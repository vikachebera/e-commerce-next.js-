import { render, screen, fireEvent } from '@testing-library/react';
import ProductForm, { Product } from '@/components/AdminDashboard/ProductForm';

const categories = [
    { id: 1, name: 'Категорія 1' },
    { id: 2, name: 'Категорія 2' },
];

describe('ProductForm', () => {
    const defaultProduct: Product = {
        id: 5,
        name: 'Тестовий продукт',
        description: 'Опис продукту',
        price: 123.45,
        stock: 10,
        imageUrl: 'http://example.com/image.jpg',
        categoryId: 1,
    };

    const setup = (props = {}) => {
        const onSubmit = jest.fn();
        const onCancel = jest.fn();
        const onSuccess = jest.fn();

        render(
            <ProductForm
                product={undefined}
                categories={categories}
                onSubmit={onSubmit}
                onCancel={onCancel}
                onSuccess={onSuccess}
                {...props}
            />
        );

        return { onSubmit, onCancel, onSuccess };
    };

    it('рендерить форму створення продукту', () => {
        setup();
        expect(screen.getByLabelText(/Назва/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Опис/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Ціна/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Кількість/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/URL зображення/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Категорія/i)).toBeInTheDocument();
    });

    it('викликає onSubmit та onSuccess при сабміті', () => {
        const { onSubmit, onSuccess } = setup();

        fireEvent.change(screen.getByLabelText(/Назва/i), { target: { value: 'Продукт X' } });
        fireEvent.change(screen.getByLabelText(/Ціна/i), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText(/Кількість/i), { target: { value: '20' } });

        fireEvent.click(screen.getByRole('button', { name: /Створити/i }));

        expect(onSubmit).toHaveBeenCalledWith(
            expect.objectContaining({
                name: 'Продукт X',
                price: 99.99,
                stock: 20,
            })
        );
        expect(onSuccess).toHaveBeenCalled();
    });

    it('відображає значення полів для редагування продукту', () => {
        setup({ product: defaultProduct });

        expect(screen.getByDisplayValue('Тестовий продукт')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Опис продукту')).toBeInTheDocument();
        expect(screen.getByDisplayValue('123.45')).toBeInTheDocument();
        expect(screen.getByDisplayValue('10')).toBeInTheDocument();
        expect(screen.getByDisplayValue('http://example.com/image.jpg')).toBeInTheDocument();
    });

    it('викликає onCancel при натисканні "Скасувати"', () => {
        const { onCancel } = setup();

        fireEvent.click(screen.getByRole('button', { name: /Скасувати/i }));
        expect(onCancel).toHaveBeenCalled();
    });
});
