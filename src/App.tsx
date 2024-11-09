import "./App.css";
import { useState  } from "react";

import LeafletMap from "./components/LeafletMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./components/ui/data-table";
import { ScrollArea } from "./components/ui/scroll-area";
import { Button } from "@/components/ui/button.tsx";
import {
	generateRandomEmergencyLocation,
	useLocations,
	type EmergencyLocation,
} from "./hooks/locations";
import { columns } from "./columns";
import {AlertTriangle, Heart, Plus, Siren, Timer, Sun, Moon} from "lucide-react";

function App() {
	const {
		addLocation,
		removeLocation,
		locations,
		viewableLocations,
		getTodaysEmergenciesCount,
	} = useLocations();
	const [selectedLocation, setSelectedLocation] =
		useState<EmergencyLocation | null>(null);

	const openEmergenciesCount = locations.filter(
		(loc) => loc.status === "OPEN",
	).length;
	const resolvedEmergenciesCount = locations.filter(
		(loc) => loc.status === "RESOLVED",
	).length;

	const handleRowClick = (location: EmergencyLocation) => {
		console.log("Row clicked:", location);
		setSelectedLocation(location);
	};
	const [isDarkMode, setIsDarkMode] = useState(true);
	const toggleDarkMode = () => {
	  setIsDarkMode((prev) => !prev);
	  document.body.classList.toggle("dark", !isDarkMode);
	};

	return (
		<>
			<div className="flex flex-col min-h-screen gap-2">
					<div className="flex items-center justify-between">
						<h2 className="text-3xl font-bold tracking-tight ml-8">
							E-Comm Dashboard
						</h2>
					</div>
					<div className="flex-1 space-y-4 p-8 pt-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium ">
										Active emergencies:{" "}
									</CardTitle>
									<AlertTriangle className="h-4 w-4 text-red-500" />
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{openEmergenciesCount}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium ">
										Resolved emergencies:{" "}
									</CardTitle>
									<Heart className="h-4 w-4 text-green-500" />
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{resolvedEmergenciesCount}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium ">
										Total emergencies today:{" "}
									</CardTitle>
									<Siren className="h-4 w-4 text-orange-500" />
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{getTodaysEmergenciesCount()}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium ">
										Average Response Time:{" "}
									</CardTitle>
									<Timer className="h-4 w-4 text-blue-500" />
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									8.5m
								</CardContent>
							</Card>
						</div>
						<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
							<Card>
								<CardHeader className="text-left">
									<CardTitle className="text-xl font-bold">
										Emergency Location Map
									</CardTitle>
								</CardHeader>
								<CardContent>
									<LeafletMap selectedLocation={selectedLocation} />
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center text-left justify-between pb-3">
									<CardTitle className="text-xl font-bold w-fit">
										Emergency Reports
									</CardTitle>
									<Button
										onClick={() =>
											addLocation(generateRandomEmergencyLocation())
										}
										variant="outline" className="ml-auto flex items-center leading-none">
										<Plus className="h-8 w-8 text-blue-400" />
										New Report

									</Button>
								</CardHeader>
								<CardContent className="h-[50dvh] py-0">
									<ScrollArea className="h-full overflow-y-auto">
										<DataTable
											columns={columns}
											data={viewableLocations}
											onRowClick={handleRowClick}
										/>
									</ScrollArea>
								</CardContent>
							</Card>
						</div>
						<div className="flex justify-center space-x-2">
							<Button
								className="flex items-center "
								variant="secondary"
								onClick={() =>
									removeLocation(
										locations[Math.floor(Math.random() * locations.length)],
									)
								}
							>
								Remove Random
							</Button>
							<Button onClick={toggleDarkMode} variant="secondary"
							className="ml-auto flex items-center ">
								{isDarkMode ? <Moon /> : <Sun />}
							</Button>
						</div>
					</div>
			</div>
		</>
	);
}

export default App;
