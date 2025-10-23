"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminPolicyWithDetails } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreVertical, Eye, FileText, DollarSign, CheckCircle, XCircle, Clock } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "active":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Active
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getCoverageTypeBadge = (type: string) => {
  switch (type) {
    case "single":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Single-Use</Badge>;
    case "subscription":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Subscription</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};

const getRoleBadgeColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 border-purple-200";
    case "agent":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "homeowner":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const createPoliciesColumns = (
  onViewDetails: (policy: AdminPolicyWithDetails) => void,
  onViewClaims: (policy: AdminPolicyWithDetails) => void
): ColumnDef<AdminPolicyWithDetails>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "property_address",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Property Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="max-w-[300px]">
        <div className="font-medium truncate">{row.getValue("property_address")}</div>
        <div className="text-xs text-muted-foreground">ID: {row.original.id.slice(0, 8)}...</div>
      </div>
    ),
  },
  {
    accessorKey: "user",
    header: "User",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user?.full_name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
          {user?.role && (
            <Badge className={`${getRoleBadgeColor(user.role)} text-xs mt-1`}>
              {user.role}
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "coverage_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("coverage_type") as string;
      return getCoverageTypeBadge(type);
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return getStatusBadge(status);
    },
  },
  {
    accessorKey: "claims_count",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Claims
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const count = row.getValue("claims_count") as number;
      return (
        <div className="text-center">
          {count > 0 ? (
            <Badge variant="outline" className="font-mono">
              {count}
            </Badge>
          ) : (
            <span className="text-muted-foreground">0</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("created_at"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "expiry_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expires
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.expiry_date || "");
      const isExpired = date < new Date();
      return (
        <div className={isExpired ? "text-red-600" : ""}>
          {date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const policy = row.original;
      const hasClaims = (policy.claims_count || 0) > 0;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(policy)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {hasClaims && (
              <DropdownMenuItem onClick={() => onViewClaims(policy)}>
                <FileText className="mr-2 h-4 w-4" />
                View Claims ({policy.claims_count})
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <DollarSign className="mr-2 h-4 w-4" />
              View Stripe Payment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
