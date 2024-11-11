import type { LatLngBounds } from "leaflet";
import { useLocalStorage } from "usehooks-ts";
import { useViewCoordinates } from "./viewCoordinates.ts";

const isInBounds = (
	location: EmergencyLocation,
	bounds: LatLngBounds,
): boolean => {
	return (
		// @ts-expect-error its actually a json object
		location.location.lat >= bounds._southWest.lat &&
		// @ts-expect-error its actually a json object
		location.location.lat <= bounds._northEast.lat &&
		// @ts-expect-error its actually a json object
		location.location.lng >= bounds._southWest.lng &&
		// @ts-expect-error its actually a json object
		location.location.lng <= bounds._northEast.lng
	);
};

export interface EmergencyLocation {
	id: string; // unique id for the location
	witness: {
		name: string; // name of witness
		phoneNumber: string; // phone number of witness
	};
	emergencyType: string; // fire, shooting, vehicle accident, medical, etc
	location: {
		place: string; // name of place
		lat: number; // latitude
		lng: number; // longitude
	};
	pictureLink: string; // An optional URL to an image of the emergency.
	comment: string; //  Additional details, such as "suspect is wearing cargo shorts with green t-shirt"
	time: number; // unix timestamp of when the report was lodged
	formattedTime?: string;
	status: "OPEN" | "RESOLVED"; // Initially set to "OPEN"
}

const formatTime = (unixTime: number): string => {
	const date = new Date(unixTime);
	return date.toLocaleString("en-US", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		hour12: true,
	});
};

export const generateRandomEmergencyLocation = (): EmergencyLocation => {
	const randomEmergencyType = ["Fire", "Shooting", "Medical", "Other"];
	const randomLocation = ["Vancouver", "Burnaby", "Richmond"];
	const currentTime = Date.now();

	return {
		id: Math.random().toString(36).substring(2, 15),
		witness: {
			name: `name: ${Math.random().toString(36).substring(2, 5)}`,
			phoneNumber: Math.random().toString(36).substring(2, 15),
		},
		emergencyType: randomEmergencyType[Math.floor(Math.random() * 3)],
		location: {
			place: randomLocation[Math.floor(Math.random() * 3)],
			lat: Math.random() * (49.3 - 49.1) + 49.1,
			lng: Math.random() * (-122.5 - -123.2) + -123.2,
		},
		pictureLink:
			"https://akns-images.eonline.com/eol_images/Entire_Site/201363/rs_1024x759-130703124141-1024.Gru.mh.070313.jpg?fit=around%7C1024:759&output-quality=90&crop=1024:759;center,top",
		comment: `comment: ${Math.random().toString(36).substring(2, 5)}`,
		time: currentTime,
		formattedTime: formatTime(currentTime),
		status: "OPEN",
	};
};

export const useLocations = () => {
	const [locations, setLocations] = useLocalStorage<EmergencyLocation[]>(
		"emergencyLocations",
		[],
	);

	const { bounds } = useViewCoordinates();

	const removeLocation = (oldLocation: EmergencyLocation) => {
		const newLocations = locations.filter((loc) => loc.id !== oldLocation.id);
		setLocations(newLocations);
	};

	const addLocation = (newLocation: EmergencyLocation) => {
		setLocations([...locations, newLocation]);
	};

	const viewableLocations = locations.filter((loc) => isInBounds(loc, bounds));

	const markAsResolved = (id: string) => {
		const updatedLocations = locations.map((loc) =>
			loc.id === id ? { ...loc, status: "RESOLVED" as const } : loc,
		);
		setLocations(updatedLocations);
	};

	const getTodaysEmergenciesCount = () => {
		const startOfToday = new Date();
		startOfToday.setHours(0, 0, 0, 0);
		const startOfTodayTimestamp = startOfToday.getTime();

		return locations.filter((loc) => loc.time >= startOfTodayTimestamp).length;
	};

	return {
		locations,
		viewableLocations,
		removeLocation,
		addLocation,
		markAsResolved,
		getTodaysEmergenciesCount,
		setLocations,
	};
};
