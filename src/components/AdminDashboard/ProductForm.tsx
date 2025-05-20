import { useState } from "react";

interface Category {
    id: number;
    name: string;
}

export interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number | null;
}

interface ProductFormProps {
    product?: Product | null;
    categories: Category[];
    onSubmit: (product: Product) => void;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function ProductForm({
                                        product,
                                        categories,
                                        onSubmit,
                                        onCancel,
                                        onSuccess,
                                    }: ProductFormProps) {
    const [formData, setFormData] = useState<Product>({
        id: product?.id,
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        stock: product?.stock || 0,
        imageUrl: product?.imageUrl || "",
        categoryId: product?.categoryId ?? (categories[0]?.id || null),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "stock"
                ? parseFloat(value)
                : name === "categoryId"
                    ? parseInt(value)
                    : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
        onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
            <div>
                <label className="block text-sm font-medium mb-1">Назва</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Опис</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full border rounded-md p-2"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Ціна</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        step="0.01"
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Кількість</label>
                    <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleChange}
                        min="0"
                        required
                        className="w-full border rounded-md p-2"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">URL зображення</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Категорія</label>
                <select
                    name="categoryId"
                    value={formData.categoryId ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                >
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 bg-gray-400 text-white rounded"
                >
                    Скасувати
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    {product ? "Оновити" : "Створити"}
                </button>
            </div>
        </form>
    );
}
