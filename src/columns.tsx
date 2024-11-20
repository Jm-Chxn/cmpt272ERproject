import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { type EmergencyLocation, useLocations } from "./hooks/locations";
import { useFormattedTime } from "./hooks/ui-hooks";
import { IncidentDetails } from "./components/IncidentDetails";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { LineChart, ListCheck, MoreVertical, Trash2 } from "lucide-react";
import { checkPassword } from "./lib/MD5";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUpDown } from "lucide-react";
import { PasswordPrompt } from "./components/PasswordPrompt";

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
            );
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
            );
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
        accessorKey: "time",
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
            );
        },
        cell: ({ row }) => {
            const time = row.getValue("time") as number;
            const formattedTime = useFormattedTime(time);
            return <span>{formattedTime}</span>;
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
            );
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
            const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
            const [isDelete, setIsDelete] = useState(false);

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
                            <DropdownMenuItem onClick={() => {
                                setIsPasswordPromptOpen(true)
                                setIsDelete(false)
                            }}>
                                <ListCheck className="h-4 w-4" />
                                Mark as resolved
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setIsSheetOpen(true)}>
                                <LineChart className="h-4 w-4" />
                                View details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setIsPasswordPromptOpen(true)
                                setIsDelete(true)
                            }}>
                                <Trash2 className="h-4 w-4" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <Dialog
                        open={isPasswordPromptOpen}
                        onOpenChange={setIsPasswordPromptOpen}
                    >
                        <PasswordPrompt
                            location={location}
                            onClose={() => setIsPasswordPromptOpen(false)}
                            isDelete={isDelete}
                        />
                    </Dialog>

                    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                        <SheetContent className="w-[400px] sm:w-[540px]">
                            <SheetHeader>
                                <SheetTitle className="font-bold text-2xl">
                                    Incident Details
                                </SheetTitle>
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
