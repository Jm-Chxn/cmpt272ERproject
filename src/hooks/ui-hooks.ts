import { useEffect, useState } from "react";

export const useDarkMode = () => {
	const [isDarkMode, setIsDarkMode] = useState(true);

	const toggleDarkMode = () => {
		setIsDarkMode((prev) => !prev);
		document.body.classList.toggle("dark", !isDarkMode);
	};

	return { isDarkMode, toggleDarkMode };
};

export const useTime = () => {
	const [currentTime, setCurrentTime] = useState(
		new Date().toLocaleTimeString(),
	);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setCurrentTime(new Date().toLocaleTimeString());
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	return currentTime;
};

export const useFormattedTime = (timestamp: number) => {
	return new Date(timestamp).toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};
