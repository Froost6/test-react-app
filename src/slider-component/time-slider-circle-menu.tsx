import react, { useState } from "react";
import { gsap } from 'gsap'
import { eventsData } from "./time-slider-events";

interface Event {
    year: string,
    description: string
}

interface Date {
    number: number,
    label: string,
    yearRange: string,
    events: Event[]
}

interface CircleMenuProps {
    onSelectedDate: (yearRange: string, label:string) =>  void
}

const CircleMenu = ({ onSelectedData }) => {
    const [selectedIndex, setSelectedIndex] = useState(-1)

    const Dates: Date[] = [

    ]
}