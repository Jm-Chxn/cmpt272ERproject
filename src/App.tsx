import "./App.css";
import { useState } from "react";
import LeafletMap from "./components/LeafletMap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./components/ui/data-table";
import { ScrollArea } from "./components/ui/scroll-area";
import {
	generateRandomEmergencyLocation,
	useLocations,
	type EmergencyLocation,
} from "./hooks/locations";
import { columns } from "./columns";
import { Plus } from "lucide-react";

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

	return (
		<>
			<div className="flex flex-col min-h-screen w-full">
				<div className="hidden flex-col md:flex">
					<div className="flex items-center justify-between space-y-2">
						<h2 className="text-3xl font-bold tracking-tight">
							E-Comm Dashboard
						</h2>
					</div>
					<div className="flex-1 space-y-4 p-8 pt-6">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
									<CardTitle className="text-sm font-medium ">
										Active emergencies:{" "}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{openEmergenciesCount}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
									<CardTitle className="text-sm font-medium ">
										Resolved emergencies:{" "}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{resolvedEmergenciesCount}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
									<CardTitle className="text-sm font-medium ">
										Total emergencies today:{" "}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									{getTodaysEmergenciesCount()}
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
									<CardTitle className="text-sm font-medium ">
										Placeholder:{" "}
									</CardTitle>
								</CardHeader>
								<CardContent className="text-2xl font-bold text-left">
									0 (placeholder)
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
								<CardHeader className="flex flex-row items-center text-left justify-between">
									<CardTitle className="text-xl font-bold w-fit">
										Emergency Reports
									</CardTitle>
									<button
										onClick={() =>
											addLocation(generateRandomEmergencyLocation())
										}
										className="flex items-center justify-center h-8 w-8 p-0"
									>
										<Plus size={16} />
									</button>
								</CardHeader>
								<CardContent className="h-[50dvh]">
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
						<div className="flex-1 space-x-2">
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
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
