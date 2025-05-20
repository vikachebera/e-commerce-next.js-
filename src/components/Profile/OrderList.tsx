"use client";

import { useEffect, useState } from "react";

type Product = {
    id: number;
    name: string;
    price: number;
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
};

export default function OrderList() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetch('/api/orders')
            .then(res => res.json())
            .then(data => {
                console.log("Orders from API:", data);
                setOrders(data);
            })
            .catch(error => console.error('Error fetching orders:', error));

        }, []);

    return (
        <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-2xl font-bold mb-6">Ваші замовлення</h1>
            {orders.length > 0 ? (
                orders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4 mb-4 shadow">
                        <div className="flex justify-between items-center">
                            <div>
                                <p><strong>Номер замовлення:</strong> {order.id}</p>
                                <p><strong>Дата:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        {order.orderItems && order.orderItems.length > 0 && (
                            <div className="mt-4 border-t pt-4">
                                <h3 className="font-semibold mb-2">Товари:</h3>
                                <ul className="list-disc pl-5 space-y-1">
                                    {order.orderItems.map((item) => (
                                        <li key={item.id}>
                                            {item.product?.name} — {item.quantity} шт. — {item.price} грн
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>У вас ще немає замовлень.</p>
            )}
        </div>
    );
}