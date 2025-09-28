'use client'

import BrowsingHistoryList from "@/components/shared/browsing-history-list"
import ProductPrice from "@/components/shared/product/product-price"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useCartStore } from "@/hooks/use-cart-store"
import useIsMounted from "@/hooks/use-is-mounted"
import { FREE_SHIPPING_MIN_PRICE } from "@/lib/constant"
import { cn } from "@/lib/utils"
import { CheckCircleIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

export default function AddItemToCart({ itemId }: { itemId: string }) {
  const {
    cart: { items, itemsPrice },
  } = useCartStore()

  const item = items.find((x) => x.clientId === itemId)

      const isMounted = useIsMounted();
        if (!isMounted) return null;
      if (!item) return notFound()
    

  return (
    <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 ">
            <Card className="w-full rounded-none">
             <CardContent className="flex h-full items-center gap-3 justify-center py-4">
                <Link href={`/product/${item.slug}`}>
                <Image
                src={item.image}
                alt={item.name}
                width={80}
                height={80}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                }}
                />
                </Link>
                <div>
                  <h3 className="text-xl font-bold flex gap-2 my-2">
                    <CheckCircleIcon className="h-6 w-6 text-green-700"/>
                    Added to Cart
                  </h3>
                  <p className="text-sm">
                    <span className="font-bold">Color: </span> {' '}
                    {item.color ?? '-'}
                  </p>
                  <p className="text-sm">
                    <span className="font-bold">Size: </span> {' '}
                    {item.size ?? '-'}
                  </p>
                </div>

             </CardContent>
            </Card>

            <Card className="w-full rounded-none">
              <CardContent className="p-4 rounded-none">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="flex justify-center items-center">
                    {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                      <div className="text-center">
                        Add 
                        <span className="text-green-700">
                          <ProductPrice
                          price={FREE_SHIPPING_MIN_PRICE- itemsPrice}
                          plain/>
                        </span>
                        Shipping 
                      </div>
                    ): (
                      <div className="flex item-center">
                        <div>
                          <span className="text-green-700">
                            Your order qualifies for FREE Shipping.
                          </span>{' '}
                          Choose this option at checkout.
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="lg:border-1 lg:border-muted lg:pl-3 flex flex-col items-center gap-3 ">
                    <div className="flex gap-3">
                      <span className="text-lg font-bold">Cart Subtotal:</span>
                      <ProductPrice className="text-2xl" price={itemsPrice}/>
                    </div>
                    <Link 
                     href='/checkout'
                     className= {cn(buttonVariants(), 'rounded-full w-full')}
                    >
                    Prodceed to checkout (
                      {items.reduce((acc,c)=> acc + c.quantity,0 )} items
                    )
                    </Link>
                    <Link
                    href='/cart'
                    className={cn(buttonVariants({variant:'outline'}),
                  'rounded-full w-full')}
                    >
                      Go to Cart 
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
        </div>
        <BrowsingHistoryList/>
    </div>
  )
}
