import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CartPage from '@/app/(main)/cart/page';
import prisma from '@lib/prisma';
import { getServerSession } from 'next-auth';

jest.mock('@lib/prisma', () => ({
    cartItem: {
        findMany: jest.fn(),
    },
}));

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

jest.mock('@/components/Cart/CartClient', () => ({
    __esModule: true,
    default: jest.fn(() => <div>CartClient Component</div>),
}));

describe('CartPage', () => {
    const mockSession = {
        user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
        },
    };

    const mockCartItems = [
        {
            id: 1,
            quantity: 2,
            userId: 1,
            productId: 1,
            product: {
                id: 1,
                name: 'Test Product',
                price: 100,
                description: 'Test Description',
            },
            user: {
                id: 1,
                name: 'Test User',
            },
        },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('повинен показати повідомлення про необхідність авторизації, якщо користувач не увійшов', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce(null);

        render(await CartPage());

        expect(
            screen.getByText('Будь ласка, увійдіть для перегляду кошика')
        ).toBeInTheDocument();
        expect(prisma.cartItem.findMany).not.toHaveBeenCalled();
    });

    it('повинен завантажити кошик для авторизованого користувача', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.cartItem.findMany as jest.Mock).mockResolvedValueOnce(mockCartItems);

        render(await CartPage());

        await waitFor(() => {
            expect(prisma.cartItem.findMany).toHaveBeenCalledWith({
                where: { userId: Number(mockSession.user.id) },
                include: { product: true, user: true },
            });
        });

        expect(screen.getByText('CartClient Component')).toBeInTheDocument();
    });

    it('повинен фільтрувати елементи з null продуктами', async () => {
        const cartWithNullProduct = [
            ...mockCartItems,
            {
                id: 2,
                quantity: 1,
                userId: 1,
                productId: 2,
                product: null,
                user: {
                    id: 1,
                    name: 'Test User',
                },
            },
        ];

        (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.cartItem.findMany as jest.Mock).mockResolvedValueOnce(
            cartWithNullProduct
        );

        render(await CartPage());

        await waitFor(() => {
            expect(prisma.cartItem.findMany).toHaveBeenCalled();
        });

        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const mockCall = (require('@/components/Cart/CartClient').default as jest.Mock).mock.calls[0];
        expect(mockCall[0]).toEqual({
            initialCart: mockCartItems,
        });
    });

    it('повинен обробляти помилки при завантаженні кошика', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce(mockSession);
        (prisma.cartItem.findMany as jest.Mock).mockRejectedValueOnce(
            new Error('Database error')
        );
    })
})
