import { Category, Product } from "@prisma/client";
import ProductList from "@/components/Blocks/ProductList";
import Link from "next/link";

interface CategoryBlockProps {
    category: Category;
    products: Product[];
}

export default function CategoryBlock({ category, products }: CategoryBlockProps) {
    return (
        <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{category.name}</h2>
                <Link href={`/categories/${category.id}`} className="text-blue-600 hover:underline">
                   Дивитись всі
                </Link>
            </div>

            <ProductList products={products} />
        </div>
    );
}