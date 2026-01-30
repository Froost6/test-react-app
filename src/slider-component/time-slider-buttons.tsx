import React from "react";

interface TimeSliderButtonsProps {
    swiperRef: { current:any}; 
}

const TimeSliderButtons = ({ swiperRef }: TimeSliderButtonsProps) => {
    return(
        <div className="slider-buttons">
            <button 
                className="slider-button slider-button-prev" 
                onClick={() => swiperRef.current?.swiper?.slidePrev()}
            >
                &lt;
            </button>
            <button 
                className="slider-button slider-button-next" 
                onClick={() => {swiperRef.current?.swiper?.slideNext()}}
            >
                &gt;
            </button>
        </div>
    )
}

export default TimeSliderButtons