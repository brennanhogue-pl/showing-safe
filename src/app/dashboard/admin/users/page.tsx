"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Plus, Trash2 } from "lucide-react";
import { AdminUserWithDetails } from "@/types";
import CreateUserDialog from "@/components/admin/CreateUserDialog";
import EditUserDialog from "@/components/admin/EditUserDialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { createUsersColumns } from "@/components/admin/UsersTableColumns";
import { StatsCardsSkeleton, DataTableSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function UsersManagementPage() {
  const { profile, session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<AdminUserWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUserWithDetails | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<AdminUserWithDetails[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  // Fetch users
  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchUsers();
    }
  }, [authLoading, profile]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/users/${userToDelete}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Refresh users list
      await fetchUsers();
      setUserToDelete(null);
    } catch (err) {
      console.error("Error deleting user:", err);
      alert(err instanceof Error ? err.message : "Failed to delete user");
    }
  };

  const handleEditUser = (user: AdminUserWithDetails) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };

  const handleBulkDelete = () => {
    if (selectedUsers.length === 0) return;
    setBulkDeleteDialogOpen(true);
  };

  const confirmBulkDelete = async () => {
    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      // Delete users sequentially
      for (const user of selectedUsers) {
        await fetch(`/api/admin/users/${user.id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
      }

      // Refresh users list
      await fetchUsers();
      setSelectedUsers([]);
    } catch (err) {
      console.error("Error deleting users:", err);
      alert(err instanceof Error ? err.message : "Failed to delete users");
    }
  };

  // Create columns with handlers
  const columns = createUsersColumns(handleEditUser, handleDeleteUser);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-64 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-80 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
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
        <Button onClick={fetchUsers}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage all users and their accounts
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedUsers.length > 0 && (
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete ({selectedUsers.length})
            </Button>
          )}
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Create User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Users</p>
          <p className="text-2xl font-bold">{users.length}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active Agents</p>
          <p className="text-2xl font-bold">
            {users.filter((u) => u.role === "agent" && u.agent_subscription_status === "active").length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Homeowners</p>
          <p className="text-2xl font-bold">
            {users.filter((u) => u.role === "homeowner").length}
          </p>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="p-6">
        <UsersDataTable
          columns={columns}
          data={users}
          searchPlaceholder="Search by name or email..."
          searchColumn="email"
          onSelectionChange={setSelectedUsers}
        />
      </Card>

      {/* Dialogs */}
      <CreateUserDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onSuccess={() => {
          setShowCreateDialog(false);
          fetchUsers();
        }}
      />

      {selectedUser && (
        <EditUserDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          user={selectedUser}
          onSuccess={() => {
            setShowEditDialog(false);
            fetchUsers();
          }}
        />
      )}

      {/* Confirmation Dialogs */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />

      <ConfirmationDialog
        open={bulkDeleteDialogOpen}
        onOpenChange={setBulkDeleteDialogOpen}
        onConfirm={confirmBulkDelete}
        title="Delete Multiple Users"
        description={`Are you sure you want to delete ${selectedUsers.length} user(s)? This action cannot be undone.`}
        confirmText="Delete All"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
