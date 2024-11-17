import type { Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { type EmergencyLocation, useLocations } from "../hooks/locations.ts";
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

const LeafletMap = ({
	selectedLocation,
}: { selectedLocation: EmergencyLocation | null }) => {
	const { center, zoom } = useViewCoordinates();
	const { locations } = useLocations();
	const markerRefs = useRef<{ [key: string]: LeafletMarker | null }>({});
	useEffect(() => {
		if (selectedLocation && markerRefs.current[selectedLocation.id]) {
			markerRefs.current[selectedLocation.id]?.openPopup();
		}
	}, [selectedLocation]);

	return (
		<div className="map-container">
			<MapContainer
				center={center}
				zoom={zoom}
				scrollWheelZoom={true}
				style={{
          			zIndex: "1",
					height: "50vh",
					width: "100vh",
					display: "block",
					borderRadius: "var(--radius)",
				}}
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
						ref={(el) => {
							if (el) markerRefs.current[location.id] = el;
						}}
					>
						<Popup>
							<div className="text-xl font-bold">{location.location.place}</div>
							<div className="text-lg">{location.emergencyType}</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
		</div>
	);
};

export default LeafletMap;
