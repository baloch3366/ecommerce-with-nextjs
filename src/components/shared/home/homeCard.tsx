import { Card,CardContent,CardFooter} from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
type CartItem = {
    title: string,
    link: {text:string, href:string},
    items:{
        name:string,
        image:string,
        href: string,
    }[]
}

export function HomeCart ({cards}:{cards: CartItem[]}) {
  return(
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4">
     {cards.map((card)=>(
      <Card key={card.title} className="rounded-2xl shadow-md bg-white hover:shodow-lg transition-shadow flex flex-col border border-gray-200">
        <CardContent className="p-4 flex-1">
            <h3 className="text-2xl font-semi text-gray-800 mb-4">{card.title}</h3>
            <div className="grid grid-cols-2 gap-4">
                {card.items.map((item)=> (
                    <Link
                     key={item.name}
                     href={item.href}
                     className="flex flex-col group"
                    >
                     <div className="w-full aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-100 group-hover:scale-105 transition-transform ">
                    <Image
                    src={item.image}
                    alt={item.name}
                    className="object-contain w-full h-full"
                    width={120}
                    height={120}
                    />
                    </div>
                   <p className="text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis text-gray-600 group-hover:text-gray-800 transition-colors">{item.name}</p>
                    </Link>
                ))}
            </div>
        </CardContent>
        {card.link && (
          <CardFooter className="border-t border-gray-100 p-4">
            <Link href={card.link.href} className="text-blue-600 font-medium hover:underline ml-auto">
            {card.link.text}
            </Link>
          </CardFooter>
        )}
      </Card>  
     ))}
    </div>
  )  
}






