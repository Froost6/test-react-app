import React, { useRef, useEffect} from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import TimeSliderButtons from "./time-slider-buttons.tsx";
import type { Swiper as SwiperType } from 'swiper';

interface Event {
    year: string,
    description: string
}

interface TimeSliderInfoProps {
    selectedData: string;
    events: {
        date: string,
        events: Event[]
    }[];
    selectedIndex: number;
    isMobile?: boolean;
}


const TimeSliderInfo = ({ selectedData, events, selectedIndex, isMobile} : TimeSliderInfoProps) => {
    const selectedEvents = events.find((event) => event.date === selectedData)?.events || []
    const swiperRef = useRef<SwiperType>(null)
    
    const currentEvents = events[selectedIndex]?.events || [];

    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(0)
        }
    }, [selectedIndex])

    return (
        <div className="wrapper-time-slider-events">
            <div className="slider-container-wrapper">
                <Swiper
                onSwiper={(swiper) => {
                    swiperRef.current = swiper
                }}
                    spaceBetween={20}
                    slidesPerView={isMobile ? 1.5 : 4}
                    loop
                    className="time-slider-events"
                    watchSlidesProgress={true}
                >  
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event, idx) => (
                            <SwiperSlide 
                                key={`${selectedIndex}-${idx}`}
                                className="event-item">
                                <div className="time-slider-events-container">
                                    <h3 className="time-slider-events-header"
                                        style={{ color: '#3877EE' }}>
                                            {event.year}</h3>
                                    <p className="time-slider-events-content">{event.description}</p>
                                </div>
                            </SwiperSlide>
                        ))    
                    ) : (
                        <p>Нет событий</p>
                    )}
                </Swiper>
                <TimeSliderButtons swiperRef={swiperRef} />
            </div>
        </div>
    )
}

export default TimeSliderInfo