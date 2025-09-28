"use client"
import * as React from "react"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import {Button} from '@/components/ui/button'

export function HomeCarousel ({items}:{
  items:{
    image:string,
    url:string,
    title:string,
    buttonCaption:string
  }[]
}) {
 const plugin = React.useRef<ReturnType<typeof Autoplay>>(
  Autoplay({ delay: 3000, stopOnInteraction: true })
)

  return (
    <Carousel
     dir="ltr"
     plugins={[plugin.current]}
     className="w-full mx-auto "
     onMouseEnter={plugin.current.stop}
     onMouseLeave={plugin.current.reset}
    >
     <CarouselContent>
      {items.map((item)=> (
        <CarouselItem key={item.title}>
          <Link href={item.url}>
          <div className="flex items-center justify-center aspect-[16/6] p-6 -m-1 relative ">
           <Image
           src={item.image}
           alt={item.title}
           className="object-cover"
           fill   // Makes the image fill its container if parent has relative and w and h
           priority     // Loads this image eagerly (immediately)
           />
           <div className="absolute w-1/3 top-1/2 left-16 md:left-32 trasform -translate-y-1/2">
            <h2 className={cn(
              'text-xl md:text-6xl font-bold mb-4 text-primary'
            )}>
              {item.title}
            </h2>
            <Button className="hidden md:block text-white">
              {item.buttonCaption}
            </Button>
           </div>
          </div>
          </Link>
        </CarouselItem>
      ))}
     </CarouselContent>
     <CarouselPrevious className="left-0 md:left-12"/>
     <CarouselNext className="right-0 md:right-12"/>
    </Carousel>
  )
}