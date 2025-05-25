import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CategoryManager from "@/components/AdminDashboard/CategoryManager";

(global as any).fetch = jest.fn(() =>
    Promise.resolve({
        json: () => Promise.resolve(mockCategories),
    })
);

const mockCategories = [
    { id: 1, name: "Категорія 1" },
    { id: 2, name: "Категорія 2" },
];
(fetch as jest.Mock).mockResolvedValue({
    json: async () => mockCategories,
});
describe("CategoryManager", () => {
    beforeEach(() => {
        (fetch as jest.Mock).mockClear();
    });

    it("завантажує та відображає список категорій", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => mockCategories,
        });

        render(<CategoryManager />);

        await waitFor(() => {
            expect(screen.getByText("Категорія 1")).toBeInTheDocument();
            expect(screen.getByText("Категорія 2")).toBeInTheDocument();
        });
    });

    it("відкриває форму при натисканні на кнопку 'Створити категорію'", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => [],
        });

        render(<CategoryManager />);

        fireEvent.click(screen.getByText(/Створити категорію/i));

        expect(screen.getByLabelText(/назва категорії/i)).toBeInTheDocument();
    });

    it("редагує категорію при натисканні на кнопку 'Редагувати'", async () => {
        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => mockCategories,
            })
            .mockResolvedValueOnce({
                json: async () => mockCategories,
            });

        render(<CategoryManager />);

        await waitFor(() => {
            expect(screen.getByText("Категорія 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText(/редагувати/i)[0]);

        expect(screen.getByLabelText(/назва категорії/i)).toHaveValue("Категорія 1");
    });

    it("видаляє категорію після підтвердження", async () => {
        window.confirm = jest.fn(() => true);

        (fetch as jest.Mock)
            .mockResolvedValueOnce({
                json: async () => mockCategories,
            })
            .mockResolvedValueOnce({
                json: async () => mockCategories.filter((c) => c.id !== 1),
            })
            .mockResolvedValueOnce({
                json: async () => [],
            });


        render(<CategoryManager />);

        await waitFor(() => {
            expect(screen.getByText("Категорія 1")).toBeInTheDocument();
        });

        fireEvent.click(screen.getAllByText(/видалити/i)[0]);

        expect(window.confirm).toHaveBeenCalledWith(
            expect.stringContaining("Категорія 1")
        );

        await waitFor(() => {
            expect(screen.queryByText("Категорія 1")).not.toBeInTheDocument();
        });
    });

    it("закриває форму при натисканні на 'Скасувати'", async () => {
        (fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => [],
        });

        render(<CategoryManager />);

        fireEvent.click(screen.getByText(/створити категорію/i));

        expect(screen.getByLabelText(/назва категорії/i)).toBeInTheDocument();

        fireEvent.click(screen.getByText(/скасувати/i));

        expect(screen.queryByLabelText(/назва категорії/i)).not.toBeInTheDocument();
    });
});
