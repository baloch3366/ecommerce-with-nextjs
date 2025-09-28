import { notFound } from 'next/navigation'
import { auth } from '@/auth'
import PaymentForm from './payment-form'
import { getOrderById } from '@/lib/actions/order-action'
import Stripe from 'stripe'
import { STRIPE_SECRET_KEY } from '@/lib/constant'

export const metadata = {
  title: 'Payment',
}

const CheckoutPaymentPage = async (props: {
  params: Promise<{
    id: string
  }>
}) => {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()
    


  const session = await auth()


  let clientSecret = null;
  if (order.paymentMethod === 'Stripe' && !order.isPaid) {
    const stripe = new Stripe(STRIPE_SECRET_KEY as string)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: 'USD',
      metadata: { orderId: order._id },
    })
    clientSecret = paymentIntent.client_secret
  }

  return (
    <PaymentForm
      order={order}
      paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
      clientSecret={clientSecret}
      isAdmin={session?.user?.role === 'Admin' || false}
    />
  )
}

export default CheckoutPaymentPage