import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import SignInForm from "./signin-form";
import SeparatorWithOr from "@/components/shared/separator-or";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import GoogleSignInForm from "./google-signin-form";



export const metadata: Metadata = {
    'title': 'Sign In'
}
 export default async function SignIn(props:
     {searchParams: Promise<{
    callbackUrl: string
}>
}) {
    const searchParams = await props.searchParams;
    const {callbackUrl = '/'} = searchParams;

    const session = await auth()
    if(session) {
        return redirect(callbackUrl)
    }

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <div>
                        <SignInForm/>
                    </div>
                    <SeparatorWithOr/>
                    <div className="mt-5">
                        <GoogleSignInForm/>
                    </div>
                </CardContent>
            </Card>
            <SeparatorWithOr>New ?</SeparatorWithOr>
            <Link href='/sign-up' className="w-full">
             <Button variant='outline' className='w-full'>
                Create Account
             </Button>
            </Link>
        </div>
    )
 }
  