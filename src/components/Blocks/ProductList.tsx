"use client"
import { Product } from "@prisma/client";
import ProductCard from "@/components/Blocks/ProductCard";

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    return (
        <div className="flex flex-row   w-full">
            {products.map((product) => (
                <div key={product.id} className="w-1/5 m-1">
                    <ProductCard product={product} />
                </div>
            ))}
        </div>
    );
}