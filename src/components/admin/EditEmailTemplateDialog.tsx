"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, Eye } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  html_content: string;
  variables: string[];
  description: string | null;
  is_active: boolean;
}

interface EditEmailTemplateDialogProps {
  template: EmailTemplate;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
}

export function EditEmailTemplateDialog({
  template,
  open,
  onOpenChange,
  onSave,
}: EditEmailTemplateDialogProps) {
  const { user } = useAuth();
  const [subject, setSubject] = useState(template.subject);
  const [htmlContent, setHtmlContent] = useState(template.html_content);
  const [description, setDescription] = useState(template.description || "");
  const [isActive, setIsActive] = useState(template.is_active);
  const [isSaving, setIsSaving] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const { data: { session } } = await (await import("@/lib/supabase")).supabase.auth.getSession();

      const response = await fetch(`/api/admin/email-templates/${template.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          subject,
          html_content: htmlContent,
          description,
          is_active: isActive,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update email template");
      }

      setSuccess("Template updated successfully!");
      setTimeout(() => {
        onSave();
      }, 1000);
    } catch (err) {
      console.error("Error updating template:", err);
      setError("Failed to update template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSendTest = async () => {
    try {
      setIsSendingTest(true);
      setError("");
      setSuccess("");

      if (!testEmail) {
        setError("Please enter a test email address");
        return;
      }

      const { data: { session } } = await (await import("@/lib/supabase")).supabase.auth.getSession();

      // Create test variables
      const testVariables: any = {};
      template.variables.forEach((variable: string) => {
        if (variable === "userName") testVariables[variable] = "John Doe";
        else if (variable === "userRole") testVariables[variable] = "Agent";
        else if (variable === "dashboardUrl") testVariables[variable] = "https://showingsafe.co/dashboard";
        else if (variable === "inviterName") testVariables[variable] = "Admin User";
        else if (variable === "inviterEmail") testVariables[variable] = "admin@showingsafe.co";
        else if (variable === "inviteUrl") testVariables[variable] = "https://showingsafe.co/accept-invite";
        else if (variable === "expiresInDays") testVariables[variable] = "7";
        else testVariables[variable] = `[${variable}]`;
      });

      const response = await fetch(`/api/admin/email-templates/${template.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({
          test_email: testEmail,
          variables: testVariables,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send test email");
      }

      setSuccess(`Test email sent to ${testEmail}!`);
      setTestEmail("");
    } catch (err) {
      console.error("Error sending test email:", err);
      setError("Failed to send test email. Please try again.");
    } finally {
      setIsSendingTest(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Edit Email Template: {template.name.split("_").map(word =>
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(" ")}
          </DialogTitle>
          <DialogDescription>
            Customize the email template. Use variables like {template.variables.map(v => `{{${v}}}`).join(", ")}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit Template</TabsTrigger>
            <TabsTrigger value="test">Send Test</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Email Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe when this email is sent"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="html_content">HTML Content</Label>
              <Textarea
                id="html_content"
                value={htmlContent}
                onChange={(e) => setHtmlContent(e.target.value)}
                placeholder="Enter HTML content"
                rows={15}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500">
                Available variables: {template.variables.map(v => (
                  <Badge key={v} variant="outline" className="text-xs mr-1">{`{{${v}}}`}</Badge>
                ))}
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={isActive}
                onCheckedChange={setIsActive}
              />
              <Label htmlFor="is_active">
                Active (email will be sent when triggered)
              </Label>
            </div>
          </TabsContent>

          <TabsContent value="test" className="space-y-4 mt-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="test_email">Test Email Address</Label>
              <Input
                id="test_email"
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <p className="text-sm text-gray-500">
                Send a test email with sample data to verify the template
              </p>
            </div>

            <Button
              onClick={handleSendTest}
              disabled={isSendingTest || !testEmail}
              className="w-full"
            >
              {isSendingTest ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Test Email
                </>
              )}
            </Button>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
