'use client';

import {CartItem, Product, User} from "@prisma/client";
import {useState,useEffect} from "react";
import Link from "next/link";

type CartWithProduct = CartItem & { product: Product | null, user: User };

export default function CartClient({initialCart}: { initialCart: CartWithProduct[] }) {
    const [items, setItems] = useState(initialCart.filter(item => item.product !== null));

    const total = items.reduce((sum, item) => {
        const price = item.product?.price ?? 0;
        return sum + price * item.quantity;
    }, 0);

    const updateCartCounter = () => {
        const event = new CustomEvent('cartUpdated', {
            detail: {count: items.reduce((sum, item) => sum + item.quantity, 0)}

        });
        window.dispatchEvent(event);

    }
    useEffect(() => {
        updateCartCounter();
    }, [items]);

    const handleQuantityChange = async (itemId: number, newQuantity: number) => {
        try {
            const response = await fetch('/api/cart/update', {
                method: 'POST',
                body: JSON.stringify({itemId, newQuantity}),
                headers: {'Content-Type': 'application/json'}
            });

            if (!response.ok) throw new Error('Помилка оновлення');

            setItems(prev => prev.map(i => i.id === itemId ? {...i, quantity: newQuantity} : i));
        } catch (error) {
            console.error(error);
            alert('Не вдалося оновити кількість');
        }
    };

    const handleRemoveItem = async (itemId: number) => {
        try {
            const response = await fetch('/api/cart/remove', {
                method: 'POST',
                body: JSON.stringify({itemId}),
                headers: {'Content-Type': 'application/json'}
            });

            if (!response.ok) throw new Error('Помилка видалення');

            setItems(prev => prev.filter(i => i.id !== itemId));
        } catch (error) {
            console.error(error);
            alert('Не вдалося видалити товар');
        }
    };

    const handleCheckout = async () => {
        try {
            const orderResponse = await fetch('/api/orders', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    total: total,
                    orderItems: items.map(item => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product?.price ?? 0
                    }))
                })
            });

            if (!orderResponse.ok) throw new Error('Помилка оформлення замовлення');

            const clearCartResponse = await fetch('/api/cart/clear', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });

            if (!clearCartResponse.ok) throw new Error('Помилка очищення кошика');
            setItems([]);
            updateCartCounter();

            alert('Замовлення успішно оформлено!');
        } catch (error) {
            console.error(error);
            alert('Не вдалося оформити замовлення');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Ваш кошик</h1>

            {items.length > 0 ? (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="divide-y divide-gray-200">
                        <div className="hidden md:grid grid-cols-12 gap-6 py-4 px-6 bg-gray-50">
                            <div className="col-span-5 font-medium text-gray-500">Товар</div>
                            <div className="col-span-2 font-medium text-gray-500 text-center">Ціна</div>
                            <div className="col-span-3 font-medium text-gray-500 text-center">Кількість</div>
                            <div className="col-span-1 font-medium text-gray-500 text-right">Сума</div>
                            <div className="col-span-1"></div>
                        </div>

                        {items.map((cartItem) => (
                            <div key={cartItem.id}
                                 className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 px-6 hover:bg-gray-50 transition-colors">
                                <div className="col-span-5 flex flex-col md:flex-row gap-4">
                                    <img
                                        src={cartItem.product?.imageUrl ?? "/placeholder.jpg"}
                                        alt={cartItem.product?.name ?? "Product"}
                                        className="w-full md:w-24 h-24 object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{cartItem.product?.name}</h3>
                                        <p className="text-gray-500 text-sm mt-1">Артикул: {cartItem.product?.id}</p>
                                    </div>
                                </div>

                                {/* Ціна */}
                                <div className="col-span-2 flex items-center justify-center">
                                    <p className="text-gray-900 font-medium">
                                        {cartItem.product?.price.toFixed(2)} грн
                                    </p>
                                </div>

                                {/* Кількість */}
                                <div className="col-span-3 flex items-center justify-center">
                                    <div className="flex items-center border border-gray-300 rounded-md">
                                        <button
                                            onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity - 1)}
                                            disabled={cartItem.quantity <= 1}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1 border-x border-gray-300">
                                            {cartItem.quantity}
                                        </span>
                                        <button
                                            onClick={() => handleQuantityChange(cartItem.id, cartItem.quantity + 1)}
                                            className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                {/* Сума */}
                                <div className="col-span-1 flex items-center justify-end">
                                    <p className="text-gray-900 font-medium">
                                        {(cartItem.product?.price ? cartItem.product.price * cartItem.quantity : 0).toFixed(2)} грн
                                    </p>
                                </div>

                                {/* Кнопка видалення */}
                                <div className="col-span-1 flex items-center justify-end">
                                    <button
                                        onClick={() => handleRemoveItem(cartItem.id)}
                                        className="text-red-500 hover:text-red-700 transition-colors"
                                        title="Видалити товар"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                                             viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Підсумок */}
                    <div className="border-t border-gray-200 px-6 py-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Разом</h3>
                                <p className="text-sm text-gray-500 mt-1">Доставка розраховується на етапі
                                    оформлення</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-bold text-gray-900">{total.toFixed(2)} грн</p>
                            </div>
                        </div>
                        <div className="mt-6">
                            <button
                                onClick={handleCheckout}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md shadow-sm text-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                Оформити замовлення
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Кошик порожній</h3>
                    <p className="mt-1 text-gray-500">Додайте товари до кошика, щоб продовжити покупки</p>
                    <div className="mt-6">
                        <Link
                            href="/"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Перейти на головну
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
}