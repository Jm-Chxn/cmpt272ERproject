import type { Marker as LeafletMarker } from "leaflet";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { type EmergencyLocation, useLocations } from "../hooks/locations.ts";
import { useViewCoordinates } from "../hooks/viewCoordinates.ts";
import { useLocalStorage } from "usehooks-ts";

const MapController = ({
	markersRef,
}: {
	markersRef: React.MutableRefObject<{ [key: string]: LeafletMarker | null }>;
}) => {
	const map = useMap();
	const { setZoom, setBounds, setCenter } = useViewCoordinates();
	const [selectedLocation, _setSelectedLocation] =
		useLocalStorage<EmergencyLocation | null>("selectedLocation", null);

	useEffect(() => {
		if (selectedLocation && markersRef.current[selectedLocation.id]) {
			map.flyTo(
				[selectedLocation.location.lat, selectedLocation.location.lng],
				map.getZoom(),
				{
					animate: true,
					duration: 0.5,
				},
			);

			if (markersRef.current[selectedLocation.id]) {
				markersRef.current[selectedLocation.id]?.openPopup();
			} else {
				console.log("marker not found:", selectedLocation.id);
			}
		}
	}, [markersRef, map, selectedLocation]);

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
	const markerRefs = useRef<{ [key: string]: LeafletMarker | null }>({});

	const [_selectedLocation, setSelectedLocation] =
		useLocalStorage<EmergencyLocation | null>("selectedLocation", null);

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
				<MapController markersRef={markerRefs} />
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
						eventHandlers={{
							click: () => setSelectedLocation(location),
						}}
					>
						<Popup autoPan={false}>
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
