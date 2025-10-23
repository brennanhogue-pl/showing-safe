"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Loader2, ChevronLeft, ChevronRight, Upload, CheckCircle, CalendarIcon } from "lucide-react";
import { uploadClaimFiles } from "@/lib/uploadClaimFiles";
import AddressForm from "@/components/AddressForm";

interface AgentClaimDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AgentClaimDialog({ open, onOpenChange }: AgentClaimDialogProps) {
  const { session } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [incidentDate, setIncidentDate] = useState<Date | undefined>(undefined);
  const [damagedItems, setDamagedItems] = useState("");
  const [supaShowingNumber, setSupaShowingNumber] = useState("");
  const [description, setDescription] = useState("");
  const [atFaultParty, setAtFaultParty] = useState<"agent" | "client">("client");
  const [atFaultName, setAtFaultName] = useState("");
  const [atFaultPhone, setAtFaultPhone] = useState("");
  const [atFaultEmail, setAtFaultEmail] = useState("");
  const [homeownerName, setHomeownerName] = useState("");
  const [homeownerPhone, setHomeownerPhone] = useState("");
  const [homeownerEmail, setHomeownerEmail] = useState("");

  // Address fields
  const [street, setStreet] = useState("");
  const [unit, setUnit] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  // File uploads
  const [damagePhotos, setDamagePhotos] = useState<FileList | null>(null);
  const [showingProof, setShowingProof] = useState<FileList | null>(null);

  const totalSteps = 4;

  // Phone number formatting helper
  const formatPhoneNumber = (value: string) => {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');

    // Format based on length
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const resetForm = () => {
    setCurrentStep(1);
    setIncidentDate(undefined);
    setDamagedItems("");
    setSupaShowingNumber("");
    setDescription("");
    setAtFaultParty("client");
    setAtFaultName("");
    setAtFaultPhone("");
    setAtFaultEmail("");
    setHomeownerName("");
    setHomeownerPhone("");
    setHomeownerEmail("");
    setStreet("");
    setUnit("");
    setCity("");
    setState("");
    setZipCode("");
    setDamagePhotos(null);
    setShowingProof(null);
    setError(null);
    setSuccess(false);
  };

  const validateStep = (step: number): boolean => {
    setError(null);

    switch (step) {
      case 1:
        if (!incidentDate || !street.trim() || !city.trim() || !state || !zipCode.trim() || !damagedItems || !description) {
          setError("Please fill in all required fields");
          return false;
        }
        if (!/^\d{5}$/.test(zipCode)) {
          setError("Please enter a valid 5-digit zip code");
          return false;
        }
        return true;
      case 2:
        if (!supaShowingNumber) {
          setError("Supra showing number is required");
          return false;
        }
        return true;
      case 3:
        if (atFaultParty === "client" && !atFaultName) {
          setError("Client name is required");
          return false;
        }
        if (!homeownerName || !homeownerPhone || !homeownerEmail) {
          setError("All homeowner information is required");
          return false;
        }
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(homeownerEmail)) {
          setError("Please enter a valid homeowner email address");
          return false;
        }
        // Validate phone format (US phone numbers)
        const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if (!phoneRegex.test(homeownerPhone)) {
          setError("Please enter a valid homeowner phone number (10 digits)");
          return false;
        }
        // Validate client email and phone if client is at fault
        if (atFaultParty === "client") {
          if (atFaultEmail && !emailRegex.test(atFaultEmail)) {
            setError("Please enter a valid client email address");
            return false;
          }
          if (atFaultPhone && !phoneRegex.test(atFaultPhone)) {
            setError("Please enter a valid client phone number (10 digits)");
            return false;
          }
        }
        return true;
      case 4:
        if (!showingProof || showingProof.length === 0) {
          setError("Showing proof document is required");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setError(null);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setError(null);

    try {
      if (!session) {
        throw new Error("Not authenticated");
      }

      // Upload files
      let damagePhotoUrl: string | undefined;

      if (damagePhotos && damagePhotos.length > 0) {
        const uploadedUrls = await uploadClaimFiles(damagePhotos, session.user.id);
        damagePhotoUrl = uploadedUrls[0];
      }

      const showingProofUrls = await uploadClaimFiles(showingProof!, session.user.id, "showing-proofs");
      const showingProofUrl = showingProofUrls[0];

      // Construct full address
      const homeownerAddress = unit.trim()
        ? `${street}, ${unit}, ${city}, ${state} ${zipCode}`
        : `${street}, ${city}, ${state} ${zipCode}`;

      // Submit claim
      const response = await fetch("/api/claims", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          claimType: "agent_subscription",
          incidentDate: incidentDate?.toISOString().split('T')[0], // Format as YYYY-MM-DD
          damagedItems,
          supaShowingNumber,
          description,
          proofUrl: damagePhotoUrl,
          atFaultParty,
          atFaultName: atFaultParty === "client" ? atFaultName : undefined,
          atFaultPhone: atFaultParty === "client" ? atFaultPhone : undefined,
          atFaultEmail: atFaultParty === "client" ? atFaultEmail : undefined,
          homeownerName,
          homeownerPhone,
          homeownerEmail,
          homeownerAddress,
          showingProofUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to submit claim");
      }

      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        resetForm();
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit claim");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Incident Details</h3>
              <p className="text-sm text-muted-foreground">Tell us what happened</p>
            </div>

            <div>
              <Label>When did this happen? *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1.5",
                      !incidentDate && "text-muted-foreground"
                    )}
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
              disabled={isSubmitting}
            />

            <div>
              <Label htmlFor="damagedItems">What was damaged? *</Label>
              <Input
                id="damagedItems"
                type="text"
                placeholder="e.g., Kitchen cabinet door, Living room window"
                value={damagedItems}
                onChange={(e) => setDamagedItems(e.target.value)}
                className="mt-1.5"
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what happened and how the damage occurred..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="mt-1.5"
                required
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Showing Details</h3>
              <p className="text-sm text-muted-foreground">Provide showing confirmation</p>
            </div>

            <div>
              <Label htmlFor="supaShowingNumber">Supra Showing Number *</Label>
              <Input
                id="supaShowingNumber"
                type="text"
                placeholder="Enter showing confirmation number"
                value={supaShowingNumber}
                onChange={(e) => setSupaShowingNumber(e.target.value)}
                className="mt-1.5"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                This is your lockbox showing confirmation number
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Contact Information</h3>
              <p className="text-sm text-muted-foreground">Who was involved and who receives payout</p>
            </div>

            <div className="border-b pb-4">
              <Label htmlFor="atFaultParty" className="text-base">Who was at fault? *</Label>
              <Select value={atFaultParty} onValueChange={(value) => setAtFaultParty(value as "agent" | "client")}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="agent">I was at fault</SelectItem>
                  <SelectItem value="client">My client was at fault</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {atFaultParty === "client" && (
              <div className="space-y-4 border-b pb-4">
                <p className="text-sm font-medium">Client Information</p>
                <div>
                  <Label htmlFor="atFaultName">Client Name *</Label>
                  <Input
                    id="atFaultName"
                    type="text"
                    placeholder="Full name"
                    value={atFaultName}
                    onChange={(e) => setAtFaultName(e.target.value)}
                    className="mt-1.5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="atFaultPhone">Client Phone</Label>
                  <Input
                    id="atFaultPhone"
                    type="tel"
                    placeholder="(555) 555-5555"
                    value={atFaultPhone}
                    onChange={(e) => setAtFaultPhone(formatPhoneNumber(e.target.value))}
                    className="mt-1.5"
                    maxLength={14}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    10-digit phone number
                  </p>
                </div>

                <div>
                  <Label htmlFor="atFaultEmail">Client Email</Label>
                  <Input
                    id="atFaultEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={atFaultEmail}
                    onChange={(e) => setAtFaultEmail(e.target.value)}
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Valid email address
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <p className="text-sm font-medium">Homeowner Information (for payout)</p>
              <div>
                <Label htmlFor="homeownerName">Homeowner Name *</Label>
                <Input
                  id="homeownerName"
                  type="text"
                  placeholder="Full name"
                  value={homeownerName}
                  onChange={(e) => setHomeownerName(e.target.value)}
                  className="mt-1.5"
                  required
                />
              </div>

              <div>
                <Label htmlFor="homeownerPhone">Homeowner Phone *</Label>
                <Input
                  id="homeownerPhone"
                  type="tel"
                  placeholder="(555) 555-5555"
                  value={homeownerPhone}
                  onChange={(e) => setHomeownerPhone(formatPhoneNumber(e.target.value))}
                  className="mt-1.5"
                  maxLength={14}
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  10-digit phone number
                </p>
              </div>

              <div>
                <Label htmlFor="homeownerEmail">Homeowner Email *</Label>
                <Input
                  id="homeownerEmail"
                  type="email"
                  placeholder="homeowner@example.com"
                  value={homeownerEmail}
                  onChange={(e) => setHomeownerEmail(e.target.value)}
                  className="mt-1.5"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Valid email address for payout confirmation
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold">Upload Documentation</h3>
              <p className="text-sm text-muted-foreground">Provide proof of showing and damage photos</p>
            </div>

            <div>
              <Label htmlFor="showingProof">Showing Proof (Required) *</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Screenshot of MLS showing details or showing confirmation
              </p>
              <Input
                id="showingProof"
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setShowingProof(e.target.files)}
                className="mt-1.5"
                required
              />
              {showingProof && showingProof.length > 0 && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  File selected: {showingProof[0].name}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="damagePhotos">Damage Photos (Optional)</Label>
              <p className="text-xs text-muted-foreground mb-2">
                Photos of the damage (optional but recommended)
              </p>
              <Input
                id="damagePhotos"
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setDamagePhotos(e.target.files)}
                className="mt-1.5"
              />
              {damagePhotos && damagePhotos.length > 0 && (
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  {damagePhotos.length} file(s) selected
                </p>
              )}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-medium text-blue-900 mb-2">Review Before Submitting:</p>
              <ul className="text-xs text-blue-800 space-y-1">
                <li>✓ All required information is accurate</li>
                <li>✓ Showing proof document is uploaded</li>
                <li>✓ Maximum payout: $1,000 per incident</li>
                <li>✓ Payout will go directly to the homeowner</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>File Agent Subscription Claim</DialogTitle>
          <DialogDescription>
            Step {currentStep} of {totalSteps} • Max payout: $1,000
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Claim submitted successfully! Redirecting...
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Progress Indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`h-2 rounded-full transition-all ${
                    index + 1 === currentStep
                      ? "w-8 bg-blue-600"
                      : index + 1 < currentStep
                      ? "w-2 bg-blue-600"
                      : "w-2 bg-gray-300"
                  }`}
                />
              ))}
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {renderStepContent()}

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between mt-6 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={currentStep === 1 ? () => onOpenChange(false) : prevStep}
                disabled={isSubmitting}
              >
                {currentStep === 1 ? (
                  "Cancel"
                ) : (
                  <>
                    <ChevronLeft className="w-4 h-4 mr-1" />
                    Back
                  </>
                )}
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={isSubmitting}>
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Claim"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
