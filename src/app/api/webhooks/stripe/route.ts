import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    switch (event.type) {
      case "checkout.session.completed":
        // Example: update Supabase policy to active
        // TODO: Add Supabase logic here
        console.log("✅ Checkout completed:", event.data.object.id);
        break;

      case "customer.subscription.deleted":
        console.log("❌ Subscription canceled:", event.data.object.id);
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("❌ Webhook error:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
