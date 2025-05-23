import prisma from "@lib/prisma";
import {NextResponse} from "next/server";
import {Prisma} from "@prisma/client";

export async function GET(
    req: Request,
    {params}: { params: Promise<{ id: string }> }
) {
    try {
        const resolvedProps = await params;
        const categoryId = Number(resolvedProps.id);

        const url = new URL(req.url);
        const minPrice = url.searchParams.get("minPrice");
        const maxPrice = url.searchParams.get("maxPrice");
        const inStock = url.searchParams.get("inStock");
        const sort = url.searchParams.get("sort");

        const whereClause: Prisma.ProductWhereInput = {
            categoryId,
        };

        if (minPrice) whereClause.price = {gte: Number(minPrice)};
        if (maxPrice) {
            whereClause.price = {
                ...whereClause.price as Prisma.FloatFilter,
                lte: Number(maxPrice),
            };
        }


        if (inStock === "true") whereClause.stock = {gt: 0};

        let orderBy: Prisma.ProductOrderByWithRelationInput | undefined = undefined;
        switch (sort) {
            case "price-asc":
                orderBy = {price: "asc"};
                break;
            case "price-desc":
                orderBy = {price: "desc"};
                break;
            case "name-asc":
                orderBy = {name: "asc"};
                break;
            case "name-desc":
                orderBy = {name: "desc"};
                break;
        }

        const products = await prisma.product.findMany({
            where: whereClause,
            orderBy,
        });

        return NextResponse.json(products, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {error: "Internal server error"},
            {status: 500}
        );
    }
}