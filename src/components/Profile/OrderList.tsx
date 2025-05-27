"use client";

import {useEffect, useState} from "react";

type Product = {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
};

type OrderItem = {
    id: number;
    product: Product;
    quantity: number;
    price: number;
};

type Order = {
    id: number;
    createdAt: string;
    orderItems: OrderItem[];
    status?: "pending" | "completed" | "cancelled";
};

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                const sortedOrders = [...data].sort((a, b) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setOrders(sortedOrders);
            })
            .catch(error => console.error('Error fetching orders:', error))
            .finally(() => setIsLoading(false));
    }, []);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (isLoading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="border rounded-lg p-6 space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-center items-center text-gray-900 mb-8">Історія замовлень</h1>

            {orders.length > 0 ? (
                <div className="space-y-4">
                    {orders.map((order) => (
                        <div key={order.id}
                             className="border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                            <div className="bg-white p-6">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            Замовлення #{order.id}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(order.createdAt).toLocaleDateString('uk-UA', {
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {order.status && (
                                        <span
                                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status === 'pending' && 'В обробці'}
                                            {order.status === 'completed' && 'Виконано'}
                                            {order.status === 'cancelled' && 'Скасовано'}
                    </span>
                                    )}
                                </div>

                                <div className="mt-6 border-t border-gray-100 pt-6">
                                    <h4 className="font-medium text-gray-900 mb-3">Товари</h4>
                                    <ul className="space-y-4">
                                        {order.orderItems?.map((item) => (
                                            <li key={item.id} className="flex items-start gap-4">
                                                {item.product?.imageUrl && (
                                                    <div className="flex-shrink-0">
                                                        <img
                                                            src={item.product.imageUrl}
                                                            alt={item.product.name}
                                                            className="h-16 w-16 rounded-md object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-gray-900 truncate">
                                                        {item.product?.name}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.quantity} × {item.price.toFixed(2)} грн
                                                    </p>
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {(item.quantity * item.price).toFixed(2)} грн
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-end">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Сума замовлення:</p>
                                        <p className="text-lg font-semibold text-gray-900">
                                            {order.orderItems?.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2)} грн
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Немає замовлень</h3>
                    <p className="mt-1 text-gray-500">Ви ще не зробили жодного замовлення.</p>
                    <div className="mt-6">
                        <a
                            href="/products"
                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                            Перейти до каталогу
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}