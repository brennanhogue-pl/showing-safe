"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { AdminClaimWithDetails } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { createClaimsColumns } from "@/components/admin/ClaimsTableColumns";
import ClaimDetailsDialog from "@/components/admin/ClaimDetailsDialog";
import { StatsCardsSkeleton, DataTableSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function ClaimsManagementPage() {
  const { profile, session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState<AdminClaimWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClaims, setSelectedClaims] = useState<AdminClaimWithDetails[]>([]);
  const [selectedClaim, setSelectedClaim] = useState<AdminClaimWithDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  // Fetch claims
  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchClaims();
    }
  }, [authLoading, profile]);

  const fetchClaims = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch("/api/admin/claims", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Failed to fetch claims");
      }

      const data = await response.json();
      setClaims(data.claims || []);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError(err instanceof Error ? err.message : "Failed to load claims");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (claim: AdminClaimWithDetails) => {
    setSelectedClaim(claim);
    setShowDetailsDialog(true);
  };

  const handleApproveClaim = async (claim: AdminClaimWithDetails) => {
    setSelectedClaim(claim);
    setShowDetailsDialog(true);
  };

  const handleDenyClaim = async (claim: AdminClaimWithDetails) => {
    setSelectedClaim(claim);
    setShowDetailsDialog(true);
  };

  const handleApproveFromDialog = async (note?: string) => {
    if (!selectedClaim) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/claims/${selectedClaim.id}/approve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          adminNote: note,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to approve claim");
      }

      setSuccessMessage("Claim approved successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowDetailsDialog(false);
      await fetchClaims();
    } catch (err) {
      console.error("Error approving claim:", err);
      alert(err instanceof Error ? err.message : "Failed to approve claim");
    }
  };

  const handleDenyFromDialog = async (reason: string, note?: string) => {
    if (!selectedClaim) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/claims/${selectedClaim.id}/deny`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          reason,
          adminNote: note,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to deny claim");
      }

      setSuccessMessage("Claim denied successfully!");
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowDetailsDialog(false);
      await fetchClaims();
    } catch (err) {
      console.error("Error denying claim:", err);
      alert(err instanceof Error ? err.message : "Failed to deny claim");
    }
  };

  // Create columns with handlers
  const columns = createClaimsColumns(
    handleViewDetails,
    handleApproveClaim,
    handleDenyClaim
  );

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-40 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats cards skeleton - 5 cards for claims page */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-3 w-32 bg-gray-200 rounded animate-pulse" />
            </Card>
          ))}
        </div>

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
        <Button onClick={fetchClaims}>Retry</Button>
      </div>
    );
  }

  // Calculate stats
  const totalClaims = claims.length;
  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const approvedClaims = claims.filter((c) => c.status === "approved").length;
  const deniedClaims = claims.filter((c) => c.status === "denied").length;

  const approvalRate = totalClaims > 0 ? ((approvedClaims / (approvedClaims + deniedClaims)) * 100) : 0;

  // Calculate total payout (approved claims only)
  const totalPayout = claims
    .filter((c) => c.status === "approved" && c.max_payout_amount)
    .reduce((sum, c) => sum + (c.max_payout_amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Success Alert */}
      {successMessage && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims</h1>
          <p className="text-muted-foreground mt-1">
            Review and process all insurance claims
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Claims</p>
          </div>
          <p className="text-2xl font-bold">{totalClaims}</p>
          <p className="text-xs text-muted-foreground mt-1">All time submissions</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-4 h-4 text-amber-600" />
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
          <p className="text-2xl font-bold text-amber-600">{pendingClaims}</p>
          <p className="text-xs text-muted-foreground mt-1">Awaiting review</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <p className="text-sm text-muted-foreground">Approved</p>
          </div>
          <p className="text-2xl font-bold text-green-600">{approvedClaims}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {approvalRate.toFixed(1)}% approval rate
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-4 h-4 text-red-600" />
            <p className="text-sm text-muted-foreground">Denied</p>
          </div>
          <p className="text-2xl font-bold text-red-600">{deniedClaims}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((deniedClaims / totalClaims) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Payout</p>
          </div>
          <p className="text-2xl font-bold">${totalPayout.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">Approved claims</p>
        </Card>
      </div>

      {/* Claims Table */}
      <Card className="p-6">
        <UsersDataTable
          columns={columns}
          data={claims}
          searchPlaceholder="Filter by damaged items..."
          searchColumn="damaged_items"
          onSelectionChange={setSelectedClaims}
          showRoleFilter={false}
        />
      </Card>

      {/* Details Dialog */}
      <ClaimDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        claim={selectedClaim}
        onApprove={handleApproveFromDialog}
        onDeny={handleDenyFromDialog}
      />
    </div>
  );
}
