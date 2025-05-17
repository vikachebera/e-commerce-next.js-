import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

type Product = {
    id: number;
    name: string;
    description: string | null;
    price: number;
    categoryId: number | null;
};

type Category = {
    id: number;
    name: string;
};

export default async function Home() {
    try {
        const allProducts = await prisma.product.findMany({
            include: {
                category: true,
            },
        });

        return (
            <div className="flex flex-col items-center p-8">
                <h1 className="text-2xl font-bold mb-6">Список продуктів</h1>

                {allProducts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                        {allProducts.map((product) => (
                            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <h2 className="text-xl font-semibold">{product.name}</h2>
                                <p className="text-gray-600">{product.category?.name}</p>
                                <p className="text-blue-600 font-bold mt-2">
                                    {product.price.toFixed(2)} грн
                                </p>
                                {product.description && (
                                    <p className="mt-2 text-sm">{product.description}</p>
                                )}
                            </div>
                        ))}
                    </div>
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