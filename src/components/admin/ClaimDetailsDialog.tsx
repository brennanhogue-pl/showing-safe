"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AdminClaimWithDetails } from "@/types";
import {
  FileText,
  User,
  MapPin,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Image as ImageIcon,
  AlertCircle,
} from "lucide-react";

interface ClaimDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  claim: AdminClaimWithDetails | null;
  onApprove: (note?: string) => void;
  onDeny: (reason: string, note?: string) => void;
}

export default function ClaimDetailsDialog({
  open,
  onOpenChange,
  claim,
  onApprove,
  onDeny,
}: ClaimDetailsDialogProps) {
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [showDenyForm, setShowDenyForm] = useState(false);
  const [adminNote, setAdminNote] = useState("");
  const [denyReason, setDenyReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!claim) return null;

  const isPending = claim.status === "pending";
  const incidentDate = new Date(claim.incident_date);
  const submittedDate = new Date(claim.created_at);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "denied":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case "denied":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Denied</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800 border-amber-200">Pending Review</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    try {
      await onApprove(adminNote || undefined);
      setAdminNote("");
      setShowApproveForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeny = async () => {
    if (!denyReason.trim()) {
      alert("Please provide a reason for denial");
      return;
    }
    setIsSubmitting(true);
    try {
      await onDeny(denyReason, adminNote || undefined);
      setDenyReason("");
      setAdminNote("");
      setShowDenyForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPropertyAddress = () => {
    if (claim.claim_type === "agent_subscription") {
      return claim.homeowner_address || "N/A";
    }
    return claim.policy?.property_address || "N/A";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <DialogTitle>Claim Details</DialogTitle>
              <DialogDescription>
                Claim ID: {claim.id}
              </DialogDescription>
            </div>
            {getStatusBadge(claim.status)}
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Overview */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {getStatusIcon(claim.status)}
            <div className="flex-1">
              <p className="text-sm font-medium">Claim Status</p>
              <p className="text-xs text-muted-foreground">
                {claim.status === "pending" && "Awaiting admin review"}
                {claim.status === "approved" && "This claim has been approved"}
                {claim.status === "denied" && "This claim has been denied"}
              </p>
            </div>
          </div>

          {/* Claim Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Claim Information</h3>
            </div>
            <div className="space-y-3 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Claim Type</p>
                <Badge className={
                  claim.claim_type === "agent_subscription"
                    ? "bg-blue-100 text-blue-800 border-blue-200"
                    : claim.claim_type === "agent_listing"
                    ? "bg-purple-100 text-purple-800 border-purple-200"
                    : "bg-green-100 text-green-800 border-green-200"
                }>
                  {claim.claim_type === "agent_subscription" && "Agent Subscription"}
                  {claim.claim_type === "agent_listing" && "Agent Listing"}
                  {claim.claim_type === "homeowner_showing" && "Homeowner Showing"}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Damaged Items</p>
                <p className="text-sm font-medium">{claim.damaged_items}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{claim.description}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Supra Showing Number</p>
                <p className="text-sm font-mono">{claim.supra_showing_number}</p>
              </div>
              {claim.max_payout_amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Max Payout Amount</p>
                  <p className="text-lg font-bold text-green-600">
                    ${claim.max_payout_amount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Property/Location */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Property Information</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Address</p>
                <p className="text-sm font-medium">{getPropertyAddress()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* User Information */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Submitted By</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="text-sm font-medium">{claim.user?.full_name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{claim.user?.email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Type</p>
                <Badge>{claim.user?.role || "N/A"}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Agent-Specific Information */}
          {(claim.claim_type === "agent_subscription" || claim.claim_type === "agent_listing") && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">At-Fault Party Information</h3>
                </div>
                <div className="space-y-2 pl-6">
                  <div>
                    <p className="text-sm text-muted-foreground">At-Fault Party</p>
                    <Badge>{claim.at_fault_party || "N/A"}</Badge>
                  </div>
                  {claim.at_fault_name && (
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{claim.at_fault_name}</p>
                    </div>
                  )}
                  {claim.at_fault_email && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{claim.at_fault_email}</p>
                    </div>
                  )}
                  {claim.at_fault_phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{claim.at_fault_phone}</p>
                    </div>
                  )}
                </div>
              </div>

              {claim.claim_type === "agent_subscription" && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <User className="w-4 h-4 text-muted-foreground" />
                    <h3 className="font-semibold">Homeowner Information</h3>
                  </div>
                  <div className="space-y-2 pl-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="text-sm font-medium">{claim.homeowner_name || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{claim.homeowner_email || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="text-sm font-medium">{claim.homeowner_phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              )}

              <Separator />
            </>
          )}

          {/* Timeline */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-semibold">Timeline</h3>
            </div>
            <div className="space-y-2 pl-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Incident Date</p>
                  <p className="text-sm font-medium">{incidentDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Submitted</p>
                  <p className="text-sm font-medium">{submittedDate.toLocaleDateString()}</p>
                  <p className="text-xs text-muted-foreground">{submittedDate.toLocaleTimeString()}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Proof */}
          {(claim.proof_url || claim.showing_proof_url) && (
            <>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  <h3 className="font-semibold">Supporting Documents</h3>
                </div>
                <div className="pl-6 space-y-2">
                  {claim.proof_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(claim.proof_url || "", "_blank")}
                      className="w-full"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      View Damage Proof
                    </Button>
                  )}
                  {claim.showing_proof_url && (
                    <Button
                      variant="outline"
                      onClick={() => window.open(claim.showing_proof_url || "", "_blank")}
                      className="w-full"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      View Showing Proof
                    </Button>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Admin Actions */}
          {isPending && !showApproveForm && !showDenyForm && (
            <div className="flex gap-3">
              <Button
                onClick={() => setShowApproveForm(true)}
                className="flex-1 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Claim
              </Button>
              <Button
                onClick={() => setShowDenyForm(true)}
                variant="destructive"
                className="flex-1"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Deny Claim
              </Button>
            </div>
          )}

          {/* Approve Form */}
          {showApproveForm && (
            <div className="space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-green-900">Approve Claim</h4>
              <div className="space-y-2">
                <Label htmlFor="approve-note">Admin Note (Optional)</Label>
                <Textarea
                  id="approve-note"
                  placeholder="Add any notes about this approval..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? "Approving..." : "Confirm Approval"}
                </Button>
                <Button
                  onClick={() => {
                    setShowApproveForm(false);
                    setAdminNote("");
                  }}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Deny Form */}
          {showDenyForm && (
            <div className="space-y-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-900">Deny Claim</h4>
              <div className="space-y-2">
                <Label htmlFor="deny-reason">Denial Reason *</Label>
                <Textarea
                  id="deny-reason"
                  placeholder="Provide a reason for denying this claim..."
                  value={denyReason}
                  onChange={(e) => setDenyReason(e.target.value)}
                  rows={3}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deny-note">Additional Notes (Optional)</Label>
                <Textarea
                  id="deny-note"
                  placeholder="Add any additional notes..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleDeny}
                  disabled={isSubmitting}
                  variant="destructive"
                  className="flex-1"
                >
                  {isSubmitting ? "Denying..." : "Confirm Denial"}
                </Button>
                <Button
                  onClick={() => {
                    setShowDenyForm(false);
                    setDenyReason("");
                    setAdminNote("");
                  }}
                  variant="outline"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
