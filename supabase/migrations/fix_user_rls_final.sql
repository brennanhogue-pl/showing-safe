-- Final fix for user RLS policies and profile creation
-- This migration ensures users can be created and their profiles can be fetched

-- ============================================================================
-- STEP 1: Drop ALL existing policies on users table
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
-- STEP 2: Recreate the handle_new_user function with SECURITY DEFINER
-- ============================================================================

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert the user profile
  INSERT INTO public.users (id, email, role, full_name, phone)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner'),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NULL),
    COALESCE(NEW.raw_user_meta_data->>'phone', NULL)
  );

  RAISE LOG 'Created user profile for: % with role: %', NEW.email, COALESCE(NEW.raw_user_meta_data->>'role', 'homeowner');

  RETURN NEW;
EXCEPTION
  WHEN others THEN
    RAISE LOG 'Error creating user profile for %: %', NEW.email, SQLERRM;
    -- Still return NEW so auth user is created even if profile creation fails
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
-- STEP 3: Create simple, non-conflicting RLS policies
-- ============================================================================

-- Allow authenticated users to read their own profile
CREATE POLICY "users_read_own"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Allow authenticated users to update their own profile
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Note: We don't need an INSERT policy because the trigger runs with SECURITY DEFINER
-- which bypasses RLS. This prevents users from creating duplicate or fake profiles.

-- Allow admins to do everything
CREATE POLICY "admins_all"
  ON users FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users u
      WHERE u.id = auth.uid() AND u.role = 'admin'
    )
  );

-- ============================================================================
-- STEP 4: Ensure RLS is enabled
-- ============================================================================

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- STEP 5: Grant necessary permissions
-- ============================================================================

GRANT SELECT, UPDATE ON TABLE users TO authenticated;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON POLICY "users_read_own" ON users IS 'Users can read their own profile';
COMMENT ON POLICY "users_update_own" ON users IS 'Users can update their own profile';
COMMENT ON POLICY "admins_all" ON users IS 'Admins have full access to all user profiles';
COMMENT ON FUNCTION handle_new_user() IS 'Automatically creates user profile when auth user is created (SECURITY DEFINER bypasses RLS)';
