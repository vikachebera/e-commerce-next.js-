import { render, screen } from '@testing-library/react';
import Sidebar from "@/components/AdminDashboard/Sidebar/Sidebar";
import {usePathname} from "next/navigation";

jest.mock("next/navigation", () => ({
    usePathname: jest.fn(),
}))


describe("Sidebar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    })

    it('рендерить заголовок ', () => {
        (usePathname as jest.Mock).mockReturnValue('/admin');
        render(<Sidebar/>);
        expect(screen.getByText('Адмін панель')).toBeInTheDocument();
    });
    it('рендерить всі пункти навігації', () => {
        (usePathname as jest.Mock).mockReturnValue('/admin');

        render(<Sidebar />);

        expect(screen.getByText('Продукти')).toBeInTheDocument();
        expect(screen.getByText('Категорії')).toBeInTheDocument();
        expect(screen.getByText('Замовлення')).toBeInTheDocument();
    });
    it('підсвічує активний пункт', () => {
        (usePathname as jest.Mock).mockReturnValue('/admin/products');

        render(<Sidebar />);

        const activeLink = screen.getByText('Продукти');
        expect(activeLink).toHaveClass('bg-blue-100', 'font-semibold');
    });

    it('не підсвічує неактивні пункти', () => {
        (usePathname as jest.Mock).mockReturnValue('/admin/orders');

        render(<Sidebar />);

        const inactiveLink = screen.getByText('Категорії');
        expect(inactiveLink).not.toHaveClass('bg-blue-100');
        expect(inactiveLink).not.toHaveClass('font-semibold');
    });
})