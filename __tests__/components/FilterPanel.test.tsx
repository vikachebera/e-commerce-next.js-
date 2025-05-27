import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FiltersPanel from '@/components/Filter/FiltersPanel';
import { FilterOptions, SortOption } from '@/types/filter';

describe('FiltersPanel', () => {
    const mockOnSortChange = jest.fn();
    const mockOnFilterChange = jest.fn();
    const mockOnResetFilters = jest.fn();

    const defaultProps = {
        sortOption: 'price-asc' as SortOption,
        filterOptions: {
            minPrice: undefined,
            maxPrice: undefined,
            inStock: false,
        } as FilterOptions,
        onSortChangeAction: mockOnSortChange,
        onFilterChangeAction: mockOnFilterChange,
        onResetFiltersAction: mockOnResetFilters,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Рендеринг компонента', () => {
        it('відображає всі основні елементи', () => {
            render(<FiltersPanel {...defaultProps} />);

            expect(screen.getByText('Сортування')).toBeInTheDocument();
            expect(screen.getByText('Ціна')).toBeInTheDocument();
            expect(screen.getByText('Тільки в наявності')).toBeInTheDocument();
            expect(screen.getByText('Скинути фільтри')).toBeInTheDocument();
        });

        it('відображає правильне значення сортування', () => {
            render(<FiltersPanel {...defaultProps} />);

            const sortSelect = screen.getByRole('combobox');
            expect(sortSelect).toHaveValue('price-asc');
        });

        it('відображає всі опції сортування', () => {
            render(<FiltersPanel {...defaultProps} />);

            expect(screen.getByText('За ціною (зростання)')).toBeInTheDocument();
            expect(screen.getByText('За ціною (спадання)')).toBeInTheDocument();
            expect(screen.getByText('За назвою (А-Я)')).toBeInTheDocument();
            expect(screen.getByText('За назвою (Я-А)')).toBeInTheDocument();
        });

        it('відображає поля для введення ціни', () => {
            render(<FiltersPanel {...defaultProps} />);

            const minPriceInput = screen.getByPlaceholderText('Від');
            const maxPriceInput = screen.getByPlaceholderText('До');

            expect(minPriceInput).toBeInTheDocument();
            expect(maxPriceInput).toBeInTheDocument();
            expect(minPriceInput).toHaveAttribute('type', 'number');
            expect(maxPriceInput).toHaveAttribute('type', 'number');
        });

        it('відображає чекбокс "в наявності"', () => {
            render(<FiltersPanel {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).not.toBeChecked();
        });
    });

    describe('Відображення значень фільтрів', () => {
        it('відображає встановлені значення цін', () => {
            const propsWithPrices = {
                ...defaultProps,
                filterOptions: {
                    minPrice: 100,
                    maxPrice: 500,
                    inStock: false,
                },
            };

            render(<FiltersPanel {...propsWithPrices} />);

            const minPriceInput = screen.getByPlaceholderText('Від');
            const maxPriceInput = screen.getByPlaceholderText('До');

            expect(minPriceInput).toHaveValue(100);
            expect(maxPriceInput).toHaveValue(500);
        });

        it('відображає відмічений чекбокс коли inStock = true', () => {
            const propsWithStock = {
                ...defaultProps,
                filterOptions: {
                    ...defaultProps.filterOptions,
                    inStock: true,
                },
            };

            render(<FiltersPanel {...propsWithStock} />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeChecked();
        });

        it('відображає різні опції сортування', () => {
            const propsWithSort = {
                ...defaultProps,
                sortOption: 'name-desc' as SortOption,
            };

            render(<FiltersPanel {...propsWithSort} />);

            const sortSelect = screen.getByRole('combobox');
            expect(sortSelect).toHaveValue('name-desc');
        });
    });

    describe('Взаємодія користувача', () => {
        it('викликає onSortChangeAction при зміні сортування', () => {
            render(<FiltersPanel {...defaultProps} />);

            const sortSelect = screen.getByRole('combobox');
            fireEvent.change(sortSelect, {target: {value: 'price-desc'}});

            expect(mockOnSortChange).toHaveBeenCalledWith('price-desc');
            expect(mockOnSortChange).toHaveBeenCalledTimes(1);
        });

        it('викликає onFilterChangeAction при зміні мінімальної ціни', () => {
            render(<FiltersPanel {...defaultProps} />);

            const minPriceInput = screen.getByPlaceholderText('Від');
            fireEvent.change(minPriceInput, {target: {name: 'minPrice', value: '150'}});

            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                minPrice: 150,
            });
        });

        it('викликає onFilterChangeAction при зміні максимальної ціни', () => {
            render(<FiltersPanel {...defaultProps} />);

            const maxPriceInput = screen.getByPlaceholderText('До');
            fireEvent.change(maxPriceInput, {target: {name: 'maxPrice', value: '300'}});

            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                maxPrice: 300,
            });
        });

        it('викликає onFilterChangeAction при зміні чекбокса', () => {
            render(<FiltersPanel {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox');
            fireEvent.click(checkbox);

            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                inStock: true,
            });
        });

        it('викликає onResetFiltersAction при натисканні кнопки скидання', () => {
            render(<FiltersPanel {...defaultProps} />);

            const resetButton = screen.getByText('Скинути фільтри');
            fireEvent.click(resetButton);

            expect(mockOnResetFilters).toHaveBeenCalledTimes(1);
        });
    });

})