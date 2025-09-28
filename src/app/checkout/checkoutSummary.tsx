'use client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useCartStore } from '@/hooks/use-cart-store'
import { toast } from "sonner"
import { createOrder } from '@/lib/actions/order-action'
import { AVAILABLE_DELIVERY_DATES } from '@/lib/constant'
import { calculateFutureDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'

export default function CheckoutSummary() {
  const { cart, clearCart } = useCartStore()
  const { itemsPrice, shippingPrice, taxPrice, totalPrice } = cart
  const router = useRouter()

  const handlePlaceOrder = async () => {
  const res = await createOrder({
    ...cart,
    expectedDeliveryDate: calculateFutureDate(
      AVAILABLE_DELIVERY_DATES[cart.deliveryDateIndex!].daysToDeliver
    ),
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  })

  if (!res.success) {
      toast.error(res.message || 'Something went wrong!')
    } else {
      toast.success(res.message || 'Order placed successfully!')
      clearCart()
      router.push(`/checkout/${res.data?.orderId}`)
    }
  }

  return (
    <Card className="md:ml-8 my-4">
      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between">
          <span>Items</span>
          <span>${itemsPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${(shippingPrice ?? 0) .toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${(taxPrice ?? 0).toFixed(2)}</span>
        </div>
        <hr />
        <div className="flex justify-between font-bold">
          <span>Order Total</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>

        <Button
          onClick={handlePlaceOrder}
          className="w-full rounded-full font-bold mt-4"
          disabled={cart.items.length === 0}
        >
          Place your order
        </Button>
      </CardContent>
    </Card>
  )
}

