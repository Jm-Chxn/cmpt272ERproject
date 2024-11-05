import { useMap, MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useLocations, type EmergencyLocation } from "../hooks/locations.ts";
import { useViewCoordinates } from "../hooks/viewCoordinates.ts";

export function focusMarker(id: string, lat: number, lng: number) {
	const event = new CustomEvent("focusMarker", { detail: { id, lat, lng } });
	document.dispatchEvent(event);
}

const MapController = ({ markersRef }) => {
	const map = useMap();
	const { setZoom, setBounds, setCenter } = useViewCoordinates();
	const { locations } = useLocations();

	useEffect(() => {
		const handleFocusMarker = (
			e: CustomEvent<{ id: string; lat: number; lng: number }>,
		) => {
			if (location) {
				map.flyTo([e.detail.lat, e.detail.lng], map.getZoom(), {
					animate: true,
					duration: 0.5,
				});

				if (markersRef.current[e.detail.id]) {
					markersRef.current[e.detail.id].openPopup();
				} else {
					console.log("marker not found:", e.detail.id);
				}
			}
		};

		document.addEventListener("focusMarker", handleFocusMarker);
		return () => {
			document.removeEventListener("focusMarker", handleFocusMarker);
		};
	}, [locations]);

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
	const markersRef = useRef({});

	return (
		<MapContainer
			center={center}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: "50vh", width: "full" }}
		>
			<MapController markersRef={markersRef} />
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			{locations.map((location: EmergencyLocation) => (
				<Marker
					key={location.id}
					position={[location.location.lat, location.location.lng]}
					ref={(el) => (markersRef.current[location.id] = el)}
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
