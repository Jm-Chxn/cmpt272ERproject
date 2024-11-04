import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useLocations, type EmergencyLocation } from "../hooks/locations.ts";
import { useViewCoordinates } from "../hooks/viewCoordinates.ts";

const isInBounds = (
	location: EmergencyLocation,
	bounds: LatLngBounds,
): boolean => {
	return (
		// Terrible, but it works
		// @ts-ignore
		location.location.lat >= bounds._southWest.lat &&
		// @ts-ignore
		location.location.lat <= bounds._northEast.lat &&
		// @ts-ignore
		location.location.lng >= bounds._southWest.lng &&
		// @ts-ignore
		location.location.lng <= bounds._northEast.lng
	);
};

const MapController = () => {
	const map = useMap();
	const { setZoom, setBounds, setCenter } = useViewCoordinates();

	useEffect(() => {
		const updateMapInfo = () => {
			setZoom(map.getZoom());
			setCenter(map.getCenter());
			setBounds(map.getBounds());
		};

		updateMapInfo(); // Initial update

		map.on("moveend", updateMapInfo);

		// Clean up the event listener when the component unmounts
		return () => {
			map.off("moveend", updateMapInfo);
		};
	}, [map, setZoom, setBounds, setCenter]);

	return null;
};

const LeafletMap = () => {
	const { center, bounds, zoom } = useViewCoordinates();
	const { locations } = useLocations();

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: "50vh", width: "full" }}
		>
			<MapController />
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{locations.map(
				(location: EmergencyLocation) =>
					isInBounds(location, bounds) && (
						<Marker
							key={location.id}
							position={[location.location.lat, location.location.lng]}
						>
							<Popup>{location.comment}</Popup>
						</Marker>
					),
			)}
		</MapContainer>
	);
};

export default LeafletMap;
