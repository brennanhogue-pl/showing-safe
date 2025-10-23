"use client";

import { ColumnDef } from "@tanstack/react-table";
import { InvitationWithInviter } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreVertical, Mail, Copy, Trash2, CheckCircle, XCircle, Clock } from "lucide-react";

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

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "accepted":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Accepted
        </Badge>
      );
    case "expired":
      return (
        <Badge className="bg-gray-100 text-gray-800 border-gray-200">
          <XCircle className="w-3 h-3 mr-1" />
          Expired
        </Badge>
      );
    case "cancelled":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Cancelled
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

const getInitials = (email: string): string => {
  const username = email.split("@")[0];
  const parts = username.split(/[._-]/);

  if (parts.length === 1) {
    return username.charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

const getNameFromEmail = (email: string): string => {
  const username = email.split("@")[0];
  const parts = username.split(/[._-]/);

  // Capitalize each part
  const formatted = parts.map(part =>
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  ).join(" ");

  return formatted;
};

const getAvatarColor = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-500";
    case "agent":
      return "bg-blue-500";
    case "homeowner":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

export const createInvitationsColumns = (
  onResend: (invitation: InvitationWithInviter) => void,
  onCopyLink: (invitation: InvitationWithInviter) => void,
  onDelete: (invitationId: string) => void
): ColumnDef<InvitationWithInviter>[] => [
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
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Invited User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const email = row.getValue("email") as string;
      const role = row.original.role;
      const initials = getInitials(email);
      const avatarColor = getAvatarColor(role);
      const name = getNameFromEmail(email);

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={undefined} alt={email} />
            <AvatarFallback className={`${avatarColor} text-white font-semibold text-sm`}>
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="font-medium">{name}</div>
            <div className="text-sm text-muted-foreground">{email}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;
      return <Badge className={getRoleBadgeColor(role)}>{role}</Badge>;
    },
    enableHiding: true,
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
    accessorKey: "inviter",
    header: "Invited By",
    cell: ({ row }) => {
      const inviter = row.original.inviter;
      return (
        <div>
          <div className="font-medium">{inviter?.full_name || "N/A"}</div>
          <div className="text-xs text-muted-foreground">{inviter?.email}</div>
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
          Sent
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
    accessorKey: "expires_at",
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
      const date = new Date(row.getValue("expires_at"));
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
      const invitation = row.original;
      const canResend = invitation.status === "pending" || invitation.status === "expired";

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onCopyLink(invitation)}>
              <Copy className="mr-2 h-4 w-4" />
              Copy Invite Link
            </DropdownMenuItem>
            {canResend && (
              <DropdownMenuItem onClick={() => onResend(invitation)}>
                <Mail className="mr-2 h-4 w-4" />
                Resend Invitation
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(invitation.id)}
              className="text-red-600"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Cancel Invitation
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
