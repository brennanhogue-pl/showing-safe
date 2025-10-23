"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Download, DollarSign } from "lucide-react";
import { AdminPolicyWithDetails, Claim, AdminClaimWithDetails } from "@/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UsersDataTable } from "@/components/admin/UsersDataTable";
import { createPoliciesColumns } from "@/components/admin/PoliciesTableColumns";
import PolicyDetailsDialog from "@/components/admin/PolicyDetailsDialog";
import ClaimDetailsDialog from "@/components/admin/ClaimDetailsDialog";
import { StatsCardsSkeleton, DataTableSkeleton } from "@/components/skeletons/DashboardSkeleton";

export default function PoliciesManagementPage() {
  const { profile, session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [policies, setPolicies] = useState<AdminPolicyWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPolicies, setSelectedPolicies] = useState<AdminPolicyWithDetails[]>([]);
  const [selectedPolicy, setSelectedPolicy] = useState<AdminPolicyWithDetails | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [showClaimDialog, setShowClaimDialog] = useState(false);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  // Fetch policies
  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchPolicies();
    }
  }, [authLoading, profile]);

  const fetchPolicies = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch("/api/admin/policies", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Failed to fetch policies");
      }

      const data = await response.json();
      setPolicies(data.policies || []);
    } catch (err) {
      console.error("Error fetching policies:", err);
      setError(err instanceof Error ? err.message : "Failed to load policies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewDetails = (policy: AdminPolicyWithDetails) => {
    setSelectedPolicy(policy);
    setShowDetailsDialog(true);
  };

  const handleViewClaims = (policy: AdminPolicyWithDetails) => {
    // TODO: Navigate to claims page filtered by this policy
    router.push(`/dashboard/admin/claims?policy_id=${policy.id}`);
  };

  const handleExportPolicies = () => {
    // TODO: Implement export to CSV
    alert("Export functionality coming soon!");
  };

  const handleClaimClick = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowClaimDialog(true);
  };

  const handleApproveClaim = async (note?: string) => {
    if (!selectedClaim) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/claims/${selectedClaim.id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ adminNote: note }),
      });

      if (!response.ok) {
        throw new Error("Failed to approve claim");
      }

      // Refresh policies to get updated claim status
      await fetchPolicies();
      setShowClaimDialog(false);
      setSelectedClaim(null);
    } catch (err) {
      console.error("Error approving claim:", err);
      alert(err instanceof Error ? err.message : "Failed to approve claim");
    }
  };

  const handleDenyClaim = async (reason: string, note?: string) => {
    if (!selectedClaim) return;

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/claims/${selectedClaim.id}/deny`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason, adminNote: note }),
      });

      if (!response.ok) {
        throw new Error("Failed to deny claim");
      }

      // Refresh policies to get updated claim status
      await fetchPolicies();
      setShowClaimDialog(false);
      setSelectedClaim(null);
    } catch (err) {
      console.error("Error denying claim:", err);
      alert(err instanceof Error ? err.message : "Failed to deny claim");
    }
  };

  // Create columns with handlers
  const columns = createPoliciesColumns(handleViewDetails, handleViewClaims);

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-9 w-48 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Stats cards skeleton - 5 cards for policies page */}
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
        <Button onClick={fetchPolicies}>Retry</Button>
      </div>
    );
  }

  // Calculate stats
  const totalPolicies = policies.length;
  const activePolicies = policies.filter((p) => p.status === "active").length;
  const expiredPolicies = policies.filter((p) => p.status === "expired").length;
  const singleUsePolicies = policies.filter((p) => p.coverage_type === "single").length;
  const subscriptionPolicies = policies.filter((p) => p.coverage_type === "subscription").length;

  // Calculate total revenue (rough estimate)
  const totalRevenue = (singleUsePolicies * 99) + (subscriptionPolicies * 99);
  const monthlyRecurring = subscriptionPolicies * 99;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policies</h1>
          <p className="text-muted-foreground mt-1">
            Manage all insurance policies and coverage
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedPolicies.length > 0 && (
            <Button
              variant="outline"
              onClick={handleExportPolicies}
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              Export ({selectedPolicies.length})
            </Button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total Policies</p>
          <p className="text-2xl font-bold">{totalPolicies}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {singleUsePolicies} single • {subscriptionPolicies} subscription
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Active</p>
          <p className="text-2xl font-bold text-green-600">{activePolicies}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((activePolicies / totalPolicies) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Expired</p>
          <p className="text-2xl font-bold text-gray-600">{expiredPolicies}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {((expiredPolicies / totalPolicies) * 100).toFixed(1)}% of total
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Total Revenue</p>
          </div>
          <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">All time</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Monthly Recurring</p>
          </div>
          <p className="text-2xl font-bold">${monthlyRecurring.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground mt-1">MRR</p>
        </Card>
      </div>

      {/* Policies Table */}
      <Card className="p-6">
        <UsersDataTable
          columns={columns}
          data={policies}
          searchPlaceholder="Filter by address..."
          searchColumn="property_address"
          onSelectionChange={setSelectedPolicies}
          showRoleFilter={false}
        />
      </Card>

      {/* Details Dialog */}
      <PolicyDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        policy={selectedPolicy}
        onClaimClick={handleClaimClick}
      />

      {/* Claim Details Dialog */}
      <ClaimDetailsDialog
        open={showClaimDialog}
        onOpenChange={setShowClaimDialog}
        claim={selectedClaim as AdminClaimWithDetails}
        onApprove={handleApproveClaim}
        onDeny={handleDenyClaim}
      />
    </div>
  );
}
