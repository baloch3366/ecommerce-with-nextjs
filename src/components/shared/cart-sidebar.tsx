// 'use client'
// import { cn } from '@/lib/utils'
// import Link from 'next/link'
// import React from 'react'
// import { Button, buttonVariants } from '../ui/button'
// import { Separator } from '../ui/separator'
// import Image from 'next/image'
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '../ui/select'
// import { TrashIcon } from 'lucide-react'
// import ProductPrice from './product/product-price'
// import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constant'
// import { ScrollArea } from '../ui/scroll-area'
// import { useCartStore } from '@/hooks/use-cart-store'

// export default function CartSidebar() {
//   const { cart: { items, itemsPrice }, updateItem, removeItem } = useCartStore()

//   return (
//     <div className='w-36 overflow-y-auto'>
//       <div className={`fixed border-l h-full`}>
//         <div className='p-2 h-full flex flex-col gap-2 justify-start items-center'>
//           <div className='text-center space-y-2'>
//             <div> Subtotal</div>
//             <div className='font-bold'>
//               <ProductPrice price={itemsPrice} plain />
//             </div>
//             {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
//               <div className=' text-center text-xs'>
//                 Your order qualifies for FREE Shipping
//               </div>
//             )}

//             <Link
//               className={cn(
//                 buttonVariants({ variant: 'outline' }),
//                 'rounded-full hover:no-underline w-full'
//               )}
//               href='/cart'
//             >
//               Go to Cart
//             </Link>
//             <Separator className='mt-3' />
//           </div>

//           <ScrollArea className='flex-1  w-full'>
//             {items.map((item) => (
//               <div key={item.clientId}>
//                 <div className='my-3'>
//                   <Link href={`/product/${item.slug}`}>
//                     <div className='relative h-24'>
//                       <Image
//                         src={item.image}
//                         alt={item.name}
//                         fill
//                         sizes='20vw'
//                         className='object-contain'
//                       />
//                     </div>
//                   </Link>
//                   <div className='text-sm text-center font-bold'>
//                     <ProductPrice price={item.price} plain />
//                   </div>
//                   <div className='flex gap-2 mt-2'>
//                     <Select
//                       value={item.quantity.toString()}
//                       onValueChange={(value) => {
//                         updateItem(item, Number(value))
//                       }}
//                     >
//                       <SelectTrigger className='text-xs w-16 ml-1 h-auto py-0'>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {Array.from({ length: item.countInStock }).map(
//                           (_, i) => (
//                             <SelectItem value={(i + 1).toString()} key={i + 1}>
//                               {i + 1}
//                             </SelectItem>
//                           )
//                         )}
//                       </SelectContent>
//                     </Select>
//                     <Button
//                       variant={'outline'}
//                       className='h-9'
//                       size={'sm'}
//                       onClick={() => {
//                         removeItem(item)
//                       }}
//                     >
//                       <TrashIcon className='w-4 h-4' />
//                     </Button>
//                   </div>
//                 </div>
//                 <Separator />
//               </div>
//             ))}
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'
import { Button, buttonVariants } from '../ui/button'
import { Separator } from '../ui/separator'
import Image from 'next/image'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { TrashIcon } from 'lucide-react'
import ProductPrice from './product/product-price'
import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constant'
import { ScrollArea } from '../ui/scroll-area'
import { useCartStore } from '@/hooks/use-cart-store'

export default function CartSidebar() {
  const { cart: { items, itemsPrice }, updateItem, removeItem } = useCartStore()

  return (
    <div className='fixed right-0 top-0 h-full w-36 border-l bg-background'>
      <div className='p-4 h-full flex flex-col'>
        <div className='text-center space-y-2'>
          <div> Subtotal</div>
          <div className='font-bold'>
            <ProductPrice price={itemsPrice} plain />
          </div>
          {itemsPrice > FREE_SHIPPING_MIN_PRICE && (
            <div className=' text-center text-xs'>
              Your order qualifies for FREE Shipping
            </div>
          )}

          <Link
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'rounded-full hover:no-underline w-full'
            )}
            href='/cart'
          >
            Go to Cart
          </Link>
          <Separator className='mt-3' />
        </div>

        {/* Scroll Area Fix - Added height constraints */}
        <ScrollArea className='h-[calc(100vh-220px)] flex-1 w-full py-2'>
          <div className='pr-2 space-y-4'>
            {items.map((item) => (
              <div key={item.clientId}>
                <div className='my-3'>
                  <Link href={`/product/${item.slug}`}>
                    <div className='relative h-24'>
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes='20vw'
                        className='object-contain'
                      />
                    </div>
                  </Link>
                  <div className='text-sm text-center font-bold'>
                    <ProductPrice price={item.price} plain />
                  </div>
                  <div className='flex gap-2 mt-2'>
                    <Select
                      value={item.quantity.toString()}
                      onValueChange={(value) => {
                        updateItem(item, Number(value))
                      }}
                    >
                      <SelectTrigger className='text-xs w-16 ml-1 h-auto py-0'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: item.countInStock }).map(
                          (_, i) => (
                            <SelectItem value={(i + 1).toString()} key={i + 1}>
                              {i + 1}
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                    <Button
                      variant={'outline'}
                      className='h-9'
                      size={'sm'}
                      onClick={() => {
                        removeItem(item)
                      }}
                    >
                      <TrashIcon className='w-4 h-4' />
                    </Button>
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

