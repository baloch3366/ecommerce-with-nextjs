'use client'

import { IUserSignUp } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation"
import {  useForm } from "react-hook-form";
import { UserSignUpSchema } from "@/lib/validator";
import { registerUser, signInWithCredential } from "@/lib/actions/user-action";
import { toast } from "sonner";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const signUpDefaultValues = 
    process.env.NODE_ENV  === 'development' ? 
    {
        name:'Khalil Ahmad',
        email: 'khalil343@gmail.com',
        password:'123456',
        confirmPassword:'123456',
    }:{
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    export default function SignUpForm () {
        const searchParams = useSearchParams();
        const callbacUrl = searchParams.get('callbackUrl') || '/'

        const form = useForm<IUserSignUp>({
            resolver: zodResolver(UserSignUpSchema),
            defaultValues: signUpDefaultValues,
        })
        const {control, handleSubmit} = form;

        const onSubmit = async (data: IUserSignUp) => {
            try {
                const res = await registerUser(data);
                if(!res.success) {
                    toast.error(res.error)
                    return
                }
                await signInWithCredential({
                    email: data.email,
                    password: data.password
                })

            } catch (error) {
                if(isRedirectError(error)){
                    throw error
                }
                toast.error("Invalid email or password ❌")
            }
        }
 

        return(
            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input type="hidden" name="callbackUrl" value={callbacUrl} />
                    <div className="space-y-6">
                        <FormField
                        control={control}
                        name="name"
                        render={({field})=> (
                            <FormItem className="w-full">
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter Your Name" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={control}
                        name='email'
                        render={({field})=> (
                            <FormItem className='w-full'>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your Email" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={control}
                        name='password'
                        render={({field})=> (
                            <FormItem className='w-full'>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter Password" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />

                        <FormField
                        control={control}
                        name='confirmPassword'
                        render={({field})=> (
                            <FormItem className='w-full'>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Confirm Password" {...field}/>
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                        />
                        <div>
                            <Button type="submit">Sign Up</Button>
                        </div>

                        <div className="text-sm">
                            By creating an account, you agree to
                            <Link href="/page/condition-of-use">Condition of use</Link> and {' '}
                            <Link href='/page/privacy-policy'>Privacy Notice. </Link>
                        </div>
                        <Separator className="mb-4"/>
                        <div className="text-sm">
                            Already have an account? {' '}
                            <Link className="link" href={`/sign-in?callbackUrl=${callbacUrl}`}>
                            Sign In
                            </Link>
                        </div>
                    </div>
                </form>
            </Form>
        )
       
    }