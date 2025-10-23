"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";
import { AdminUserWithDetails, UserRole, AgentSubscriptionStatus } from "@/types";

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: AdminUserWithDetails;
  onSuccess: () => void;
}

export default function EditUserDialog({
  open,
  onOpenChange,
  user,
  onSuccess,
}: EditUserDialogProps) {
  const { session } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<UserRole>("homeowner");
  const [agentSubscriptionStatus, setAgentSubscriptionStatus] = useState<AgentSubscriptionStatus>("none");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize form with user data when dialog opens
  useEffect(() => {
    if (open && user) {
      setFullName(user.full_name || "");
      setEmail(user.email);
      setRole(user.role);
      setAgentSubscriptionStatus(user.agent_subscription_status || "none");
      setError(null);
    }
  }, [open, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!fullName.trim()) {
      setError("Full name is required");
      setIsLoading(false);
      return;
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Valid email is required");
      setIsLoading(false);
      return;
    }

    try {
      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch(`/api/admin/users/${user.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          fullName,
          email,
          role,
          agentSubscriptionStatus: role === "agent" ? agentSubscriptionStatus : undefined,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update user");
      }

      // Success!
      onSuccess();
    } catch (err) {
      console.error("Update user error:", err);
      setError(err instanceof Error ? err.message : "Failed to update user");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
          <DialogDescription>
            Update user information and permissions.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              Changing email will update the user&apos;s login credentials
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role *</Label>
            <Select
              value={role}
              onValueChange={(value) => setRole(value as UserRole)}
              disabled={isLoading}
            >
              <SelectTrigger id="role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="homeowner">
                  <div className="flex flex-col items-start">
                    <span>Homeowner</span>
                    <span className="text-xs text-muted-foreground">
                      Can purchase policies and file claims
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="agent">
                  <div className="flex flex-col items-start">
                    <span>Agent</span>
                    <span className="text-xs text-muted-foreground">
                      Can subscribe and protect listings
                    </span>
                  </div>
                </SelectItem>
                <SelectItem value="admin">
                  <div className="flex flex-col items-start">
                    <span>Administrator</span>
                    <span className="text-xs text-muted-foreground">
                      Full system access
                    </span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {role === "agent" && (
            <div className="space-y-2">
              <Label htmlFor="subscriptionStatus">Agent Subscription Status</Label>
              <Select
                value={agentSubscriptionStatus}
                onValueChange={(value) => setAgentSubscriptionStatus(value as AgentSubscriptionStatus)}
                disabled={isLoading}
              >
                <SelectTrigger id="subscriptionStatus">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Manually override subscription status if needed
              </p>
            </div>
          )}

          {/* User Info Summary */}
          <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
            <p className="font-medium">Additional Info:</p>
            <div className="grid grid-cols-2 gap-2 text-muted-foreground">
              <div>
                <span className="font-medium">Policies:</span> {user.policies_count || 0}
              </div>
              <div>
                <span className="font-medium">Claims:</span> {user.claims_count || 0}
              </div>
              <div className="col-span-2">
                <span className="font-medium">Joined:</span>{" "}
                {new Date(user.created_at).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
