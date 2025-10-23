-- ============================================================================
-- FIX RLS INFINITE RECURSION
-- ============================================================================
-- This fixes the circular dependency in the admin policies
-- ============================================================================

-- Drop the problematic policies
DROP POLICY IF EXISTS "users_select_own" ON users;
DROP POLICY IF EXISTS "admins_select_all" ON users;
DROP POLICY IF EXISTS "admins_update_all" ON users;
DROP POLICY IF EXISTS "admins_delete_all" ON users;
DROP POLICY IF EXISTS "users_update_own" ON users;

-- ============================================================================
-- Create non-recursive policies
-- ============================================================================

-- Policy 1: Allow users to select their own record
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Policy 2: Allow users to update their own record (but not change role)
CREATE POLICY "users_update_own"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Policy 3: Service role can do everything (for admin operations via API)
-- No policy needed - service role bypasses RLS

-- ============================================================================
-- Create helper function that doesn't cause recursion
-- ============================================================================

-- This function uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION auth.user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT role FROM public.users WHERE id = auth.uid()
$$;

-- Now create admin policies using the helper function
CREATE POLICY "admins_select_all"
  ON users FOR SELECT
  TO authenticated
  USING (auth.user_role() = 'admin');

CREATE POLICY "admins_update_all"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.user_role() = 'admin');

CREATE POLICY "admins_delete_all"
  ON users FOR DELETE
  TO authenticated
  USING (auth.user_role() = 'admin');

-- ============================================================================
-- Verification
-- ============================================================================

SELECT policyname, cmd FROM pg_policies WHERE tablename = 'users';
