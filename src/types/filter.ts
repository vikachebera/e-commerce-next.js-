import { Category, Product } from "@prisma/client";

export type SortOption = "price-asc" | "price-desc" | "name-asc" | "name-desc" | "rating";
export type FilterOptions = {
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
};

export type CategoryWithProducts = Category & { products: Product[] };