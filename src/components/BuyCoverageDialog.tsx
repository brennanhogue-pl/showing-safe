"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import AddressForm from "@/components/AddressForm";
import { publicEnv } from "@/lib/env";

interface BuyCoverageDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function BuyCoverageDialog({
  trigger,
  open: controlledOpen,
  onOpenChange,
}: BuyCoverageDialogProps) {
  const { user, profile } = useAuth();
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;
  const [street, setStreet] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!user) {
      setError("You must be logged in to purchase coverage");
      setIsLoading(false);
      return;
    }

    // Validate address fields
    if (!street.trim()) {
      setError("Please enter a street address");
      setIsLoading(false);
      return;
    }

    if (!city.trim()) {
      setError("Please enter a city");
      setIsLoading(false);
      return;
    }

    if (!state) {
      setError("Please select a state");
      setIsLoading(false);
      return;
    }

    if (!zipCode.trim() || !/^\d{5}$/.test(zipCode)) {
      setError("Please enter a valid 5-digit zip code");
      setIsLoading(false);
      return;
    }

    // Construct full address
    const propertyAddress = unit.trim()
      ? `${street}, ${unit}, ${city}, ${state} ${zipCode}`
      : `${street}, ${city}, ${state} ${zipCode}`;

    // Get the price ID from env
    const priceId = publicEnv.stripe.singleUsePriceId;
    if (!priceId) {
      setError("Stripe is not configured. Please contact support.");
      setIsLoading(false);
      return;
    }

    try {
      // Call the checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          propertyAddress,
          coverageType: "Single-Use Policy",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create checkout session");
      }

      const data = await response.json();

      if (data.url) {
        // Redirect to Stripe checkout
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-6 h-6 text-blue-600" />
            <DialogTitle>Protect a Listing</DialogTitle>
          </div>
          <DialogDescription>
            Purchase 90-day protection for a specific property listing
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <AddressForm
            street={street}
            unit={unit}
            city={city}
            state={state}
            zipCode={zipCode}
            onStreetChange={setStreet}
            onUnitChange={setUnit}
            onCityChange={setCity}
            onStateChange={setState}
            onZipCodeChange={setZipCode}
            disabled={isLoading}
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="font-semibold text-blue-900">Single-Use Listing Protection</h4>
                <p className="text-sm text-blue-800 mt-1">90-day coverage for one property</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-900">$99</div>
                <div className="text-xs text-blue-700">one-time</div>
              </div>
            </div>
            <ul className="text-sm text-blue-800 space-y-1 mt-3">
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Protects this specific listing for 90 days</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>Coverage during all showings at this property</span>
              </li>
              <li className="flex items-start">
                <Shield className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                <span>File claims if damage occurs during showings</span>
              </li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Processing..." : "Continue to Payment"}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2">
            You&apos;ll be redirected to Stripe to complete your purchase
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
