// Centralized environment variable validation

function getEnvVar(key: string): string {
  const value = process.env[key];

  if (!value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Please add it to your .env.local file.`
    );
  }

  return value;
}

// Optional env var getter (doesn't throw if missing)
function getOptionalEnvVar(key: string): string | undefined {
  return process.env[key];
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
  resend: {
    apiKey: getOptionalEnvVar('RESEND_API_KEY'), // Optional for now
  },
};

// Public variables (available client-side)
export const publicEnv = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  stripe: {
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    agentSubscriptionPriceId: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_AGENT_SUBSCRIPTION_PRICE_ID'), // Optional - can be added after Stripe product creation
  },
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL'),
  },
};
