import prisma from "@/lib/prisma";
import { Product, Category } from "@prisma/client";

export type ProductWithCategory = Product & { category: Category | null };

export async function getProducts(): Promise<ProductWithCategory[]> {
    return prisma.product.findMany({
        include: { category: true },
    });
}
