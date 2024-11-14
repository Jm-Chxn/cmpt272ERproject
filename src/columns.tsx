import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type EmergencyLocation, useLocations } from "./hooks/locations";

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
import { MapPin, Clock, User, Phone, MessageSquare, AlertTriangle } from 'lucide-react'


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
						<SheetContent className="w-[400px] sm:w-[540px]">
							<SheetHeader>
							<SheetTitle>Incident Details</SheetTitle>
							</SheetHeader>
							<ScrollArea className="h-[calc(100vh-80px)] pr-4">
							<Card>
								<CardHeader>
								</CardHeader>
								<CardContent className="space-y-6">
								<div className="aspect-video overflow-hidden rounded-md">
									<img 
									src={location.pictureLink} 
									alt="Incident" 
									className="object-cover w-full h-full"
									/>
								</div>
								<div className="grid gap-4">
									<div className="flex items-center space-x-4">
									<MapPin className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Location</p>
										<p className="text-sm text-muted-foreground">{location.location.place}</p>
									</div>
									</div>
									<Separator />
									<div className="flex items-center space-x-4">
									<Clock className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Time Reported</p>
										<p className="text-sm text-muted-foreground">{location.formattedTime}</p>
									</div>
									</div>
									<Separator />
									<div className="flex items-center space-x-4">
									<User className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Witness Name</p>
										<p className="text-sm text-muted-foreground">{location.witness.name}</p>
									</div>
									</div>
									<Separator />
									<div className="flex items-center space-x-4">
									<Phone className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Witness Phone Number</p>
										<p className="text-sm text-muted-foreground">{location.witness.phoneNumber}</p>
									</div>
									</div>
									<Separator />
									<div className="flex items-start space-x-4">
									<MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5" />
									<div>
										<p className="text-sm font-medium">Comment</p>
										<p className="text-sm text-muted-foreground">{location.comment}</p>
									</div>
									</div>
									<Separator />
									<div className="flex items-center space-x-4">
									<AlertTriangle className="w-5 h-5 text-muted-foreground" />
									<div>
										<p className="text-sm font-medium">Status</p>
										<Badge 
										variant={location.status.toLowerCase() === 'open' ? 'destructive' : 'outline'}
										>
										{location.status}
										</Badge>
									</div>
									</div>
								</div>
								</CardContent>
							</Card>
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
