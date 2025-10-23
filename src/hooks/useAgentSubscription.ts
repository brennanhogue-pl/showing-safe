import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AgentSubscription } from "@/types";

export function useAgentSubscription() {
  const { user, profile, session } = useAuth();
  const [subscription, setSubscription] = useState<AgentSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubscription = useCallback(() => {
    if (!user || !profile || profile.role !== "agent") {
      setSubscription(null);
      setIsLoading(false);
      return;
    }

    try {
      // Extract subscription info from profile
      const subscriptionInfo: AgentSubscription = {
        status: profile.agent_subscription_status,
        subscriptionId: profile.agent_subscription_id,
        subscriptionStart: profile.agent_subscription_start,
        canFileClaims: profile.agent_subscription_status === "active",
      };

      setSubscription(subscriptionInfo);
      setError(null);
    } catch (err) {
      console.error("Error loading subscription:", err);
      setError(err instanceof Error ? err.message : "Failed to load subscription");
    } finally {
      setIsLoading(false);
    }
  }, [user, profile]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const subscribe = async () => {
    if (!session) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("/api/agent/subscribe", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create subscription");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error("Error subscribing:", err);
      throw err;
    }
  };

  const cancelSubscription = async () => {
    if (!session) {
      throw new Error("Not authenticated");
    }

    try {
      const response = await fetch("/api/agent/cancel-subscription", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to cancel subscription");
      }

      // Refresh subscription status
      fetchSubscription();
    } catch (err) {
      console.error("Error canceling subscription:", err);
      throw err;
    }
  };

  return {
    subscription,
    isLoading,
    error,
    subscribe,
    cancelSubscription,
    refetch: fetchSubscription,
  };
}
