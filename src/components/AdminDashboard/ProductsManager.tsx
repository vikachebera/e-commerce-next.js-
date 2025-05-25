import {useState, useEffect} from "react";
import ProductForm, {Product} from "@/components/AdminDashboard/ProductForm";

interface Category {
    id: number;
    name: string;
}

export default function ProductsManager() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetch("/api/admin/products")
            .then(res => res.json())
            .then((data: Product[]) => setProducts(data));

        fetch("/api/admin/categories")
            .then(res => res.json())
            .then((data: Category[]) => setCategories(data));
    }, []);

    const handleAdd = () => {
        setEditingProduct(null);
        setShowForm(true);

    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setShowForm(true);

    };
    const handleDelete = async (product: Product) => {
        const confirmed = confirm(`Are you sure you want to delete "${product.name}"?`);
        if (!confirmed) return;

        await fetch(`/api/admin/products/${product.id}`, {
            method: "DELETE",
        });

        handleFormSuccess();
    };
    const handleFormClose = () => {
        setShowForm(false);
    };

    const handleFormSuccess = () => {
        fetch("/api/admin/products")
            .then(res => res.json())
            .then((data: Product[]) => setProducts(data));
        setShowForm(false);
    };

    const handleSubmit = async (product: Product) => {
        const method = product.id ? "PUT" : "POST";
        const url = product.id ?
            `/api/admin/products/${product.id}` :
            `/api/admin/products`;
        await fetch(url, {
            method,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(product),
        });
        handleFormSuccess();
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Products</h2>
                <button
                    onClick={handleAdd}
                    className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                    Додати продукт
                </button>
            </div>
            {showForm ? (
                <ProductForm
                    product={editingProduct}
                    categories={categories}
                    onSubmit={handleSubmit}
                    onCancel={handleFormClose}
                    onSuccess={handleFormSuccess}
                />
            ) : (
                <table className="min-w-full bg-white shadow rounded">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">Назва</th>
                        <th className="px-4 py-2">Ціна</th>
                        <th className="px-4 py-2">Наявність</th>
                        <th className="px-4 py-2">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {products.map((prod) => (
                        <tr key={prod.id} className="border-t">
                            <td className="px-4 py-2">{prod.name}</td>
                            <td className="px-4 py-2">${prod.price}</td>
                            <td className="px-4 py-2">{prod.stock}</td>
                            <td className="px-4 py-2">
                                <button
                                    onClick={() => handleEdit(prod)}
                                    className="p-2 m-2 gap-2 bg-green-500 text-white rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(prod)}
                                    className="p-2 m-2 gap-2 bg-red-500 text-white rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
