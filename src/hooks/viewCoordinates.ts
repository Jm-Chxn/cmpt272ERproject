import { useLocalStorage } from "usehooks-ts";

import { LatLng, LatLngBounds } from "leaflet";

export const useViewCoordinates = () => {
	// default values taken from google maps

	// {"lat":49.23681619396022,"lng":-123.05455607011129}
	const [center, setCenter] = useLocalStorage<LatLng>(
		"center",
		new LatLng(49.2368, -123.0545),
	);
	// {"_southWest":{"lat":49.13583796323594,"lng":-123.28252237870504},"_northEast":{"lat":49.337588404275586,"lng":-122.82658976151754}}
	const [bounds, setBounds] = useLocalStorage<LatLngBounds>(
		"bounds",
		new LatLngBounds(
			new LatLng(49.1358, -123.2825),
			new LatLng(49.3375, -122.8226),
		),
	);
	const [zoom, setZoom] = useLocalStorage<number>("zoom", 10);

	return { center, bounds, zoom, setZoom, setBounds, setCenter };
};
