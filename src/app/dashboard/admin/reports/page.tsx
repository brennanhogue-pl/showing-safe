"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Shield, TrendingUp, Users, FileText, DollarSign, CheckCircle, BarChart3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { StatsCardsSkeleton, ChartSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ReportsData {
  revenueByMonth: Array<{
    month: string;
    singleUse: number;
    subscription: number;
    total: number;
  }>;
  claimsByMonth: Array<{
    month: string;
    pending: number;
    approved: number;
    denied: number;
    total: number;
  }>;
  usersByMonth: Array<{
    month: string;
    homeowners: number;
    agents: number;
    admins: number;
    total: number;
  }>;
  topAgents: Array<{
    id: string;
    name: string;
    email: string;
    policyCount: number;
  }>;
  claimsByType: {
    homeowner_showing: number;
    agent_subscription: number;
    agent_listing: number;
  };
  metrics: {
    approvalRate: number;
    totalPayout: number;
    avgPayoutAmount: number;
    totalProcessedClaims: number;
    approvedClaims: number;
    deniedClaims: number;
  };
}

const COLORS = {
  primary: "#3b82f6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  purple: "#8b5cf6",
  gray: "#6b7280",
};

export default function ReportsPage() {
  const { profile, session, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState<ReportsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && profile && profile.role !== "admin") {
      const dashboardPath =
        profile.role === "agent" ? "/dashboard/agent" : "/dashboard/homeowner";
      router.push(dashboardPath);
    }
  }, [profile, authLoading, router]);

  // Fetch reports data
  useEffect(() => {
    if (!authLoading && profile?.role === "admin") {
      fetchReports();
    }
  }, [authLoading, profile]);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!session?.access_token) {
        throw new Error("No session token");
      }

      const response = await fetch("/api/admin/analytics/reports", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        throw new Error(errorText || "Failed to fetch reports");
      }

      const reportsData = await response.json();
      setData(reportsData);
    } catch (err) {
      console.error("Error fetching reports:", err);
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div>
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse mb-2" />
          <div className="h-4 w-96 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stats cards skeleton */}
        <StatsCardsSkeleton />

        {/* Charts skeleton */}
        <ChartSkeleton />

        <div className="grid gap-4 md:grid-cols-2">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>

        <ChartSkeleton />

        {/* Top agents skeleton */}
        <Card>
          <div className="p-6 space-y-3">
            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                  <div className="space-y-2">
                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                    <div className="h-3 w-48 bg-gray-200 rounded animate-pulse" />
                  </div>
                </div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  const claimsTypeData = [
    { name: "Homeowner", value: data.claimsByType.homeowner_showing, color: COLORS.success },
    { name: "Agent Subscription", value: data.claimsByType.agent_subscription, color: COLORS.primary },
    { name: "Agent Listing", value: data.claimsByType.agent_listing, color: COLORS.purple },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Business insights and performance metrics
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {data.metrics.approvalRate.toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.approvedClaims} of {data.metrics.totalProcessedClaims} processed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.metrics.totalPayout.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From {data.metrics.approvedClaims} approved claims
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Payout</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${data.metrics.avgPayoutAmount.toFixed(0)}
            </div>
            <p className="text-xs text-muted-foreground">Per approved claim</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Denial Rate</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {((data.metrics.deniedClaims / data.metrics.totalProcessedClaims) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {data.metrics.deniedClaims} denied claims
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Revenue Over Time
          </CardTitle>
          <CardDescription>Monthly revenue breakdown by coverage type</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                stroke={COLORS.primary}
                strokeWidth={2}
                name="Total Revenue"
              />
              <Line
                type="monotone"
                dataKey="singleUse"
                stroke={COLORS.success}
                strokeWidth={2}
                name="Single-Use"
              />
              <Line
                type="monotone"
                dataKey="subscription"
                stroke={COLORS.purple}
                strokeWidth={2}
                name="Subscription"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Claims Trends & Claims by Type */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Claims Trends
            </CardTitle>
            <CardDescription>Monthly claims by status</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.claimsByMonth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" fill={COLORS.success} name="Approved" />
                <Bar dataKey="denied" fill={COLORS.danger} name="Denied" />
                <Bar dataKey="pending" fill={COLORS.warning} name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Claims by Type
            </CardTitle>
            <CardDescription>Distribution of claim types</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={claimsTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {claimsTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* User Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            User Growth
          </CardTitle>
          <CardDescription>Monthly user registrations by role</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.usersByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="homeowners" stackId="a" fill={COLORS.success} name="Homeowners" />
              <Bar dataKey="agents" stackId="a" fill={COLORS.primary} name="Agents" />
              <Bar dataKey="admins" stackId="a" fill={COLORS.purple} name="Admins" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Agents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Top Agents by Policies
          </CardTitle>
          <CardDescription>Agents with the most active policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.topAgents.slice(0, 5).map((agent, index) => (
              <div
                key={agent.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-xs text-muted-foreground">{agent.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{agent.policyCount}</p>
                  <p className="text-xs text-muted-foreground">policies</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
