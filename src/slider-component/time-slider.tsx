import React, { useState, useRef, useEffect } from 'react';
import './time-slider.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { eventsData } from './time-slider-events.ts';
import TimeSliderInfo from './time-slider-info.tsx'
import gsap from 'gsap';



const TimeSlider = () => {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [currentRotation, setCurrentRotation] = useState(0);
    const [outerCircleSize, setOuterCircleSize] = useState(500)
    const [inerCircleSize, setInerCircleSize] = useState(275)
    const swiperRef = useRef(null);
    const innerCircleRef = useRef(null)
    const outerCircleRef = useRef(null)
    const Angles = [300, 360, 60, 120, 180, 240];
    const selectedAngle = 300;

    useEffect(() => {
        const updateCirleSize = () => {
            const baseWidth = 1440;
            const baseCircleSize = 500

            const currentWidth = window.innerWidth
            let newSize = (currentWidth / baseWidth) * baseCircleSize;

            newSize = Math.max(400, Math.min(newSize, 550))
            
            updateCirleSize()

            const handleResize = () => {
                updateCirleSize()
            }

            window.addEventListener('resize',handleResize)

            return () => {
                window.removeEventListener('resize',handleResize)
            }
        }
    }, [])

    // отвечает за положение эллементов круга на 6 позициях
    const calculatePosition = (index: number) => {
        const radius =  inerCircleSize - 25
        const angle = Angles[index];
        const x = radius * Math.cos((angle * Math.PI) / 180);
        const y = radius * Math.sin((angle * Math.PI) / 180);
        return { x, y, angle };
    };
    
    // когда крутится круг - свайпается и слайдер тоже
    const HandleCircleClick = (index: number) => {
        setSelectedIndex(index)
        const targetAngle = selectedAngle - Angles[index]
        gsap.to(innerCircleRef.current, {
            rotation: targetAngle,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
                setCurrentRotation(targetAngle)
            }
        })
        if (swiperRef.current) {
            swiperRef.current.slideTo(index, 2000);
        }
    }
    // функция которая при свайпе даты автоматически поворачивает и круг
    const HandleSlideChange = (swiper: SwiperType) => {
        const newIndex = swiper.activeIndex;
        setSelectedIndex(newIndex);
        
        const targetAngle = selectedAngle - Angles[newIndex];
        gsap.to('.inner-circle', {
            rotation: targetAngle,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                setCurrentRotation(targetAngle)
            }
        });
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
    // разделяет дату на два эллемента что бы сделать разные цвета
    const splitDate = (date : string) => {
        const parts = date.split('-')
        return (
        <div className="date-words">
            <span className="first-date">{parts[0]}</span>
            <span className="second-date">{parts[1]}</span>
        </div>
        )
    }

    return(
        <main>
          <div className="slider-info-nav">
            <h1 className="time-slider-h1">Исторические</h1>
            <h1 className="time-slider-h1">Даты</h1>
          </div>
          
          <div className="circle-wrapper">
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
                        transform: `translate(-50%, -50%) rotate(${-currentRotation}deg)`,
                      }}
                      onClick={() => HandleCircleClick(index)}
                    >
                      <div className="circle-number">
                        {index + 1}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <div className="fixed-label-container">
                <p className="static-label">
                  {eventsData[selectedIndex]?.label || ''}
                </p>
              </div>
            </div>
          </div>
          
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
                      <h2 className="slider-content-date">{splitDate(event.date)}</h2>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="slider-container-main">
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
          </div>
          
          <TimeSliderInfo selectedData={eventsData[selectedIndex]?.date || ''} events={eventsData} />
        </main>
      )
}

export default TimeSlider