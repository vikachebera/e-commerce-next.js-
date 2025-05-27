"use client"
import {useEffect, useState} from "react";
import {Category, Product} from "@prisma/client";
import ProductList from "@/components/Blocks/ProductList";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";
import {SortOption, FilterOptions} from "@/types/filter";
import FiltersPanel from "@/components/Filter/FiltersPanel";

export default function CategoryProducts({category}: { category: Category }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [sortOption, setSortOption] = useState<SortOption>("price-asc");
    const [filters, setFilters] = useState<FilterOptions>({
        minPrice: undefined,
        maxPrice: undefined,
        inStock: false,
    });


    useEffect(() => {
        if (!category?.id) {
            setLoading(false);
            setProducts([]);
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const params = new URLSearchParams();

                if (filters.minPrice) params.append("minPrice", String(filters.minPrice));
                if (filters.maxPrice) params.append("maxPrice", String(filters.maxPrice));
                if (filters.inStock) params.append("inStock", "true");
                if (sortOption) params.append("sort", sortOption);

                const response = await fetch(
                    `/api/categories/${category.id}/products?${params.toString()}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error("Failed to fetch products", err);
                setError("Не вдалося завантажити продукти");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [category?.id, sortOption, filters]);

    if (loading) {
        <LoadingSpinner/>
    }

    if (error) {
        return (
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Продукти в категорії: {category.name}</h2>
                <div className="text-red-500">{error}</div>
            </div>
        );
    }

    return (
        <div className="p-4">

            <h2 className="text-xl font-bold mb-4 text-center">{category.name}</h2>
            {products.length === 0 ? (
                <>      <FiltersPanel
                    sortOption={sortOption}
                    filterOptions={filters}
                    onSortChangeAction={setSortOption}
                    onFilterChangeAction={setFilters}
                    onResetFiltersAction={() =>
                        setFilters({minPrice: undefined, maxPrice: undefined, inStock: false})
                    }
                />
                    <p className="text-gray-500">Немає продуктів у цій категорії</p>

                </>
            ) : (
                <>
                    <FiltersPanel
                        sortOption={sortOption}
                        filterOptions={filters}
                        onSortChangeAction={setSortOption}
                        onFilterChangeAction={setFilters}
                        onResetFiltersAction={() =>
                            setFilters({minPrice: undefined, maxPrice: undefined, inStock: false})
                        }
                    />
                    <ProductList products={products}/>
                </>
            )}
        </div>
    );
}