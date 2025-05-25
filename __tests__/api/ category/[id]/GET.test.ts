import { GET } from "@/app/api/categories/[id]/products/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
    product: {
        findMany: jest.fn(),
    },
}));

describe("GET /api/category/[id]", () => {
    const mockProducts = [
        { id: 1, name: "Test Product", price: 100, stock: 10, categoryId: 1 },
    ];

    const createRequest = (url: string): Request =>
        new Request(url, { method: "GET" });

    it("повертає відсортовані та відфільтровані товари", async () => {
        (prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts);

        const req = createRequest("http://localhost/api/categories/1?minPrice=50&maxPrice=200&inStock=true&sort=price-asc");

        const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
        const data = await res.json();

        expect(prisma.product.findMany).toHaveBeenCalledWith({
            where: {
                categoryId: 1,
                price: { gte: 50, lte: 200 },
                stock: { gt: 0 },
            },
            orderBy: { price: "asc" },
        });

        expect(res.status).toBe(200);
        expect(data).toEqual(mockProducts);
    });

    it("обробляє помилки", async () => {
        (prisma.product.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

        const req = createRequest("http://localhost/api/categories/1");
        const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
        const data = await res.json();

        expect(res.status).toBe(500);
        expect(data).toEqual({ error: "Internal server error" });
    });
});
