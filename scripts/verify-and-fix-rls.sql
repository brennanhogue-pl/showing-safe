-- Comprehensive RLS Fix for Users Table
-- Run this in Supabase SQL Editor to completely reset and fix RLS policies

-- ============================================================================
-- STEP 1: Check current state
-- ============================================================================

-- Show all current policies on users table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- ============================================================================
-- STEP 2: Completely disable RLS temporarily
-- ============================================================================

ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 3: Drop ALL policies
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
DROP POLICY IF EXISTS "users_read_own" ON users;
DROP POLICY IF EXISTS "admins_all" ON users;

-- ============================================================================
-- STEP 4: Recreate the trigger function with better logging
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the attempt
  RAISE NOTICE 'Creating user profile for: %, role: %', NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner');

  -- Insert the user profile
  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  );

  RAISE NOTICE 'Successfully created user profile for: %', NEW.email;

  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RAISE NOTICE 'User profile already exists for: %', NEW.email;
    RETURN NEW;
  WHEN others THEN
    RAISE WARNING 'Error creating user profile for %: %', NEW.email, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- STEP 5: Create SIMPLE policies (no complex checks)
-- ============================================================================

-- Let ALL authenticated users read their own profile
CREATE POLICY "enable_read_own_profile"
ON users FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Let ALL authenticated users update their own profile
CREATE POLICY "enable_update_own_profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- ============================================================================
-- STEP 6: Re-enable RLS
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 7: Grant permissions
-- ============================================================================

GRANT SELECT, UPDATE ON users TO authenticated;
GRANT ALL ON users TO service_role;

-- ============================================================================
-- STEP 8: Verify the setup
-- ============================================================================

-- Show final state of policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'users';

-- Show sample data (this should work now)
SELECT id, email, role, full_name, created_at FROM users LIMIT 5;
