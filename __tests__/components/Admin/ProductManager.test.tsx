import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProductsManager from '@/components/AdminDashboard/ProductsManager';
import React from 'react';

type Product = {
    id?: number;
    name: string;
    price: number;
    stock: number;
};

type Props = {
    onSubmit: (product: Product) => void;
    onCancel: () => void;
    product?: Product | null;
    categories: { id: number; name: string }[];
};
jest.mock('@/components/AdminDashboard/ProductForm', () => ({
    __esModule: true,
    default: ({ onSubmit, onCancel}:Props) => (
        <div>
            <p>ProductForm</p>
            <button onClick={() => onSubmit({ id: 1, name: 'Test Product', price: 100, stock: 10 })}>
                Submit
            </button>
            <button onClick={onCancel}>Cancel</button>
        </div>
    )
}));

global.fetch = jest.fn();

const mockProducts = [
    { id: 1, name: 'Product 1', price: 100, stock: 5 },
    { id: 2, name: 'Product 2', price: 200, stock: 10 },
];

const mockCategories = [
    { id: 1, name: 'Category A' },
    { id: 2, name: 'Category B' },
];

describe('ProductsManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('рендерить список продуктів', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
            .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });

        render(<ProductsManager />);

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
            expect(screen.getByText('Product 2')).toBeInTheDocument();
        });

    });

    it('відкриває форму при натисканні "Додати продукт"', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
            .mockResolvedValueOnce({ ok: true, json: async () => mockCategories });

        render(<ProductsManager />);

        fireEvent.click(screen.getByText('Додати продукт'));

        expect(await screen.findByText('ProductForm')).toBeInTheDocument();
    });

    it('виконує submit та оновлює список', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
            .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
            .mockResolvedValueOnce({ ok: true }) // submit
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts });

        render(<ProductsManager />);

        fireEvent.click(screen.getByText('Додати продукт'));
        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });
    });

    it('видаляє продукт після підтвердження', async () => {
        global.confirm = jest.fn(() => true);

        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts })
            .mockResolvedValueOnce({ ok: true, json: async () => mockCategories })
            .mockResolvedValueOnce({ ok: true }) // delete
            .mockResolvedValueOnce({ ok: true, json: async () => mockProducts });

        render(<ProductsManager />);

        await waitFor(() => {
            expect(screen.getByText('Product 1')).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText('Delete')[0]);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/admin/products/1', expect.objectContaining({ method: 'DELETE' }));
        });
    });
});
