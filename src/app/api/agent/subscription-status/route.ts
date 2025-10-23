import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

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

    // Get user's subscription info
    const { data: profile, error } = await supabase
      .from("users")
      .select("agent_subscription_status, agent_subscription_id, agent_subscription_start, role")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({
      status: profile.agent_subscription_status,
      subscriptionId: profile.agent_subscription_id,
      subscriptionStart: profile.agent_subscription_start,
      canFileClaims: profile.agent_subscription_status === "active",
      isAgent: profile.role === "agent",
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
