'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';

type AddToCartProps = {
    productId: number;
    disabled?: boolean;
};

export default function AddToCart({ productId, disabled = false }: AddToCartProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleAddToCart = async () => {
        if (disabled) return;

        setIsLoading(true);

        try {
            const res = await fetch('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    productId: Number(productId),
                    quantity: 1,
                }),
            });

            if (!res.ok) throw new Error("Помилка при додаванні до кошика");

            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err) {
            console.error(err);
            alert("Помилка при додаванні до кошика");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleAddToCart}
            disabled={disabled || isLoading}
            className={`
                w-full py-3 px-4 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2
                ${disabled
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isSuccess
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }
                ${isLoading ? 'opacity-80' : ''}
            `}
        >
            {isLoading ? (
                <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Додаємо...
                </>
            ) : isSuccess ? (
                <>
                    <Check className="h-5 w-5" />
                    Додано!
                </>
            ) : (
                disabled ? 'Немає в наявності' : 'Додати до кошика'
            )}
        </button>
    );
}