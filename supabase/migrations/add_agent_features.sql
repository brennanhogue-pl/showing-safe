-- Add agent subscription and enhanced claim features
-- This migration adds support for real estate agent subscriptions and enhanced claim tracking

-- ============================================================================
-- STEP 1: Add agent subscription fields to users table
-- ============================================================================

ALTER TABLE users
ADD COLUMN IF NOT EXISTS agent_subscription_status TEXT DEFAULT 'none' CHECK (agent_subscription_status IN ('none', 'active', 'cancelled')),
ADD COLUMN IF NOT EXISTS agent_subscription_id TEXT,
ADD COLUMN IF NOT EXISTS agent_subscription_start TIMESTAMP WITH TIME ZONE;

-- Add index for faster subscription status queries
CREATE INDEX IF NOT EXISTS idx_users_agent_subscription_status ON users(agent_subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_agent_subscription_id ON users(agent_subscription_id);

-- Add comments for documentation
COMMENT ON COLUMN users.agent_subscription_status IS 'Agent subscription status: none, active, or cancelled';
COMMENT ON COLUMN users.agent_subscription_id IS 'Stripe subscription ID for agent monthly subscription';
COMMENT ON COLUMN users.agent_subscription_start IS 'Timestamp when agent subscription started';

-- ============================================================================
-- STEP 2: Add claim type and agent-specific fields to claims table
-- ============================================================================

ALTER TABLE claims
ADD COLUMN IF NOT EXISTS claim_type TEXT DEFAULT 'homeowner_showing' CHECK (claim_type IN ('homeowner_showing', 'agent_subscription', 'agent_listing')),
ADD COLUMN IF NOT EXISTS at_fault_party TEXT,
ADD COLUMN IF NOT EXISTS at_fault_name TEXT,
ADD COLUMN IF NOT EXISTS at_fault_phone TEXT,
ADD COLUMN IF NOT EXISTS at_fault_email TEXT,
ADD COLUMN IF NOT EXISTS homeowner_name TEXT,
ADD COLUMN IF NOT EXISTS homeowner_phone TEXT,
ADD COLUMN IF NOT EXISTS homeowner_email TEXT,
ADD COLUMN IF NOT EXISTS homeowner_address TEXT,
ADD COLUMN IF NOT EXISTS showing_proof_url TEXT,
ADD COLUMN IF NOT EXISTS max_payout_amount DECIMAL(10, 2);

-- Add index for faster claim type queries
CREATE INDEX IF NOT EXISTS idx_claims_claim_type ON claims(claim_type);

-- Add comments for documentation
COMMENT ON COLUMN claims.claim_type IS 'Type of claim: homeowner_showing (homeowner protection), agent_subscription (agent monthly subscription claim), agent_listing (agent protecting their own listing)';
COMMENT ON COLUMN claims.at_fault_party IS 'Who was at fault: agent or client';
COMMENT ON COLUMN claims.at_fault_name IS 'Full name of person at fault';
COMMENT ON COLUMN claims.at_fault_phone IS 'Phone number of person at fault';
COMMENT ON COLUMN claims.at_fault_email IS 'Email of person at fault';
COMMENT ON COLUMN claims.homeowner_name IS 'Full name of homeowner (for agent claims where payout goes to homeowner)';
COMMENT ON COLUMN claims.homeowner_phone IS 'Phone number of homeowner';
COMMENT ON COLUMN claims.homeowner_email IS 'Email of homeowner';
COMMENT ON COLUMN claims.homeowner_address IS 'Property address where incident occurred (for agent subscription claims)';
COMMENT ON COLUMN claims.showing_proof_url IS 'URL to showing proof document (screenshot of MLS showing details, etc.)';
COMMENT ON COLUMN claims.max_payout_amount IS 'Maximum payout amount for this claim (e.g., $1000 for agent subscription claims)';

-- ============================================================================
-- STEP 3: Make policy_id nullable for agent subscription claims
-- ============================================================================

-- Agent subscription claims don't have an associated policy (Option C from planning)
-- We need to allow policy_id to be NULL for these claims
ALTER TABLE claims
ALTER COLUMN policy_id DROP NOT NULL;

-- Add a constraint to ensure logic is valid:
-- - If claim_type is 'agent_subscription', policy_id must be NULL
-- - If claim_type is 'homeowner_showing' or 'agent_listing', policy_id must NOT be NULL
ALTER TABLE claims
ADD CONSTRAINT check_claim_policy_requirement
CHECK (
  (claim_type = 'agent_subscription' AND policy_id IS NULL) OR
  (claim_type IN ('homeowner_showing', 'agent_listing') AND policy_id IS NOT NULL)
);

-- ============================================================================
-- STEP 4: Update RLS policies for agent subscription claims
-- ============================================================================

-- Drop existing claims RLS policies to recreate them with agent logic
DROP POLICY IF EXISTS "Users can view own claims" ON claims;
DROP POLICY IF EXISTS "Users can insert own claims" ON claims;
DROP POLICY IF EXISTS "Users can update own claims" ON claims;

-- Users can view their own claims (either via policy ownership or direct user_id for subscription claims)
-- We'll add a user_id column to claims to make this cleaner
ALTER TABLE claims
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE;

-- Add index for faster user claim queries
CREATE INDEX IF NOT EXISTS idx_claims_user_id ON claims(user_id);

COMMENT ON COLUMN claims.user_id IS 'Direct reference to user who filed the claim (used for agent subscription claims without policies)';

-- Recreate RLS policies with agent subscription support
CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT
  USING (
    -- Own claims directly (agent subscription claims)
    user_id = auth.uid()
    OR
    -- Own claims via policy (homeowner/agent listing claims)
    EXISTS (
      SELECT 1 FROM policies
      WHERE policies.id = claims.policy_id
      AND policies.user_id = auth.uid()
    )
    OR is_admin()
  );

-- Users can create claims if they own the policy OR if it's an agent subscription claim and they're subscribed
CREATE POLICY "Users can insert own claims"
  ON claims FOR INSERT
  WITH CHECK (
    -- Agent subscription claims: must have active subscription and no policy
    (
      claim_type = 'agent_subscription'
      AND user_id = auth.uid()
      AND EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND users.agent_subscription_status = 'active'
      )
      AND policy_id IS NULL
    )
    OR
    -- Policy-based claims: must own the policy
    (
      claim_type IN ('homeowner_showing', 'agent_listing')
      AND EXISTS (
        SELECT 1 FROM policies
        WHERE policies.id = claims.policy_id
        AND policies.user_id = auth.uid()
      )
    )
    OR is_admin()
  );

-- Users can update their own pending claims
CREATE POLICY "Users can update own claims"
  ON claims FOR UPDATE
  USING (
    (
      (
        user_id = auth.uid()
        OR
        EXISTS (
          SELECT 1 FROM policies
          WHERE policies.id = claims.policy_id
          AND policies.user_id = auth.uid()
        )
      )
      AND status = 'pending'
    )
    OR is_admin()
  );

-- ============================================================================
-- STEP 5: Create storage bucket for showing proof documents
-- ============================================================================

-- Create bucket for showing proof documents (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('showing-proofs', 'showing-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for showing proof uploads
CREATE POLICY "Users can upload their own showing proofs"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'showing-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Create RLS policy for viewing showing proofs
CREATE POLICY "Users can view their own showing proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'showing-proofs'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all showing proofs
CREATE POLICY "Admins can view all showing proofs"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'showing-proofs'
    AND is_admin()
  );

-- ============================================================================
-- STEP 6: Add validation for file size (50MB max - industry standard)
-- ============================================================================

-- Note: File size validation will be handled at the application layer
-- Supabase storage has a default 50MB limit per file which is appropriate
-- for PDF and image uploads

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON CONSTRAINT check_claim_policy_requirement ON claims IS 'Ensures agent_subscription claims have no policy, while other claim types require a policy';
