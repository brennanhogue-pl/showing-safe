import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import Stripe from 'stripe';

// Define proper types for policy metadata
interface PolicyMetadata {
  userId: string;
  propertyAddress: string;
  coverageType: string;
}

/**
 * Validates policy metadata from Stripe checkout session
 * Ensures all required fields are present, properly typed, and within length constraints
 */
function validatePolicyMetadata(metadata: unknown): PolicyMetadata | null {
  if (!metadata || typeof metadata !== 'object') {
    console.error("❌ Missing or invalid metadata");
    return null;
  }

  const record = metadata as Record<string, unknown>;
  const { userId, propertyAddress, coverageType } = record;

  // Validate required fields exist and are non-empty strings
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.error("❌ Invalid userId in metadata");
    return null;
  }

  if (!propertyAddress || typeof propertyAddress !== 'string' || propertyAddress.trim() === '') {
    console.error("❌ Invalid propertyAddress in metadata");
    return null;
  }

  if (!coverageType || typeof coverageType !== 'string' || coverageType.trim() === '') {
    console.error("❌ Invalid coverageType in metadata");
    return null;
  }

  // Validate length constraints to prevent abuse
  if (userId.length > 255 || propertyAddress.length > 500 || coverageType.length > 100) {
    console.error("❌ Metadata fields exceed maximum length");
    return null;
  }

  return { userId, propertyAddress, coverageType };
}

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  // Validate signature exists
  if (!sig) {
    console.error("❌ Missing stripe-signature header");
    return new NextResponse("Webhook signature missing", { status: 400 });
  }

  // Validate webhook secret is configured
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("❌ STRIPE_WEBHOOK_SECRET not configured");
    return new NextResponse("Webhook misconfigured", { status: 500 });
  }

  try {
    // Verify webhook signature for security
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);

    console.log("📥 Received webhook event:", event.type);

    switch (event.type) {
      // When a checkout is completed
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        console.log("🔍 Session ID:", session.id);
        console.log("🔍 Session metadata:", JSON.stringify(session.metadata, null, 2));

        // Check if this is an agent subscription or a policy purchase
        const subscriptionType = session.metadata?.type;

        if (subscriptionType === "agent_subscription") {
          // Handle agent subscription
          console.log("🤝 Agent subscription checkout completed");

          const userId = session.metadata?.userId;
          const subscriptionId = session.subscription as string;

          if (!userId || !subscriptionId) {
            console.error("❌ Missing userId or subscriptionId for agent subscription");
            return NextResponse.json({ received: true, error: "Invalid agent subscription metadata" });
          }

          // Update user's agent subscription status
          const { error: updateError } = await supabaseAdmin
            .from("users")
            .update({
              agent_subscription_status: "active",
              agent_subscription_id: subscriptionId,
              agent_subscription_start: new Date().toISOString(),
            })
            .eq("id", userId);

          if (updateError) {
            console.error("❌ Failed to update agent subscription:", updateError);
          } else {
            console.log("✅ Agent subscription activated for user:", userId);
          }
        } else {
          // Handle policy purchase (existing logic)
          const validatedMetadata = validatePolicyMetadata(session.metadata);
          if (!validatedMetadata) {
            console.error("❌ Invalid metadata in checkout session:", session.id);
            console.error("❌ Received metadata:", session.metadata);
            return NextResponse.json({ received: true, error: "Invalid metadata" });
          }

          console.log("✅ Checkout completed for:", validatedMetadata);

          // Check if policy already exists for this session (idempotency)
          const { data: existingPolicy } = await supabaseAdmin
            .from("policies")
            .select("id")
            .eq("stripe_session_id", session.id)
            .single();

          if (existingPolicy) {
            console.log("✅ Policy already exists for session:", session.id);
            return NextResponse.json({ received: true, status: "duplicate" });
          }

          // Insert new policy with stripe_session_id for idempotency
          console.log("💾 Attempting to insert policy into database...");
          const { data: insertedPolicy, error } = await supabaseAdmin.from("policies").insert([
            {
              user_id: validatedMetadata.userId,
              property_address: validatedMetadata.propertyAddress,
              coverage_type: validatedMetadata.coverageType,
              status: "active",
              stripe_session_id: session.id,
              stripe_payment_intent: session.payment_intent as string,
              created_at: new Date().toISOString(),
            },
          ]).select();

          if (error) {
            // Check if it's a unique constraint violation (race condition)
            if (error.code === '23505') {
              console.log("✅ Policy already created (race condition handled)");
              return NextResponse.json({ received: true, status: "duplicate" });
            }

            console.error("❌ Supabase insert error:", error);
            console.error("❌ Error details:", JSON.stringify(error, null, 2));
          } else {
            console.log("✅ Policy activated:", validatedMetadata.propertyAddress);
            console.log("✅ Inserted policy:", insertedPolicy);
          }
        }

        break;
      }

      // When a subscription is created (agent subscription)
      case "customer.subscription.created": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("✅ Subscription created:", subscription.id);

        // Get customer to find user
        const customerId = subscription.customer as string;
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("agent_subscription_id", subscription.id)
          .single();

        if (user) {
          await supabaseAdmin
            .from("users")
            .update({
              agent_subscription_status: "active",
              agent_subscription_start: new Date(subscription.created * 1000).toISOString(),
            })
            .eq("id", user.id);

          console.log("✅ Subscription activated for user:", user.id);
        }

        break;
      }

      // When a subscription is updated (agent subscription)
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("🔄 Subscription updated:", subscription.id);

        // Update user's subscription status based on Stripe status
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("agent_subscription_id", subscription.id)
          .single();

        if (user) {
          let subscriptionStatus: "active" | "cancelled" = "active";

          // Map Stripe statuses to our statuses
          if (subscription.status === "canceled" || subscription.status === "incomplete_expired") {
            subscriptionStatus = "cancelled";
          }

          await supabaseAdmin
            .from("users")
            .update({
              agent_subscription_status: subscriptionStatus,
            })
            .eq("id", user.id);

          console.log("✅ Subscription status updated to:", subscriptionStatus);
        }

        break;
      }

      // When a subscription is canceled (agent subscription)
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        console.log("❌ Subscription canceled:", subscription.id);

        // Update user's subscription status to cancelled
        const { data: user } = await supabaseAdmin
          .from("users")
          .select("id")
          .eq("agent_subscription_id", subscription.id)
          .single();

        if (user) {
          await supabaseAdmin
            .from("users")
            .update({
              agent_subscription_status: "cancelled",
            })
            .eq("id", user.id);

          console.log("✅ Subscription cancelled for user:", user.id);
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Webhook error:", errorMessage);
    return new NextResponse(`Webhook Error: ${errorMessage}`, { status: 400 });
  }
}
