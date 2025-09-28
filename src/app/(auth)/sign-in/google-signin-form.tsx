'use client'
import { Button } from "@/components/ui/button"
import { SigninWithGoogle } from "@/lib/actions/user-action"
import { useFormStatus } from "react-dom"


export default function GoogleSignInForm () {
    const SignInButton = () => {
        const {pending} = useFormStatus()
        return(
            <Button disabled={pending} className="w-full" variant="outline">
                {[pending ? "Redirecting to Google..." : "Sign in with Google"]}
            </Button>
        )
    }
    return(
        <form action={SigninWithGoogle}>
            <SignInButton/>

        </form>
    )
}
