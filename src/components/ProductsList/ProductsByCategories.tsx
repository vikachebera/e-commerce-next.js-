import prisma from "@lib/prisma";
import { Category, Product } from "@prisma/client";
import CategoryBlock from "@/components/Blocks/CategoryBlock";

type CategoryWithProducts = Category & { products: Product[] };

export default async function ProductsByCategories() {
    try {
        const categories: CategoryWithProducts[] = await prisma.category.findMany({
            include: {
                products: true,
            },
        });

        return (
            <div className="container mx-auto px-4 py-8">
                {categories.length > 0 ? (
                    <div className="space-y-12">
                        {categories.map((category) => (
                            <CategoryBlock
                                key={category.id}
                                category={category}
                                products={category.products}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">Категорії не знайдені</p>
                )}
            </div>
        );
    } catch (error) {
        console.error('Помилка при завантаженні категорій:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Сталася помилка при завантаженні даних</p>
            </div>
        );
    }
}