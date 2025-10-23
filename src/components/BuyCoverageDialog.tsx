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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield } from "lucide-react";
import AddressForm from "@/components/AddressForm";

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
  const [coverageType, setCoverageType] = useState("Single-Use Policy");
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

    try {
      // Call the checkout API
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE,
          userId: user.id,
          propertyAddress,
          coverageType,
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
            <DialogTitle>Purchase Coverage</DialogTitle>
          </div>
          <DialogDescription>
            Protect your property during showings with comprehensive insurance coverage
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

          <div className="space-y-2">
            <Label htmlFor="coverage">Coverage Type</Label>
            <Select
              value={coverageType}
              onValueChange={setCoverageType}
              disabled={isLoading}
            >
              <SelectTrigger id="coverage">
                <SelectValue placeholder="Select coverage type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Single-Use Policy">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Single-Use Policy</span>
                    <span className="text-xs text-muted-foreground">$99 - One showing</span>
                  </div>
                </SelectItem>
                <SelectItem value="Listing Agent Subscription">
                  <div className="flex flex-col items-start">
                    <span className="font-medium">Agent Subscription</span>
                    <span className="text-xs text-muted-foreground">$99/mo - Unlimited</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
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
