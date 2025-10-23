"use client";

import { useClaims } from "@/hooks/useClaims";
import ClaimsList from "@/components/ClaimsList";
import FileClaimDialog from "@/components/FileClaimDialog";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";

export default function ClaimsPage() {
  const { claims, isLoading } = useClaims();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Claims</h1>
          <p className="text-muted-foreground mt-1">
            File and manage your insurance claims
          </p>
        </div>
        <FileClaimDialog
          trigger={
            <Button size="lg" className="gap-2">
              <Plus className="w-4 h-4" />
              File Claim
            </Button>
          }
        />
      </div>

      {/* Claims List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <FileText className="w-8 h-8 text-blue-600 animate-pulse" />
          <p className="ml-3 text-muted-foreground">Loading your claims...</p>
        </div>
      ) : (
        <ClaimsList claims={claims} />
      )}
    </div>
  );
}
