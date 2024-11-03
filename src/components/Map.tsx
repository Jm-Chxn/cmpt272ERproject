import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const Map = () => {
	const [lat, setLat] = useState(49.27);
	const [lng, setLng] = useState(-122.92);
	const [zoom, setZoom] = useState(12);

	return (
		<MapContainer
			center={[lat, lng]}
			zoom={zoom}
			scrollWheelZoom={true}
			style={{ height: "50vh", width: "full" }}
		>
			<TileLayer
				attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={[lat, lng]}>
				<Popup>
					A pretty CSS3 popup. <br /> Easily customizable.
				</Popup>
			</Marker>
		</MapContainer>
	);
};

export default Map;
