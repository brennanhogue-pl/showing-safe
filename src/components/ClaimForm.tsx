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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Upload, X, CalendarIcon } from "lucide-react";
import { uploadClaimFiles } from "@/lib/uploadClaimFiles";

interface ClaimFormProps {
  onSuccess?: () => void;
  defaultPolicyId?: string;
}

export default function ClaimForm({ onSuccess, defaultPolicyId }: ClaimFormProps) {
  const { session } = useAuth();
  const { policies } = usePolicies();

  const [policyId, setPolicyId] = useState(defaultPolicyId || "");
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(undefined);
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
      if (!session?.access_token) {
        setError("You must be logged in to submit a claim");
        setIsLoading(false);
        return;
      }

      // First, create the claim without file URLs
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          policyId,
          incidentDate: incidentDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
          damagedItems,
          supaShowingNumber,
          description,
          proofUrl: null, // Will be updated after file upload
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to submit claim");
      }

      const data = await response.json();
      const claimId = data.claim.id;

      // Upload files to storage
      let fileUrls: string[] = [];
      if (proofFiles.length > 0) {
        try {
          fileUrls = await uploadClaimFiles(proofFiles, claimId);

          // Update the claim with file URLs
          await fetch(`/api/claims/${claimId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({
              proofUrl: fileUrls.join(", "),
            }),
          });
        } catch (uploadError) {
          console.error("File upload error:", uploadError);
          // Claim was created but file upload failed - show partial success
          setError("Claim created, but some files failed to upload. Please try again or contact support.");
        }
      }

      // Success!
      setSuccess(true);

      // Reset form
      setPolicyId("");
      setIncidentDate(undefined);
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
    } catch (err) {
      console.error("Claim submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
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
                Claim submitted successfully! We&apos;ll review it and get back to you soon.
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
            <Label>Date of Incident *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !incidentDate && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {incidentDate ? format(incidentDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={incidentDate}
                  onSelect={setIncidentDate}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
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
