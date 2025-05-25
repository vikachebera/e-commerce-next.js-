import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddToCart from '@/components/Buttons/AddToCart';


jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
    }),
}));
global.fetch = jest.fn();
global.alert = jest.fn();

describe('AddToCart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (global.fetch as jest.Mock).mockClear();
    });

    it('рендерить кнопку', () => {
        render(<AddToCart productId={1} />);
        expect(screen.getByText('Додати до кошика')).toBeInTheDocument();
    });

    it('відправляє POST-запит при кліку', async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => ({ user: { id: '1', email: 'test@example.com' } }),
            })
            .mockResolvedValueOnce({ ok: true });

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
    });

    it('показує стан завантаження під час відправки', async () => {
        (fetch as jest.Mock).mockImplementationOnce(() =>
            new Promise(resolve => setTimeout(() => resolve({ ok: true }), 100))
        );

        render(<AddToCart productId={42} />);
        fireEvent.click(screen.getByText('Додати до кошика'));

        expect(await screen.findByText('Додаємо...')).toBeInTheDocument();
    });



    it('показує помилку при невдалому запиті', async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

        render(<AddToCart productId={99} />);
        fireEvent.click(screen.getByText('Додати до кошика'));

        await waitFor(() => {
            expect(global.alert).toHaveBeenCalledWith('Помилка при додаванні до кошика');
        });
    });



    it('не дозволяє клік при disabled', () => {
        render(<AddToCart productId={1} disabled={true} />);
        const button = screen.getByText('Немає в наявності');

        fireEvent.click(button);

        expect(fetch).not.toHaveBeenCalled();
    });
});