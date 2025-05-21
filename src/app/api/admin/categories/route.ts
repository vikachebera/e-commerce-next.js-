import prisma from "@lib/prisma";
import {NextRequest, NextResponse} from "next/server";


const handler = {
    GET: async () => {
        try {
            const categories = await prisma.category.findMany();
            return NextResponse.json(categories, {status: 200});

        } catch (error) {
            console.log(error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});

        }

    },
    POST: async (req: NextRequest) => {
        try {
            const body = await req.json();
            const {name} = body;

            if (!name) {
                return NextResponse.json({error: "Missing required fields"}, {status: 400});
            }
            const category = await prisma.category.create({
                data: {
                    name
                }
            });
            return NextResponse.json(category, {status: 200})
        } catch (error) {
            console.log(error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});

        }

    }
}


export const GET = handler.GET;
export const POST = handler.POST;