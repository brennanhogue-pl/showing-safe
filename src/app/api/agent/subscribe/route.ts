import { stripe } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { publicEnv } from "@/lib/env";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("🚀 Agent subscribe endpoint called");

    // Get the authorization token from the request headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      console.error("❌ No authorization header");
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user with the token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error("❌ Auth error:", authError);
      return new NextResponse("Unauthorized", { status: 401 });
    }

    console.log("✅ User authenticated:", user.email);

    // Check if user is an agent (use admin client to bypass RLS)
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("role, agent_subscription_status")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("❌ Profile fetch error:", profileError);
      return new NextResponse("Failed to fetch user profile", { status: 500 });
    }

    if (!profile || profile.role !== "agent") {
      console.error("❌ User is not an agent. Role:", profile?.role);
      return new NextResponse("Only agents can subscribe", { status: 403 });
    }

    console.log("✅ User is agent, subscription status:", profile.agent_subscription_status);

    // Check if already subscribed
    if (profile.agent_subscription_status === "active") {
      console.error("❌ Already subscribed");
      return new NextResponse("Already subscribed", { status: 400 });
    }

    // Log environment variables (without exposing full values)
    console.log("🔑 Checking environment variables...");
    console.log("Price ID exists:", !!publicEnv.stripe.agentSubscriptionPriceId);
    console.log("Price ID starts with:", publicEnv.stripe.agentSubscriptionPriceId?.substring(0, 10));
    console.log("App URL:", publicEnv.app.url);

    // Create Stripe Checkout Session for subscription
    console.log("💳 Creating Stripe checkout session...");
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      line_items: [
        {
          price: publicEnv.stripe.agentSubscriptionPriceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${publicEnv.app.url}/dashboard/agent?subscription=success`,
      cancel_url: `${publicEnv.app.url}/dashboard/agent?subscription=cancelled`,
      metadata: {
        userId: user.id,
        type: "agent_subscription",
      },
    });

    console.log("✅ Stripe session created:", session.id);

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
    });
  } catch (err) {
    console.error("❌ Agent subscribe error:", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
    return new NextResponse(
      err instanceof Error ? err.message : "Internal server error",
      { status: 500 }
    );
  }
}
