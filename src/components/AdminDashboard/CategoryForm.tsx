import {useState} from "react";

export interface Category {
    id?: number;
    name: string;
}

interface CategoryFormProps {
    category?: Category | null;
    onSubmit: (category: Category) => void;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function CategoryForm({
                                         category,
                                         onSubmit,
                                         onCancel,
                                         onSuccess,
                                     }: CategoryFormProps) {
    const [formData, setFormData] = useState<Category>({
        id: category?.id,
        name: category?.name || "",
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value,
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
                <label className="block text-sm font-medium mb-1">Назва категорії</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full border rounded-md p-2"
                />
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
                    {category ? "Оновити" : "Створити"}
                </button>
            </div>
        </form>
    );
}
