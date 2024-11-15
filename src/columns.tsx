import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type EmergencyLocation, useLocations } from "./hooks/locations";
import { IncidentDetails } from "./components/IncidentDetails";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { LineChart, ListCheck, MoreVertical, Trash2 } from "lucide-react";
import { checkPassword } from "./lib/MD5";

import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MapPin, Clock, User, Phone, MessageSquare, AlertTriangle, ArrowUpDown } from 'lucide-react'


export const columns: ColumnDef<EmergencyLocation>[] = [
	{
		accessorKey: "location.place",
		header: ({ column }) => {
			return (
				<Button
					variant={getStatusBadgeVariant(status)}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border border-transparent hover:border-gray-400 bg-transparent hover:bg-transparent focus-visible:bg-transparent"
				>
					Location
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "emergencyType",
		header: ({ column }) => {
			return (
				<Button
					variant={getStatusBadgeVariant(status)}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border border-transparent hover:border-gray-400 bg-transparent hover:bg-transparent focus-visible:bg-transparent"
				>
					Type
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const type = row.getValue("emergencyType") as string;
			return (
				<Badge
					variant="outline"
					className="rounded-full px-3 py-1 text-xs font-semibold"
				>
					{type}
				</Badge>
			);
		},
	},
	{
		accessorKey: "formattedTime",
		header: ({ column }) => {
			return (
				<Button
					variant={getStatusBadgeVariant(status)}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border border-transparent hover:border-gray-400 bg-transparent hover:bg-transparent focus-visible:bg-transparent"
				>
					Time Reported
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			)
		},
	},
	{
		accessorKey: "status",
		header: ({ column }) => {
			return (
				<Button
					variant={getStatusBadgeVariant(status)}
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					className="border border-transparent hover:border-gray-400 bg-transparent hover:bg-transparent focus-visible:bg-transparent"
				>
					Status
					<ArrowUpDown className="h-4 w-4" />
				</Button>
			)
		},
		cell: ({ row }) => {
			const status = row.getValue("status") as string;
			return (
				<Badge
					variant={getStatusBadgeVariant(status)}
					className="rounded-full px-3 py-0.5 text-xs font-semibold"
				>
					{status}
				</Badge>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const location = row.original;
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const [isSheetOpen, setIsSheetOpen] = useState(false);
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { markAsResolved, removeLocation } = useLocations();

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
							<DropdownMenuItem
								onClick={async () => {
									if (await checkPassword()) {
										markAsResolved(location.id);
									}
								}}
							>
								<ListCheck className="h-4 w-4" />
								Mark as resolved
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
								<LineChart className="h-4 w-4" />
								View details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={async () => {
									if (await checkPassword()) {
										removeLocation(location);
									}
								}}
							>
								<Trash2 className="h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
						<SheetContent className="w-[400px] sm:w-[540px]">
							<SheetHeader>
								<SheetTitle className="font-bold text-2xl">Incident Details</SheetTitle>
							</SheetHeader>
							<ScrollArea className="h-[calc(100vh-80px)] pr-4">
								<IncidentDetails location={location} />
							</ScrollArea>
						</SheetContent>
					</Sheet>
				</>
			);
		},
	},
];

export function getEmergencyTypeBadgeVariant(
	type: string,
): "default" | "destructive" | "outline" | "secondary" {
	switch (type.toLowerCase()) {
		case "fire":
			return "destructive";
		case "medical":
			return "outline";
		case "shooting":
			return "secondary";
		default:
			return "outline";
	}
}
function getStatusBadgeVariant(
	status: string,
): "default" | "destructive" | "outline" | "secondary" {
	switch (status.toLowerCase()) {
		case "open":
			return "destructive";
		case "resolved":
			return "outline";
		default:
			return "outline";
	}
}
