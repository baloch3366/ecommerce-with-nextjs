import Image from "next/image";
import Link from "next/link";
import Search from "./search"
import Menu from "./menu";
import { menu } from "@/lib/menu";
import Sidebar from "./sidebar";
import { getAllCategory } from "@/lib/actions/product.actions";

export default async function Header() {
 const allCategories = await getAllCategory()
 console.log("allcat", allCategories)
   
 return (
    <header className="bg-gray-900 text-white">
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

       <div className='flex items-center px-3 mb-[1px]  bg-orange-800'>
                {/* <Button variant="ghost" className="dark header-action flex item-center gap-1 text-base [&_svg]:size-6">
                    <MenuIcon/>
                    All
                </Button> */}
                <Sidebar categories={allCategories} />
                <div className='flex items-center flex-wrap gap-3 overflow-hidden   max-h-[42px]'>
                {menu.map((menu) => (
                    <Link
                    href={menu.href}
                    key={menu.href}
                    className='header-button !p-2 '
                    >
                    {menu.name}
                    </Link>
                ))}
                </div>
            </div>
    </header>
 )
}