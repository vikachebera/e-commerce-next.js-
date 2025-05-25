import { render, screen } from '@testing-library/react';
import LoadingSpinner from "@/components/Loader/LoadingSpinner";

describe('LoadingSpinner', () => {
    it('відображає текст "Завантаження..."', () => {
        render(<LoadingSpinner />);
        expect(screen.getByText('Завантаження...')).toBeInTheDocument();
    });

    it('містить анімований елемент-спінер', () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.animate-spin');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('rounded-full', 'h-8', 'w-8', 'border-b-2', 'border-gray-900');
    });

    it('має коректну структуру DOM', () => {
        const { container } = render(<LoadingSpinner />);
        const spinner = container.querySelector('.rounded-full');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveClass('h-8', 'w-8', 'border-b-2', 'border-gray-900');
    });
});
