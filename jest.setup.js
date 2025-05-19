import '@testing-library/jest-dom'

jest.mock('swiper/react', () => ({
    Swiper: ({ children }) => <div data-testid="swiper">{children}</div>,
    SwiperSlide: ({ children }) => <div data-testid="swiper-slide">{children}</div>
}))

jest.mock('swiper/modules', () => ({
    Navigation: jest.fn(),
    Autoplay: jest.fn()
}))
