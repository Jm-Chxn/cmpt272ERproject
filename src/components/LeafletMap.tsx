import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngBounds } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { useLocations, type EmergencyLocation } from "../hooks/locations.ts";
import { useViewCoordinates } from "../hooks/viewCoordinates.ts";

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
	const { center, zoom } = useViewCoordinates();
	const { locations, viewableLocations } = useLocations();

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
			{locations.map((location: EmergencyLocation) => (
				<Marker
					key={location.id}
					position={[location.location.lat, location.location.lng]}
				>
					<Popup>
						<strong>{location.location.place}</strong>
						<br />
						{location.emergencyType}
					</Popup>
				</Marker>
			))}
		</MapContainer>
	);
};

export default LeafletMap;
