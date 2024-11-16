import "./App.css";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Moon, Plus, Sun } from "lucide-react";
import { columns } from "./columns";
import LeafletMap from "./components/LeafletMap";
import EmergencyForm from "./components/EmergencyForm";
import { DataTable } from "./components/ui/data-table";
import { ScrollArea } from "./components/ui/scroll-area";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { type EmergencyLocation, useLocations } from "./hooks/locations";

import { VisibilityState } from "@tanstack/react-table";
import { DataTableViewOptions } from "./components/ui/view-options";
import { useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { EmergencyStats } from "./components/EmergencyStats";


function App() {
	const {
		addLocation,
		removeLocation,
		locations,
		viewableLocations,
	} = useLocations();

	const [selectedLocation, setSelectedLocation] =
		useState<EmergencyLocation | null>(null);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

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
					<EmergencyStats />
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

