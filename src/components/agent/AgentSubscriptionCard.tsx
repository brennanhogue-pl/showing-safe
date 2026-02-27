"use client";

import { useAgentSubscription } from "@/hooks/useAgentSubscription";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function AgentSubscriptionCard() {
  const { subscription, isLoading, subscribe, cancelSubscription } = useAgentSubscription();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async () => {
    try {
      setIsProcessing(true);
      setError(null);
      await subscribe();
      // User will be redirected to Stripe Checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start subscription");
      setIsProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel your subscription? You will lose access to filing claims.")) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      await cancelSubscription();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to cancel subscription");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        <p className="ml-3 text-sm text-muted-foreground">Loading subscription...</p>
      </div>
    );
  }

  const getStatusBadge = () => {
    if (!subscription) return null;

    switch (subscription.status) {
      case "active":
        return (
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Clock className="w-3 h-3 mr-1" />
            Inactive
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {subscription?.status === "active" ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Active Subscription</h3>
              <p className="text-sm text-muted-foreground">
                $19.99/month • Unlimited claims up to $1,000 per incident
              </p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm text-blue-900">What&apos;s Covered:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>File unlimited claims for incidents during showings</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Up to $1,000 per claim</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Covers both agent and client damages</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Payout goes directly to homeowner</span>
              </li>
            </ul>
          </div>

          {subscription.subscriptionStart && (
            <p className="text-xs text-muted-foreground">
              Member since {new Date(subscription.subscriptionStart).toLocaleDateString()}
            </p>
          )}

          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isProcessing}
            className="w-full sm:w-auto"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">Subscribe for $19.99/month</h3>
              <p className="text-sm text-muted-foreground">
                Protection for incidents during showings
              </p>
            </div>
            {getStatusBadge()}
          </div>

          <div className="border border-gray-200 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-sm">Benefits:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>File unlimited claims up to $1,000 per incident</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>No claim limits per month or year</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>Covers damages by you or your clients during showings</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                <span>Fast claim processing with direct homeowner payouts</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleSubscribe}
            disabled={isProcessing}
            className="w-full sm:w-auto"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Subscribe Now - $19.99/month"
            )}
          </Button>

          <p className="text-xs text-muted-foreground">
            Cancel anytime. No long-term contracts.
          </p>
        </div>
      )}
    </div>
  );
}
