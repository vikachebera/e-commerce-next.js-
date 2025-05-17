import { Product, Category } from '@prisma/client';

export type ProductWithCategory = Product & {
    category: Category | null;
};
