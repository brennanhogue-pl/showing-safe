import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

// GET - List all claims with details
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

    // Get all claims
    const { data: claims, error } = await supabaseAdmin
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error);
      return new NextResponse("Failed to fetch claims", { status: 500 });
    }

    // Get user IDs from claims (both user_id and from policies)
    const directUserIds = claims?.filter(c => c.user_id).map(c => c.user_id) || [];
    const policyIds = claims?.filter(c => c.policy_id).map(c => c.policy_id) || [];

    // Get policies to get user_ids
    const { data: policies } = await supabaseAdmin
      .from("policies")
      .select("id, user_id, property_address")
      .in("id", policyIds);

    const policyUserIds = policies?.map(p => p.user_id) || [];
    const allUserIds = [...new Set([...directUserIds, ...policyUserIds])];

    // Get user details
    const { data: users } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email, role")
      .in("id", allUserIds);

    // Create maps for quick lookup
    const userMap = new Map(users?.map((u) => [u.id, u]) || []);
    const policyMap = new Map(policies?.map((p) => [p.id, p]) || []);

    // Map details to claims
    const claimsWithDetails = claims?.map((claim) => {
      let user = null;
      let policy = null;

      // Get user either directly from claim or from policy
      if (claim.user_id) {
        user = userMap.get(claim.user_id);
      } else if (claim.policy_id) {
        policy = policyMap.get(claim.policy_id);
        if (policy) {
          user = userMap.get(policy.user_id);
        }
      }

      return {
        ...claim,
        user,
        policy: claim.policy_id ? policyMap.get(claim.policy_id) : null,
      };
    });

    return NextResponse.json({ claims: claimsWithDetails || [] });
  } catch (err) {
    console.error("Admin claims GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
