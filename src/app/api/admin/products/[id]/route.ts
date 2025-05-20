import prisma from "@lib/prisma";
import {NextRequest, NextResponse} from "next/server";


const handlers = {
    GET: async (_: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
        const resolvedParams = await params
        try {
            const product = await prisma.product.findUnique({
                where: {id: Number(resolvedParams.id)},
            });

            if (!product) {
                return NextResponse.json({error: "Product not found"}, {status: 404});
            }

            return NextResponse.json(product, {status: 200});
        } catch (error) {
            console.error("Error fetching product:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    },


    PUT: async (req: NextRequest, {params}: { params: Promise<{ id: string }> }) => {
        const resolvedParams = await params;

        try {
            const {name, description, price, stock, imageUrl, categoryId} = await req.json();

            const product = await prisma.product.update({
                where: {id: Number(resolvedParams.id)},
                data: {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    imageUrl,
                    categoryId: categoryId ?? null,
                },
            });

            return NextResponse.json(product, {status: 200});
        } catch (error) {
            console.error("Error updating product:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});
        }
    },

    DELETE: async (req: NextRequest, {params}: { params: Promise<{ id: string }>}) =>
{
    const resolvedParams = await params;

    try {
        await prisma.cartItem.deleteMany({
            where: {productId: Number(resolvedParams.id)},
        });
        await prisma.product.delete({
            where: {id: Number(resolvedParams.id)},
        });

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

}


export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
