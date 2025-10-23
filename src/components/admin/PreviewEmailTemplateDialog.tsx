"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  description: string | null;
  is_active: boolean;
}

interface PreviewEmailTemplateDialogProps {
  template: EmailTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PreviewEmailTemplateDialog({
  template,
  open,
  onOpenChange,
}: PreviewEmailTemplateDialogProps) {
  // Create sample variables for preview
  const getSampleVariables = () => {
    const samples: Record<string, string> = {
      userName: "John Doe",
      userRole: "Agent",
      dashboardUrl: "https://showingsafe.co/dashboard",
      inviterName: "Admin User",
      inviterEmail: "admin@showingsafe.co",
      inviteUrl: "https://showingsafe.co/accept-invite",
      expiresInDays: "7",
      currentYear: new Date().getFullYear().toString(),
    };
    return samples;
  };

  // Replace variables in template
  const replaceVariables = (content: string) => {
    let result = content;
    const samples = getSampleVariables();

    template.variables.forEach((variable: string) => {
      const value = samples[variable] || `[${variable}]`;
      const regex = new RegExp(`{{${variable}}}`, "g");
      result = result.replace(regex, value);
    });

    return result;
  };

  const previewSubject = replaceVariables(template.subject);
  const previewHtml = replaceVariables(template.html_content);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Preview: {template.name.split("_").map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(" ")}
          </DialogTitle>
          <DialogDescription>
            Preview with sample data
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Subject Line */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Subject:</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md border border-gray-200">
              <p className="text-gray-900">{previewSubject}</p>
            </div>
          </div>

          {/* Sample Variables Used */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Sample Variables:
            </label>
            <div className="flex flex-wrap gap-2">
              {template.variables.map((variable: string) => {
                const samples = getSampleVariables();
                const value = samples[variable] || `[${variable}]`;
                return (
                  <Badge key={variable} variant="outline" className="text-xs">
                    {`{{${variable}}}`} = {value}
                  </Badge>
                );
              })}
            </div>
          </div>

          {/* Email Preview */}
          <div>
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Email Preview:
            </label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[500px] bg-white"
                title="Email Preview"
                sandbox="allow-same-origin"
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
