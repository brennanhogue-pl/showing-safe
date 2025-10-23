"use client";

import { usePolicies } from "@/hooks/usePolicies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";
import BuyCoverageDialog from "@/components/BuyCoverageDialog";
import { useState } from "react";

export default function AgentListingsPage() {
  const { policies, isLoading } = usePolicies();
  const [showBuyCoverage, setShowBuyCoverage] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="ml-3 text-muted-foreground">Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Protected Listings</h1>
          <p className="text-muted-foreground mt-1">
            Manage coverage for your listings and client properties
          </p>
        </div>
        <Button onClick={() => setShowBuyCoverage(true)} size="lg" className="gap-2">
          <Plus className="w-4 h-4" />
          Protect a Listing
        </Button>
      </div>

      {policies.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Shield className="w-16 h-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Protected Listings</h3>
            <p className="text-sm text-muted-foreground text-center mb-4 max-w-md">
              Start protecting your listings and client properties during showings.
            </p>
            <Button onClick={() => setShowBuyCoverage(true)}>
              Protect Your First Listing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {policies.map((policy) => {
            const expiryDate = new Date(policy.created_at);
            expiryDate.setDate(expiryDate.getDate() + 90);
            const isExpired = expiryDate < new Date();

            return (
              <Card key={policy.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Shield className="w-5 h-5 text-blue-600" />
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isExpired
                          ? "bg-gray-100 text-gray-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {isExpired ? "Expired" : "Active"}
                    </span>
                  </div>
                  <CardTitle className="text-lg mt-4">
                    {policy.property_address}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Type:</span>
                      <span className="font-medium">
                        {policy.coverage_type === "single" ? "Single-Use" : "Subscription"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valid Until:</span>
                      <span className="font-medium">
                        {expiryDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium capitalize">{policy.status}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <BuyCoverageDialog open={showBuyCoverage} onOpenChange={setShowBuyCoverage} />
    </div>
  );
}
