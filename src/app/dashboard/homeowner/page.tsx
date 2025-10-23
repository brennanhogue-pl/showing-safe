"use client";

import { usePolicies } from "@/hooks/usePolicies";
import { useClaims } from "@/hooks/useClaims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Shield, FileText, CheckCircle, Clock, Plus } from "lucide-react";
import BuyCoverageDialog from "@/components/BuyCoverageDialog";
import FileClaimDialog from "@/components/FileClaimDialog";
import { useState } from "react";

export default function HomeownerDashboard() {
  const { policies, isLoading: policiesLoading } = usePolicies();
  const { claims, isLoading: claimsLoading } = useClaims();
  const [showBuyCoverage, setShowBuyCoverage] = useState(false);
  const [showFileClaim, setShowFileClaim] = useState(false);

  // Calculate stats
  const activePolicies = policies.filter((p) => {
    const expiryDate = new Date(p.created_at);
    expiryDate.setDate(expiryDate.getDate() + 90);
    return p.status === "active" && expiryDate > new Date();
  }).length;

  const pendingClaims = claims.filter((c) => c.status === "pending").length;
  const approvedClaims = claims.filter((c) => c.status === "approved").length;
  const totalClaims = claims.length;

  const isLoading = policiesLoading || claimsLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="ml-3 text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s an overview of your policies and claims.
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Quick Actions
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setShowBuyCoverage(true)}>
              <Shield className="mr-2 h-4 w-4" />
              Buy Coverage
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowFileClaim(true)}>
              <FileText className="mr-2 h-4 w-4" />
              File Claim
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePolicies}</div>
            <p className="text-xs text-muted-foreground">
              {policies.length} total policies
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingClaims}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting review
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedClaims}</div>
            <p className="text-xs text-muted-foreground">
              Successfully processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claims</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClaims}</div>
            <p className="text-xs text-muted-foreground">
              All time submissions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Policies</CardTitle>
          </CardHeader>
          <CardContent>
            {policies.length === 0 ? (
              <div className="text-center py-6">
                <Shield className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No policies yet
                </p>
                <Button onClick={() => setShowBuyCoverage(true)} size="sm">
                  Buy Your First Policy
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {policies.slice(0, 3).map((policy) => {
                  const expiryDate = new Date(policy.created_at);
                  expiryDate.setDate(expiryDate.getDate() + 90);
                  const isExpired = expiryDate < new Date();

                  return (
                    <div key={policy.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {policy.property_address}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {policy.coverage_type === "single" ? "Single-Use" : "Subscription"} • {isExpired ? "Expired" : "Active"}
                        </p>
                      </div>
                    </div>
                  );
                })}
                {policies.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href="/dashboard/homeowner/policies">View All Policies</a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Claims</CardTitle>
          </CardHeader>
          <CardContent>
            {claims.length === 0 ? (
              <div className="text-center py-6">
                <FileText className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">
                  No claims submitted yet
                </p>
                <Button onClick={() => setShowFileClaim(true)} size="sm">
                  File Your First Claim
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {claims.slice(0, 3).map((claim) => {
                  const statusConfig = {
                    pending: { color: "text-amber-600", label: "Pending" },
                    approved: { color: "text-green-600", label: "Approved" },
                    denied: { color: "text-red-600", label: "Denied" },
                  };
                  const config = statusConfig[claim.status];

                  return (
                    <div key={claim.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <FileText className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {claim.damaged_items}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {claim.policies?.property_address} • <span className={config.color}>{config.label}</span>
                        </p>
                      </div>
                    </div>
                  );
                })}
                {claims.length > 3 && (
                  <Button variant="outline" size="sm" className="w-full mt-2" asChild>
                    <a href="/dashboard/homeowner/claims">View All Claims</a>
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Dialogs */}
      <BuyCoverageDialog open={showBuyCoverage} onOpenChange={setShowBuyCoverage} />
      <FileClaimDialog
        trigger={null}
        open={showFileClaim}
        onOpenChange={setShowFileClaim}
      />
    </div>
  );
}
