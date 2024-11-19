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
	status: "OPEN" | "RESOLVED"; // Initially set to "OPEN"
}

export const formatTime = (unixTime: number): string => {
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

const names = ["Alice", "Bob", "Charlie", "Diana", "Ethan", "Fiona"];

function getRandomName() {
	const randomIndex = Math.floor(Math.random() * names.length);
	return names[randomIndex];
}
function getRandomPhoneNumber() {
	const randomPart = () => Math.floor(1000000 + Math.random() * 9000000);
	return `604-${randomPart().toString().slice(0, 3)}-${randomPart().toString().slice(-4)}`;
}

const emergencyTypes: { [key: string]: string } = {
	Fire: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS-7sQLj999nSbC0gtrkIubimJwH-GvwkIBg&s",
	Shooting:
		"https://media.istockphoto.com/id/490970658/photo/woman-aiming-a-pneumatic-air-rifle.jpg?s=612x612&w=0&k=20&c=x7AwKOxSgiVPJL0GSraWjoj3MtKL00wNRlKY3f9ICAI=",
	Medical:
		"https://media.istockphoto.com/id/469836068/photo/businessman-falling-on-stairwell.jpg?s=612x612&w=0&k=20&c=nVFDij7QtRiMGBiFHWDqIsPqwPXX2SqPUVoMMg9sJD4=",
	"Vehicle Accident":
		"https://cdn.aarp.net/content/dam/aarp/auto/2021/06/1140-car-crash.jpg",
	"Natural Disaster":
		"https://zhl.org.in/blog/wp-content/uploads/2023/09/Natural-Disasters-5-1-1-1-1-2.webp",
	Robbery:
		"https://www.deweybrinkleylaw.com/wp-content/uploads/2016/04/bigstock-Hooded-Robber-With-A-Gun-And-A-78546158.jpg",
	Flooding:
		"https://smartcdn.gprod.postmedia.digital/vancouversun/wp-content/uploads/2024/10/png1019-burnaby-still-creek-1.jpg?quality=90&strip=all&w=375&sig=Vpp9MMrVkP59rGEiokLHBw",
	Assault: "https://www.criminaldefenselawyerbrooklyn.com/images/assault.jpg",
	"Domestic Violence":
		"https://www.masstsang.com/media/images/iStock-1398690964-min.original.jpg",
	"Drug Overdose":
		"https://journeyhillside.com/wp-content/uploads/AdobeStock_627493260.jpeg",
	Other:
		"https://media.istockphoto.com/id/1152189152/vector/red-alert-icon.jpg?s=612x612&w=0&k=20&c=Kw_-i314F4cxgn2hmakp-88-O45FSx62c6r-OzKYMw4=",
};

const randomLocation = [
	"Vancouver",
	"Burnaby",
	"Richmond",
	"New Westminster",
	"Surrey",
	"Langley",
	"Coquitlam",
	"Port Coquitlam",
	"North Vancouver",
];
function getRandomKey(obj) {
	const keys = Object.keys(obj);
	const randomIndex = Math.floor(Math.random() * keys.length);
	return keys[randomIndex];
}
export const generateRandomEmergencyLocation = (): EmergencyLocation => {
	const currentTime = Date.now();

	const emergencyType = getRandomKey(emergencyTypes);

	const place =
		randomLocation[Math.floor(Math.random() * randomLocation.length)];

	return {
		id: Math.random().toString(36).substring(2, 15),
		witness: {
			name: getRandomName(),
			phoneNumber: getRandomPhoneNumber(),
		},
		emergencyType,
		location: {
			place,
			lat: Math.random() * (49.3 - 49.1) + 49.1,
			lng: Math.random() * (-122.5 - -123.2) + -123.2,
		},
		pictureLink: emergencyTypes[emergencyType],
		comment: `A ${emergencyType} has occurred in ${place}!`,
		time: currentTime,
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
