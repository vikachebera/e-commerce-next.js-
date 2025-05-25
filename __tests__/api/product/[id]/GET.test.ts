import { GET } from "@/app/api/product/[id]/route";
import prisma from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
    product: {
        findUnique: jest.fn(),
    },
}));

describe("GET /api/product/[id]", () => {
    const createRequest = (url: string): Request => new Request(url, { method: "GET" });

    it("повертає продукт за правильним ID", async () => {
        const mockProduct = {
            id: 1,
            name: "Test Product",
            price: 123.45,
            description: "Example",
            stock: 10,
            categoryId: 2,
        };

        (prisma.product.findUnique as jest.Mock).mockResolvedValue(mockProduct);

        const req = createRequest("http://localhost/api/product/1");

        const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
        const json = await res.json();

        expect(res.status).toBe(200);
        expect(json).toEqual(mockProduct);
        expect(prisma.product.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it("повертає 404, якщо продукт не знайдено", async () => {
        (prisma.product.findUnique as jest.Mock).mockResolvedValue(null);

        const req = createRequest("http://localhost/api/product/999");
        const res = await GET(req, { params: Promise.resolve({ id: "999" }) });
        const json = await res.json();

        expect(res.status).toBe(404);
        expect(json).toEqual({ error: "Product not found" });
    });

    it("повертає 400, якщо ID некоректний", async () => {
        const req = createRequest("http://localhost/api/product/abc");
        const res = await GET(req, { params: Promise.resolve({ id: "abc" }) });
        const json = await res.json();

        expect(res.status).toBe(400);
        expect(json).toEqual({ error: "Invalid product ID" });
    });

    it("повертає 500 при внутрішній помилці", async () => {
        (prisma.product.findUnique as jest.Mock).mockRejectedValue(new Error("DB Error"));

        const req = createRequest("http://localhost/api/product/1");
        const res = await GET(req, { params: Promise.resolve({ id: "1" }) });
        const json = await res.json();

        expect(res.status).toBe(500);
        expect(json).toEqual({ error: "Internal server error" });
    });
});
