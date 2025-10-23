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

// Define the type for server-side env
type ServerEnv = {
  stripe: {
    secretKey: string;
    webhookSecret: string;
  };
  supabase: {
    serviceRoleKey: string;
  };
  resend: {
    apiKey: string | undefined;
  };
};

// Server-side only variables - only evaluate on server
export const env: ServerEnv = typeof window === 'undefined' ? {
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
} : {} as ServerEnv;

// Public variables (available client-side)
export const publicEnv = {
  supabase: {
    url: getEnvVar('NEXT_PUBLIC_SUPABASE_URL'),
    anonKey: getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  },
  stripe: {
    publishableKey: getEnvVar('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
    agentSubscriptionPriceId: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_AGENT_SUBSCRIPTION_PRICE_ID'), // Agent monthly subscription
    singleUsePriceId: getOptionalEnvVar('NEXT_PUBLIC_STRIPE_PRICE_SINGLE'), // Single-use listing protection
  },
  app: {
    url: getEnvVar('NEXT_PUBLIC_APP_URL'),
  },
};
