"use client";

import { ColumnDef } from "@tanstack/react-table";
import { AdminClaimWithDetails } from "@/types";
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
import { ArrowUpDown, MoreVertical, Eye, CheckCircle, XCircle, Clock, DollarSign, FileText } from "lucide-react";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "approved":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Approved
        </Badge>
      );
    case "denied":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Denied
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getClaimTypeBadge = (type: string) => {
  switch (type) {
    case "homeowner_showing":
      return <Badge className="bg-green-100 text-green-800 border-green-200">Homeowner</Badge>;
    case "agent_subscription":
      return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Agent Sub</Badge>;
    case "agent_listing":
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">Agent Listing</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};

export const createClaimsColumns = (
  onViewDetails: (claim: AdminClaimWithDetails) => void,
  onApproveClaim: (claim: AdminClaimWithDetails) => void,
  onDenyClaim: (claim: AdminClaimWithDetails) => void
): ColumnDef<AdminClaimWithDetails>[] => [
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
    accessorKey: "damaged_items",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Claim Details
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const claim = row.original;
      return (
        <div className="max-w-[250px]">
          <div className="font-medium truncate">{claim.damaged_items}</div>
          <div className="text-xs text-muted-foreground truncate">
            {claim.claim_type === "agent_subscription"
              ? claim.homeowner_address
              : claim.policy?.property_address || "N/A"}
          </div>
          <div className="text-xs text-muted-foreground">ID: {claim.id.slice(0, 8)}...</div>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Submitted By",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div>
          <div className="font-medium">{user?.full_name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{user?.email}</div>
        </div>
      );
    },
  },
  {
    accessorKey: "claim_type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("claim_type") as string;
      return getClaimTypeBadge(type);
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
    accessorKey: "max_payout_amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = row.getValue("max_payout_amount") as number | null;
      return (
        <div className="font-medium">
          {amount ? `$${amount.toLocaleString()}` : "—"}
        </div>
      );
    },
  },
  {
    accessorKey: "incident_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Incident Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("incident_date"));
      return <div>{date.toLocaleDateString()}</div>;
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
          Submitted
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
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const claim = row.original;
      const isPending = claim.status === "pending";
      const hasProof = claim.proof_url || claim.showing_proof_url;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onViewDetails(claim)}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            {hasProof && (
              <DropdownMenuItem
                onClick={() => window.open(claim.proof_url || claim.showing_proof_url || "", "_blank")}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Proof
              </DropdownMenuItem>
            )}
            {isPending && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => onApproveClaim(claim)}
                  className="text-green-600"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Approve Claim
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => onDenyClaim(claim)}
                  className="text-red-600"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Deny Claim
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
