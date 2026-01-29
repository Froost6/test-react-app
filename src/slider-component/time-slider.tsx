import React, { useState, useRef } from 'react';
import './time-slider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import TimeSliderButtons from './time-slider-buttons.tsx';
import { eventsData } from './time-slider-events.ts';
import TimeSliderInfo from './time-slider-info.tsx'
import gsap from 'gsap';


const TimeSlider = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const swiperRef = useRef(null);
    const innerCircleRef = useRef(0)
    const Angles = [300, 360, 60, 120, 180, 240];
    const selectedAngle = 300;

    const calculatePosition = (index: number, currentRotation = 0) => {
        const radius = 300;
        const angle = Angles[index] + currentRotation;
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        return { x, y, angle };
    };
    

    const HandleCircleClick = (index: number) => {
        setSelectedIndex(index)
        const targetAngle = selectedAngle - Angles[index]
        gsap.to(innerCircleRef.current, {
            rotation: targetAngle,
            duration: 1,
            ease: "power2.out"
        })
        if (swiperRef.current) {
            swiperRef.current.slideTo(index);
        }
    }

    const HandleSlideChange = (swiper: SwiperType) => {
        const newIndex = swiper.activeIndex;
        setSelectedIndex(newIndex);
        
        const targetAngle = selectedAngle - Angles[newIndex];
        gsap.to('.inner-circle', {
            rotation: targetAngle,
            duration: 1,
            ease: 'power2.out',
        });
    }

    const handleSwiperInit = (swiper: SwiperType) => {
        console.log('Swiper initialized');
        swiperRef.current = swiper;
    };

    return(
        <main>
        <div className="slider-info-nav">
            <div className="slider-info-line"></div>
            <h1 className="time-slider-h1">Исторические Даты</h1>
        </div>
        <div className="outer-circle">
            <div className="inner-circle">
            {eventsData.map((event, index) => {
                const { x, y } = calculatePosition(index);
                const isActive = selectedIndex === index
                return (
                <div 
                key={index}
                className={`circle-item ${isActive ? 'selected' : 'circle-small'}`}
                style={{ 
                    position: 'absolute',
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                    transform: `translate(-50%, -50%)`,
                }}
                onClick={() => HandleCircleClick(index)}
                >
                    <div 
                    className="circle-number">
                        {index + 1}
                    </div>
                </div>
            )})}
            </div>
   
            <div className="slider-container">
                <Swiper
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={HandleSlideChange}
                onSwiper={handleSwiperInit}
                >
                    {eventsData.map((event, idx) =>(
                        <SwiperSlide key={idx}>
                            <div className="slider-content">
                                <h2 className="slider-content-date">{event.date}</h2>
                            </div>
                        </SwiperSlide>
                    ))}
                    <TimeSliderButtons />
                </Swiper>
            </div>
            </div>
            <TimeSliderInfo selectedData={eventsData[selectedIndex]?.date || ''} events={eventsData} />
        </main>
    )
}

export default TimeSlider