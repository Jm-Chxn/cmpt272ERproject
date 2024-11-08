import { ColumnDef } from "@tanstack/react-table";
import { EmergencyLocation, useLocations } from "./hooks/locations";
import { useState } from "react";

import { MoreVertical, LineChart, Trash2, ListCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"
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
		cell: ({ row }) => {
			const type = row.getValue("emergencyType") as string
			return (
			  <Badge 
			  	variant={getEmergencyTypeBadgeVariant(type)}
				className="rounded-full px-3 py-1 text-xs font-semibold"
			  
			  >
				{type}
			  </Badge>
			)
		  },
	},
	{
		accessorKey: "formattedTime",
		header: "Time Reported",
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ row }) => {
			const status = row.getValue("status") as string
			return (
			  <Badge 
			  variant={getStatusBadgeVariant(status)}
			  className="rounded-full px-3 py-0.5 text-xs font-semibold"
			  >
				{status}
			  </Badge>
			)
		  },
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
							<Button variant="ghost" className="h-8 w-8 p-0 bg-transparent">
								<span className="sr-only">Open menu</span>
								<MoreVertical className="h-4 w-4" />
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

function getEmergencyTypeBadgeVariant(type: string): "default" | "destructive" | "outline" | "secondary" {
	switch (type.toLowerCase()) {
	  case "fire":
		return "destructive"
	  case "medical":
		return "outline"
	  case "shooting":
		return "secondary"
	  default:
		return "outline"
	}
}
function getStatusBadgeVariant(status: string): "default" | "destructive" | "outline" | "secondary" {
	switch (status.toLowerCase()) {
	  case "open":
		return "destructive"
	  case "resolved":
		return "outline"
	  default:
		return "outline"
	}
}
