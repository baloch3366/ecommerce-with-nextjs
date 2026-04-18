'use server'

import { Cart, OrderItem, ShippingAddress } from "@/types"
import { formatError, round2 } from "@/lib/utils"
import { AVAILABLE_DELIVERY_DATES, PAGE_SIZE } from "@/lib/constant"
import { ConnectToDatabase } from "../db"
import { auth } from "@/auth"
import { OrderInputSchema } from "@/lib/validator"
import Order, { IOrder } from "@/lib/db/model/order-model"
import { paypal } from "../paypal"
import { revalidatePath } from "next/cache"
import { sendPurchaseReceipt } from "../../../email"
import { convertDoc } from "../convert-doc"


/* ================================
   CALCULATE DELIVERY
================================ */
export const calculateDeliveryDateAndPrice = async ({
  items,
  shippingAddress,
  deliveryDateIndex,
}: {
  items: OrderItem[],
  shippingAddress?: ShippingAddress,
  deliveryDateIndex?: number
}) => {
  const itemsPrice = round2(
    items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  )

  const deliveryDate =
    AVAILABLE_DELIVERY_DATES[
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex
    ]

  const shippingPrice =
    !shippingAddress || !deliveryDate
      ? undefined
      : deliveryDate.freeShippingMinPrice > 0 &&
        itemsPrice >= deliveryDate.freeShippingMinPrice
      ? 0
      : deliveryDate.shippingPrice

  const taxPrice = !shippingAddress
    ? undefined
    : round2(itemsPrice * 0.15)

  const totalPrice = round2(
    itemsPrice +
      (shippingPrice ? round2(shippingPrice) : 0) +
      (taxPrice ? round2(taxPrice) : 0)
  )

  return {
    AVAILABLE_DELIVERY_DATES,
    deliveryDateIndex:
      deliveryDateIndex === undefined
        ? AVAILABLE_DELIVERY_DATES.length - 1
        : deliveryDateIndex,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  }
}

/* ================================
   CREATE ORDER
================================ */
export const createOrder = async (clientSideCart: Cart) => {
  try {
    await ConnectToDatabase()

    const session = await auth()
    if (!session) throw new Error('User not authenticated')

    const createdOrder = await createOrderFromCart(
      clientSideCart,
      session.user.id!
    )

    return {
      success: true,
      message: 'Order placed successfully',
      data: { orderId: createdOrder._id.toString() },
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

export const createOrderFromCart = async (
  clientSideCart: Cart,
  userId: string
) => {
  const calc = await calculateDeliveryDateAndPrice({
    items: clientSideCart.items,
    shippingAddress: clientSideCart.shippingAddress,
    deliveryDateIndex: clientSideCart.deliveryDateIndex,
  })

  const cart = {
    ...clientSideCart,
    ...calc,
  }

  const order = OrderInputSchema.parse({
    user: userId,
    items: cart.items,
    shippingAddress: cart.shippingAddress,
    paymentMethod: cart.paymentMethod,
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    taxPrice: cart.taxPrice,
    totalPrice: cart.totalPrice,
    expectedDeliveryDate: cart.expectedDeliveryDate,
  })

  return await Order.create(order)
}

/* ================================
   PAYPAL CREATE
================================ */
export async function createPayPalOrder(orderId: string) {
  await ConnectToDatabase()

  try {
    const order = await Order.findById(orderId)
    if (!order) throw new Error('Order not found')

    const paypalOrder = await paypal.createOrder(order.totalPrice)

    order.paymentResult = {
      id: paypalOrder.id,
      email_address: '',
      status: '',
      pricePaid: '0',
    }

    await order.save()

    return {
      success: true,
      message: 'PayPal order created successfully',
      data: paypalOrder.id,
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

/* ================================
   PAYPAL APPROVE
================================ */
export async function approvePayPalOrder(
  orderId: string,
  data: { orderID: string }
) {
  await ConnectToDatabase()

  try {
    const order = await Order.findById(orderId).populate('user', 'email')
    if (!order) throw new Error('Order not found')

    const captureData = await paypal.capturePayment(data.orderID)

    if (
      !captureData ||
      captureData.id !== order.paymentResult?.id ||
      captureData.status !== 'COMPLETED'
    ) {
      throw new Error('Error in PayPal payment')
    }

    order.isPaid = true
    order.paidAt = new Date()

    order.paymentResult = {
      id: captureData.id,
      status: captureData.status,
      email_address: captureData.payer.email_address,
      pricePaid:
        captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
    }

    await order.save()

    await sendPurchaseReceipt({ order })

    revalidatePath(`/account/orders/${orderId}`)

    return {
      success: true,
      message: 'Order paid successfully',
    }
  } catch (err) {
    return { success: false, message: formatError(err) }
  }
}

/* ================================
   GET SINGLE ORDER ✅ FIXED
================================ */
export async function getOrderById(orderId: string): Promise<IOrder | null> {
  try {
    await ConnectToDatabase()

    const order = await Order.findById(orderId)
    if (!order) return null

       return convertDoc<IOrder>(order)
  } catch (error) {
    console.error(error)
    return null
  }
}

/* ================================
   GET ORDERS LIST ✅ FIXED
================================ */
export async function getOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE

  await ConnectToDatabase()

  const session = await auth()
  if (!session) throw new Error('User not authenticated')

  const skipAmount = (page - 1) * limit

  const orders = await Order.find({
    user: session.user.id,
  })
    .sort({ createdAt: -1 })
    .skip(skipAmount)
    .limit(limit)

  const ordersCount = await Order.countDocuments({
    user: session.user.id,
  })

  const plainOrders = orders.map((order) =>
    convertDoc<IOrder>(order) 
  )

  return {
    data: plainOrders,
    totalPages: Math.ceil(ordersCount / limit),
  }
}