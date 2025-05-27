import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { Prisma } from '@prisma/client';


export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q");
        const minPrice = searchParams.get("minPrice");
        const maxPrice = searchParams.get("maxPrice");
        const inStock = searchParams.get("inStock");
        const sort = searchParams.get("sort");

        if (!query || query.trim().length === 0) {
            return NextResponse.json([]);
        }

        const where: Prisma.ProductWhereInput  = {
            name: {
                contains: query,
                mode: "insensitive",
            },
        };

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice && !isNaN(Number(minPrice))) {
                where.price.gte = Number(minPrice);
            }
            if (maxPrice && !isNaN(Number(maxPrice))) {
                where.price.lte = Number(maxPrice);
            }
        }

        if (inStock === "true") {
            where.stock = {
                gt: 0
            };
        }

        let orderBy: Prisma.ProductOrderByWithRelationInput = {};
        switch (sort) {
            case 'price-asc':
                orderBy = { price: 'asc' };
                break;
            case 'price-desc':
                orderBy = { price: 'desc' };
                break;
            case 'name-asc':
                orderBy = { name: 'asc' };
                break;
            case 'name-desc':
                orderBy = { name: 'desc' };
                break;
            default:
                orderBy = {  price: 'asc' };
        }

        const results = await prisma.product.findMany({
            where,
            orderBy,
            take: 10,
        });

        return NextResponse.json(results);

    } catch (error) {
        console.error('Search API Error:', error);

        return NextResponse.json(
            {
                error: 'Failed to search products',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}