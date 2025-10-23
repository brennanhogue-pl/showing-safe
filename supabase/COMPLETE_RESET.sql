-- ============================================================================
-- COMPLETE DATABASE RESET FOR AUTHENTICATION
-- ============================================================================
-- This script completely resets the users table, triggers, and RLS policies
-- Run this in your Supabase SQL Editor to start fresh
-- WARNING: This will delete ALL user data!
-- ============================================================================

-- ============================================================================
-- STEP 1: Drop all existing policies on users table
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own record" ON users;
DROP POLICY IF EXISTS "Users can update own record" ON users;
DROP POLICY IF EXISTS "Admins can insert users" ON users;
DROP POLICY IF EXISTS "Admins can delete users" ON users;
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;
DROP POLICY IF EXISTS "admins_select_all" ON users;
DROP POLICY IF EXISTS "admins_update_all" ON users;
DROP POLICY IF EXISTS "admins_delete_all" ON users;

-- ============================================================================
-- STEP 2: Drop existing trigger and function
-- ============================================================================

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();

-- ============================================================================
-- STEP 3: Drop and recreate the users table
-- ============================================================================

-- First, we need to temporarily disable RLS to drop the table
ALTER TABLE IF EXISTS users DISABLE ROW LEVEL SECURITY;

-- Drop the table (this will cascade to policies and claims)
DROP TABLE IF EXISTS users CASCADE;

-- Recreate the users table
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('homeowner', 'agent', 'admin')),
  full_name TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_email ON users(email);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 4: Create the trigger function with SECURITY DEFINER
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role TEXT;
  user_name TEXT;
  user_phone TEXT;
BEGIN
  -- Extract metadata with defaults
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner');
  user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', '');
  user_phone := COALESCE(NEW.raw_user_meta_data->>'phone', NULL);

  -- Log the attempt
  RAISE LOG 'Creating user profile for: % with role: %', NEW.email, user_role;

  -- Insert the user profile
  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (NEW.id, NEW.email, user_role, user_name, user_phone);

  RAISE LOG 'User profile created successfully for: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'ERROR creating user profile for %: %', NEW.email, SQLERRM;
    -- Re-raise the exception so we know something went wrong
    RAISE;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- STEP 5: Create simple RLS policies
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile (but not their role)
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM users WHERE id = auth.uid())
  );

-- Admins can select all users
CREATE POLICY "admins_select_all"
  ON users FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can update all users
CREATE POLICY "admins_update_all"
  ON users FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Admins can delete users
CREATE POLICY "admins_delete_all"
  ON users FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ============================================================================
-- STEP 6: Grant necessary permissions
-- ============================================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT, UPDATE ON TABLE users TO authenticated;
GRANT SELECT ON TABLE users TO anon;

-- ============================================================================
-- STEP 7: Update trigger for updated_at
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check that the trigger exists
SELECT
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- Check that RLS is enabled
SELECT
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'users';

-- Check policies
SELECT
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE tablename = 'users';

-- ============================================================================
-- DONE!
-- ============================================================================
-- Now test by creating a new user in your app
-- The trigger should automatically create a profile in the users table
-- ============================================================================
