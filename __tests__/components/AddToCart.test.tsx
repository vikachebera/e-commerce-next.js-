import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToCart from '@/components/Buttons/AddToCart';

global.fetch = jest.fn();
global.alert = jest.fn();

describe('AddToCart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('рендерить кнопку', () => {
        render(<AddToCart productId={1} />);
        const button = screen.getByText('Додати до кошика');
        expect(button).toBeInTheDocument();
    });

    it('відправляє POST-запит при кліку', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: true });

        render(<AddToCart productId={42} />);
        const button = screen.getByText('Додати до кошика');

        fireEvent.click(button);

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith('/api/cart/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId: 42, quantity: 1 }),
            });
        });

        expect(global.alert).toHaveBeenCalledWith('Товар додано до кошика');
    });

    it('показує alert про помилку при невдалому запиті', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

        render(<AddToCart productId={99} />);
        const button = screen.getByText('Додати до кошика');

        fireEvent.click(button);

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('`Помилка при додаванні до кошика`');
        });
    });
});
