import { useState } from "react";
import "./App.css";
import LeafletMap from "./components/LeafletMap";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react"

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
            locations[Math.floor(Math.random() * locations.length)]
          )
        }
        type="button"
      >
        Remove Random
      </button>
      
    <div className="alert-container">
		<Alert className="alert">
			<Terminal className="h-4 w-4" />
			<AlertTitle>Location Update</AlertTitle>
			<AlertDescription>
			Current number of emergency locations: {locations.length}
			</AlertDescription>
		</Alert>
	</div>

    </>
  );
}

export default App;