import prisma from "@lib/prisma";
import {NextResponse} from "next/server";


const handler = {
    GET: async () => {
        try {
            const categories = await prisma.category.findMany();
            return NextResponse.json(categories, {status: 200});

        } catch (error) {
            console.log(error);
            return NextResponse.json({error: "Internal Server Error"}, {status: 500});

        }

    }
}


export const GET = handler.GET;