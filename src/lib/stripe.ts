import Stripe from "stripe";
import { env } from "@/lib/env";

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: "2025-09-30.clover",
});
