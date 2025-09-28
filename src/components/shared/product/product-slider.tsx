import { IProduct } from "@/lib/db/model/product.model" 
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel"
import ProductCard from "./product-card"

export default function ProductSlider ({
    title,
    products,
    hideDetails  = false,
}: {
    title?:string,
    products: IProduct[],
    hideDetails?: boolean,
}) {
 return (
    <div className="w-full bg-background">
     <h2 className="h1-bold mb-5">{title}</h2>
     <Carousel
     opts={{
        align: 'start'
     }}
     className="w-full"
     >
        <CarouselContent>
            {products.map((product)=> (
              <CarouselItem
              key={product.slug}
              className={
                hideDetails ? 
                "md:basis-14 lg:basis-1/6"
                : "md:basis-1/3 lg:basis-1/5"
              }
              >
               
               <ProductCard
                hideDetails = {hideDetails}
                hideAddToCart
                hideBorder
                product={product}
               />
               
              </CarouselItem>
            ))}
        </CarouselContent>
         <CarouselPrevious className='left-0' />
        <CarouselNext className='right-0' />

     </Carousel>

    </div>
 )
}

