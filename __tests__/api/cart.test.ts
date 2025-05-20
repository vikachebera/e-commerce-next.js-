import {POST} from "@/app/api/cart/add/route";
import { getServerSession } from 'next-auth'
import prisma from '@lib/prisma'
import { NextRequest } from 'next/server'
jest.mock('@lib/prisma', () => ({
    cartItem: {
        findFirst: jest.fn(),
        update: jest.fn(),
        create: jest.fn(),
    },
}));

jest.mock('next-auth', () => ({
    getServerSession: jest.fn(),
}));

const mockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/cart', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};describe('POST /api/cart', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('повинен повертати 401, якщо користувач не авторизований', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce(null);

        const req = mockRequest({ productId: 1 });
        const response = await POST(req);

        expect(response.status).toBe(401);
        expect(await response.json()).toEqual({ error: 'Неавторизовано' });
    });

    it('повинен повертати 400, якщо productId відсутній', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: '1' } });

        const req = mockRequest({});
        const response = await POST(req);

        expect(response.status).toBe(400);
        expect(await response.json()).toEqual({ error: 'productId обов’язковий' });
    });

    it('повинен створити новий запис, якщо товару немає в кошику', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: '1' } });
        (prisma.cartItem.findFirst as jest.Mock).mockResolvedValueOnce(null);
        (prisma.cartItem.create as jest.Mock).mockResolvedValueOnce({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 1,
        });

        const req = mockRequest({ productId: 1 });
        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 1,
        });
        expect(prisma.cartItem.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                productId: 1,
                quantity: 1,
            },
        });
    });

    it('повинен оновити кількість, якщо товар вже є в кошику', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: '1' } });
        (prisma.cartItem.findFirst as jest.Mock).mockResolvedValueOnce({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 2,
        });
        (prisma.cartItem.update as jest.Mock).mockResolvedValueOnce({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 3,
        });

        const req = mockRequest({ productId: 1, quantity: 1 });
        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 3,
        });
        expect(prisma.cartItem.update).toHaveBeenCalledWith({
            where: { id: 1 },
            data: { quantity: 3 },
        });
    });

    it('повинен використовувати вказану кількість при створенні нового запису', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: '1' } });
        (prisma.cartItem.findFirst as jest.Mock).mockResolvedValueOnce(null);
        (prisma.cartItem.create as jest.Mock).mockResolvedValueOnce({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 5,
        });

        const req = mockRequest({ productId: 1, quantity: 5 });
        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(await response.json()).toEqual({
            id: 1,
            userId: 1,
            productId: 1,
            quantity: 5,
        });
        expect(prisma.cartItem.create).toHaveBeenCalledWith({
            data: {
                userId: 1,
                productId: 1,
                quantity: 5,
            },
        });
    });

    it('повинен повертати 500 при помилці сервера', async () => {
        (getServerSession as jest.Mock).mockResolvedValueOnce({ user: { id: '1' } });
        (prisma.cartItem.findFirst as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

        const req = mockRequest({ productId: 1 });
        const response = await POST(req);

        expect(response.status).toBe(500);
        expect(await response.json()).toEqual({ error: 'Internal Server Error' });
    });
});