// app/api/webhook/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

import Order from '@/lib/db/models/order.model'
import { sendPurchaseReceipt } from '../../../../../emails'
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from '@/lib/constant'

const stripe = new Stripe(STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-06-20', // always set API version
})

export async function POST(req: NextRequest) {
  try {
    // ✅ Verify webhook signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature') as string

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      STRIPE_WEBHOOK_SECRET as string
    )

    // ✅ Handle only successful charge events
    if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge

      const orderId = charge.metadata?.orderId
      const email = charge.billing_details?.email
      const pricePaidInCents = charge.amount

      if (!orderId) {
        return NextResponse.json({ error: 'Missing orderId in metadata' }, { status: 400 })
      }

      // ✅ Find the related order
      const order = await Order.findById(orderId).populate('user', 'email')
      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 })
      }

      // ✅ Update payment info
      order.isPaid = true
      order.paidAt = new Date()
      order.paymentResult = {
        id: event.id,
        status: 'COMPLETED',
        email_address: email || order.user?.email,
        pricePaid: (pricePaidInCents / 100).toFixed(2), // cents → dollars
      }
      await order.save()

      // ✅ Send confirmation email
      try {
        await sendPurchaseReceipt({ order })
      } catch (err) {
        console.error('❌ Failed to send purchase receipt email:', err)
      }

      return NextResponse.json({ message: 'Order marked as paid successfully' })
    }

    // ✅ Ignore unhandled events
    return NextResponse.json({ received: true })
  } catch (err: any) {
    console.error('❌ Stripe webhook error:', err.message)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }
}
