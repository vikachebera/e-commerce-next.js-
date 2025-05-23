import { Category, Product } from "@prisma/client";
import ProductList from "@/components/Blocks/ProductList";
import Link from "next/link";

interface CategoryBlockProps {
    category: Category;
    products: Product[];
}

export default function CategoryBlock({ category, products }: CategoryBlockProps) {
    const limitedProducts = products.slice(0, 5);
    return (
        <div className="mb-12 bg-blue-100 rounded-2xl border border-gray-200  p-5">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link href={`/categories/${category.id}`} className="text-blue-600 hover:underline">
                   Дивитись всі
                </Link>
            </div>

            <ProductList  products={limitedProducts}  />
        </div>
    );
}