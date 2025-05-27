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
        <div className="bg-gradient-to-br from-white/90 to-gray-50/90 p-6 rounded-2xl shadow-lg shadow-gray-100/50 border border-gray-200/60 mb-8 backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-sm">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-800 tracking-tight">Фільтри та сортування</h2>
                    <p className="text-sm text-gray-500 mt-1">Уточніть параметри пошуку</p>
                </div>
            </div>

            {/* Filters Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Sort Dropdown */}
                <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Сортування
                    </label>
                    <div className="relative">
                        <select
                            value={sortOption}
                            onChange={handleSortChange}
                            className="w-full p-3.5 pl-4 pr-10 border border-gray-200/80 rounded-xl bg-white text-gray-700 font-medium
                                    focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500
                                    transition-all duration-200 shadow-xs hover:shadow-sm appearance-none cursor-pointer
                                    group-hover:border-blue-300 backdrop-blur-sm"
                        >
                            <option value="price-asc">За ціною (зростання)</option>
                            <option value="price-desc">За ціною (спадання)</option>
                            <option value="name-asc">За назвою (А-Я)</option>
                            <option value="name-desc">За назвою (Я-А)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Price Range */}
                <div className="group">
                    <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        Діапазон цін
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <input
                                type="number"
                                name="minPrice"
                                placeholder="Мін"
                                value={filterOptions.minPrice || ""}
                                onChange={handleInputChange}
                                className="w-full p-3.5 pl-4 pr-8 border border-gray-200/80 rounded-xl bg-white text-gray-700 font-medium
                                        placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-green-500/30
                                        focus:border-green-500 transition-all duration-200 shadow-xs hover:shadow-sm
                                        group-hover:border-green-300 backdrop-blur-sm"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-xs text-gray-400/80 font-medium">₴</span>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-px bg-gray-300/80 rounded"></div>
                        </div>
                        <div className="relative flex-1">
                            <input
                                type="number"
                                name="maxPrice"
                                placeholder="Макс"
                                value={filterOptions.maxPrice || ""}
                                onChange={handleInputChange}
                                className="w-full p-3.5 pl-4 pr-8 border border-gray-200/80 rounded-xl bg-white text-gray-700 font-medium
                                        placeholder-gray-400/80 focus:outline-none focus:ring-2 focus:ring-green-500/30
                                        focus:border-green-500 transition-all duration-200 shadow-xs hover:shadow-sm
                                        group-hover:border-green-300 backdrop-blur-sm"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                <span className="text-xs text-gray-400/80 font-medium">₴</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-end">
                    <label className="flex items-center gap-3 cursor-pointer group p-3 -ml-3 rounded-xl hover:bg-amber-50/50 transition-all duration-200">
                        <div className="relative">
                            <input
                                type="checkbox"
                                name="inStock"
                                checked={!!filterOptions.inStock}
                                onChange={handleInputChange}
                                className="sr-only"
                            />
                            <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center
                                        ${filterOptions.inStock
                                ? 'bg-amber-500 border-amber-500 shadow-xs'
                                : 'bg-white/80 border-gray-300/80 group-hover:border-amber-400'}`}>
                                {filterOptions.inStock && (
                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 group-hover:text-amber-700 transition-colors">
                            Тільки в наявності
                        </span>
                    </label>
                </div>

                <div className="flex items-end">
                    <button
                        onClick={onResetFiltersAction}
                        className="w-full px-5 py-3.5 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 font-semibold
                                rounded-xl hover:from-gray-100 hover:to-gray-200 focus:outline-none focus:ring-2
                                focus:ring-gray-400/30 focus:ring-offset-1 transition-all duration-200 shadow-xs
                                hover:shadow-sm transform hover:translate-y-[-1px] active:translate-y-0 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Скинути фільтри</span>
                    </button>
                </div>
            </div>
        </div>
    );
}