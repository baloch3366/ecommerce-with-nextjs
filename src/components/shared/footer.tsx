"use client"
import {Button} from "@/components/ui/button"
import { ChevronUp } from "lucide-react"
import Link from "next/link"

export default function Footer () {

    return(
        <footer className="bg-black text-white underline-link">

           <div className="w-full">
            <Button
             variant='ghost'
             className="bg-gray-800 w-full rounded-none"
             onClick={()=> window.scrollTo({top:0, behavior:"smooth"})}
            >
                <ChevronUp className="mr-2 w-4 h-4"/>
                Back To Top
            </Button>
            </div> 

            <div className="p-4">
                <div className="flex justify-center gap-3 text-sm">
                    <Link href="./page/condition-of-use">Condition of Use</Link>
                    <Link href='./page/privacy-notice'>Privacy Notice</Link>
                    <Link href='./page/help'>Help</Link>
                </div>
                <div className='flex justify-center text-sm'>
                    <p> © Copyright</p>
                    </div>
              <div className='mt-8 flex justify-center text-sm text-gray-400'>
                   (+51-11123-34), DIK, Pakistan
             </div>
            </div>
        </footer>
    )
}