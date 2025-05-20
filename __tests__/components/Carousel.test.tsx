import { render, screen } from '@testing-library/react';
import Carousel from "@/components/Carousel/Carousel";

jest.mock('swiper/react', () => {
    return {
        Swiper: ({ children }: any) => <div data-testid="mock-swiper">{children}</div>,
        SwiperSlide: ({ children }: any) => <div data-testid="mock-swiper-slide">{children}</div>,
    };
});

describe('Carousel', () => {
    it('renders without crashing', () => {
        render(<Carousel />);
        const slides = screen.getAllByRole('img');
        expect(slides.length).toBe(4);
    });

    it('renders correct image sources', () => {
        render(<Carousel />);
        expect(screen.getByAltText('Slide 1')).toHaveAttribute('src', '/assets/1.jpg');
        expect(screen.getByAltText('Slide 2')).toHaveAttribute('src', '/assets/2.jpg');
        expect(screen.getByAltText('Slide 3')).toHaveAttribute('src', '/assets/3.jpg');
        expect(screen.getByAltText('Slide 4')).toHaveAttribute('src', '/assets/4.jpg');
    });
});
