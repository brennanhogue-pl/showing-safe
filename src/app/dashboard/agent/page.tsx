"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter, useSearchParams } from "next/navigation";
import { useAgentSubscription } from "@/hooks/useAgentSubscription";
import { usePolicies } from "@/hooks/usePolicies";
import { useClaims } from "@/hooks/useClaims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, FileText, CheckCircle, Clock, Plus, XCircle } from "lucide-react";
import AgentSubscriptionCard from "@/components/agent/AgentSubscriptionCard";
import AgentClaimDialog from "@/components/agent/AgentClaimDialog";
import BuyCoverageDialog from "@/components/BuyCoverageDialog";
import FileClaimDialog from "@/components/FileClaimDialog";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AgentDashboard() {
  const { profile, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { subscription, isLoading: subscriptionLoading } = useAgentSubscription();
  const { policies, isLoading: policiesLoading } = usePolicies();
  const { claims, isLoading: claimsLoading } = useClaims();

  const [showSubscriptionClaim, setShowSubscriptionClaim] = useState(false);
  const [showBuyCoverage, setShowBuyCoverage] = useState(false);
  const [showFileClaim, setShowFileClaim] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  // Check for subscription status in URL
  useEffect(() => {
    const subscriptionStatus = searchParams?.get("subscription");
    if (subscriptionStatus === "success") {
      setShowSuccessAlert(true);
      // Clear the URL parameter after 5 seconds
      setTimeout(() => {
        setShowSuccessAlert(false);
        router.replace("/dashboard/agent");
      }, 5000);
    } else if (subscriptionStatus === "cancelled") {
      setShowCancelAlert(true);
      // Clear the URL parameter after 5 seconds
      setTimeout(() => {
        setShowCancelAlert(false);
        router.replace("/dashboard/agent");
      }, 5000);
    }
  }, [searchParams, router]);

  if (authLoading || subscriptionLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  // Redirect if not agent
  if (profile && profile.role !== "agent") {
    const dashboardPath =
      profile.role === "admin" ? "/dashboard/admin" : "/dashboard/homeowner";
    router.push(dashboardPath);
    return null;
  }

  // Calculate stats
  const activePolicies = policies.filter((p) => {
    const expiryDate = new Date(p.created_at);
    expiryDate.setDate(expiryDate.getDate() + 90);
    return p.status === "active" && expiryDate > new Date();
  }).length;

  // Separate claims by type
  const subscriptionClaims = claims.filter((c) => c.claim_type === "agent_subscription");
  const listingClaims = claims.filter(
    (c) => c.claim_type === "agent_listing" || c.claim_type === "homeowner_showing"
  );

  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const approvedClaims = claims.filter((c) => c.status === "approved").length;
  const totalClaims = claims.length;

  const isLoading = policiesLoading || claimsLoading;

  return (
    <div className="space-y-6">
      {/* Success/Cancel Alerts */}
      {showSuccessAlert && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Subscription activated successfully! You can now file unlimited claims up to $1,000 per incident.
          </AlertDescription>
        </Alert>
      )}

      {showCancelAlert && (
        <Alert className="bg-amber-50 border-amber-200">
          <XCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Subscription checkout was cancelled. You can try again anytime.
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {profile?.full_name || "Agent"}! Manage your subscription and listings.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {subscription?.canFileClaims && (
              <DropdownMenuItem onClick={() => setShowSubscriptionClaim(true)}>
                <FileText className="mr-2 h-4 w-4" />
                File Subscription Claim
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setShowBuyCoverage(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Protect a Listing
            </DropdownMenuItem>
            {activePolicies > 0 && (
              <DropdownMenuItem onClick={() => setShowFileClaim(true)}>
                <FileText className="mr-2 h-4 w-4" />
                File Listing Claim
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Protected Listings</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">{policies.length} total policies</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaims}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedClaims}</div>
            <p className="text-xs text-muted-foreground">Successfully processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims}</div>
            <p className="text-xs text-muted-foreground">All time submissions</p>
          </CardContent>
        </Card>
      </div>

      {/* Agent Subscription Section */}
      <Card>
        <CardHeader>
          <CardTitle>Agent Subscription</CardTitle>
          <p className="text-sm text-muted-foreground">
            $9.99/month for unlimited claims up to $1,000 per incident during showings
          </p>
        </CardHeader>
        <CardContent>
          <AgentSubscriptionCard />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Claims</CardTitle>
          </CardHeader>
          <CardContent>
            {subscriptionClaims.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No subscription claims yet
                </p>
                {subscription?.canFileClaims && (
                  <Button onClick={() => setShowSubscriptionClaim(true)} size="sm">
                    File Your First Claim
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {subscriptionClaims.slice(0, 3).map((claim) => {
                  const statusConfig = {
                    pending: { color: "text-amber-600", label: "Pending" },
                    approved: { color: "text-green-600", label: "Approved" },
                    denied: { color: "text-red-600", label: "Denied" },
                  };
                  const config = statusConfig[claim.status];

                  return (
                    <div
                      key={claim.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{claim.damaged_items}</p>
                        <p className="text-xs text-muted-foreground">
                          {claim.homeowner_address} •{" "}
                          <span className={config.color}>{config.label}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Protected Listings</CardTitle>
          </CardHeader>
          <CardContent>
            {policies.length === 0 ? (
              <div className="text-center py-6">
                <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">No protected listings yet</p>
                <Button onClick={() => setShowBuyCoverage(true)} size="sm">
                  Protect Your First Listing
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {policies.slice(0, 3).map((policy) => {
                  const expiryDate = new Date(policy.created_at);
                  expiryDate.setDate(expiryDate.getDate() + 90);
                  const isExpired = expiryDate < new Date();

                  return (
                    <div
                      key={policy.id}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{policy.property_address}</p>
                        <p className="text-xs text-muted-foreground">
                          {policy.coverage_type === "single" ? "Single-Use" : "Subscription"} •{" "}
                          {isExpired ? "Expired" : "Active"}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <AgentClaimDialog open={showSubscriptionClaim} onOpenChange={setShowSubscriptionClaim} />
      <BuyCoverageDialog open={showBuyCoverage} onOpenChange={setShowBuyCoverage} />
      <FileClaimDialog trigger={null} open={showFileClaim} onOpenChange={setShowFileClaim} />
    </div>
  );
}
