import { useState } from "react";
import "./App.css";
import LeafletMap from "./components/LeafletMap";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
  } from "@/components/ui/card"
import { Emergency, columns } from "./columns";
import { DataTable } from "./components/ui/data-table";
import {
  generateRandomEmergencyLocation,
  useLocations,
} from "./hooks/locations";


function getData(): Emergency[] {
	// Temporarily hardcoding data for now
	return [
		{
		loc: "123 Main St",
		emergency_type: "Fire",
		report_time: "12:34 PM",
		status: "OPEN",
	  },
	  {
		loc: "456 Elm St",
		emergency_type: "Medical",
		report_time: "1:45 PM",
		status: "OPEN",
	  },
	];
}
function App() {
  const [count, setCount] = useState(0);
  const { addLocation, removeLocation, locations, getTodaysEmergenciesCount } = useLocations();
  const openEmergenciesCount = locations.filter((loc) => loc.status === "OPEN").length;
  const resolvedEmergenciesCount = locations.filter((loc) => loc.status === "RESOLVED").length;
  return (
    <>
	<div className="flex flex-col min-h-screen w-full">
		<div className="hidden flex-col md:flex">
			<div className="flex items-center justify-between space-y-2">
				<h2 className="text-3xl font-bold tracking-tight">E-Comm Dashboard</h2>
			</div>
			<div className="flex-1 space-y-4 p-8 pt-6">
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
							<CardTitle className="text-sm font-medium ">Active emergencys: </CardTitle>
						</CardHeader>
						<CardContent className="text-2xl font-bold text-left">
							{openEmergenciesCount}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
							<CardTitle className="text-sm font-medium ">Resolved emergencys: </CardTitle>
						</CardHeader>
						<CardContent className="text-2xl font-bold text-left">
							{resolvedEmergenciesCount}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
							<CardTitle className="text-sm font-medium ">Total emergencies today: </CardTitle>
						</CardHeader>
						<CardContent className="text-2xl font-bold text-left">
							{getTodaysEmergenciesCount()}
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-left">
							<CardTitle className="text-sm font-medium ">Placeholder: </CardTitle>
						</CardHeader>
						<CardContent className="text-2xl font-bold text-left">
							0 (placeholder)
						</CardContent>
					</Card>
				</div>
				<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
					<Card>
						<CardHeader className="text-left">
							<CardTitle className="text-xl font-bold">Emergency Location Map</CardTitle>
						</CardHeader>
						<CardContent>
							<LeafletMap />
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="text-left">
							<CardTitle className="text-xl font-bold">Emergency Reports</CardTitle>
						</CardHeader>
						<CardContent>
							<DataTable
							// Temporarily hardcoded since columns.tsx is not working
								columns={[
									{ accessorKey: "loc", header: "Location" },
									{ accessorKey: "emergency_type", header: "Type" },
									{ accessorKey: "report_time", header: "Time Reported" },
									{ accessorKey: "status", header: "Status" },
								]}
								data={getData()}
							/>
						</CardContent>
					</Card>
				
				</div>
				
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
			
			</div>
		</div>
	</div>
    </>
  );
}

export default App;