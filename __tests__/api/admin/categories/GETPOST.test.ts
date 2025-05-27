import { GET, POST } from '@/app/api/admin/categories/route';
import prisma from '@lib/prisma';
import type { NextRequest } from 'next/server';

jest.mock('@lib/prisma', () => ({
    category: {
        findMany: jest.fn(),
        create: jest.fn(),
    },
}));

describe('/api/categories API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET', () => {
        it('повертає список категорій', async () => {
            const mockCategories = [
                { id: 1, name: 'Гаджети' },
                { id: 2, name: 'Ноутбуки' },
            ];
            (prisma.category.findMany as jest.Mock).mockResolvedValue(mockCategories);

            const req: Partial<NextRequest> = {};

            const res = await GET(req as NextRequest);

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual(mockCategories);
        });

        it('повертає 500 у випадку помилки', async () => {
            (prisma.category.findMany as jest.Mock).mockRejectedValue(new Error('DB error'));

            const req: Partial<NextRequest> = {};

            const res = await GET(req as NextRequest);

            expect(res.status).toBe(500);
            const data = await res.json();
            expect(data.error).toBe('Internal Server Error');
        });
    });

    describe('POST', () => {
        it('створює нову категорію', async () => {
            const mockCategory = { id: 3, name: 'Телефони' };
            (prisma.category.create as jest.Mock).mockResolvedValue(mockCategory);

            const body = { name: 'Телефони' };

            const req: Partial<NextRequest> = {
                json: async () => body,
            };

            const res = await POST(req as NextRequest);

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual(mockCategory);
        });

        it('повертає 400, якщо name не передано', async () => {
            const req: Partial<NextRequest> = {
                json: async () => ({}),
            };

            const res = await POST(req as NextRequest);

            expect(res.status).toBe(400);
            const data = await res.json();
            expect(data.error).toBe('Missing required fields');
        });

        it('повертає 500, якщо сталася помилка', async () => {
            (prisma.category.create as jest.Mock).mockRejectedValue(new Error('DB error'));

            const req: Partial<NextRequest> = {
                json: async () => ({ name: 'Телевізори' }),
            };

            const res = await POST(req as NextRequest);

            expect(res.status).toBe(500);
            const data = await res.json();
            expect(data.error).toBe('Internal Server Error');
        });
    });
});
