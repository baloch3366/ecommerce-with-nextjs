'use server'

import { signIn, signOut } from "@/auth";
import { IUserSignIn, IUserSignUp } from "@/types";
import { redirect } from "next/navigation";
import { UserSignUpSchema } from "../validator";
import { ConnectToDatabase } from "../db";
import User from "../db/model/user.model";
import bcrypt from "bcryptjs";
import { formatError } from "../utils";

export async function signInWithCredential (user:IUserSignIn) {
    await signIn('credentials',{...user, redirect: false})
}
export async function SigninWithGoogle () {
  await signIn('google')
}
export const SignOut = async() => {
  const redirectTo = await signOut({redirect:false})
  redirect(redirectTo.redirect)
}

export async function registerUser (userSignUp: IUserSignUp) {
  try {
    //checking zod validation each field
    const user = await UserSignUpSchema.parseAsync({
      name: userSignUp.name,
      email: userSignUp.email,
      password: userSignUp.password,
      confirmPassword: userSignUp.confirmPassword
    })
    await ConnectToDatabase()
    await User.create({
      ...user,
       password: await bcrypt.hash(user.password,8)
    })
    return {success: true, message: 'User successfully register'}
  } catch (error) {
    return {success: false, error: formatError(error)}
  }
}
