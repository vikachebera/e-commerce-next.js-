"use client"
import {FilterOptions, SortOption} from "@/types/filter";


interface FiltersPanelProps {
    sortOption: SortOption;
    filterOptions: FilterOptions;
    onSortChangeAction: (value: SortOption) => void;
    onFilterChangeAction: (options: FilterOptions) => void;
    onResetFiltersAction: () => void;
}

export default function FiltersPanel({
                                         sortOption,
                                         filterOptions,
                                         onSortChangeAction,
                                         onFilterChangeAction,
                                         onResetFiltersAction,
                                     }: FiltersPanelProps) {
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onSortChangeAction(e.target.value as SortOption);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        onFilterChangeAction({
            ...filterOptions,
            [name]: type === "checkbox" ? checked : value ? Number(value) : undefined,
        });
    };
    return (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Сортування</label>
                    <select
                        value={sortOption}
                        onChange={handleSortChange}
                        className="w-full p-2 border rounded"
                    >
                        <option value="price-asc">За ціною (зростання)</option>
                        <option value="price-desc">За ціною (спадання)</option>
                        <option value="name-asc">За назвою (А-Я)</option>
                        <option value="name-desc">За назвою (Я-А)</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Ціна</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            placeholder="Від"
                            value={filterOptions.minPrice || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            placeholder="До"
                            value={filterOptions.maxPrice || ""}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="flex items-end">
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={!!filterOptions.inStock}
                            onChange={handleInputChange}
                            className="mr-2"
                        />
                        Тільки в наявності
                    </label>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={onResetFiltersAction}
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                        Скинути фільтри
                    </button>
                </div>
            </div>
        </div>
    );
}