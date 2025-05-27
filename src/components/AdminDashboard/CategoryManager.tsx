"use client"
import {useState, useEffect} from "react";
import {Category} from "@/components/AdminDashboard/CategoryForm";
import CategoryForm from "@/components/AdminDashboard/CategoryForm";
import toast from "react-hot-toast";

export default function CategoryManager() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch("/api/admin/categories")
            .then(res => res.json())
            .then((data: Category[]) => setCategories(data));
    }, []);

    const handleAdd = () => {
        setEditingCategory(null);
        setShowForm(true);
        refreshCategories();

    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setShowForm(true);
        refreshCategories();

    };
    const handleDelete = async (category: Category) => {
        const confirmed = confirm(`Ви впевнені,що хочете видалити категорію: "${category.name}"?`);
        if (!confirmed) return;
        const res = await fetch(`/api/admin/categories/${category.id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            toast.success(`Товар "${category.name}" було успішно видалено`, {
                duration: 3000,
                position: "top-center",
            });
            handleFormClose();
        } else {
            toast.error(`Не вдалося видалити товар "${category.name}"`, {
                duration: 3000,
                position: "top-center",
            });
        }
        refreshCategories();

    };
    const handleFormClose = () => {
        setShowForm(false);
        setEditingCategory(null);
    };

    const refreshCategories = () => {
        fetch("/api/admin/categories")
            .then(res => res.json())
            .then((data: Category[]) => setCategories(data));
    };

    const handleSubmit = async (category: Category) => {
        const method = editingCategory ? "PUT" : "POST";
        const url = editingCategory
            ? `/api/admin/categories/${editingCategory.id}`
            : `/api/admin/categories`;

        await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({name: category.name}),
        });

        handleFormClose();
        refreshCategories();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Категорії</h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Створити категорію
                </button>
            </div>

            {showForm ? (
                <CategoryForm category={editingCategory}
                              onSubmit={handleSubmit}
                              onCancel={handleFormClose}
                              onSuccess={refreshCategories}/>
            ) : null}

            <table className="min-w-full bg-white shadow rounded">
                <thead>
                <tr>
                    <th className="px-4 py-2 text-left">Категорія</th>
                    <th className="px-4 py-2 text-left">Дії</th>
                </tr>
                </thead>
                <tbody>
                {categories.map((cat) => (
                    <tr key={cat.id} className="border-t">
                        <td className="px-4 py-2">{cat.name}</td>
                        <td className="px-4 py-2">
                            <button
                                onClick={() => handleEdit(cat)}
                                className="p-2 m-2 bg-green-500 text-white rounded"
                            >
                                Редагувати
                            </button>
                            <button
                                onClick={() => handleDelete(cat)}
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
