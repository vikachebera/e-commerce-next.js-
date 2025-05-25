import { render, screen, fireEvent } from '@testing-library/react';
import SidebarItem from "@/components/AdminDashboard/Sidebar/SidebarItem";
import { FiHome } from 'react-icons/fi';

describe('SidebarItem', () => {
    it('рендерить іконку та заголовок', () => {
        render(<SidebarItem icon={<FiHome data-testid="icon" />} title="Головна" />);

        expect(screen.getByText('Головна')).toBeInTheDocument();
        expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('підсвічується при isActive=true', () => {
        render(<SidebarItem icon={<FiHome />} title="Головна" isActive />);

        const button = screen.getByRole('button', { name: /Головна/i });
        expect(button).toHaveClass('bg-blue-50');
        expect(button).toHaveClass('text-blue-600');
    });

    it('не має активного стилю при isActive=false', () => {
        render(<SidebarItem icon={<FiHome />} title="Головна" />);

        const button = screen.getByRole('button', { name: /Головна/i });
        expect(button).not.toHaveClass('bg-blue-50');
        expect(button).toHaveClass('hover:bg-gray-100');
    });

    it('викликає onClick при натисканні', () => {
        const handleClick = jest.fn();
        render(<SidebarItem icon={<FiHome />} title="Головна" onClick={handleClick} />);

        fireEvent.click(screen.getByRole('button', { name: /Головна/i }));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('додає додатковий className', () => {
        render(
            <SidebarItem
                icon={<FiHome />}
                title="Головна"
                className="custom-class"
            />
        );

        const button = screen.getByRole('button', { name: /Головна/i });
        expect(button).toHaveClass('custom-class');
    });
});
