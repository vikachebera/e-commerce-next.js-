"use client";
import { useState, useEffect } from "react";
import { Order, OrderStatus } from "@prisma/client";
import OrderForm from "@/components/AdminDashboard/OrderForm";

 interface FullOrder extends Order {
    orderItems: {
        id?: number;
        productId: number;
        quantity: number;
        price: number;
    }[];
}

export default function OrderManager() {
    const [orders, setOrders] = useState<FullOrder[]>([]);
    const [editingOrder, setEditingOrder] = useState<FullOrder | null>(null);
    const [showForm, setShowForm] = useState(false);

    const refreshOrders = () => {
        fetch("/api/admin/orders")
            .then((res) => res.json())
            .then((data: FullOrder[]) => setOrders(data));
    };

    useEffect(() => {
        refreshOrders();
    }, []);

    const handleEdit = async (order: FullOrder) => {
        try {
            const res = await fetch(`/api/admin/orders/${order.id}/items`);
            const items = await res.json();
            setEditingOrder({ ...order, orderItems: items });
            setShowForm(true);
        } catch (error) {
            console.error("Не вдалося завантажити orderItems:", error);
            alert("Помилка при завантаженні деталей замовлення");
        }
    };

    const handleDelete = async (order: FullOrder) => {
        const confirmed = confirm(`Ви впевнені, що хочете видалити замовлення "${order.id}"?`);
        if (!confirmed) return;

        await fetch(`/api/admin/orders/${order.id}`, {
            method: "DELETE",
        });
        refreshOrders();
    };

    const handleFormClose = () => {
        setShowForm(false);
        setEditingOrder(null);
    };

    const handleSubmit = async (formData: {
        total: number;
        status: OrderStatus;
        orderItems: {
            id?: number;
            productId: number;
            quantity: number;
            price: number;
        }[];
    }) => {
        const method = editingOrder ? "PUT" : "POST";
        const url = editingOrder
            ? `/api/admin/orders/${editingOrder.id}`
            : `/api/admin/orders`;

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        handleFormClose();
        refreshOrders();
    };

    return (
        <div className="p-6">
            {showForm && (
                <OrderForm
                    order={editingOrder}
                    onSubmitAction={handleSubmit}
                    onCancelAction={handleFormClose}
                    onSuccessAction={refreshOrders}
                />
            )}

            <table className="min-w-full bg-white shadow rounded mt-6">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Сума</th>
                    <th className="px-4 py-2 text-left">Статус</th>
                    <th className="px-4 py-2 text-left">Дії</th>
                </tr>
                </thead>
                <tbody>
                {orders.map((order) => (
                    <tr key={order.id} className="border-t">
                        <td className="px-4 py-2">{order.id}</td>
                        <td className="px-4 py-2">{order.total.toFixed(2)}</td>
                        <td className="px-4 py-2">{order.status}</td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => handleEdit(order)}
                                className="p-2 m-2 bg-green-500 text-white rounded"
                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => handleDelete(order)}
                                className="p-2 m-2 bg-red-500 text-white rounded"
                            >
                                Видалити
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
