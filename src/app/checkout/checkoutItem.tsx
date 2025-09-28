'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AVAILABLE_DELIVERY_DATES } from '@/lib/constant'
import { cn } from '@/lib/utils'
import {useCartStore} from '@/hooks/use-cart-store'

export default function CheckoutItems() {
  const { cart, updateItem, setDeliveryDateIndex } = useCartStore()

  return (
    <Card className="md:ml-8 my-4">
      <CardContent className="p-4">
        {cart.items.map((item) => (
          <div key={item.product} className="flex items-center space-x-2 my-2">
            {/* product image */}
            <Image
              src={item.image}
              alt={item.name}
              width={100}
              height={100}
              className="w-20 h-20 object-cover rounded"
            />

            {/* product info */}
            <div className="flex-1">
              <Link href={`/product/${item.product}`} className="text-blue-600 hover:underline">
                {item.name}
              </Link>
              <div className="text-muted-foreground">${item.price}</div>
            </div>

            {/* qty select */}
            <Select
              value={String(item.quantity)}
              onValueChange={(value) => updateItem(item, Number(value))}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="Qty" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((qty) => (
                  <SelectItem key={qty} value={String(qty)}>
                    {qty}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        {/* delivery dates */}
        <div className="mt-4">
          <div className="text-lg font-bold mb-2">Choose your delivery option</div>
          <RadioGroup
            value={String(cart.deliveryDateIndex)}
            onValueChange={(value) => setDeliveryDateIndex(Number(value))}
          >
            {AVAILABLE_DELIVERY_DATES.map((date, idx) => (
              <div key={idx} className="flex items-center py-1">
                <RadioGroupItem
                  value={String(idx)}
                  id={`delivery-${idx}`}
                  className={cn(
                    cart.deliveryDateIndex === idx ? 'border-primary' : 'border-muted'
                  )}
                />
                <Label htmlFor={`delivery-${idx}`} className="pl-2 cursor-pointer">
                  {date.name} – <span className="font-bold">${date.shippingPrice}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  )
}
