import { ConnectToDatabase } from '.';

import { loadEnvConfig } from '@next/env';
import { cwd } from 'process';
import products from '../Data';
import Product from './model/product.model';
import User from './model/user.model';
import users from '../user-data';
import Review from './model/review.model';
import { reviews } from '../reviews';

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

     await Review.deleteMany()
            const rws = []
            for (let i = 0; i < createdProduct.length; i++) {
                let x = 0
                const { ratingDistribution } = createdProduct[i]
                for (let j = 0; j < ratingDistribution.length; j++) {
                  for (let k = 0; k < ratingDistribution[j].count; k++) {
                    x++
                    rws.push({
                      ...reviews.filter((x) => x.rating === j + 1)[
                        x % reviews.filter((x) => x.rating === j + 1).length
                      ],
                      isVerifiedPurchase: true,
                      product: createdProduct[i]._id,
                      user: createdUser[x % createdUser.length]._id,
                      updatedAt: Date.now(),
                      createdAt: Date.now(),
                    })
                  }
                }
            }
            const createdReviews = await Review.insertMany(rws)
    
    console.log({
       createdProduct,
       createdUser,
       createdReviews,
       message:"Products are inserted in DB"
    })
    process.exit(0)
   } catch (error) {
    console.log(error)
    throw new Error("Failed to insert error")
 }
}
main()