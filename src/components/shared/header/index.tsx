import Image from "next/image";
import Link from "next/link";
import Search from "./search"
import Menu from "./menu";
import { menu } from "@/lib/menu";

export default async function Header() {
 return (
    <div className="bg-gray-900 text-white">
      <div className="px-2">
       <div className="flex items-center justify-between">

         <div className="flex items-center ">
            <Link href='/'
            className="flex items-center header-button font-extrabold text-2xl m-1"
            >
            <Image 
            src={'/logo.png'}
            width={110}
            height={40}
            alt={`logo`}
            />
            </Link>
         </div>

            <div className="hidden md:block max-w-xl flex-1">
               <Search/>
            </div>
            <Menu/>
       </div>
       <div className="md:hidden block py-2">
         <Search/>
       </div>
      </div>

      <div>
         <div className="flex items-center gap-3 flex-wrap overflow-hidden max-h-[42px]">
            {menu.map((menu)=> (
               <Link href={menu.href}
               key={menu.href} 
               className="header-button !p-2">
               {menu.name}
               
               </Link>
            ))}
         </div>
      </div>
    </div>
 )
}