/**
 * Script to create the Agent Subscription product in Stripe
 *
 * This creates:
 * - Product: "ShowingSafe Agent Subscription"
 * - Price: $9.99/month recurring
 *
 * Usage:
 * 1. Make sure your STRIPE_SECRET_KEY is set in .env.local
 * 2. Run: npx tsx scripts/create-stripe-agent-subscription.ts
 */

import Stripe from "stripe";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("❌ Error: STRIPE_SECRET_KEY not found in .env.local");
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-09-30.clover",
});

async function createAgentSubscription() {
  try {
    console.log("🚀 Creating Agent Subscription product in Stripe...\n");

    // Step 1: Create the Product
    console.log("📦 Creating product...");
    const product = await stripe.products.create({
      name: "ShowingSafe Agent Subscription",
      description:
        "Monthly subscription for real estate agents to file claims for incidents during showings. Covers up to $1,000 per claim with unlimited claims.",
      metadata: {
        type: "agent_subscription",
        max_claim_amount: "1000",
        claim_limit: "unlimited",
      },
    });

    console.log("✅ Product created:");
    console.log(`   ID: ${product.id}`);
    console.log(`   Name: ${product.name}\n`);

    // Step 2: Create the Price (Recurring monthly)
    console.log("💰 Creating price...");
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: 999, // $9.99 in cents
      currency: "usd",
      recurring: {
        interval: "month",
        interval_count: 1,
      },
      metadata: {
        type: "agent_subscription",
      },
    });

    console.log("✅ Price created:");
    console.log(`   ID: ${price.id}`);
    console.log(`   Amount: $${(price.unit_amount! / 100).toFixed(2)}/month\n`);

    // Step 3: Output environment variables
    console.log("📝 Add these to your .env.local file:\n");
    console.log("# Agent Subscription");
    console.log(`NEXT_PUBLIC_STRIPE_AGENT_SUBSCRIPTION_PRICE_ID=${price.id}`);
    console.log(`STRIPE_AGENT_SUBSCRIPTION_PRODUCT_ID=${product.id}`);
    console.log("\n✅ Done! Copy the above variables to your .env.local file.");
  } catch (error) {
    console.error("❌ Error creating Stripe product:", error);
    process.exit(1);
  }
}

createAgentSubscription();
