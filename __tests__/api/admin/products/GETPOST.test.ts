import { GET, POST } from '@/app/api/admin/products/route';
import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

jest.mock('@/lib/prisma', () => ({
    product: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
}));

describe('API /api/products', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('повертає список продуктів', async () => {
            const mockProducts = [
                { id: 1, name: 'Product 1', price: 100 },
                { id: 2, name: 'Product 2', price: 200 },
            ];
            (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockProducts);
            expect(prisma.product.findMany).toHaveBeenCalledTimes(1);
        });

        it('повертає 500, якщо сталася помилка', async () => {
            (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

            const response = await GET();
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal Server Error');
        });
    });

    describe('POST', () => {
        const createRequest = (body: any) =>
            new NextRequest('http://localhost', {
                method: 'POST',
                body: JSON.stringify(body),
                headers: { 'Content-Type': 'application/json' },
            });

        it('створює продукт з валідними даними', async () => {
            const newProduct = {
                name: 'Test Product',
                description: 'Test description',
                price: 99.99,
                stock: 10,
                imageUrl: 'https://example.com/image.jpg',
                categoryId: 1,
            };

            const mockCreated = { id: 123, ...newProduct };

            (prisma.product.create as jest.Mock).mockResolvedValue(mockCreated);

            const request = createRequest(newProduct);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(201);
            expect(data).toEqual(mockCreated);
            expect(prisma.product.create).toHaveBeenCalledWith({
                data: {
                    ...newProduct,
                    price: expect.any(Number),
                    stock: expect.any(Number),
                },
            });
        });

        it('повертає 400, якщо бракує обовʼязкових полів', async () => {
            const invalidProduct = {
                name: '',
                price: 100,
                stock: 5,
            };

            const request = createRequest(invalidProduct);
            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('Missing required fields');
        });

        it('повертає 500 при помилці створення', async () => {
            (prisma.product.create as jest.Mock).mockRejectedValue(new Error('Create error'));

            const request = createRequest({
                name: 'Product',
                description: 'desc',
                price: 100,
                stock: 5,
            });

            const response = await POST(request);
            const data = await response.json();

            expect(response.status).toBe(500);
            expect(data.error).toBe('Internal Server Error');
        });
    });
});
