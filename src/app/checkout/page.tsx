import { redirect } from 'next/navigation';
import { auth } from "@/auth";
import { Metadata } from "next";
import CheckoutForm from './checkout-form';


export const metadata:Metadata = {
    title: "Checkout",
}

export default async function Checkout () {
    const session = await auth();
     if(!session?.user){
        redirect('/sign-in?callbackUrl=/checkout')
     }
     return <CheckoutForm/>
}
