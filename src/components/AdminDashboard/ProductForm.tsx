import { useState } from "react";

interface Category {
    id: number;
    name: string;
}

interface Product {
    id?: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    categoryId: number | null;
}

interface ProductFormProps {
    product?: Product;
    categories: Category[];
    onSubmit: (product: Product) => void;
    onCancel: () => void;
}

export default function ProductForm({
                                        product,
                                        categories,
                                        onSubmit,
                                        onCancel,
                                    }: ProductFormProps) {
    const [formData, setFormData] = useState<Product>({
        id: product?.id || 0,
        name: product?.name || "",
        description: product?.description || "",
        price: product?.price || 0,
        stock: product?.stock || 0,
        imageUrl: product?.imageUrl || "",
        categoryId: product?.categoryId || (categories[0]?.id || null),
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === "price" || name === "stock" ? parseFloat(value) : value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Назва</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Опис</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ціна</label>
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Кількість</label>
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

            {/* Зображення */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL зображення</label>
                <input
                    type="text"
                    name="imageUrl"
                    value={formData.imageUrl}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категорія</label>
                <select
                    name="categoryId"
                    value={formData.categoryId ?? ""}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2"
                >
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
                <button type="button" onClick={onCancel}>
                    Скасувати
                </button>
                <button type="submit">
                    {product ? "Оновити" : "Створити"}
                </button>
            </div>
        </form>
    );
}
