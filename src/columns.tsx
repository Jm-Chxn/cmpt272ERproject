import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type EmergencyLocation, useLocations } from "./hooks/locations";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
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

export const columns: ColumnDef<EmergencyLocation>[] = [
	{
		accessorKey: "location.place",
		header: "Location",
	},
	{
		accessorKey: "emergencyType",
		header: "Type",
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
		header: "Time Reported",
	},
	{
		accessorKey: "status",
		header: "Status",
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
						<SheetContent style={{ zIndex: 1000 }}>
							<SheetHeader>
								<SheetTitle>Incident Details</SheetTitle>
							</SheetHeader>
							<SheetDescription>
								<Card>
                                    <CardContent className="space-y-4">
                                        <img src={location.pictureLink} alt="Incident" className="mb-4"/>
                                        <div className="space-y-2">
                                            <div>
                                                <p className="text-l font-bold">Location:</p>
                                                <p>{location.location.place}</p>
                                            </div>
                                            <div>
                                                <p className="text-l font-bold">Time:</p>
                                                <p>{location.formattedTime}</p>
                                            </div>
                                            <div>
                                                <p className="text-l font-bold">Witness Name:</p>
                                                <p>{location.witness.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-l font-bold">Witness Phone Number:</p>
                                                <p>{location.witness.phoneNumber}</p>
                                            </div>
                                            <div>
                                                <p className="text-l font-bold">Comment:</p>
                                                <p>{location.comment}</p>
                                            </div>
                                            <div>
                                                <p className="text-l font-bold">Status:</p>
                                                <p>{location.status}</p>
                                            </div>
                                        </div>
                                    </CardContent>
								</Card>
							</SheetDescription>
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
