import { IProduct } from "@/lib/db/model/product.model"
import Link from "next/link"
import ImageHover from "./image-hover"
import Image from "next/image"
import Rating from "./rating"
import { generateId, number_formate, round2 } from "@/lib/utils"
import ProductPrice from "./product-price"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import AddToCart from "./add-to-cart"

const ProductCard =(
    {
        product,
        hideBorder = false,
        hideDetails = false,
        hideAddToCart = false,
    }:{
        product:IProduct
        hideBorder?: boolean
        hideDetails?: boolean
        hideAddToCart?: boolean
    }
) =>{
      
    const ProductImage = () => (
       <Link href={product.slug ? `/product/${product.slug}` : '#'}>

        <div className="relative h-52">
           {Array.isArray(product.images) && product.images.length > 1 ? (
            <ImageHover
            src={product.images[0]}
            hoverSrc={product.images[1]}
            alt={product.name}
            />
           ):(
            
            <Image
             src={product.images?.[0] || '/placeholder.jpg'}
             alt={product.name}
             fill
             className="object-contain "
            />
            
           )} 
       </div>
       </Link>
    )

    const ProductDetails  = () => (
       <div className="flex-1 space-y-1 text-sm text-center">
         {product.tags?.includes("todays-deal") && (
        <div className="text-xs text-red-600 font-bold uppercase">Today’s Deal</div>
      )}

        <p className="font-semibold text-gray-600">{product.brand}</p>
        <Link href={product.slug ? `/product/${product.slug}` : '#'}

        className="font-medium text-gray-800 hover:underline block"
        style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow:'hidden'
        }}
        >
        {product.name}
        </Link>

        <div className="flex flex-col gap-2 justify-center items-center text-xs text-gray-800">
            <div className="flex justify-center gap-1 items-center">
            <Rating rating = {product.avgRating}/>
            <span>({number_formate(product.numReviews)})</span>
             </div>

              <div  className="flex flex-col ">
             <ProductPrice
             isDeal={Array.isArray(product.tags) && product.tags.includes('todays-deal')}
             price= {product.price}
             listPrice={product.listPrice}
             forListing
             />
             </div>
             
        </div>

       </div>
    )
    const AddCartButton = () => {
        return (
            <div className="w-full text-center">
                <AddToCart
                item = {{
                    clientId: generateId(),
                    product: product._id,
                    size: product.sizes[0],
                    color: product.colors[0],
                    countInStock: product.countInStock,
                    name: product.name,
                    slug:product.slug,
                    category: product.category,
                    price: round2(product.price),
                    quantity: 1,
                    image: product.images[0]
                }}
                />
            </div>
        )
    }
    return hideBorder ? (  // ✅ No border layout (simpler div structure)

        <div className="flex flex-col">
            <ProductImage/>
            {!hideDetails && (
                <>
                <div className="p-3 flex-1 text-center">
                  <ProductDetails/>
                </div>
                {!hideAddToCart  && <AddCartButton/>}
                </>
            )}
        </div>
    ):(  // ✅ Show border layout (Card with shadow and padding)
        <Card className="flex flex-col text-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <CardHeader className="p-0">
                <ProductImage/>
            </CardHeader>
            {!hideDetails && (
                <>
                <CardContent className="flex-1 p-3  text-center">
                 <ProductDetails/>
                </CardContent>
                <CardFooter className="p-3">
                    {!hideAddToCart && <AddCartButton/>}
                </CardFooter>
                </>
            )}
        </Card>
    )
}

export default ProductCard;