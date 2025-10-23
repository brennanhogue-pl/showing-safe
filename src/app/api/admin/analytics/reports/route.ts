import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET - Get detailed analytics for reports page
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user is an admin
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    // Fetch all necessary data
    const [usersResult, policiesResult, claimsResult, subscriptionsResult] = await Promise.all([
      supabaseAdmin.from("users").select("id, role, created_at"),
      supabaseAdmin.from("policies").select("id, coverage_type, status, created_at, user_id"),
      supabaseAdmin.from("claims").select("id, claim_type, status, created_at, max_payout_amount"),
      supabaseAdmin.from("agent_subscriptions").select("id, status, created_at"),
    ]);

    const users = usersResult.data || [];
    const policies = policiesResult.data || [];
    const claims = claimsResult.data || [];
    const subscriptions = subscriptionsResult.data || [];

    // Calculate revenue over time (last 12 months)
    const now = new Date();
    const revenueByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthPolicies = policies.filter((p) => {
        const created = new Date(p.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      const singleUseRevenue = monthPolicies.filter((p) => p.coverage_type === "single").length * 99;
      const subscriptionRevenue = monthPolicies.filter((p) => p.coverage_type === "subscription").length * 99;

      revenueByMonth.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        singleUse: singleUseRevenue,
        subscription: subscriptionRevenue,
        total: singleUseRevenue + subscriptionRevenue,
      });
    }

    // Claims trends over time (last 12 months)
    const claimsByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthClaims = claims.filter((c) => {
        const created = new Date(c.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      claimsByMonth.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        pending: monthClaims.filter((c) => c.status === "pending").length,
        approved: monthClaims.filter((c) => c.status === "approved").length,
        denied: monthClaims.filter((c) => c.status === "denied").length,
        total: monthClaims.length,
      });
    }

    // User growth over time (last 12 months)
    const usersByMonth = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const monthUsers = users.filter((u) => {
        const created = new Date(u.created_at);
        return created >= monthStart && created <= monthEnd;
      });

      usersByMonth.push({
        month: date.toLocaleDateString("en-US", { month: "short", year: "numeric" }),
        homeowners: monthUsers.filter((u) => u.role === "homeowner").length,
        agents: monthUsers.filter((u) => u.role === "agent").length,
        admins: monthUsers.filter((u) => u.role === "admin").length,
        total: monthUsers.length,
      });
    }

    // Top agents by policies
    const agentPolicyCounts = new Map<string, number>();
    const agentUsers = users.filter((u) => u.role === "agent");

    policies.forEach((policy) => {
      const count = agentPolicyCounts.get(policy.user_id) || 0;
      agentPolicyCounts.set(policy.user_id, count + 1);
    });

    const topAgents = agentUsers
      .map((agent) => ({
        id: agent.id,
        policyCount: agentPolicyCounts.get(agent.id) || 0,
      }))
      .sort((a, b) => b.policyCount - a.policyCount)
      .slice(0, 10);

    // Get agent details
    const topAgentIds = topAgents.map((a) => a.id);
    const { data: topAgentDetails } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .in("id", topAgentIds);

    const topAgentsWithDetails = topAgents.map((agent) => {
      const details = topAgentDetails?.find((u) => u.id === agent.id);
      return {
        ...agent,
        name: details?.full_name || "Unknown",
        email: details?.email || "",
      };
    });

    // Claims by type breakdown
    const claimsByType = {
      homeowner_showing: claims.filter((c) => c.claim_type === "homeowner_showing").length,
      agent_subscription: claims.filter((c) => c.claim_type === "agent_subscription").length,
      agent_listing: claims.filter((c) => c.claim_type === "agent_listing").length,
    };

    // Approval metrics
    const totalProcessedClaims = claims.filter((c) => c.status !== "pending").length;
    const approvedClaims = claims.filter((c) => c.status === "approved").length;
    const deniedClaims = claims.filter((c) => c.status === "denied").length;
    const approvalRate = totalProcessedClaims > 0 ? (approvedClaims / totalProcessedClaims) * 100 : 0;

    // Payout analytics
    const totalPayout = claims
      .filter((c) => c.status === "approved" && c.max_payout_amount)
      .reduce((sum, c) => sum + (c.max_payout_amount || 0), 0);

    const avgPayoutAmount = approvedClaims > 0 ? totalPayout / approvedClaims : 0;

    return NextResponse.json({
      revenueByMonth,
      claimsByMonth,
      usersByMonth,
      topAgents: topAgentsWithDetails,
      claimsByType,
      metrics: {
        approvalRate,
        totalPayout,
        avgPayoutAmount,
        totalProcessedClaims,
        approvedClaims,
        deniedClaims,
      },
    });
  } catch (err) {
    console.error("Admin analytics reports GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
