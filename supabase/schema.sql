-- ShowingSafe Database Schema
-- Complete schema with proper foreign keys, RLS policies, and admin bypass logic

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
-- Stores user profiles linked to auth.users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('homeowner', 'agent', 'admin')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index for faster role-based queries
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- ADMIN HELPER FUNCTION
-- ============================================================================
-- Check if the current user has admin role
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- POLICIES TABLE
-- ============================================================================
-- Insurance policies for properties
CREATE TABLE IF NOT EXISTS policies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_address TEXT NOT NULL,
  coverage_type TEXT NOT NULL CHECK (coverage_type IN ('single', 'subscription')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired')),
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_policies_user_id ON policies(user_id);
CREATE INDEX IF NOT EXISTS idx_policies_status ON policies(status);
CREATE INDEX IF NOT EXISTS idx_policies_stripe_session_id ON policies(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_policies_stripe_subscription_id ON policies(stripe_subscription_id);

-- Enable RLS on policies table
ALTER TABLE policies ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CLAIMS TABLE
-- ============================================================================
-- Claims submitted for policies
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  incident_date DATE NOT NULL,
  damaged_items TEXT NOT NULL,
  supra_showing_number TEXT NOT NULL,
  description TEXT NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_claims_policy_id ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);

-- Enable RLS on claims table
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- TRIGGERS
-- ============================================================================
-- Auto-update updated_at timestamp on record changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to users table
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON users FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to policies table
CREATE TRIGGER update_policies_updated_at BEFORE UPDATE
  ON policies FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to claims table
CREATE TRIGGER update_claims_updated_at BEFORE UPDATE
  ON claims FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - USERS TABLE
-- ============================================================================

-- Users can view their own record
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid() = id OR is_admin());

-- Users can update their own record (except role)
CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid() = id OR is_admin());

-- Only admins can insert new users (or service role via trigger)
CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

-- Admins can delete users
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (is_admin());

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - POLICIES TABLE
-- ============================================================================

-- Users can view their own policies, admins can view all
CREATE POLICY "Users can view own policies"
  ON policies FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

-- Users can create their own policies, admins can create any
CREATE POLICY "Users can insert own policies"
  ON policies FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

-- Users can update their own policies, admins can update any
CREATE POLICY "Users can update own policies"
  ON policies FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

-- Admins can delete policies
CREATE POLICY "Admins can delete policies"
  ON policies FOR DELETE
  USING (is_admin());

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - CLAIMS TABLE
-- ============================================================================

-- Users can view claims for their own policies, admins can view all
CREATE POLICY "Users can view own claims"
  ON claims FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM policies
      WHERE policies.id = claims.policy_id
      AND policies.user_id = auth.uid()
    )
    OR is_admin()
  );

-- Users can create claims for their own policies, admins can create any
CREATE POLICY "Users can insert own claims"
  ON claims FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM policies
      WHERE policies.id = claims.policy_id
      AND policies.user_id = auth.uid()
    )
    OR is_admin()
  );

-- Users can update their own claims (only if pending), admins can update any
CREATE POLICY "Users can update own claims"
  ON claims FOR UPDATE
  USING (
    (
      EXISTS (
        SELECT 1 FROM policies
        WHERE policies.id = claims.policy_id
        AND policies.user_id = auth.uid()
      )
      AND status = 'pending'
    )
    OR is_admin()
  );

-- Admins can delete claims
CREATE POLICY "Admins can delete claims"
  ON claims FOR DELETE
  USING (is_admin());

-- ============================================================================
-- HELPER FUNCTION TO CREATE USER PROFILE ON SIGNUP
-- ============================================================================
-- This function should be called by a trigger on auth.users insert
-- or by your application after user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE users IS 'User profiles linked to Supabase auth.users with role-based access control';
COMMENT ON TABLE policies IS 'Insurance policies for properties with Stripe integration';
COMMENT ON TABLE claims IS 'Claims submitted against active policies';
COMMENT ON FUNCTION is_admin() IS 'Helper function to check if current user has admin role for RLS bypass';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user profile when new auth user is created';
