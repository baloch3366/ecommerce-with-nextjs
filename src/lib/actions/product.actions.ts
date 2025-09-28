"use server"
import Product, { IProduct } from '../db/model/product.model';
import { ConnectToDatabase } from '../db';
import { PAGE_SIZE } from '../constant';
import { Types } from 'mongoose';

// import { PAGE_SIZE } from "../constant"
// import { connectToDatabase } from "../db"
// import Product, { IProduct } from "../db/models/product.model"

// type PaginationParams = {
//   tag?: string
//   limit?: number
//   page?: number
// }

// export async function getAllCategory() {
//   await connectToDatabase()
//   return await Product.find({ isPublished: true }).distinct('category')
// }

// export async function getProductForCard({ tag, limit = 4 }: PaginationParams) {
//   await connectToDatabase()

//   const product = await Product.aggregate([
//     { $match: { tags: { $in: [tag] }, isPublished: true } },
//     { $sort: { createdAt: -1 } },
//     { $limit: limit },
//     {
//       $project: {
//         name: 1,
//         href: { $concat: ['/product/', '$slug'] },
//         image: { $arrayElemAt: ['$images', 0] },
//       },
//     },
//   ])

//   return product as { name: string; href: string; image: string }[]
// }

// export async function getProductByTag({ tag, limit = 10 }: PaginationParams) {
//   await connectToDatabase()

//   const product = await Product.find({
//     tags: { $in: [tag] },
//     isPublished: true,
//   })
//     .sort({ createdAt: -1 })
//     .limit(limit)
//     .lean()

//   return product as IProduct[]
// }

// export async function getProductBySlug(slug: string) {
//   await connectToDatabase()

//   const product = await Product.findOne({ slug, isPublished: true }).lean()

//   if (!product) throw new Error(`Product with slug "${slug}" not found`)

//   return product as IProduct
// }

// export async function getRelatedProductByCategory({
//   category,
//   productId,
//   limit = PAGE_SIZE,
//   page = 1,
// }: {
//   category: string
//   productId: string
//   limit?: number
//   page?: number
// }) {
//   await connectToDatabase()

//   const skip = (page - 1) * limit

//   const condition = {
//     isPublished: true,
//     category,
//     _id: { $ne: productId },
//   }

//   const [products, total] = await Promise.all([
//     Product.find(condition).sort({ numSales: -1 }).skip(skip).limit(limit).lean(),
//     Product.countDocuments(condition),
//   ])

//   return {
//     data: products as IProduct[],
//     totalPage: Math.ceil(total / limit),
//   }
// }

// export async function getAllProducts({
//   query,
//   category,
//   tag,
//   price,
//   rating,
//   sort,
//   limit = PAGE_SIZE,
//   page,
// }: {
//   query: string
//   category: string
//   tag: string
//   limit?: number
//   page: number
//   price?: string
//   rating?: string
//   sort?: string
// }) {
//   await connectToDatabase()

//   const filters: any = {
//     isPublished: true,
//   }

//   if (query && query !== 'all') {
//     filters.name = { $regex: query, $options: 'i' }
//   }
//   if (category && category !== 'all') {
//     filters.category = category
//   }
//   if (tag && tag !== 'all') {
//     filters.tags = tag
//   }
//   if (rating && rating !== 'all') {
//     filters.avgRating = { $gte: Number(rating) }
//   }
//   if (price && price !== 'all') {
//     const [min, max] = price.split('-').map(Number)
//     filters.price = { $gte: min, $lte: max }
//   }

//   const sortOrder: Record<string, 1 | -1> =
//     sort === 'best-selling'
//       ? { numSales: -1 }
//       : sort === 'price-low-to-high'
//       ? { price: 1 }
//       : sort === 'price-high-to-low'
//       ? { price: -1 }
//       : sort === 'avg-customer-review'
//       ? { avgRating: -1 }
//       : { _id: -1 }

//   const skip = (page - 1) * limit

//   const [products, count] = await Promise.all([
//     Product.find(filters).sort(sortOrder).skip(skip).limit(limit).lean(),
//     Product.countDocuments(filters),
//   ])

//   return {
//     products: products as IProduct[],
//     totalPages: Math.ceil(count / limit),
//     totalProducts: count,
//     from: skip + 1,
//     to: skip + products.length,
//   }
// }

// export async function getAllTags() {
//   await connectToDatabase()

//   const tags = await Product.aggregate([
//     { $match: { isPublished: true } },
//     { $unwind: '$tags' },
//     { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
//     { $project: { _id: 0, uniqueTags: 1 } },
//   ])

//   return (
//     (tags[0]?.uniqueTags || [])
//       .sort((a: string, b: string) => a.localeCompare(b))
//       .map((x: string) =>
//         x
//           .split('-')
//           .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//           .join(' ')
//       ) || []
//   )
// }

type PaginationParams = {
  tag?: string;
  limit? : number;
  page? : number;

}

export async function getAllCategory () {
  await ConnectToDatabase();
  return await Product.find({isPublished:true}).distinct('category')
}

// export async function getProductForCard({tag,limit=4,page=1}: PaginationParams) {
//   await ConnectToDatabase();
//   const product = await Product.aggregate([
//     {$match: {tags:{$in: [tag]}, isPublished: true}},
//     {$sort: {createdAt: -1}},
//     { $skip: (page - 1) * limit },
//     {$limit: limit},
//     {$project:{
//       name:1,
//       href:{$concat:['/product/', '$slug']},
//       image:{$arrayElemAt: ['$images',0]}
//     }
//   },
//   ])

//   return product as {name:string, href:string, image: string}[];
// }
export async function getProductForCard({ tag, limit = 4, page = 1 }: PaginationParams) {
  await ConnectToDatabase();
  return await Product.find({
    isPublished: true,
    ...(tag && { tags: { $in: [tag] } }),
  })
  .sort({ createdAt: -1 })
  .skip((page - 1) * limit)
  .limit(limit).lean();
}


export async function getProductByTag ({tag,limit=10}:PaginationParams) {
  await ConnectToDatabase();
  const product = await Product.aggregate([
    {
      $match: {tags: tag, isPublished: true}
    },
    {
      $sort: {createdAt:-1}
    },
    {
      $limit:limit
    }
  ]);
  return product as IProduct[]
}

export async function getProductBySlug (slug:string) {
 await ConnectToDatabase();
 const product = await Product.findOne({slug, isPublished: true});
 if(!product) throw new Error(`Product with slug "${slug}" not found`);
 
 return JSON.parse(JSON.stringify(product)) as IProduct
  
}
// export async function getRelatedProductByCategory ({
//   category,
//   productId,
//   limit=PAGE_SIZE,
//   page = 1,
// }:{
//  category: string,
//  productId: string,
//  limit?: number,
//  page?: number
// }){
//  await ConnectToDatabase();
//  const skip = (page-1) * limit;
//  const condition = {
//   isPublished: true,
//   category ,
//   _id: {$ne: productId}
//  }
 
//  const [products,total] = await Promise.all([
//   Product.find(condition).sort({numSales: -1}).skip(skip).limit(limit).lean(),
//   Product.countDocuments(condition)
//  ])

//  return {
//   data : products as IProduct[],
//    totalPage: Math.ceil(total/limit)
//  }

// }

export async function getRelatedProductByCategory({
  category,
  productId,
  limit = PAGE_SIZE,
  page = 1,
}: {
  category: string;
  productId: string;
  limit?: number;
  page?: number;
}) {
  try {
    await ConnectToDatabase();
    const skip = (page - 1) * limit;
    
    const condition = {
      isPublished: true,
      category: category,
      _id: { $ne: new Types.ObjectId(productId) }
    };
    
    const [products, total] = await Promise.all([
      Product.find(condition)
        .sort({ numSales: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(condition)
    ]);
    console.log("Related products found:", products.map(p => ({ name: p.name, category: p.category })));


    return {
      data: products as IProduct[],
      totalPage: Math.ceil(total / limit),
      currentPage: page
    };
  } catch (error) {
    console.error('Error fetching related products:', error);
    return {
      data: [],
      totalPage: 0,
      currentPage: page
    };
  }
}


