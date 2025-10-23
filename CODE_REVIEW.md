# ShowingSafe Project - Comprehensive Code Review

## Project Summary

**ShowingSafe** is a Next.js 15 application that provides insurance policy management for real estate showings. The application integrates:
- **Stripe** for payment processing (single-use policies and subscriptions)
- **Supabase** as the database backend
- A webhook system to activate policies upon successful payment

The current implementation provides a basic checkout flow where users can purchase insurance coverage, and upon successful payment, a policy record is automatically created in the database via Stripe webhooks.

---

## CRITICAL SECURITY ISSUES

### 1. **EXPOSED SECRETS IN VERSION CONTROL**
**Priority: CRITICAL - Fix Immediately**
**File: `/Users/brennanhogue/Desktop/showing-safe/.env.local`**

Your `.env.local` file contains actual production/test API keys and secrets that should NEVER be committed to version control:

- Supabase Service Role Key (full database admin access)
- Stripe Secret Key
- Stripe Webhook Secret
- Public Supabase URL and keys

**Impact:** Anyone with access to this repository has full administrative access to your database and can make unauthorized charges through Stripe.

**Fix Required:**
```bash
# 1. Immediately rotate ALL secrets in Stripe and Supabase dashboards
# 2. Add .env.local to .gitignore
echo ".env.local" >> .gitignore
echo ".env*.local" >> .gitignore

# 3. Remove from git history
git rm --cached .env.local
git commit -m "Remove exposed secrets"

# 4. If this repo is public or has been pushed, consider all keys compromised
```

Create a `.env.example` instead:
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

### 2. **Missing Webhook Signature Verification Error Handling**
**Priority: CRITICAL**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts`**
**Lines: 7-14**

```typescript
const sig = req.headers.get("stripe-signature");

try {
  const event = stripe.webhooks.constructEvent(
    body,
    sig!,  // ❌ Using non-null assertion on potentially null value
    process.env.STRIPE_WEBHOOK_SECRET!
  );
```

**Issues:**
1. Using `sig!` forces TypeScript to assume the signature exists, but it could be `null`
2. No explicit check if signature header is present before verification
3. An attacker could send requests without the signature header, causing a runtime error

**Fix:**
```typescript
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
    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    // ... rest of handler
```

---

### 3. **SQL Injection Risk via Unvalidated Metadata**
**Priority: CRITICAL**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts`**
**Lines: 19-32**

```typescript
const session = event.data.object as any;  // ❌ Using 'any' type
const metadata = session.metadata;

// ✅ Insert new policy record in Supabase using the service role client
const { error } = await supabaseAdmin.from("policies").insert([
  {
    user_id: metadata.userId,          // ❌ No validation
    property_address: metadata.propertyAddress,  // ❌ No validation
    coverage_type: metadata.coverageType,        // ❌ No validation
    status: "active",
  },
]);
```

**Issues:**
1. No validation that metadata exists or contains expected fields
2. No type safety - using `any` type
3. Could insert `undefined` or malicious values into database
4. No validation of data types or lengths

**Fix:**
```typescript
import Stripe from 'stripe';

// Define proper types
interface PolicyMetadata {
  userId: string;
  propertyAddress: string;
  coverageType: string;
}

function validatePolicyMetadata(metadata: any): PolicyMetadata | null {
  if (!metadata) {
    console.error("❌ Missing metadata");
    return null;
  }

  const { userId, propertyAddress, coverageType } = metadata;

  // Validate required fields
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

  // Validate length constraints
  if (userId.length > 255 || propertyAddress.length > 500 || coverageType.length > 100) {
    console.error("❌ Metadata fields exceed maximum length");
    return null;
  }

  return { userId, propertyAddress, coverageType };
}

// In the webhook handler:
case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;

  const validatedMetadata = validatePolicyMetadata(session.metadata);
  if (!validatedMetadata) {
    console.error("❌ Invalid metadata in checkout session:", session.id);
    // Still return 200 to acknowledge receipt (Stripe best practice)
    return NextResponse.json({ received: true, error: "Invalid metadata" });
  }

  console.log("✅ Checkout completed for:", validatedMetadata);

  const { error } = await supabaseAdmin.from("policies").insert([
    {
      user_id: validatedMetadata.userId,
      property_address: validatedMetadata.propertyAddress,
      coverage_type: validatedMetadata.coverageType,
      status: "active",
    },
  ]);

  if (error) {
    console.error("❌ Supabase insert error:", error.message);
    // Log for monitoring but return 200 to prevent retries
    // Consider implementing a retry queue for failed inserts
  } else {
    console.log("✅ Policy activated:", validatedMetadata.propertyAddress);
  }
  break;
}
```

---

### 4. **Missing Input Validation in Checkout API**
**Priority: HIGH**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/checkout/route.ts`**
**Lines: 6-20**

```typescript
const { priceId, userId, propertyAddress, coverageType } = await req.json();

// Create a Stripe checkout session
const session = await stripe.checkout.sessions.create({
  payment_method_types: ["card"],
  line_items: [{ price: priceId, quantity: 1 }],  // ❌ No validation
  mode: "payment",
  success_url: `${process.env.NEXT_PUBLIC_APP_URL}/success`,
  cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cancel`,
  metadata: {
    userId,              // ❌ No validation
    propertyAddress,     // ❌ No validation
    coverageType,        // ❌ No validation
  },
});
```

**Issues:**
1. No validation of input parameters
2. Malicious user could pass arbitrary `priceId` to charge different amounts
3. No authentication - anyone can create checkout sessions
4. No rate limiting
5. Missing error handling for malformed JSON

**Fix:**
```typescript
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

// Define allowed price IDs from environment
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

function validateCheckoutRequest(data: any): CheckoutRequest | null {
  const { priceId, userId, propertyAddress, coverageType } = data || {};

  // Validate priceId is in allowed list
  if (!priceId || !ALLOWED_PRICE_IDS.includes(priceId)) {
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

  // Validate coverageType
  const validCoverageTypes = ['Single-Use Policy', 'Listing Agent Subscription', 'Buyer Agent Subscription', 'Add-On Listing'];
  if (!coverageType || !validCoverageTypes.includes(coverageType)) {
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
    } catch (e) {
      return new NextResponse("Invalid JSON", { status: 400 });
    }

    // Validate request
    const validatedData = validateCheckoutRequest(body);
    if (!validatedData) {
      return new NextResponse("Invalid request parameters", { status: 400 });
    }

    const { priceId, userId, propertyAddress, coverageType } = validatedData;

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
        coverageType,
      },
      // Add customer email collection
      customer_email: undefined, // TODO: Pass from authenticated user
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("❌ Checkout error:", err.message);
    // Don't expose internal error details to client
    return new NextResponse("Unable to create checkout session", { status: 500 });
  }
}
```

---

### 5. **Hardcoded Test Data in Production Code**
**Priority: HIGH**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/page.tsx`**
**Lines: 13-18**

```typescript
const body = {
  priceId: "price_1SIbMM4NYEkiDrYSnRv9FA2j", // TEMP: your test Single-Use price
  userId: "test-user-123",  // ❌ Hardcoded test user
  propertyAddress: "123 Test St, Salt Lake City, UT",  // ❌ Hardcoded
  coverageType: "Single-Use Policy",
};
```

**Issues:**
1. Hardcoded price ID in client code
2. All users would be created as "test-user-123"
3. Not production-ready - needs authentication and real user data

**Fix:**
```typescript
"use client";

import { useState } from "react";

export default function HomePage() {
  const [loading, setLoading] = useState(false);
  const [propertyAddress, setPropertyAddress] = useState("");
  const [coverageType, setCoverageType] = useState("Single-Use Policy");

  const handleCheckout = async () => {
    try {
      setLoading(true);

      // TODO: Get userId from authentication context
      // For now, this should error out in production
      const userId = "test-user-123"; // TODO: Replace with actual auth

      if (!propertyAddress.trim()) {
        alert("Please enter a property address");
        return;
      }

      const body = {
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SINGLE,
        userId,
        propertyAddress,
        coverageType,
      };

      console.log("🧾 Sending checkout payload:", body);

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Checkout failed: ${errText}`);
      }

      const data = await res.json();
      console.log("✅ Stripe checkout session created:", data);

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (err: any) {
      console.error("❌ Checkout error:", err.message);
      alert("Something went wrong starting checkout — check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen space-y-6 bg-gray-50 p-4">
      <h1 className="text-3xl font-bold text-gray-900">
        ShowingSafe - Property Insurance
      </h1>

      <div className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
            Property Address
          </label>
          <input
            id="address"
            type="text"
            value={propertyAddress}
            onChange={(e) => setPropertyAddress(e.target.value)}
            placeholder="123 Main St, Salt Lake City, UT"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="coverage" className="block text-sm font-medium text-gray-700 mb-2">
            Coverage Type
          </label>
          <select
            id="coverage"
            value={coverageType}
            onChange={(e) => setCoverageType(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option>Single-Use Policy</option>
            <option>Listing Agent Subscription</option>
            <option>Buyer Agent Subscription</option>
            <option>Add-On Listing</option>
          </select>
        </div>

        <button
          onClick={handleCheckout}
          disabled={loading}
          className={`w-full px-6 py-3 rounded-lg font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Redirecting..." : "Buy Coverage"}
        </button>
      </div>

      <p className="text-xs text-gray-400 mt-4">
        Use test card: 4242 4242 4242 4242 — Any date, CVC, ZIP.
      </p>
    </main>
  );
}
```

---

### 6. **Supabase Client Misconfiguration**
**Priority: MEDIUM**
**Files: `/Users/brennanhogue/Desktop/showing-safe/src/lib/supabase.ts` and `/Users/brennanhogue/Desktop/showing-safe/src/lib/supabaseClient.ts`**

**Issues:**
1. You have **two duplicate files** creating the same client: `supabase.ts` and `supabaseClient.ts`
2. Both use environment variables in client-side code without proper checks
3. The client-side Supabase client is imported in server-side route (`/api/test/route.ts`)

**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/test/route.ts`**
```typescript
import { supabase } from "@/lib/supabase";  // ❌ Using client-side Supabase in API route
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("users").select("*").limit(1);
  // This should use supabaseAdmin instead
```

**Fix:**
1. Remove duplicate file:
```bash
rm /Users/brennanhogue/Desktop/showing-safe/src/lib/supabaseClient.ts
```

2. Update `/Users/brennanhogue/Desktop/showing-safe/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

// Client-side Supabase client - use only in browser/client components
if (typeof window === 'undefined') {
  console.warn('⚠️ Client-side Supabase client imported in server context');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

3. Update `/Users/brennanhogue/Desktop/showing-safe/src/lib/supabaseAdmin.ts`:
```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase admin environment variables');
}

// Admin client - SERVER-SIDE ONLY - bypasses Row Level Security
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
```

4. Fix the test route:
```typescript
import { supabaseAdmin } from "@/lib/supabaseAdmin";  // ✅ Use admin client
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("users").select("*").limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
```

---

### 7. **Missing Webhook Idempotency**
**Priority: MEDIUM**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts`**

Stripe webhooks can be sent multiple times for the same event. Your current implementation will create duplicate policy records.

**Fix:**
```typescript
case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;

  const validatedMetadata = validatePolicyMetadata(session.metadata);
  if (!validatedMetadata) {
    console.error("❌ Invalid metadata in checkout session:", session.id);
    return NextResponse.json({ received: true, error: "Invalid metadata" });
  }

  console.log("✅ Checkout completed for:", validatedMetadata);

  // Check if policy already exists for this session
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
  const { error } = await supabaseAdmin.from("policies").insert([
    {
      user_id: validatedMetadata.userId,
      property_address: validatedMetadata.propertyAddress,
      coverage_type: validatedMetadata.coverageType,
      status: "active",
      stripe_session_id: session.id,  // Add this field to your schema
      stripe_payment_intent: session.payment_intent,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    // Check if it's a unique constraint violation (race condition)
    if (error.code === '23505') {
      console.log("✅ Policy already created (race condition handled)");
      return NextResponse.json({ received: true, status: "duplicate" });
    }

    console.error("❌ Supabase insert error:", error.message);
    // Consider implementing a dead letter queue for failed webhooks
  } else {
    console.log("✅ Policy activated:", validatedMetadata.propertyAddress);
  }
  break;
}
```

You'll need to add a unique constraint to your `policies` table:
```sql
ALTER TABLE policies ADD COLUMN stripe_session_id TEXT UNIQUE;
ALTER TABLE policies ADD COLUMN stripe_payment_intent TEXT;
```

---

### 8. **Missing Error Monitoring and Logging**
**Priority: MEDIUM**

Currently, all errors are only logged to console. In production, you need proper error monitoring.

**Recommendations:**
1. Integrate error tracking (Sentry, LogRocket, or similar)
2. Add structured logging
3. Set up alerts for critical errors (failed webhook processing, payment issues)

---

### 9. **Missing CORS and Rate Limiting**
**Priority: MEDIUM**

The checkout API endpoint has no protection against:
- Cross-origin requests from unauthorized domains
- Rate limiting / DDoS attacks
- Abuse (creating unlimited checkout sessions)

**Fix:** Add rate limiting middleware or use Vercel's built-in protection.

---

### 10. **Next.js API Route Configuration Issue**
**Priority: LOW**
**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts`**
**Lines: 61-65**

```typescript
export const config = {
  api: {
    bodyParser: false,  // ❌ This is Pages Router syntax, not App Router
  },
};
```

**Issue:** This configuration syntax is for Next.js Pages Router, not App Router. In App Router, this config is ignored and could cause confusion.

**Fix:** Remove this config block. In Next.js App Router (13+), body parsing is handled differently. If you need the raw body, you're already getting it correctly with `await req.text()`.

---

## BEST PRACTICES & CODE QUALITY ISSUES

### 11. **TypeScript Type Safety**
**Priority: MEDIUM**

Multiple uses of `any` and non-null assertions (`!`) throughout the codebase reduce type safety:

- `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts` Line 19: `const session = event.data.object as any;`
- `/Users/brennanhogue/Desktop/showing-safe/src/app/api/webhooks/stripe/route.ts` Line 45: `const subscription = event.data.object as any;`
- `/Users/brennanhogue/Desktop/showing-safe/src/app/page.tsx` Line 38: `catch (err: any)`

**Recommendation:** Import proper Stripe types:
```typescript
import Stripe from 'stripe';

case "checkout.session.completed": {
  const session = event.data.object as Stripe.Checkout.Session;
  // Now you have proper type checking

case "customer.subscription.deleted": {
  const subscription = event.data.object as Stripe.Subscription;
```

---

### 12. **Missing Database Schema Documentation**

There's no visible database schema file. I couldn't find the Supabase schema that was mentioned in the commits.

**Recommendation:** Create a schema file for documentation and migrations:

**File: `/Users/brennanhogue/Desktop/showing-safe/supabase/schema.sql`**
```sql
-- ShowingSafe Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Policies table
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  property_address TEXT NOT NULL,
  coverage_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_policies_user_id ON policies(user_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_stripe_session_id ON policies(stripe_session_id);

-- Row Level Security (RLS)
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- Users can only read their own policies
CREATE POLICY "Users can view own policies"
  ON policies FOR SELECT
  USING (auth.uid()::text = user_id);

-- Only authenticated users can insert (via webhook using service role)
-- Service role bypasses RLS, so this is for direct client access
CREATE POLICY "Authenticated users can insert policies"
  ON policies FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_policies_updated_at BEFORE UPDATE
  ON policies FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 13. **Missing Success/Cancel Pages**

The checkout redirects to `/success` and `/cancel` routes that don't exist.

**Fix:** Create these pages:

**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/success/page.tsx`**
```typescript
"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-green-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Successful!
          </h1>
          <p className="text-gray-600 mb-6">
            Your ShowingSafe policy has been activated.
          </p>
          {sessionId && (
            <p className="text-xs text-gray-400">
              Session ID: {sessionId}
            </p>
          )}
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return Home
          </a>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
```

**File: `/Users/brennanhogue/Desktop/showing-safe/src/app/cancel/page.tsx`**
```typescript
export default function CancelPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 mb-6">
            Your payment was cancelled. No charges were made.
          </p>
          <a
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </a>
        </div>
      </div>
    </main>
  );
}
```

---

### 14. **Missing Environment Variable Validation**

**Create a centralized env validation file:**

**File: `/Users/brennanhogue/Desktop/showing-safe/src/lib/env.ts`**
```typescript
// Centralized environment variable validation

function getEnvVar(key: string, isPublic: boolean = false): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add it to your .env.local file.`
    );
  }

  return value;
}

// Server-side only variables
export const env = {
  stripe: {
    secretKey: getEnvVar('STRIPE_SECRET_KEY'),
    webhookSecret: getEnvVar('STRIPE_WEBHOOK_SECRET'),
  },
  supabase: {
    serviceRoleKey: getEnvVar('SUPABASE_SERVICE_ROLE_KEY'),
  },
};

// Public variables (available client-side)
export const publicEnv = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL', true),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY', true),
  },
  stripe: {
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', true),
  },
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL', true),
  },
};
```

Then use in your code:
```typescript
import { env } from '@/lib/env';

export const stripe = new Stripe(env.stripe.secretKey, {
  apiVersion: "2024-06-20",
});
```

---

## POSITIVE ASPECTS

1. **Good webhook structure**: Using Stripe's webhook signature verification is correct
2. **Separation of concerns**: Separate files for Supabase admin and client
3. **Using App Router**: Modern Next.js 15 with App Router
4. **TypeScript**: Project uses TypeScript for type safety
5. **Proper metadata usage**: Passing metadata through Stripe checkout to webhook is the right pattern
6. **Error handling**: Basic try-catch blocks are in place

---

## SUMMARY OF PRIORITIES

### Fix Immediately (Critical):
1. ✅ Remove `.env.local` from git and rotate all secrets
2. ✅ Add null checks for webhook signature
3. ✅ Validate all webhook metadata before database insert
4. ✅ Validate checkout API inputs and restrict price IDs

### Fix Soon (High):
5. ✅ Remove hardcoded test data from production code
6. ✅ Fix Supabase client usage in API routes
7. ✅ Add webhook idempotency handling

### Fix When Possible (Medium):
8. ✅ Add proper TypeScript types (remove `any`)
9. ✅ Create success/cancel pages
10. ✅ Add error monitoring
11. ✅ Document database schema
12. ✅ Add rate limiting
13. ✅ Centralize environment variable validation

### Nice to Have (Low):
14. ✅ Remove incorrect `config` export from webhook
15. ✅ Add comprehensive logging
16. ✅ Add authentication system

---

## RECOMMENDED NEXT STEPS

1. **Immediately**: Rotate all API keys and remove from version control
2. **Security**: Implement all critical security fixes listed above
3. **Authentication**: Add user authentication (Supabase Auth or NextAuth.js)
4. **Testing**: Add unit tests for validation functions and API routes
5. **Monitoring**: Set up error tracking (Sentry) and logging
6. **Documentation**: Create README with setup instructions and architecture overview
7. **Database**: Add proper migrations and RLS policies to Supabase

---

This is a solid foundation for a Stripe + Supabase integration, but it needs significant security hardening before production deployment. The main concerns are exposed secrets, missing input validation, and lack of authentication. With the fixes outlined above, this will be a much more secure and production-ready application.
