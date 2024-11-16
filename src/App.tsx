import "./App.css";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	AlertTriangle,
	Heart,
	Moon,
	Plus,
	Siren,
	Sun,
	Timer,
} from "lucide-react";
import { columns } from "./columns";
import LeafletMap from "./components/LeafletMap";
import EmergencyForm from "./components/EmergencyForm";
import { DataTable } from "./components/ui/data-table";
import { ScrollArea } from "./components/ui/scroll-area";
import {
	Dialog,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	type EmergencyLocation,
	generateRandomEmergencyLocation,
	useLocations,
} from "./hooks/locations";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings2 } from "lucide-react";
import React from "react";
import { columns as allColumns } from "./columns";

import { VisibilityState } from "@tanstack/react-table";
import { DataTableViewOptions } from "./components/ui/view-options";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";


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
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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

	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
	const table = useReactTable({
		data: viewableLocations,
		columns,
		state: {
			columnVisibility,
		},
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
	});

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
								<CardTitle className="text-sm font-medium">
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
								<CardTitle className="text-sm font-medium">
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
								<CardTitle className="text-sm font-medium">
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
								<CardTitle className="text-sm font-medium">
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
								<div className="flex justify-end items-center space-x-3">
									{/*<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="outline" className="flex items-center leading-none">
												<Settings2 className="h-8 w-8 text-emerald-500" />View
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											{ Empty for now }
								</DropdownMenuContent>
							</DropdownMenu>*/}
									<DataTableViewOptions table={table} />
									<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
										<DialogTrigger asChild>
											<Button variant="outline" className="flex items-center leading-none">
												<Plus className="h-8 w-8 text-blue-400" />
												New Report
											</Button>
										</DialogTrigger>
										<EmergencyForm
											onSubmit={(data) => {
												addLocation(data);
												setIsDialogOpen(false);
											}}
											onClose={() => setIsDialogOpen(false)}
										/>
									</Dialog>
								</div>
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
					</div >
					<div className="flex justify-center space-x-2">
						<Button
							className="flex items-center"
							variant="secondary"
							onClick={() =>
								removeLocation(
									locations[Math.floor(Math.random() * locations.length)],
								)
							}
						>
							Remove Random
						</Button>
						<Button
							onClick={toggleDarkMode}
							variant="secondary"
							className="ml-auto flex items-center"
						>
							{isDarkMode ? <Moon /> : <Sun />}
						</Button>
					</div>
				</div >
			</div >
		</>
	);
}

export default App;

