import AddToCart from "@/components/Buttons/AddToCart";
import { Product } from "@prisma/client";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    return (
        <div className="group relative w-full h-full flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <div className="relative pt-[100%] bg-gray-100 overflow-hidden">
                <img
                    src={product?.imageUrl ?? "/placeholder.jpg"}
                    alt={product?.name ?? "Product"}
                    className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {product.stock <= 0 && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg bg-red-500 px-3 py-1 rounded-full">
                            Немає в наявності
                        </span>
                    </div>
                )}
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 line-clamp-2 min-h-[3rem]">
                        {product.name}
                    </h3>
                    <p className="text-blue-600 font-bold text-xl mt-2">
                        {product.price.toFixed(2)} грн
                    </p>
                </div>

                {product.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                        {product.description}
                    </p>
                )}

                <div className="mt-auto">
                    <AddToCart
                        productId={product.id}
                        disabled={product.stock <= 0}
                    />
                </div>
            </div>

            {product.stock > 0 && (
                <div className="absolute top-3 left-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    В наявності
                </div>
            )}
        </div>
    );
}