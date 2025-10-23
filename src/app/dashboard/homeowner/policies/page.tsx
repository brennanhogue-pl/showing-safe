"use client";

import { usePolicies } from "@/hooks/usePolicies";
import PoliciesList from "@/components/PoliciesList";
import BuyCoverageDialog from "@/components/BuyCoverageDialog";
import { Button } from "@/components/ui/button";
import { Shield, Plus } from "lucide-react";

export default function PoliciesPage() {
  const { policies, isLoading } = usePolicies();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Policies</h1>
          <p className="text-muted-foreground mt-1">
            Manage and view your coverage policies
          </p>
        </div>
        <BuyCoverageDialog
          trigger={
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              Buy Coverage
            </Button>
          }
        />
      </div>

      {/* Policies List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Shield className="w-8 h-8 text-blue-600 animate-pulse" />
          <p className="ml-3 text-muted-foreground">Loading your policies...</p>
        </div>
      ) : (
        <PoliciesList policies={policies} />
      )}
    </div>
  );
}
