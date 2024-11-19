"use client";

import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Table } from "@tanstack/react-table";
import { Settings2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
} from "@/components/ui/dropdown-menu";

interface DataTableViewOptionsProps<TData> {
	table: Table<TData>;
}

export function DataTableViewOptions<TData>({
	table,
}: DataTableViewOptionsProps<TData>) {
	const columnNames: { [key: string]: string } = {
		"location.place": "Location",
		emergencyType: "Type",
		time: "Time Reported",
		status: "Status",
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" className="flex items-center leading-none">
					<Settings2 className="h-8 w-8 text-emerald-500" />
					View
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				{table
					.getAllColumns()
					.filter((column) => column.getCanHide() && column.id !== "actions")
					.map((column) => {
						return (
							<DropdownMenuCheckboxItem
								key={column.id}
								className="capitalize"
								checked={column.getIsVisible()}
								onCheckedChange={(value) => column.toggleVisibility(!!value)}
							>
								{columnNames[column.id] || column.id}
							</DropdownMenuCheckboxItem>
						);
					})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
