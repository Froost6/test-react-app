import React from "react"
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
    return (
        <Swiper
         spaceBetween={20}
         slidesPerView={4}
         loop>  
            {selectedEvents.length > 0 ? (
                selectedEvents.map((event, idx) => (
                    <SwiperSlide>
                        <div key={idx}>
                            <h3>{event.year}</h3>
                            <p>{event.description}</p>
                        </div>
                    </SwiperSlide>
                ))    
            ) : (
                <p>Нет событий</p>
            )}
            <TimeSliderButtons />
            
        </Swiper>
    )
}

export default TimeSliderInfo