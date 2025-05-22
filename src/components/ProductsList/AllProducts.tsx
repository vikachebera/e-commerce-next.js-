import prisma from "@lib/prisma";
import {Category, Product} from "@prisma/client";
import ProductList from "@/components/Blocks/ProductList";
type ProductWithCategory = Product & { category: Category | null };

export default async function AllProducts() {
    try {
        const allProducts: ProductWithCategory[] = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        return (
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Список товарів</h1>
                {allProducts.length > 0 ? (
                    <ProductList products={allProducts}/>
                ) : (
                    <p className="text-gray-500">Продукти не знайдені</p>
                )}
            </div>
        );

    } catch (error) {
        console.error('Помилка при завантаженні продуктів:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Сталася помилка при завантаженні даних</p>
            </div>

        );
    }
}