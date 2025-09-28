'use client'
import { UserSignInSchema } from "@/lib/validator";
import { IUserSignIn } from "@/types";
import { redirect, useSearchParams } from "next/navigation"
import { useForm  } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInWithCredential } from "@/lib/actions/user-action";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { toast } from "sonner";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";


const signInDefaultValues = 
process.env.NODE_ENV === 'development' ?
{
    email:'baloch342@gmail.com',
    password:'123456',
}:{
    email:'',
    password:''
}

export default function SignInForm () {
 const searchParams = useSearchParams();
 const rawCallbackUrl = searchParams.get('callbackUrl') ;
 // Safe fallback = homepage
 const callbackUrl = rawCallbackUrl && rawCallbackUrl.startsWith('/') 
 ? rawCallbackUrl : '/';

 const form = useForm<IUserSignIn>({
    resolver:zodResolver(UserSignInSchema),
    defaultValues:signInDefaultValues
 })
 const {handleSubmit,control } = form;

 const onSubmit = async (data:IUserSignIn) => {
    try {
        await signInWithCredential({
            email:data.email,
            password: data.password,
        })
         redirect(callbackUrl)
    } catch (error) {
      if(isRedirectError(error)){
        throw error
      } 
     toast.error("Invalid email or password", {
      description: "Please check your credentials and try again.",
    })
    }
 }
  return (
    <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <input type='hidden' name="callbackUrl" value={callbackUrl} />
            <div className="space-y-6">
             <FormField
             control={control}
             name="email"
             render={({field})=> (
                <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter email address" {...field}/>
                    </FormControl>
                    <FormMessage/>
                </FormItem>
             )}
             />

             <FormField
             control={control}
             name='password'
             render={({field}) => (
                <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input 
                        type="password"
                        placeholder="Enter Password"
                        {...field}
                        />
                    </FormControl>
                    <FormMessage/>
                </FormItem>
             )}
             />
              
              <div>
                <Button type='submit'>Sign In</Button>
              </div>
              <div className="highlight-link text-sm">
                By signing in, you agree to  &apos;s{' '}
                <Link href='/page/conditions-of-use'>Conditions of Use </Link> and {' '}
                <Link href='/page/privacy-policy'>Privacy Notice.</Link>
              </div>
            </div>
        </form>

    </Form>
  )
} 


