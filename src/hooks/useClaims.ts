import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Claim } from "@/types";

export function useClaims() {
  const { user, session } = useAuth();
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClaims = useCallback(async () => {
    if (!user || !session) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/claims", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch claims");
      }

      const data = await response.json();
      setClaims(data.claims || []);
      setError(null);
    } catch (err) {
      console.error("Error fetching claims:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch claims");
    } finally {
      setIsLoading(false);
    }
  }, [user, session]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  return { claims, isLoading, error, refetch: fetchClaims };
}
