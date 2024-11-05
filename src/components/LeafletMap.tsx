import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useLocations, type EmergencyLocation } from "../hooks/locations.ts";
import { useViewCoordinates } from "../hooks/viewCoordinates.ts";

const MapController = ({ markerRefs, mapRef }) => {
	const map = useMap();
	const { setZoom, setBounds, setCenter } = useViewCoordinates();

	// Function to open popup and pan to location
	const showLocation = (locationId: string) => {
		const marker = markerRefs.current[locationId];
		if (marker) {
			const map = mapRef.current;
      if (map) {
				// Pan to the marker location
				map.flyTo(marker.getLatLng(), map.getZoom());
				// Open the popup
				marker.openPopup();
			}
		}
	};

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
	const { locations } = useLocations();
	const markerRefs = useRef({});
	const mapRef = useRef(null);

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: "50vh", width: "full" }}
			ref={mapRef}
		>
			<MapController markerRefs={markerRefs} mapRef={mapRef} />
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{locations.map((location: EmergencyLocation) => (
				<Marker
					key={location.id}
					position={[location.location.lat, location.location.lng]}
					ref={(ref) => {
						if (ref) {
							markerRefs.current[location.id] = ref;
						}
					}}
				>
					<Popup autoPan={false}>
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
