"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ClaimForm from "@/components/ClaimForm";

interface FileClaimDialogProps {
  trigger?: React.ReactNode | null;
  policyId?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function FileClaimDialog({
  trigger,
  policyId,
  open: controlledOpen,
  onOpenChange,
}: FileClaimDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);

  // Use controlled state if provided, otherwise use internal state
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger && (
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
      )}
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Submit a Claim</DialogTitle>
          <DialogDescription>
            Provide details about the incident and upload proof of damage
          </DialogDescription>
        </DialogHeader>
        <ClaimForm onSuccess={() => setOpen(false)} defaultPolicyId={policyId} />
      </DialogContent>
    </Dialog>
  );
}
