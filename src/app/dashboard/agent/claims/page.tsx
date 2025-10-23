"use client";

import { useClaims } from "@/hooks/useClaims";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus } from "lucide-react";
import AgentClaimDialog from "@/components/agent/AgentClaimDialog";
import FileClaimDialog from "@/components/FileClaimDialog";
import { useState } from "react";
import { useAgentSubscription } from "@/hooks/useAgentSubscription";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AgentClaimsPage() {
  const { claims, isLoading } = useClaims();
  const { subscription } = useAgentSubscription();
  const [showSubscriptionClaim, setShowSubscriptionClaim] = useState(false);
  const [showListingClaim, setShowListingClaim] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="ml-3 text-muted-foreground">Loading claims...</p>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pending" },
      approved: { variant: "default" as const, label: "Approved" },
      denied: { variant: "destructive" as const, label: "Denied" },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getClaimTypeLabel = (claimType: string) => {
    switch (claimType) {
      case "agent_subscription":
        return "Subscription Claim";
      case "agent_listing":
        return "Listing Claim";
      default:
        return "Claim";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Claims</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all your claims
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              File Claim
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {subscription?.canFileClaims && (
              <DropdownMenuItem onClick={() => setShowSubscriptionClaim(true)}>
                <FileText className="mr-2 h-4 w-4" />
                File Subscription Claim
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => setShowListingClaim(true)}>
              <FileText className="mr-2 h-4 w-4" />
              File Listing Claim
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {claims.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Claims Yet</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
              You haven&apos;t filed any claims yet. File a claim when an incident occurs during a showing.
            </p>
            {subscription?.canFileClaims && (
              <Button onClick={() => setShowSubscriptionClaim(true)}>
                File Your First Claim
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <Card key={claim.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{claim.damaged_items}</CardTitle>
                      {getStatusBadge(claim.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {getClaimTypeLabel(claim.claim_type)} •{" "}
                      {new Date(claim.incident_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Property</p>
                    <p className="text-sm">
                      {claim.homeowner_address || claim.policies?.property_address || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Description</p>
                    <p className="text-sm">{claim.description}</p>
                  </div>
                  {claim.max_payout_amount && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Max Payout</p>
                      <p className="text-sm">
                        ${claim.max_payout_amount.toLocaleString()}
                      </p>
                    </div>
                  )}
                  {claim.homeowner_name && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Homeowner</p>
                      <p className="text-sm">{claim.homeowner_name}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Submitted</p>
                    <p className="text-sm">
                      {new Date(claim.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AgentClaimDialog
        open={showSubscriptionClaim}
        onOpenChange={setShowSubscriptionClaim}
      />
      <FileClaimDialog
        trigger={null}
        open={showListingClaim}
        onOpenChange={setShowListingClaim}
      />
    </div>
  );
}
