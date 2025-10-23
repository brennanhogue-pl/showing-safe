"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Plus, Trash2, Mail, Copy, CheckCircle } from "lucide-react";
import { InvitationWithInviter } from "@/types";
import CreateInviteDialog from "@/components/admin/CreateInviteDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { createInvitationsColumns } from "@/components/admin/InvitationsTableColumns";
import { StatsCardsSkeleton, DataTableSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function InvitationsManagementPage() {
  const { profile, session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [invitations, setInvitations] = useState<InvitationWithInviter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedInvitations, setSelectedInvitations] = useState<InvitationWithInviter[]>([]);
  const [copySuccess, setCopySuccess] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  // Fetch invitations
  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchInvitations();
    }
  }, [authLoading, profile]);

  const fetchInvitations = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch("/api/admin/invitations", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Failed to fetch invitations");
      }

      const data = await response.json();
      setInvitations(data.invitations || []);
    } catch (err) {
      console.error("Error fetching invitations:", err);
      setError(err instanceof Error ? err.message : "Failed to load invitations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteInvitation = (invitationId: string) => {
    setInvitationToDelete(invitationId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteInvitation = async () => {
    if (!invitationToDelete) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/invitations/${invitationToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Delete invitation error:", errorText);
        throw new Error(errorText || "Failed to cancel invitation");
      }

      // Refresh invitations list
      await fetchInvitations();
      setInvitationToDelete(null);
    } catch (err) {
      console.error("Error canceling invitation:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel invitation");
    }
  };

  const handleBulkDelete = () => {
    if (selectedInvitations.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      // Delete invitations sequentially
      for (const invitation of selectedInvitations) {
        await fetch(`/api/admin/invitations/${invitation.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }

      // Refresh invitations list
      await fetchInvitations();
      setSelectedInvitations([]);
    } catch (err) {
      console.error("Error canceling invitations:", err);
      alert(err instanceof Error ? err.message : "Failed to cancel invitations");
    }
  };

  const handleResendInvitation = async (invitation: InvitationWithInviter) => {
    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/invitations/${invitation.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to resend invitation");
      }

      setResendSuccess(true);
      setTimeout(() => setResendSuccess(false), 3000);
      await fetchInvitations();
    } catch (err) {
      console.error("Error resending invitation:", err);
      alert(err instanceof Error ? err.message : "Failed to resend invitation");
    }
  };

  const handleCopyInviteLink = (invitation: InvitationWithInviter) => {
    const inviteUrl = `${window.location.origin}/auth/accept-invite?token=${invitation.token}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Create columns with handlers
  const columns = createInvitationsColumns(
    handleResendInvitation,
    handleCopyInviteLink,
    handleDeleteInvitation
  );

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <StatsCardsSkeleton />

        {/* Table skeleton */}
        <DataTableSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchInvitations}>Retry</Button>
      </div>
    );
  }

  const pendingCount = invitations.filter((i) => i.status === "pending").length;
  const acceptedCount = invitations.filter((i) => i.status === "accepted").length;
  const expiredCount = invitations.filter((i) => i.status === "expired").length;

  return (
    <div className="space-y-6">
      {/* Success Alerts */}
      {copySuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Invitation link copied to clipboard!
          </AlertDescription>
        </Alert>
      )}

      {resendSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Invitation resent successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invitations</h1>
          <p className="text-muted-foreground mt-1">
            Send and manage user invitations
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedInvitations.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Cancel ({selectedInvitations.length})
            </Button>
          )}
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Send Invitation
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Invitations</p>
          <p className="text-2xl font-bold">{invitations.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Pending</p>
          <p className="text-2xl font-bold text-amber-600">{pendingCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Accepted</p>
          <p className="text-2xl font-bold text-green-600">{acceptedCount}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-gray-600">{expiredCount}</p>
        </Card>
      </div>

      {/* Invitations Table */}
      <Card className="p-6">
        <UsersDataTable
          columns={columns}
          data={invitations}
          searchPlaceholder="Filter emails..."
          searchColumn="email"
          onSelectionChange={setSelectedInvitations}
        />
      </Card>

      {/* Dialogs */}
      <CreateInviteDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchInvitations();
        }}
      />

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteInvitation}
        title="Cancel Invitation"
        description="Are you sure you want to cancel this invitation? This action cannot be undone."
        confirmText="Cancel Invitation"
        cancelText="Keep Invitation"
        variant="destructive"
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        title="Cancel Multiple Invitations"
        description={`Are you sure you want to cancel ${selectedInvitations.length} invitation(s)? This action cannot be undone.`}
        confirmText="Cancel All"
        cancelText="Keep Invitations"
        variant="destructive"
      />
    </div>
  );
}
