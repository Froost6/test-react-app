import React, { useState, useRef, useEffect } from "react";
import { gsap } from 'gsap'
import { eventsData } from "./time-slider-events.ts";
import { Swiper as SwiperType } from 'swiper'


interface Event {
    year: string,
    description: string
}

interface Date {
    number: number;
    label: string;
    yearRange: string;
    events: Event[];
}

interface CircleMenuProps {
    onSelectedDate: (yearRange: string, label:string) =>  void;
    selectedIndex: number;
    onIndexChange:(index:number) => void;
    eventsDate: Date[];
    swiperRef: React.RefObject<any>;
    outerCircleRef?: React.RefObject<HTMLDivElement>;

}

const CircleMenu = ({ onSelectedData, selectedIndex, onIndexChange, eventsData, swiperRef }) => {
        const [currentRotation, setCurrentRotation] = useState(0);
        const [outerCircleSize, setOuterCircleSize] = useState(500)
        const [inerCircleSize, setInerCircleSize] = useState(275)
        const outerCircleRef = useRef(null)
        const innerCircleRef = useRef(null)
        const Angles = [300, 360, 60, 120, 180, 240];
        const selectedAngle = 300;

        // функция для автоматического изменения размера круга при изменении ширины экрана 
    useEffect(() => {
        const updateCirleSize = () => {
            const baseWidth = 1440;
            const baseOuterCircleSize = 500
            const BaseInnerCircleSize = 275

            const currentWidth = window.innerWidth
            let newOuterSize = (currentWidth / baseWidth) * baseOuterCircleSize;
            newOuterSize = Math.max(400, Math.min(newOuterSize, 550))
            setOuterCircleSize(newOuterSize)

            let newInnerSize = (currentWidth / baseWidth) * BaseInnerCircleSize
            newInnerSize = Math.max(225, Math.min(newInnerSize, 300))
            setInerCircleSize(newInnerSize)

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
        onIndexChange(index)
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

        if (onSelectedData[index]) {
            onSelectedData(eventsData[index].yearRange, eventsData[index].label)
        }

        if (swiperRef.current) {
            swiperRef.current.slideTo(index, 2000)
        }
    }

    useEffect(() => {
        const targetAngle = selectedAngle - Angles[selectedIndex]
        gsap.to(innerCircleRef.current, {
            rotation: targetAngle,
            duration: 2, 
            ease: "power2.out",
            onUpdate: () => {
                setCurrentRotation(targetAngle)
            }
        })
    },[selectedIndex])


    return (
        <div className="circle-wrapper">
            <div className="outer-circle"
            style={{
                transform: `rotate(${currentRotation}deg)`,
                transition: 'transform 2s ease-out',
                width: `${outerCircleSize}px`,
                height: `${outerCircleSize}px`
            }}>
                <div className="inner-circle">
                {eventsData.map((event,index) => {
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
            </div>
        </div>

    )

}

export default CircleMenu