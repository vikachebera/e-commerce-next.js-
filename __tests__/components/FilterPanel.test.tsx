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
            expect(screen.getByText('Діапазон цін')).toBeInTheDocument();
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



        it('відображає чекбокс "в наявності"', () => {
            render(<FiltersPanel {...defaultProps} />);

            const checkbox = screen.getByRole('checkbox');
            expect(checkbox).toBeInTheDocument();
            expect(checkbox).not.toBeChecked();
        });
    });

    describe('Відображення значень фільтрів', () => {
        it('змінює значення сортування', () => {
            render(<FiltersPanel {...defaultProps} />);
            fireEvent.change(screen.getByRole('combobox'), { target: { value: 'price-desc' } });
            expect(mockOnSortChange).toHaveBeenCalledWith('price-desc');
        });

        it('змінює мінімальну ціну', () => {
            render(<FiltersPanel {...defaultProps} />);
            fireEvent.change(screen.getByPlaceholderText('Мін'), {
                target: { name: 'minPrice', value: '200' },
            });
            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                minPrice: 200,
            });
        });

        it('змінює максимальну ціну', () => {
            render(<FiltersPanel {...defaultProps} />);
            fireEvent.change(screen.getByPlaceholderText('Макс'), {
                target: { name: 'maxPrice', value: '1000' },
            });
            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                maxPrice: 1000,
            });
        });

        it('змінює стан чекбоксу "в наявності"', () => {
            render(<FiltersPanel {...defaultProps} />);
            fireEvent.click(screen.getByRole('checkbox'));
            expect(mockOnFilterChange).toHaveBeenCalledWith({
                ...defaultProps.filterOptions,
                inStock: true,
            });
        });

        it('викликає функцію скидання фільтрів', () => {
            render(<FiltersPanel {...defaultProps} />);
            fireEvent.click(screen.getByRole('button', { name: /Скинути фільтри/i }));
            expect(mockOnResetFilters).toHaveBeenCalledTimes(1);
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