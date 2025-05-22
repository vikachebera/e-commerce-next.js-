import prisma from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedProps = await params;
        const categoryId = Number(resolvedProps.id);

        const products = await prisma.product.findMany({
            where: { categoryId: categoryId },
        });
        return NextResponse.json(products, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}