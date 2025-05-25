import { render, screen, fireEvent } from "@testing-library/react";
import CategoryForm, { Category } from "@/components/AdminDashboard/CategoryForm"

describe("CategoryForm", () => {
    const onSubmit = jest.fn();
    const onCancel = jest.fn();
    const onSuccess = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("рендерить форму з пустим полем, якщо category не передано", () => {
        render(<CategoryForm onSubmit={onSubmit} onCancel={onCancel} onSuccess={onSuccess} />);

        expect(screen.getByLabelText(/назва категорії/i)).toHaveValue("");
        expect(screen.getByRole("button", { name: /створити/i })).toBeInTheDocument();
    });

    it("рендерить форму з переданими даними category", () => {
        const category: Category = { id: 1, name: "Категорія 1" };

        render(<CategoryForm category={category} onSubmit={onSubmit} onCancel={onCancel} onSuccess={onSuccess} />);

        expect(screen.getByLabelText(/назва категорії/i)).toHaveValue("Категорія 1");
        expect(screen.getByRole("button", { name: /оновити/i })).toBeInTheDocument();
    });

    it("змінює значення поля при введенні тексту", () => {
        render(<CategoryForm onSubmit={onSubmit} onCancel={onCancel} onSuccess={onSuccess} />);

        const input = screen.getByLabelText(/назва категорії/i);
        fireEvent.change(input, { target: { value: "Нова категорія" } });

        expect(input).toHaveValue("Нова категорія");
    });

    it("викликає onSubmit та onSuccess при сабміті форми", () => {
        render(<CategoryForm onSubmit={onSubmit} onCancel={onCancel} onSuccess={onSuccess} />);

        const input = screen.getByLabelText(/назва категорії/i);
        fireEvent.change(input, { target: { value: "Нова категорія" } });

        fireEvent.click(screen.getByRole("button", { name: /створити/i }));

        expect(onSubmit).toHaveBeenCalledWith({ id: undefined, name: "Нова категорія" });
        expect(onSuccess).toHaveBeenCalled();
    });

    it("викликає onCancel при натисканні кнопки скасувати", () => {
        render(<CategoryForm onSubmit={onSubmit} onCancel={onCancel} onSuccess={onSuccess} />);

        fireEvent.click(screen.getByRole("button", { name: /скасувати/i }));

        expect(onCancel).toHaveBeenCalled();
    });
});
