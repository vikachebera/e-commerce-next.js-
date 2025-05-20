import prisma from "@lib/prisma";
import {NextResponse, NextRequest} from "next/server";

const handlers = {
    GET: async () => {
        try {
            const products = await prisma.product.findMany();
            return NextResponse.json(products, {status: 200});
        } catch (error) {
            console.error("Error fetching products:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});

        }

    },

    POST: async (req: NextRequest) => {
        try {
            const body = await req.json();
            const {name, description, price, stock, imageUrl, categoryId} = body;
            if (!name || !description || price == null || stock == null) {
                return NextResponse.json({error: "Missing required fields"}, {status: 400});
            }
            const product = await prisma.product.create({
                data: {
                    name,
                    description,
                    price: Number(price),
                    stock: Number(stock),
                    imageUrl,
                    categoryId: categoryId ?? null,
                }


            })
            return NextResponse.json(product, { status: 201 });

        } catch (error) {
            console.error("Error fetching products:", error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});

        }
    }
}


export const GET = handlers.GET;
export const POST = handlers.POST;