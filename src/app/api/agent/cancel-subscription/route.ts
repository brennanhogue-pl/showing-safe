import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
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
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("agent_subscription_id, agent_subscription_status")
      .eq("id", user.id)
      .single();

    if (!profile || !profile.agent_subscription_id) {
      return new NextResponse("No active subscription found", { status: 404 });
    }

    if (profile.agent_subscription_status !== "active") {
      return new NextResponse("Subscription is not active", { status: 400 });
    }

    // Cancel the subscription in Stripe
    await stripe.subscriptions.cancel(profile.agent_subscription_id);

    // Update user's subscription status (webhook will also handle this)
    await supabaseAdmin
      .from("users")
      .update({
        agent_subscription_status: "cancelled",
      })
      .eq("id", user.id);

    return NextResponse.json({
      success: true,
      message: "Subscription cancelled successfully",
    });
  } catch (err) {
    console.error("Cancel subscription error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
