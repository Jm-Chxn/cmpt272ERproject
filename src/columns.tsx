import { ColumnDef } from "@tanstack/react-table";
import { EmergencyLocation, useLocations } from "./hooks/locations";
import { useState } from "react";

import { MoreHorizontal, LineChart, Trash2, ListCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import { Card, CardContent } from "@/components/ui/card";

export const columns: ColumnDef<EmergencyLocation>[] = [
	{
		accessorKey: "location.place",
		header: "Location",
	},
	{
		accessorKey: "emergencyType",
		header: "Type",
	},
	{
		accessorKey: "formattedTime",
		header: "Time Reported",
	},
	{
		accessorKey: "status",
		header: "Status",
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const location = row.original;
			const [isDrawerOpen, setIsDrawerOpen] = useState(false);
			const { markAsResolved } = useLocations();

			return (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => markAsResolved(location.id)}>
								<ListCheck className="h-4 w-4" />
								Mark as resolved
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setIsDrawerOpen(true)}>
								<LineChart className="h-4 w-4" />
								View details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => {
									/*Add delete functionality here. Does nothing for now*/
								}}
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
						<DrawerContent style={{ zIndex: 1000 }}>
							<DrawerHeader>
								<DrawerTitle>
									<h2 className="text-3xl font-bold tracking-tight">
										Incident Details
									</h2>
								</DrawerTitle>
							</DrawerHeader>
							<DrawerDescription>
								<Card>
									<CardContent>
										<img src={location.pictureLink} alt="Incident Image" />
									</CardContent>
								</Card>
							</DrawerDescription>
						</DrawerContent>
					</Drawer>
				</>
			);
		},
	},
];
