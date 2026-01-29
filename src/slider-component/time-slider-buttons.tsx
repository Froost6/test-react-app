import React from "react";
import { useSwiper } from "swiper/react";

const TimeSliderButtons = () => {
    const swiper = useSwiper()
    return(
        <div className="slider-buttons">
            <button onClick={() => swiper.slidePrev()}>Prev</button>
            <button onClick={() => swiper.slideNext()}>Next</button>
        </div>
    )
}

export default TimeSliderButtons