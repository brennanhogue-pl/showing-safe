import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

// Define allowed price IDs from environment variables
// These are the only price IDs that can be used for checkout
const ALLOWED_PRICE_IDS = [
  process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_AGENT_MONTHLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_BUYER_AGENT_MONTHLY,
  process.env.NEXT_PUBLIC_STRIPE_PRICE_ADDITIONAL_LISTING,
].filter(Boolean); // Remove undefined values

interface CheckoutRequest {
  priceId: string;
  userId: string;
  propertyAddress: string;
  coverageType: string;
}

/**
 * Validates checkout request data
 * Ensures all fields are present, properly typed, and authorized
 */
function validateCheckoutRequest(data: unknown): CheckoutRequest | null {
  if (!data || typeof data !== 'object') {
    return null;
  }

  const record = data as Record<string, unknown>;
  const { priceId, userId, propertyAddress, coverageType } = record;

  // Validate priceId is in the allowed list (prevents price manipulation)
  if (typeof priceId !== 'string' || !ALLOWED_PRICE_IDS.includes(priceId)) {
    console.error("❌ Invalid or unauthorized priceId:", priceId);
    return null;
  }

  // Validate userId
  if (!userId || typeof userId !== 'string' || userId.trim() === '') {
    console.error("❌ Invalid userId");
    return null;
  }

  // Validate propertyAddress
  if (!propertyAddress || typeof propertyAddress !== 'string' || propertyAddress.trim() === '') {
    console.error("❌ Invalid propertyAddress");
    return null;
  }

  // Validate coverageType against allowed values
  const validCoverageTypes = [
    'Single-Use Policy',
    'Listing Agent Subscription',
    'Buyer Agent Subscription',
    'Add-On Listing'
  ];
  if (typeof coverageType !== 'string' || !validCoverageTypes.includes(coverageType)) {
    console.error("❌ Invalid coverageType:", coverageType);
    return null;
  }

  return { priceId, userId, propertyAddress, coverageType };
}

export async function POST(req: Request) {
  try {
    // Parse JSON with error handling
    let body;
    try {
      body = await req.json();
    } catch {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    // Validate request data
    const validatedData = validateCheckoutRequest(body);
    if (!validatedData) {
      return new NextResponse("Invalid request parameters", { status: 400 });
    }

    const { priceId, userId, propertyAddress, coverageType } = validatedData;

    // Map coverage type display name to database value
    const coverageTypeMap: { [key: string]: string } = {
      'Single-Use Policy': 'single',
      'Listing Agent Subscription': 'subscription',
      'Buyer Agent Subscription': 'subscription',
      'Add-On Listing': 'single'
    };

    const dbCoverageType = coverageTypeMap[coverageType] || 'single';

    // Validate environment variables
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;
    if (!appUrl) {
      console.error("❌ NEXT_PUBLIC_APP_URL not configured");
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "payment",
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cancel`,
      metadata: {
        userId,
        propertyAddress,
        coverageType: dbCoverageType, // Use mapped database value
      },
      // Add customer email collection
      customer_email: undefined, // TODO: Pass from authenticated user
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("❌ Checkout error:", errorMessage);
    // Don't expose internal error details to client
    return new NextResponse("Unable to create checkout session", { status: 500 });
  }
}
