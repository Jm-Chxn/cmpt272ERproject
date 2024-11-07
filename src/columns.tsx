"use client"

import { ColumnDef } from "@tanstack/react-table"

export type Emergency = {
  loc: string
  emergency_type: string
  report_time: string
  status: "OPEN" | "RESOLVED"
}

export const columns: ColumnDef<Emergency>[] = [
  {
    accessorKey: "loc",
    header: "Location",
  },
  {
    accessorKey: "emergency_type",
    header: "Type",
  },
  {
    accessorKey: "report_time",
    header: "Time Reported",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
]
