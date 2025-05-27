import { render, screen } from '@testing-library/react';
import OrderList from '@/components/Profile/OrderList';

const mockOrders = [
    {
        id: 1,
        createdAt: '2024-01-15T10:30:00Z',
        status: 'completed',
        orderItems: [
            {
                id: 1,
                product: {
                    id: 1,
                    name: 'Тестовий товар 1',
                    price: 100,
                    imageUrl: '/test-image.jpg'
                },
                quantity: 2,
                price: 100
            }
        ]
    }
];

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockOrders),
        })
    ) as jest.Mock;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe('OrderList', () => {
    test('1. Відображає заголовок "Історія замовлень"', async () => {
        render(<OrderList />);
        expect(await screen.findByText('Історія замовлень')).toBeInTheDocument();
    });


    test('2. Відображає список замовлень після завантаження', async () => {
        render(<OrderList />);
        expect(await screen.findByText('Замовлення #1')).toBeInTheDocument();
        expect(screen.getByText('Тестовий товар 1')).toBeInTheDocument();
    });

    test('3. Відображає статус замовлення з правильними стилями', async () => {
        render(<OrderList />);
        const statusBadge = await screen.findByText('Виконано');
        expect(statusBadge).toHaveClass('bg-green-100');
        expect(statusBadge).toHaveClass('text-green-800');
    });

    test('4. Відображає повідомлення про відсутність замовлень при пустому масиві', async () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () => Promise.resolve([]),
            })
        ) as jest.Mock;

        render(<OrderList />);
        expect(await screen.findByText('Немає замовлень')).toBeInTheDocument();
        expect(screen.getByText(/Перейти до каталогу/)).toBeInTheDocument();
    });
});