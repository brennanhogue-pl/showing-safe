-- Admin Features Migration
-- This migration adds tables for admin functionality:
-- 1. invitations - for sending user invites
-- 2. admin_notes - for admin notes on claims/users/policies
-- 3. audit_logs - for tracking admin actions

-- ============================================
-- INVITATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('homeowner', 'agent', 'admin')),
  invited_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'cancelled')),
  custom_message TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  accepted_at TIMESTAMP,
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Index for faster lookups
CREATE INDEX idx_invitations_email ON invitations(email);
CREATE INDEX idx_invitations_token ON invitations(token);
CREATE INDEX idx_invitations_status ON invitations(status);
CREATE INDEX idx_invitations_invited_by ON invitations(invited_by);

-- ============================================
-- ADMIN NOTES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_type TEXT NOT NULL CHECK (resource_type IN ('claim', 'user', 'policy')),
  resource_id UUID NOT NULL,
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for faster lookups
CREATE INDEX idx_admin_notes_resource ON admin_notes(resource_type, resource_id);
CREATE INDEX idx_admin_notes_admin_id ON admin_notes(admin_id);
CREATE INDEX idx_admin_notes_created_at ON admin_notes(created_at DESC);

-- ============================================
-- AUDIT LOGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  resource_type TEXT NOT NULL CHECK (resource_type IN ('claim', 'user', 'policy', 'invitation', 'system')),
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Indexes for faster lookups and reporting
CREATE INDEX idx_audit_logs_admin_id ON audit_logs(admin_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Invitations: Only admins can view and manage
CREATE POLICY "Admins can view all invitations"
  ON invitations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create invitations"
  ON invitations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update invitations"
  ON invitations FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete invitations"
  ON invitations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Admin Notes: Only admins can view and manage
CREATE POLICY "Admins can view all admin notes"
  ON admin_notes FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create admin notes"
  ON admin_notes FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can update their own admin notes"
  ON admin_notes FOR UPDATE
  TO authenticated
  USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete their own admin notes"
  ON admin_notes FOR DELETE
  TO authenticated
  USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Audit Logs: Only admins can view, no one can delete
CREATE POLICY "Admins can view all audit logs"
  ON audit_logs FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Admins can create audit logs"
  ON audit_logs FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for admin_notes updated_at
CREATE TRIGGER update_admin_notes_updated_at
  BEFORE UPDATE ON admin_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to check if invitation is expired
CREATE OR REPLACE FUNCTION check_invitation_expiry()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'pending' AND NEW.expires_at < now() THEN
    NEW.status = 'expired';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-expire invitations
CREATE TRIGGER auto_expire_invitation
  BEFORE UPDATE ON invitations
  FOR EACH ROW
  EXECUTE FUNCTION check_invitation_expiry();

-- ============================================
-- HELPFUL VIEWS FOR ADMIN DASHBOARD
-- ============================================

-- View for invitation statistics
CREATE OR REPLACE VIEW invitation_stats AS
SELECT
  COUNT(*) FILTER (WHERE status = 'pending') as pending_invitations,
  COUNT(*) FILTER (WHERE status = 'accepted') as accepted_invitations,
  COUNT(*) FILTER (WHERE status = 'expired') as expired_invitations,
  COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_invitations,
  COUNT(*) as total_invitations
FROM invitations;

-- View for recent admin activity
CREATE OR REPLACE VIEW recent_admin_activity AS
SELECT
  audit_logs.id,
  audit_logs.action,
  audit_logs.resource_type,
  audit_logs.resource_id,
  audit_logs.created_at,
  users.full_name as admin_name,
  users.email as admin_email
FROM audit_logs
JOIN users ON audit_logs.admin_id = users.id
ORDER BY audit_logs.created_at DESC
LIMIT 50;

-- Grant permissions on views to authenticated users (will still respect RLS)
GRANT SELECT ON invitation_stats TO authenticated;
GRANT SELECT ON recent_admin_activity TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE invitations IS 'Stores user invitations sent by admins';
COMMENT ON TABLE admin_notes IS 'Stores admin notes on claims, users, and policies';
COMMENT ON TABLE audit_logs IS 'Tracks all admin actions for compliance and auditing';
