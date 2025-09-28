import { auth } from "@/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { redirect } from "next/navigation";
import SignUpForm from "./signup-form";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sign Up"
}

export default async function SignUpPage ({
    searchParams
}: {
    searchParams: Promise<{
        callbackUrl: string
    }>
}) {
    const searchParam = await searchParams;
    const {callbackUrl} = searchParam

    const session = await auth();
    if (session) {
     redirect(callbackUrl || '/')
    }

    return (
        <div className="w-full">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Create Account</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpForm/>
                </CardContent>
            </Card>
        </div>
    )
}