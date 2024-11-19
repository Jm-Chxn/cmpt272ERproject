import "./App.css";

import { Button } from "@/components/ui/button";
import { useLocations } from "./hooks/locations";
import DashboardStats from "./components/DashboardStats";
import DashboardHeader from "./components/DashboardHeader";
import EmergencyManagement from "./components/EmergencyManagement";

function App() {
	const { removeLocation, locations } = useLocations();

	const handleRemoveRandomLocation = () => {
		const randomIndex = Math.floor(Math.random() * locations.length);
		removeLocation(locations[randomIndex]);
	};

	return (
		<div className="flex flex-col min-h-screen gap-2">
			<DashboardHeader />
			<div className="flex-1 space-y-4 p-8 pt-6">
				<DashboardStats />
				<EmergencyManagement />
				<div className="flex justify-center space-x-2">
					<Button
						className="flex items-center"
						variant="secondary"
						onClick={handleRemoveRandomLocation}
					>
						Remove Random
					</Button>
				</div>
			</div>
		</div>
	);
}

export default App;
