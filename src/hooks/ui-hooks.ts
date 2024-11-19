import { useState, useEffect } from "react";
import {
	type EmergencyLocation,
} from "@/hooks/locations";

export const [selectedLocation, setSelectedLocation] =
useState<EmergencyLocation | null>(null);

export const useDarkMode = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => !prev);
        document.body.classList.toggle("dark", !isDarkMode);
    };

    return { isDarkMode, toggleDarkMode };
};

export const useTime = () => {
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return currentTime;
};

export const handleRowClick = (location: EmergencyLocation) => {
    console.log("Row clicked:", location);
    setSelectedLocation(location);
};

