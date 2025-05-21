"use client";
import { useState, useEffect } from "react";
import { OrderStatus, Product } from "@prisma/client";

interface OrderItemInput {
    id?: number;
    productId: number;
    quantity: number;
    price: number;
}

export interface OrderFormProps {
    order?: {
        id?: number;
        total?: number;
        status?: OrderStatus;
        orderItems: OrderItemInput[];
    } | null;
    onSubmitAction: (order: {
        total: number;
        status: OrderStatus;
        orderItems: OrderItemInput[];
    }) => void;
    onCancelAction: () => void;
    onSuccessAction: () => void;
}

export default function OrderForm({
                                      order,
                                      onSubmitAction,
                                      onCancelAction,
                                      onSuccessAction,
                                  }: OrderFormProps) {
    const [total, setTotal] = useState(order?.total || 0);
    const [status, setStatus] = useState<OrderStatus>(order?.status || OrderStatus.PENDING);
    const [orderItems, setOrderItems] = useState<OrderItemInput[]>(order?.orderItems || []);
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/admin/products")
            .then((res) => res.json())
            .then(setProducts)
            .catch((err) => console.error("Failed to load products", err));
    }, []);

    useEffect(() => {
        const calculatedTotal = orderItems.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
            0
        );
        setTotal(calculatedTotal);
    }, [orderItems]);

    const handleItemChange = (
        index: number,
        field: keyof OrderItemInput,
        value: string | number
    ) => {
        const updated = [...orderItems];
        const item = { ...updated[index] };

        if (field === "productId") {
            const product = products.find((p) => p.id === Number(value));
            item.productId = Number(value);
            item.price = product?.price || 0;
        } else if (field === "quantity" || field === "price") {
            item[field] = Number(value);
        }

        updated[index] = item;
        setOrderItems(updated);
    };

    const addItem = () => {
        setOrderItems([...orderItems, { productId: 0, quantity: 1, price: 0 }]);
    };

    const removeItem = (index: number) => {
        const updated = [...orderItems];
        updated.splice(index, 1);
        setOrderItems(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmitAction({ total, status, orderItems });
        onSuccessAction();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded shadow">
            <div>
                <label className="block font-medium mb-1">Сума (total)</label>
                <input
                    type="number"
                    value={total.toFixed(2)}
                    onChange={(e) => setTotal(parseFloat(e.target.value))}
                    className="w-full border rounded p-2"
                    disabled
                />
            </div>

            <div>
                <label className="block font-medium mb-1">Статус</label>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as OrderStatus)}
                    className="w-full border rounded p-2"
                >
                    {Object.values(OrderStatus).map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-4">
                <label className="block font-medium mb-2">Товари (order items)</label>
                <div className="grid grid-cols-5 gap-4 font-semibold text-sm text-gray-600">
                    <div>Продукт</div>
                    <div>Кількість</div>
                    <div>Ціна</div>
                    <div>Разом</div>
                    <div></div>
                </div>
                {orderItems.map((item, index) => (
                    <div key={index} className="grid grid-cols-5 gap-4 items-center">
                        <select
                            value={item.productId}
                            onChange={(e) => handleItemChange(index, "productId", e.target.value)}
                            className="border p-2 rounded"
                            required
                        >
                            <option value="">Оберіть товар</option>
                            {products.map((product) => (
                                <option key={product.id} value={product.id}>
                                    {product.name}
                                </option>
                            ))}
                        </select>

                        <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                            className="border p-2 rounded"
                            required
                        />

                        <input
                            type="number"
                            value={item.price}
                            readOnly
                            className="border p-2 rounded bg-gray-100"
                        />

                        <div>{(item.price * item.quantity).toFixed(2)}</div>

                        <button
                            type="button"
                            onClick={() => removeItem(index)}
                            className="text-red-600 text-lg font-bold"
                            title="Видалити"
                        >
                            ×
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={addItem}
                    className="text-blue-600 underline mt-2"
                >
                    + Додати товар
                </button>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancelAction}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                    Скасувати
                </button>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    {order ? "Оновити замовлення" : "Створити замовлення"}
                </button>
            </div>
        </form>
    );
}
