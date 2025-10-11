"use server"
import Product, { IProduct } from '../db/model/product.model';
import { ConnectToDatabase } from '../db';
import { PAGE_SIZE } from '../constant';
import { Types } from 'mongoose';


type PaginationParams = {
  tag?: string;
  limit? : number;
  page? : number;

}

export async function getAllCategory () {
  await ConnectToDatabase();
  return await Product.find({isPublished:true}).distinct('category')
}


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
    // console.log("Related products found:", products.map(p => ({ name: p.name, category: p.category })));


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

// GET ALL PRODUCTS
export async function getAllProducts({
    query,
    limit,
    page,
    category,
    tag,
    price,
    rating,
    sort,
  }: {
    query: string
    category: string
    tag: string
    limit?: number
    page: number
    price?: string
    rating?: string
    sort?: string
  }) {
    limit = limit || PAGE_SIZE
    await ConnectToDatabase()
  
    const queryFilter =
      query && query !== 'all'
        ? {
            name: {
              $regex: query,
              $options: 'i',
            },
          }
        : {}
    const categoryFilter = category && category !== 'all' ? { category } : {}
    const tagFilter = tag && tag !== 'all' ? { tags: tag } : {}
  
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            avgRating: {
              $gte: Number(rating),
            },
          }
        : {}
    // 10-50
    const priceFilter =
      price && price !== 'all'
        ? {
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {}
    const order: Record<string, 1 | -1> =
      sort === 'best-selling'
        ? { numSales: -1 }
        : sort === 'price-low-to-high'
          ? { price: 1 }
          : sort === 'price-high-to-low'
            ? { price: -1 }
            : sort === 'avg-customer-review'
              ? { avgRating: -1 }
              : { _id: -1 }
    const isPublished = { isPublished: true }
    const products = await Product.find({
      ...isPublished,
      ...queryFilter,
      ...tagFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(order)
      .skip(limit * (Number(page) - 1))
      .limit(limit)
      .lean()
  
    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...tagFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
    return {
      products: JSON.parse(JSON.stringify(products)) as IProduct[],
      totalPages: Math.ceil(countProducts / limit),
      totalProducts: countProducts,
      from: limit * (Number(page) - 1) + 1,
      to: limit * (Number(page) - 1) + products.length,
    }
  }
  
  export async function getAllTags() {
    const tags = await Product.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: null, uniqueTags: { $addToSet: '$tags' } } },
      { $project: { _id: 0, uniqueTags: 1 } },
    ])
    return (
      (tags[0]?.uniqueTags
        .sort((a: string, b: string) => a.localeCompare(b))
        .map((x: string) =>
          x
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        ) as string[]) || []
    )
  }


