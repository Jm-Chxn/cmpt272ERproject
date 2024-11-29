import { columns } from "@/columns";
import LeafletMap from "@/components/LeafletMap";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Settings2 } from "lucide-react";
import { useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { type EmergencyLocation, useLocations } from "../hooks/locations";
import EmergencyForm from "./EmergencyForm";
import { DataTable } from "./ui/data-table";

const EmergencyManagement = () => {
	const { viewableLocations } = useLocations();
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const [_selectedLocation, setSelectedLocation] =
		useLocalStorage<EmergencyLocation | null>("selectedLocation", null);

	const handleRowClick = (location: EmergencyLocation) => {
		console.log("Row clicked:", location);
		setSelectedLocation(location);
	};

	return (
		<div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
			<Card>
				<CardHeader className="text-left">
					<CardTitle className="text-xl font-bold">
						Emergency Location Map
					</CardTitle>
				</CardHeader>
				<CardContent>
					<LeafletMap />
				</CardContent>
			</Card>
			<Card>
				<CardHeader className="flex flex-row items-center text-left justify-between pb-3">
					<CardTitle className="text-xl font-bold w-fit">
						Emergency Reports
					</CardTitle>
					<div className="flex justify-end items-center space-x-3">
						<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
							<DialogTrigger asChild>
								<Button
									variant="outline"
									className="flex items-center leading-none"
								>
									<Plus className="h-8 w-8 text-blue-400" />
									New Report
								</Button>
							</DialogTrigger>
							<EmergencyForm
								onClose={() => setIsDialogOpen(false)}
								isOpen={isDialogOpen}
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
							columnVisibility={{}}
							setColumnVisibility={() => {}}
						/>
					</ScrollArea>
				</CardContent>
			</Card>
		</div>
	);
};

export default EmergencyManagement;
