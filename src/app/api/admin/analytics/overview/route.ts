import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { AdminDashboardStats } from "@/types";

export async function GET(req: Request) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user with the token
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

    // Fetch all stats in parallel
    const [
      usersData,
      policiesData,
      claimsData,
    ] = await Promise.all([
      // User stats
      supabaseAdmin.from("users").select("role, agent_subscription_status"),

      // Policy stats
      supabaseAdmin.from("policies").select("status, created_at"),

      // Claims stats
      supabaseAdmin.from("claims").select("status"),
    ]);

    // Process user stats
    const users = usersData.data || [];
    const totalUsers = users.length;
    const totalHomeowners = users.filter((u) => u.role === "homeowner").length;
    const totalAgents = users.filter((u) => u.role === "agent").length;
    const totalAdmins = users.filter((u) => u.role === "admin").length;
    const activeAgentSubscriptions = users.filter(
      (u) => u.role === "agent" && u.agent_subscription_status === "active"
    ).length;

    // Process policy stats
    const policies = policiesData.data || [];
    const totalPolicies = policies.length;

    // Calculate active policies (created within last 90 days and status is active)
    const now = new Date();
    const activePolicies = policies.filter((p) => {
      if (p.status !== "active") return false;
      const createdDate = new Date(p.created_at);
      const expiryDate = new Date(createdDate);
      expiryDate.setDate(expiryDate.getDate() + 90);
      return expiryDate > now;
    }).length;

    const expiredPolicies = totalPolicies - activePolicies;

    // Process claims stats
    const claims = claimsData.data || [];
    const totalClaims = claims.length;
    const pendingClaims = claims.filter((c) => c.status === "pending").length;
    const approvedClaims = claims.filter((c) => c.status === "approved").length;
    const deniedClaims = claims.filter((c) => c.status === "denied").length;

    // Revenue calculations
    // For simplicity, assuming:
    // - Single-use policy = $99
    // - Agent subscription = $19.99/month
    // - Total revenue = (total policies * 99) + we'll skip subscription revenue for now since it's recurring
    const singleUsePolicyPrice = 99;
    const totalRevenue = totalPolicies * singleUsePolicyPrice; // Simplified

    const agentSubscriptionPrice = 19.99;
    const monthlyRecurringRevenue = activeAgentSubscriptions * agentSubscriptionPrice;

    const stats: AdminDashboardStats = {
      totalUsers,
      totalHomeowners,
      totalAgents,
      totalAdmins,
      activeAgentSubscriptions,
      totalPolicies,
      activePolicies,
      expiredPolicies,
      totalClaims,
      pendingClaims,
      approvedClaims,
      deniedClaims,
      totalRevenue,
      monthlyRecurringRevenue,
    };

    return NextResponse.json({ stats });
  } catch (err) {
    console.error("Admin analytics error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
