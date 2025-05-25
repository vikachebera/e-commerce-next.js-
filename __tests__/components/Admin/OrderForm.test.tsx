import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import OrderForm from "@/components/AdminDashboard/OrderForm";
import { OrderStatus, Product } from "@prisma/client";

const mockProducts: Product[] = [
    { id: 1, name: "Product 1", price: 10, description: null, stock: 100, imageUrl: null, categoryId: null },
    { id: 2, name: "Product 2", price: 20, description: null, stock: 50, imageUrl: null, categoryId: null },
];

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve(mockProducts),
        })
    ) as jest.Mock;
});

afterEach(() => {
    jest.restoreAllMocks();
});

describe("OrderForm", () => {
    const defaultProps = {
        order: null,
        onSubmitAction: jest.fn(),
        onCancelAction: jest.fn(),
        onSuccessAction: jest.fn(),
    };

    it("рендерить форму з початковими даними", async () => {
        render(<OrderForm {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByText(/Статус/i)).toBeInTheDocument();
            expect(screen.getByRole("button", { name: /Створити замовлення/i })).toBeInTheDocument();
        });
    });


    it("викликає onCancelAction при натисканні 'Скасувати'", async () => {
        render(<OrderForm {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Скасувати/i })).toBeInTheDocument();
        });

        fireEvent.click(screen.getByRole("button", { name: /Скасувати/i }));

        expect(defaultProps.onCancelAction).toHaveBeenCalled();
    });

    it("завантажує продукти при монтуванні компонента", async () => {
        render(<OrderForm {...defaultProps} />);

        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith("/api/admin/products");
        });
    });
    it("додає новий товар до списку", async () => {
        render(<OrderForm {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByRole("button", { name: /Додати товар/i })).toBeInTheDocument();
        });

        const addButton = screen.getByRole("button", { name: /Додати товар/i });
        fireEvent.click(addButton);

        await waitFor(() => {
            expect(screen.getByText(/Оберіть товар/i)).toBeInTheDocument();
        });
    });

    it("видаляє товар зі списку", async () => {
        const orderWithItems = {
            id: 1,
            total: 10,
            status: OrderStatus.PENDING,
            orderItems: [
                { id: 1, productId: 1, quantity: 1, price: 10 },
            ],
        };

        render(<OrderForm {...defaultProps} order={orderWithItems} />);

        await waitFor(() => {
            const removeButton = screen.getByTitle("Видалити");
            expect(removeButton).toBeInTheDocument();
        });

        const removeButton = screen.getByTitle("Видалити");
        fireEvent.click(removeButton);

        await waitFor(() => {
            expect(screen.queryByDisplayValue("1")).not.toBeInTheDocument();
        });
    });

    it("оновлює кількість товару", async () => {
        const orderWithItems = {
            id: 1,
            total: 10,
            status: OrderStatus.PENDING,
            orderItems: [
                { id: 1, productId: 1, quantity: 1, price: 10 },
            ],
        };

        render(<OrderForm {...defaultProps} order={orderWithItems} />);

        await waitFor(() => {
            const quantityInput = screen.getByDisplayValue("1");
            expect(quantityInput).toBeInTheDocument();
        });

        const quantityInput = screen.getByDisplayValue("1");
        fireEvent.change(quantityInput, { target: { value: "3" } });

        await waitFor(() => {
            expect(screen.getByDisplayValue("3")).toBeInTheDocument();
            expect(screen.getByDisplayValue("30.00")).toBeInTheDocument();
        });
    });
});