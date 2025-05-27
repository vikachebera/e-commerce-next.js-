'use client';

import 'swiper/css';
import "swiper/css/navigation";
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function Carousel() {
    const images = [
        '/assets/1.png',
        '/assets/2.jpg',
        '/assets/3.jpg',
        '/assets/4.jpg'
    ];

    return (
        <div className="w-full h-[400px]">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={20}
                slidesPerView={1}
                centeredSlides={true}
                grabCursor={true}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                loop={true}
                className="w-full h-full rounded-xl overflow-hidden"
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i}>
                        <div className="w-full h-full flex items-center justify-center">
                            <img
                                src={src}
                                alt={`Slide ${i + 1}`}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}