# Database Migration Guide

## Overview
This guide explains how to migrate from the old schema to the corrected schema for ShowingSafe.

## Critical Changes Made

### 1. Added `users` Table
- New table to store user profiles with role-based access control
- Links to `auth.users.id` via foreign key
- Includes: email, role (homeowner/agent/admin), full_name, phone
- Automatic user profile creation via trigger on auth.users

### 2. Added `claims` Table
- New table for claim management (core feature)
- Links to policies via `policy_id` foreign key
- Includes: description, proof_url, status (pending/approved/denied)

### 3. Fixed `policies` Table
- Changed `user_id` from TEXT to UUID
- Added `stripe_subscription_id` column
- Added foreign key constraint to `users(id)`
- Added CHECK constraints for data validation
- Fixed RLS policies to use UUID natively (no casting)

### 4. Admin Bypass Logic
- Created `is_admin()` helper function
- Updated all RLS policies to check admin status
- Admins can view/edit all records across the system

## Migration Steps

### If Starting Fresh (Recommended for Development)

1. Drop the existing database (if using local Supabase):
```bash
supabase db reset
```

2. Apply the new schema:
```bash
supabase db push
```

### If Migrating Existing Data (Production)

Create a new migration file:

```sql
-- Migration: Fix schema and add missing tables
-- File: supabase/migrations/YYYYMMDDHHMMSS_fix_schema.sql

BEGIN;

-- Step 1: Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('homeowner', 'agent', 'admin')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Step 2: Create is_admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Migrate existing policies data
-- Add new column with temp name
ALTER TABLE policies ADD COLUMN user_id_uuid UUID;

-- If you have existing data, you'll need to map TEXT user_ids to UUIDs
-- This assumes user_id was storing auth.uid() as text
UPDATE policies SET user_id_uuid = user_id::uuid WHERE user_id IS NOT NULL;

-- Drop old column and rename new one
ALTER TABLE policies DROP COLUMN user_id;
ALTER TABLE policies RENAME COLUMN user_id_uuid TO user_id;
ALTER TABLE policies ALTER COLUMN user_id SET NOT NULL;

-- Add foreign key constraint
ALTER TABLE policies ADD CONSTRAINT policies_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Add missing column
ALTER TABLE policies ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Add CHECK constraints
ALTER TABLE policies ADD CONSTRAINT coverage_type_check
  CHECK (coverage_type IN ('single', 'subscription'));
ALTER TABLE policies ADD CONSTRAINT status_check
  CHECK (status IN ('pending', 'active', 'expired'));

-- Add index for new column
CREATE INDEX IF NOT EXISTS idx_policies_stripe_subscription_id
  ON policies(stripe_subscription_id);

-- Drop old RLS policies
DROP POLICY IF EXISTS "Users can view own policies" ON policies;
DROP POLICY IF EXISTS "Authenticated users can insert policies" ON policies;

-- Step 4: Create claims table
CREATE TABLE IF NOT EXISTS claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  policy_id UUID NOT NULL REFERENCES policies(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  proof_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_claims_policy_id ON claims(policy_id);
CREATE INDEX IF NOT EXISTS idx_claims_status ON claims(status);
ALTER TABLE claims ENABLE ROW LEVEL SECURITY;

-- Step 5: Create updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
  ON users FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_claims_updated_at BEFORE UPDATE
  ON claims FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Step 6: Create all RLS policies

-- Users table policies
CREATE POLICY "Users can view own record"
  ON users FOR SELECT
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Users can update own record"
  ON users FOR UPDATE
  USING (auth.uid() = id OR is_admin());

CREATE POLICY "Admins can insert users"
  ON users FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  USING (is_admin());

-- Policies table policies
CREATE POLICY "Users can view own policies"
  ON policies FOR SELECT
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can insert own policies"
  ON policies FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_admin());

CREATE POLICY "Users can update own policies"
  ON policies FOR UPDATE
  USING (auth.uid() = user_id OR is_admin());

CREATE POLICY "Admins can delete policies"
  ON policies FOR DELETE
  USING (is_admin());

-- Claims table policies
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

CREATE POLICY "Admins can delete claims"
  ON claims FOR DELETE
  USING (is_admin());

-- Step 7: Create auto-user-profile trigger
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

COMMIT;
```

## Post-Migration Tasks

### 1. Populate Users Table
If you have existing auth.users, create user profiles:

```sql
-- Run this to create user profiles for existing auth users
INSERT INTO public.users (id, email, role, full_name)
SELECT
  id,
  email,
  COALESCE(raw_user_meta_data->>'role', 'homeowner') as role,
  COALESCE(raw_user_meta_data->>'full_name', '') as full_name
FROM auth.users
ON CONFLICT (id) DO NOTHING;
```

### 2. Create First Admin User
```sql
-- Update a user to be an admin
UPDATE users SET role = 'admin' WHERE email = 'your-admin@example.com';
```

### 3. Verify RLS Policies
```sql
-- Check all policies are in place
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4. Test Access Control
```sql
-- Test as regular user (should only see own records)
SELECT * FROM policies;
SELECT * FROM claims;

-- Test as admin (should see all records)
SELECT * FROM policies;
SELECT * FROM claims;
```

## Rollback Plan

If you need to rollback the migration:

```sql
BEGIN;

-- Drop new tables
DROP TABLE IF EXISTS claims CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Restore old policies table structure
ALTER TABLE policies DROP CONSTRAINT IF EXISTS policies_user_id_fkey;
ALTER TABLE policies ADD COLUMN user_id_text TEXT;
UPDATE policies SET user_id_text = user_id::text;
ALTER TABLE policies DROP COLUMN user_id;
ALTER TABLE policies RENAME COLUMN user_id_text TO user_id;
ALTER TABLE policies DROP COLUMN IF EXISTS stripe_subscription_id;

-- Restore old RLS policies
CREATE POLICY "Users can view own policies"
  ON policies FOR SELECT
  USING (auth.uid()::text = user_id);

CREATE POLICY "Authenticated users can insert policies"
  ON policies FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Drop new functions
DROP FUNCTION IF EXISTS is_admin();
DROP FUNCTION IF EXISTS handle_new_user() CASCADE;

COMMIT;
```

## Testing Checklist

- [ ] Users table created with proper foreign keys
- [ ] Claims table created with proper foreign keys
- [ ] Policies table has UUID user_id
- [ ] All indexes created
- [ ] All RLS policies active
- [ ] Admin bypass works for all tables
- [ ] Regular users can only see their own data
- [ ] Auto-user-profile trigger works on signup
- [ ] Foreign key cascades work correctly
- [ ] CHECK constraints enforce valid values

## Common Issues

### Issue: "column user_id cannot be cast to uuid"
**Solution**: Run the migration script that creates user_id_uuid column first

### Issue: "violates foreign key constraint"
**Solution**: Ensure users table is populated before adding foreign key to policies

### Issue: "RLS policy prevents access"
**Solution**: Check that user has proper role set in users table

### Issue: "is_admin() function returns null"
**Solution**: Ensure user exists in users table with role set
