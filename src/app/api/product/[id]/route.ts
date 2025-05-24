import prisma from "@lib/prisma";
import {NextResponse} from "next/server";

const handlers = {
    GET: async (request: Request, {params}: { params: Promise<{ id: string }> }) => {
        try {

            const resolvedParams = await params;
            const productId = Number(resolvedParams.id);

            if (isNaN(productId)) {
                return NextResponse.json(
                    {error: "Invalid product ID"},
                    {status: 400}
                );
            }

            const product = await prisma.product.findUnique({
                where: {id: productId},
            });

            if (!product) {
                return NextResponse.json(
                    {error: "Product not found"},
                    {status: 404}
                );
            }

            return NextResponse.json(product, {status: 200});
        } catch (error) {
            console.error(error);
            return NextResponse.json(
                {error: "Internal server error"},
                {status: 500}
            );
        }
    }
};

export const GET = handlers.GET;