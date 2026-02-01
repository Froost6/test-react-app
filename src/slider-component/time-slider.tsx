import React, { useState, useRef, useEffect } from 'react';
import '../style/time-slider.scss'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { eventsData } from './time-slider-events.ts';
import TimeSliderInfo from './time-slider-info.tsx'
import  CircleMenu  from './time-slider-circle-menu.tsx'

const TimeSlider = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [isMobile, setIsMobile] = useState(false)
    const [currentDate, setCurrentDate] = useState({
      date:eventsData[0].date,
      label:eventsData[0].label
    })
    const swiperRef = useRef<SwiperType>(null);

    useEffect(() => {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth <= 768)
      }

      checkIsMobile()
      window.addEventListener('resize', checkIsMobile)

      return () => window.removeEventListener('resize', checkIsMobile)
    },[])

    // функция которая при свайпе даты автоматически поворачивает и круг
    const HandleSlideChange = (swiper: SwiperType) => {
        const newIndex = swiper.activeIndex;
        setSelectedIndex(newIndex);
        
        if (eventsData[newIndex]) {
          setCurrentDate({
            date:eventsData[newIndex].date,
            label:eventsData[newIndex].label
          })
        }
    }
    
    const PrevClick = () => {
        if (swiperRef.current) {
          swiperRef.current.slidePrev();
        }
      };
    
      const NextClick = () => {
        if (swiperRef.current) {
          swiperRef.current.slideNext();
        }
      };

    const handleSwiperInit = (swiper: SwiperType) => {
        swiperRef.current = swiper;
    };

    const setSelectedDate = (date: string, label: string) => {
      setCurrentDate({ date, label})
    }

    const IndexChange = (index:number) => {
      setSelectedIndex(index)
    }
    // разделяет дату на два эллемента что бы сделать разные цвета
    const splitDate = (date : string) => {
        const parts = date.split('-')
        return (
        <div className="slider-content-date">
            <span className="first-date">{parts[0]}</span>
            <span className="second-date">{parts[1]}</span>
        </div>
        )
    }

    return(
        <main>
          <div className="slider-info-nav">
            <h2 className="time-slider-h1">Исторические</h2>
            <h2 className="time-slider-h1">Даты</h2>
          </div>

          <CircleMenu
            onSelectedData={setSelectedDate}
            selectedIndex={selectedIndex}
            onIndexChange={IndexChange}
            eventsData={eventsData}
            swiperRef={swiperRef}
          />
          <div className="slider-wrapper">
            <div className="slider-container">
              <Swiper
                modules={[Navigation]}
                spaceBetween={50}
                slidesPerView={1}
                onSlideChange={HandleSlideChange}
                onSwiper={handleSwiperInit}
                speed={2000}
              >
                {eventsData.map((event, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="slider-content">
                      {splitDate(event.date)}
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="slider-content-label">
              {eventsData[selectedIndex].label}
            </div>
            {!isMobile && (
              <div className="slider-container-main .desctop-pagination">
                <span>{String(eventsData[selectedIndex].index + 1).padStart(2, '0')}/{String(eventsData.length).padStart(2, '0')}</span>
                  <div className="slider-conteiner-buttons-main"> 
                      <button className="slider-button-main slider-button-prev-main" onClick={PrevClick}>
                          &lt;
                      </button>
                      <button className="slider-button-main slider-button-next-main" onClick={NextClick}>
                          &gt;
                      </button>
                  </div>
              </div>
            )}
          </div>
          
          <TimeSliderInfo 
          selectedData={eventsData[selectedIndex]?.date || ''} 
          events={eventsData} 
          selectedIndex={selectedIndex}
          isMobile={isMobile} />

          {isMobile && (
            <div className="mobile-pagination-container">
                <div className="mobile-slider-info">
                  <div className="slide-counter">
                    {String(selectedIndex + 1).padStart(2, '0')}/{String(eventsData.length).padStart(2, '0')}
                  </div>              
                  <div className='mobile-nav-buttons'>
                    <button
                    className='mobile-btn-nav prev-btn'
                    onClick={PrevClick}
                    disabled={selectedIndex === 0}>
                      &lt;
                    </button>
                    <button
                    className='mobile-btn-nav next-btn'
                    onClick={NextClick}
                    disabled={selectedIndex === eventsData.length - 1}>
                      &gt;
                    </button>
                  </div>
                </div>
                  <div className="mobile-dots">
                    {eventsData.map((_,idx:number) => (
                      <div
                      key={idx}
                      className={`mobile-dot ${idx === selectedIndex ? 'active' : '' }`}
                      onClick={() => {
                        setSelectedIndex(idx)
                        if (swiperRef.current) {
                          swiperRef.current.slideTo(idx)
                        }
                      }}>
                  </div>
                    ))}
                </div>
              </div>
          )}
        </main>
      )
}

export default TimeSlider