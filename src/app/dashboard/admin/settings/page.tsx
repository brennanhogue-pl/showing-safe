"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Settings as SettingsIcon, Bell, DollarSign, Mail, Shield, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const { profile, isLoading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <SettingsIcon className="w-8 h-8 text-blue-600 animate-pulse" />
        <p className="ml-3 text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-muted-foreground mt-1">
          System configuration and preferences
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Shield className="w-5 h-5" />
            Settings Configuration
          </CardTitle>
          <CardDescription className="text-blue-700">
            Advanced settings and configuration options will be available here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-800">
            This page is under construction. Settings functionality will include:
          </p>
        </CardContent>
      </Card>

      {/* Settings Categories */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Pricing Configuration
            </CardTitle>
            <CardDescription>Manage pricing for policies and subscriptions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Single-Use Policy</span>
                <Badge>$99</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Listing Agent Subscription</span>
                <Badge>$99/month</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Agent Subscription</span>
                <Badge>$19.99/month</Badge>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">Add-On Listing</span>
                <Badge>$59</Badge>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Current pricing from environment variables
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure email notifications and alerts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Claim Submitted</p>
                  <p className="text-xs text-muted-foreground">Notify admins of new claims</p>
                </div>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Claim Approved</p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">New User Signup</p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Policy Expiring</p>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Templates
            </CardTitle>
            <CardDescription>Customize email templates for notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Welcome Email</p>
                <p className="text-xs text-muted-foreground">Sent to new users upon signup</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Claim Approved</p>
                <p className="text-xs text-muted-foreground">Notify user of approved claim</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Claim Denied</p>
                <p className="text-xs text-muted-foreground">Notify user of denied claim with reason</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-sm font-medium">Invitation Email</p>
                <p className="text-xs text-muted-foreground">User invitation with signup link</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Email templates will be configurable in a future update
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              System Information
            </CardTitle>
            <CardDescription>System status and configuration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium">Environment</p>
                <Badge>{process.env.NODE_ENV || "development"}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Supabase URL</p>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded truncate">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Stripe Mode</p>
                <Badge>Test Mode</Badge>
              </div>
              <div>
                <p className="text-sm font-medium">Application URL</p>
                <p className="text-xs font-mono bg-gray-50 p-2 rounded truncate">
                  {process.env.NEXT_PUBLIC_APP_URL}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
