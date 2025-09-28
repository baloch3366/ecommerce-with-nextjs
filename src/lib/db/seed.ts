import { ConnectToDatabase } from '.';

import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import products from '../Data';
import Product from './model/product.model';
import User from './model/user.model';
import users from '../user-data';

loadEnvConfig(cwd())

export const main= async() => {
 try {
    const ProductData = [...products];
    const UserData = [...users]
    await ConnectToDatabase(process.env.DB_URL)
    
    await User.deleteMany();
    const createdUser = await User.insertMany(UserData)

    await Product.deleteMany();
    const createdProduct = await Product.insertMany(ProductData)
    
    console.log({
       createdProduct,
       createdUser,
       message:"Products are inserted in DB"
    })
    process.exit(0)
   } catch (error) {
    console.log(error)
    throw new Error("Failed to insert error")
 }
}
main()