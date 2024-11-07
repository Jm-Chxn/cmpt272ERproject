import { ColumnDef } from "@tanstack/react-table";
import { EmergencyLocation } from "./hooks/locations";

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
];
