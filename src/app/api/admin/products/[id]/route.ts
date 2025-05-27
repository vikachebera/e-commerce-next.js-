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

    DELETE: async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
        const resolvedParams = await params;
        const productId = Number(resolvedParams.id);

        try {
            const product = await prisma.product.findUnique({
                where: { id: productId },
            });

            if (!product) {
                return NextResponse.json(
                    { error: "Product not found" },
                    { status: 404 }
                );
            }

            await prisma.$transaction(async (tx) => {
                await tx.cartItem.deleteMany({
                    where: { productId },
                });

                await tx.orderItem.deleteMany({
                    where: { productId },
                });

                await tx.product.delete({
                    where: { id: productId },
                });
            });

            return NextResponse.json(
                { success: true, message: "Product deleted successfully" },
                { status: 200 }
            );
        } catch (error) {
            console.error("Error deleting product:", error);

            let errorMessage = "Failed to delete product";
            let statusCode = 500;

            if (error instanceof Error) {
                if (error.message.includes("foreign key constraint")) {
                    errorMessage = "Cannot delete product - it's referenced in orders";
                    statusCode = 400;
                }
            }

            return NextResponse.json(
                {
                    error: errorMessage,
                    details: error instanceof Error ? error.message : undefined
                },
                { status: statusCode }
            );
        }
    }

}


export const GET = handlers.GET;
export const PUT = handlers.PUT;
export const DELETE = handlers.DELETE;
