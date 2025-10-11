import { CartSchema,ProductFieldSchema,OrderFieldSchema, UserFieldSchema, UserSignInSchema, UserSignUpSchema, ShippingAddressSchema, OrderInputSchema, ReviewFieldSchema, UserNameSchema } from "@/lib/validator";
import { z} from "zod";

 export type IProductField = z.infer<typeof ProductFieldSchema>
 
 export type OrderItem = z.infer<typeof OrderFieldSchema>
 export type Cart = z.infer<typeof CartSchema>
 export type ShippingAddress = z.infer<typeof ShippingAddressSchema>


export type IUserField = z.infer<typeof UserFieldSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>
export type IReviewInput = z.infer<typeof ReviewFieldSchema>
export type IUserName = z.infer<typeof UserNameSchema>


export type IReviewDetails = IReviewInput & {
    _id: string
    createdAt: string
    user:{
        name: string
    }
}

 export type Data = {
    users: IUserField[],
    products: IProductField[],
    reviews: {
      title: string,
      rating:number,
      comment:string
    }[],
    headerMenu: {
        name: string,
        href:string
    }[],
    carousels: {
        image: string,
        url: string,
        title: string,
        buttonCaption: string,
        isPublished: false
    } []
 }
 