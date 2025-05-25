import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import OrderManager from '@/components/AdminDashboard/OrderManager';
import React from 'react';
import {OrderFormProps} from "@/components/AdminDashboard/OrderForm";

jest.mock('@/components/AdminDashboard/OrderForm', () => ({
    __esModule: true,
    default: ({ onSubmitAction, onCancelAction }:OrderFormProps) => (
        <div>
            <p>OrderForm</p>
            <button onClick={() => onSubmitAction({
                total: 123.45,
                status: 'PENDING',
                orderItems: [{ productId: 1, quantity: 2, price: 50 }],
            })}>Submit</button>
            <button onClick={onCancelAction}>Cancel</button>
        </div>
    ),
}));

global.fetch = jest.fn();

const mockOrders = [
    { id: 1, total: 100.0, status: 'PENDING' },
    { id: 2, total: 250.5, status: 'COMPLETED' },
];

const mockOrderItems = [
    { id: 1, productId: 1, quantity: 2, price: 50 },
];

describe('OrderManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('рендерить список замовлень', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders });

        render(<OrderManager />);

        await waitFor(() => {
            expect(screen.getByText('PENDING')).toBeInTheDocument();
            expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        });
    });

    it('відкриває OrderForm при натисканні "Редагувати"', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders })
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrderItems });

        render(<OrderManager />);

        await waitFor(() => screen.getByText('PENDING'));

        fireEvent.click(screen.getAllByText('Редагувати')[0]);

        await waitFor(() => {
            expect(screen.getByText('OrderForm')).toBeInTheDocument();
        });
    });

    it('викликає fetch з DELETE при натисканні "Видалити"', async () => {
        global.confirm = jest.fn(() => true);

        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders })
            .mockResolvedValueOnce({ ok: true })
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders });

        render(<OrderManager />);

        await waitFor(() => screen.getByText('PENDING'));

        fireEvent.click(screen.getAllByText('Видалити')[0]);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/admin/orders/1', expect.objectContaining({ method: 'DELETE' }));
        });
    });

    it('виконує submit з OrderForm', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders })
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrderItems })
            .mockResolvedValueOnce({ ok: true })
            .mockResolvedValueOnce({ ok: true, json: async () => mockOrders });

        render(<OrderManager />);

        await waitFor(() => screen.getByText('PENDING'));

        fireEvent.click(screen.getAllByText('Редагувати')[0]);

        await waitFor(() => screen.getByText('OrderForm'));

        fireEvent.click(screen.getByText('Submit'));

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith(
                '/api/admin/orders/1',
                expect.objectContaining({
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                })
            );
        });
    });
});
