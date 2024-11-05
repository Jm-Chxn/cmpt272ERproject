import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import LeafletMap, { focusMarker } from "./components/LeafletMap";
import {
	generateRandomEmergencyLocation,
	useLocations,
} from "./hooks/locations";

function App() {
	const [count, setCount] = useState(0);
	const { addLocation, removeLocation, locations } = useLocations();

	return (
		<>
			<LeafletMap />
			<button
				onClick={() => addLocation(generateRandomEmergencyLocation())}
				type="button"
			>
				Add Random
			</button>
			<button
				onClick={() =>
					removeLocation(
						locations[Math.floor(Math.random() * locations.length)],
					)
				}
				type="button"
			>
				Remove Random
			</button>
			<button
				onClick={() => {
					if (locations.length === 0) return;
					const marker =
						locations[Math.floor(Math.random() * locations.length)];

					focusMarker(marker.id, marker.location.lat, marker.location.lng);
				}}
				type="button"
			>
				Focus Random
			</button>
			<div>
				<img src={viteLogo} className="logo" alt="Vite logo" />
				<img src={reactLogo} className="logo react" alt="React logo" />
			</div>
			<h1>Vite + React</h1>
			<div className="card">
				<button onClick={() => setCount((count) => count + 1)} type="button">
					count is {count}
				</button>
				<p>
					Edit <code>src/App.tsx</code> and save to test HMR
				</p>
			</div>
			<p className="read-the-docs">
				Click on the Vite and React logos to learn more
			</p>
		</>
	);
}

export default App;
