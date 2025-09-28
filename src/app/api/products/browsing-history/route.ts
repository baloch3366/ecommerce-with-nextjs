

import { ConnectToDatabase } from "@/lib/db";
import Product from "@/lib/db/model/product.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const listType = req.nextUrl.searchParams.get('type') || 'history';
    const productIdsParams = req.nextUrl.searchParams.get('ids');
    const categoriesParams = req.nextUrl.searchParams.get('categories');

    // Early return if no valid parameters
    if (!productIdsParams && !categoriesParams) {
        return NextResponse.json([]);
    }

    await ConnectToDatabase();

    // Handle history list type
    if (listType === 'history') {
        // If ids are missing, return an empty list.
       if (!productIdsParams) {
            return NextResponse.json([]);
        }

        const productIds = productIdsParams.split(',');
        const products = await Product.find({
            _id: { $in: productIds.map(id => new Types.ObjectId(id)) }
        }).lean();

        return NextResponse.json(
            products.sort((a, b) => 
                productIds.indexOf(a._id.toString()) - 
                productIds.indexOf(b._id.toString())
            )
        );
    }

    // Handle recommendation list type
    const productIds = productIdsParams?.split(',') || [];
    const categories = categoriesParams?.split(',') || [];
    
    if (categories.length === 0) {
        return NextResponse.json([]);
    }

    const products = await Product.find({
        category: { $in: categories },
        _id: { $nin: productIds.map(id => new Types.ObjectId(id)) }
    });

    return NextResponse.json(products);
}