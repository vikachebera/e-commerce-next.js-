'use client';

import 'swiper/css';
import "swiper/css/navigation";
import 'swiper/css/pagination';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

export default function Carousel() {
    const images = [
        '/assets/1.jpg',
        '/assets/2.jpg',
        '/assets/3.jpg',
        '/assets/4.jpg'
    ];

    return (
        <div className="w-full h-1/5">
            <Swiper
                modules={[Navigation, Autoplay]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                autoplay={{ delay: 3000, disableOnInteraction: true }}
                loop={true}
                className="w-full  h-full"
            >
                {images.map((src, i) => (
                    <SwiperSlide key={i} className="w-full h-full">
                        <img
                            src={src}
                            alt={`Slide ${i + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
