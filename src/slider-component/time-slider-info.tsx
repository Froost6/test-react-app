import React, { useRef } from "react"
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import TimeSliderButtons from "./time-slider-buttons.tsx";

interface Event {
    year: string,
    description: string
}

interface TimeSliderInfoProps {
    selectedData: string,
    events: {
        date: string,
        events: Event[]
    }[]
}

const TimeSliderInfo = ({ selectedData, events} : TimeSliderInfoProps) => {
    const selectedEvents = events.find((event) => event.date === selectedData)?.events || []
    const swiperRef = useRef(null)
    
    return (
        <div className="wrapper-time-slider-events">
            <div className="slider-container-wrapper">
                <Swiper
                    ref={swiperRef}
                    spaceBetween={20}
                    slidesPerView={4}
                    loop
                    className="time-slider-events"
                >  
                    {selectedEvents.length > 0 ? (
                        selectedEvents.map((event, idx) => (
                            <SwiperSlide key={idx}>
                                <div className="time-slider-events-container">
                                    <h3 className="time-slider-events-header">{event.year}</h3>
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