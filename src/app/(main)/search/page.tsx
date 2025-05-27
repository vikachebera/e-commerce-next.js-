"use client";
import {useEffect, useState, use} from "react";
import FiltersPanel from "@/components/Filter/FiltersPanel";
import ProductList from "@/components/Blocks/ProductList";
import {SortOption, FilterOptions} from "@/types/filter";
import {Product} from "@prisma/client";
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

export default function SearchPage({searchParams}: { searchParams: Promise<{ q?: string }> }) {
    const resolvedSearchParams = use(searchParams);
    const query = resolvedSearchParams?.q || "";
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>("price-asc");
    const [filters, setFilters] = useState<FilterOptions>({
        minPrice: undefined,
        maxPrice: undefined,
        inStock: false,
    });

    useEffect(() => {
        const fetchProducts = async () => {
            if (!query || query.trim() === "") {
                setProducts([]);
                return;
            }

            setIsLoading(true);
            setError(null);
            try {
                const params = new URLSearchParams();
                params.set("q", query);
                if (filters.minPrice !== undefined) params.set("minPrice", String(filters.minPrice));
                if (filters.maxPrice !== undefined) params.set("maxPrice", String(filters.maxPrice));
                if (filters.inStock) params.set("inStock", "true");
                params.set("sort", sortOption);

                const res = await fetch(`/api/search?${params.toString()}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [query, sortOption, filters]);

    if (!query || query.trim() === "") return <p className="p-6">Порожній запит</p>;

        return (
            <div className="max-w-6xl mx-auto px-4 py-8">
                <FiltersPanel
                    sortOption={sortOption}
                    filterOptions={filters}
                    onSortChangeAction={setSortOption}
                    onFilterChangeAction={setFilters}
                    onResetFiltersAction={() =>
                        setFilters({minPrice: undefined, maxPrice: undefined, inStock: false})
                    }
                />
                <h1 className="text-2xl font-semibold mb-4">Результати пошуку: {query}</h1>
                {isLoading ? (
                    <LoadingSpinner/>
                ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                ) : products.length === 0 ? (
                    <p>Нічого не знайдено.</p>
                ) : (
                    <ProductList products={products}/>
                )}
            </div>
        );
}