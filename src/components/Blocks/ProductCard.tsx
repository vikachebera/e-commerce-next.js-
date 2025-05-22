import AddToCart from "@/components/Buttons/AddToCart";
import {Product} from "@prisma/client";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({product}: ProductCardProps) {
    return (
        <div className="w-full p-6 hover:shadow-xl transition-shadow duration-300 bg-white border border-gray-300">
            <div className="h-5/7 mb-4 overflow-hidden rounded-md">
                <img
                    src={product?.imageUrl ?? "/placeholder.jpg"}
                    alt={product?.name ?? "Product"}
                    className="w-full h-full object-cover"
                />
            </div>
            <h2 className="text-xl font-semibold mb-2 line-clamp-2 h-14">
                {product.name}
            </h2>
            <p className="text-blue-600 font-bold text-lg mb-3">
                {product.price.toFixed(2)} грн
            </p>
            {product.description && (
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {product.description}
                </p>
            )}
            <AddToCart productId={product.id}/>
        </div>
    )
}