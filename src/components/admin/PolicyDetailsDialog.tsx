"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { AdminPolicyWithDetails, Claim } from "@/types";
import { Shield, User, MapPin, Calendar, FileText, DollarSign, CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

interface PolicyDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  policy: AdminPolicyWithDetails | null;
  onClaimClick?: (claim: Claim) => void;
}

export default function PolicyDetailsDialog({
  open,
  onOpenChange,
  policy,
  onClaimClick,
}: PolicyDetailsDialogProps) {
  if (!policy) return null;

  const getClaimStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">Denied</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200 text-xs">Pending</Badge>;
      default:
        return <Badge className="text-xs">{status}</Badge>;
    }
  };

  const getClaimTypeLabel = (type: string) => {
    switch (type) {
      case "agent_subscription":
        return "Agent Subscription";
      case "agent_listing":
        return "Agent Listing";
      case "homeowner_showing":
        return "Homeowner Showing";
      default:
        return type;
    }
  };

  const createdDate = new Date(policy.created_at);
  const expiryDate = new Date(policy.expiry_date || "");
  const isExpired = expiryDate < new Date();
  const daysRemaining = Math.ceil((expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "expired":
        return <XCircle className="w-5 h-5 text-gray-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "expired":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Expired</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getCoverageAmount = (type: string) => {
    return type === "single" ? "$1,000,000" : "$1,000,000 (Monthly)";
  };

  const getCoveragePrice = (type: string) => {
    return type === "single" ? "$99 (one-time)" : "$99/month";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle>Policy Details</DialogTitle>
              <DialogDescription>
                Policy ID: {policy.id}
              </DialogDescription>
            </div>
            {getStatusBadge(policy.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Overview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(policy.status)}
            <div className="flex-1">
              <p className="text-sm font-medium">Coverage Status</p>
              <p className="text-xs text-muted-foreground">
                {policy.status === "active" && !isExpired && `${daysRemaining} days remaining`}
                {policy.status === "active" && isExpired && "Expired"}
                {policy.status === "expired" && "This policy has expired"}
                {policy.status === "pending" && "Awaiting payment confirmation"}
              </p>
            </div>
          </div>

          {/* Property Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Property Information</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{policy.property_address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Type</p>
                  <p className="text-sm font-medium capitalize">{policy.coverage_type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Coverage Amount</p>
                  <p className="text-sm font-medium">{getCoverageAmount(policy.coverage_type)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Policy Holder</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{policy.user?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{policy.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Type</p>
                <Badge className={
                  policy.user?.role === "agent"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                  {policy.user?.role || "N/A"}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Policy Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Timeline</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-sm font-medium">{createdDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{createdDate.toLocaleTimeString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Expires</p>
                  <p className={`text-sm font-medium ${isExpired ? "text-red-600" : ""}`}>
                    {expiryDate.toLocaleDateString()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {isExpired ? "Expired" : `${daysRemaining} days remaining`}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Claims Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Claims</h3>
            </div>
            <div className="pl-6 space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Total Claims Filed</p>
                  <p className="text-xs text-muted-foreground">Against this policy</p>
                </div>
                <div className="text-2xl font-bold">{policy.claims_count || 0}</div>
              </div>

              {/* Claims List */}
              {policy.claims && policy.claims.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Filed Claims</p>
                  {policy.claims.map((claim) => {
                    const claimDate = new Date(claim.created_at);
                    return (
                      <Button
                        key={claim.id}
                        variant="outline"
                        className="w-full justify-between h-auto p-3 hover:bg-gray-50"
                        onClick={() => onClaimClick?.(claim)}
                      >
                        <div className="flex flex-col items-start gap-1 flex-1">
                          <div className="flex items-center gap-2 w-full">
                            <p className="text-sm font-medium">{getClaimTypeLabel(claim.claim_type)}</p>
                            {getClaimStatusBadge(claim.status)}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Filed {claimDate.toLocaleDateString()} • {claim.damaged_items}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Payment Information</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Price Paid</p>
                <p className="text-sm font-medium">{getCoveragePrice(policy.coverage_type)}</p>
              </div>
              {policy.stripe_session_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Stripe Session ID</p>
                  <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                    {policy.stripe_session_id}
                  </p>
                </div>
              )}
              {policy.stripe_subscription_id && (
                <div>
                  <p className="text-sm text-muted-foreground">Stripe Subscription ID</p>
                  <p className="text-xs font-mono bg-gray-50 p-2 rounded">
                    {policy.stripe_subscription_id}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
