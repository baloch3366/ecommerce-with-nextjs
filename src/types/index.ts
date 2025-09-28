import { CartSchema,ProductFieldSchema,OrderFieldSchema, UserFieldSchema, UserSignInSchema, UserSignUpSchema, ShippingAddressSchema, OrderInputSchema } from "@/lib/validator";
import { z} from "zod";

 export type IProductField = z.infer<typeof ProductFieldSchema>
 
 export type OrderItem = z.infer<typeof OrderFieldSchema>
 export type Cart = z.infer<typeof CartSchema>
 export type ShippingAddress = z.infer<typeof ShippingAddressSchema>


export type IUserField = z.infer<typeof UserFieldSchema>
export type IUserSignIn = z.infer<typeof UserSignInSchema>
export type IUserSignUp = z.infer<typeof UserSignUpSchema>
export type IOrderInput = z.infer<typeof OrderInputSchema>


 export type Data = {
    users: IUserField[],
    products: IProductField[],
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
 