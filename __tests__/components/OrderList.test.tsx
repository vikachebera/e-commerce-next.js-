import { render, screen, waitFor } from '@testing-library/react';
import OrderList from "@/components/Profile/OrderList";
import React from 'react';

global.fetch = jest.fn();

const mockOrders = [
    {
        id: 1,
        createdAt: '2024-05-01T12:00:00Z',
        orderItems: [
            {
                id: 10,
                product: { id: 101, name: 'Товар A', price: 100 },
                quantity: 2,
                price: 200,
            },
            {
                id: 11,
                product: { id: 102, name: 'Товар B', price: 150 },
                quantity: 1,
                price: 150,
            },
        ],
    },
];

describe('OrderList', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });



    it('відображає повідомлення, якщо замовлень немає', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => [],
        });

        render(<OrderList />);

        await waitFor(() => {
            expect(screen.getByText('У вас ще немає замовлень.')).toBeInTheDocument();
        });
    });

    it('обробляє помилку запиту', async () => {
        const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

        (fetch as jest.Mock).mockRejectedValueOnce(new Error('Fetch failed'));

        render(<OrderList />);

        await waitFor(() => {
            expect(errorSpy).toHaveBeenCalledWith('Error fetching orders:', expect.any(Error));
        });

        errorSpy.mockRestore();
    });
});
