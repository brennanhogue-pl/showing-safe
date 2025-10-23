"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { usePolicies } from "@/hooks/usePolicies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, X } from "lucide-react";

interface ClaimFormProps {
  onSuccess?: () => void;
  defaultPolicyId?: string;
}

export default function ClaimForm({ onSuccess, defaultPolicyId }: ClaimFormProps) {
  const { profile } = useAuth();
  const { policies } = usePolicies();

  const [policyId, setPolicyId] = useState(defaultPolicyId || "");
  const [incidentDate, setIncidentDate] = useState("");
  const [damagedItems, setDamagedItems] = useState("");
  const [supaShowingNumber, setSupraShowingNumber] = useState("");
  const [description, setDescription] = useState("");
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Filter for active policies only
  const activePolicies = policies.filter((p) => p.status === "active");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setProofFiles([...proofFiles, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setProofFiles(proofFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validation
    if (!policyId) {
      setError("Please select a policy");
      setIsLoading(false);
      return;
    }

    if (!incidentDate) {
      setError("Please enter the incident date");
      setIsLoading(false);
      return;
    }

    if (!damagedItems.trim()) {
      setError("Please list the damaged items");
      setIsLoading(false);
      return;
    }

    if (!supaShowingNumber.trim()) {
      setError("Please enter the Supra showing number");
      setIsLoading(false);
      return;
    }

    if (!description.trim()) {
      setError("Please provide a description of the incident");
      setIsLoading(false);
      return;
    }

    if (proofFiles.length === 0) {
      setError("Please upload at least one photo of the damage");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Upload files to storage and get URLs
      // For now, we'll create a placeholder
      const proofUrls = proofFiles.map((file) => file.name).join(", ");

      const response = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          policyId,
          incidentDate,
          damagedItems,
          supaShowingNumber,
          description,
          proofUrl: proofUrls, // Placeholder until we implement file upload
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit claim");
      }

      // Success!
      setSuccess(true);

      // Reset form
      setPolicyId("");
      setIncidentDate("");
      setDamagedItems("");
      setSupraShowingNumber("");
      setDescription("");
      setProofFiles([]);

      // Hide success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);

      // Call onSuccess callback to close dialog
      if (onSuccess) {
        setTimeout(() => onSuccess(), 1000);
      }
    } catch (err: any) {
      console.error("Claim submission error:", err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (activePolicies.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground mb-4">
          You need an active policy before you can file a claim.
        </p>
        <Button onClick={() => window.location.href = "/dashboard/homeowner/policies"}>
          View Policies
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                Claim submitted successfully! We'll review it and get back to you soon.
              </AlertDescription>
            </Alert>
          )}

          {/* Policy Selection */}
          <div className="space-y-2">
            <Label htmlFor="policy">Select Policy *</Label>
            <Select value={policyId} onValueChange={setPolicyId} disabled={isLoading}>
              <SelectTrigger id="policy">
                <SelectValue placeholder="Choose the policy for this claim" />
              </SelectTrigger>
              <SelectContent>
                {activePolicies.map((policy) => (
                  <SelectItem key={policy.id} value={policy.id}>
                    {policy.property_address} - {policy.coverage_type === "single" ? "Single-Use" : "Subscription"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Incident Date */}
          <div className="space-y-2">
            <Label htmlFor="incidentDate">Date of Incident *</Label>
            <Input
              id="incidentDate"
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              disabled={isLoading}
              required
              max={new Date().toISOString().split("T")[0]} // Can't be future date
            />
          </div>

          {/* Damaged Items */}
          <div className="space-y-2">
            <Label htmlFor="damagedItems">Damaged Item(s) *</Label>
            <Input
              id="damagedItems"
              type="text"
              placeholder="e.g., Living room TV, Kitchen window, Hardwood floor"
              value={damagedItems}
              onChange={(e) => setDamagedItems(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              List all items that were damaged during the showing
            </p>
          </div>

          {/* Supra Showing Number */}
          <div className="space-y-2">
            <Label htmlFor="supaShowingNumber">Supra Showing Number *</Label>
            <Input
              id="supaShowingNumber"
              type="text"
              placeholder="e.g., 123456789"
              value={supaShowingNumber}
              onChange={(e) => setSupraShowingNumber(e.target.value)}
              disabled={isLoading}
              required
            />
            <p className="text-xs text-muted-foreground">
              The confirmation number from your Supra lockbox showing report
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Incident Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what happened during the showing..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
              required
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Provide as much detail as possible about the incident
            </p>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="proofFiles">Upload Photos of Damage *</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                id="proofFiles"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
              <label htmlFor="proofFiles" className="cursor-pointer">
                <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">
                  Click to upload photos or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PNG, JPG up to 10MB each
                </p>
              </label>
            </div>

            {/* Preview uploaded files */}
            {proofFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <p className="text-sm font-medium">Uploaded files ({proofFiles.length}):</p>
                <div className="space-y-2">
                  {proofFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700 truncate flex-1">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full" size="lg">
              {isLoading ? "Submitting Claim..." : "Submit Claim"}
            </Button>
          </div>
        </form>
  );
}
