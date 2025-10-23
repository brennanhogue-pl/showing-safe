import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET - List all policies with details
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

    // Get all policies
    const { data: policies, error } = await supabaseAdmin
      .from("policies")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching policies:", error);
      return new NextResponse("Failed to fetch policies", { status: 500 });
    }

    // Get user details for all policies
    const userIds = [...new Set(policies?.map((p) => p.user_id) || [])];
    const { data: users } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email, role")
      .in("id", userIds);

    // Get claims for all policies with details
    const { data: claims } = await supabaseAdmin
      .from("claims")
      .select("*")
      .not("policy_id", "is", null);

    // Group claims by policy_id
    const claimsMap = new Map<string, typeof claims>();
    claims?.forEach((claim) => {
      if (claim.policy_id) {
        if (!claimsMap.has(claim.policy_id)) {
          claimsMap.set(claim.policy_id, []);
        }
        claimsMap.get(claim.policy_id)?.push(claim);
      }
    });

    // Map user details to policies
    const userMap = new Map(users?.map((u) => [u.id, u]) || []);
    const policiesWithDetails = policies?.map((policy) => {
      // Calculate if policy is expired (90 days from creation)
      const createdDate = new Date(policy.created_at);
      const expiryDate = new Date(createdDate);
      expiryDate.setDate(expiryDate.getDate() + 90);
      const isExpired = expiryDate < new Date();

      // Update status based on expiry
      let actualStatus = policy.status;
      if (isExpired && policy.status === "active") {
        actualStatus = "expired";
      }

      const policyClaims = claimsMap.get(policy.id) || [];

      return {
        ...policy,
        status: actualStatus,
        expiry_date: expiryDate.toISOString(),
        user: userMap.get(policy.user_id),
        claims_count: policyClaims.length,
        claims: policyClaims,
      };
    });

    return NextResponse.json({ policies: policiesWithDetails || [] });
  } catch (err) {
    console.error("Admin policies GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
