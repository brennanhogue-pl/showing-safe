-- Create email_templates table
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  subject VARCHAR(255) NOT NULL,
  html_content TEXT NOT NULL,
  variables JSONB DEFAULT '[]'::jsonb,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index on name for faster lookups
CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);

-- Enable RLS
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can read/write email templates
CREATE POLICY "Admins can manage email templates"
  ON email_templates
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.role = 'admin'
    )
  );

-- Insert default email templates
INSERT INTO email_templates (name, subject, html_content, variables, description) VALUES
(
  'welcome_email',
  'Welcome to ShowingSafe!',
  '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px;">
      <h1 style="color: #1f2937; font-size: 32px; text-align: center; margin-bottom: 30px;">
        Welcome to ShowingSafe!
      </h1>

      <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        Hi <strong>{{userName}}</strong>,
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        Thank you for joining ShowingSafe as a <strong>{{userRole}}</strong>! We''re excited to have you on board.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        ShowingSafe provides comprehensive protection for real estate showings, ensuring peace of mind for homeowners and agents alike.
      </p>

      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
        <h3 style="color: #1f2937; font-size: 18px; margin-top: 0;">Next Steps:</h3>
        <ul style="color: #374151; font-size: 16px; line-height: 24px; padding-left: 20px;">
          <li style="margin-bottom: 10px;">Complete your profile in the dashboard</li>
          <li style="margin-bottom: 10px;">Choose your protection plan</li>
          <li style="margin-bottom: 10px;">Start showing homes with confidence</li>
        </ul>
      </div>

      <div style="text-align: center; margin: 40px 0;">
        <a href="{{dashboardUrl}}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
          Go to Dashboard
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 30px;">
        If you have any questions, feel free to reply to this email. We''re here to help!
      </p>

      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
        © {{currentYear}} ShowingSafe. All rights reserved.
      </p>
    </div>
  </body>
</html>',
  '["userName", "userRole", "dashboardUrl", "currentYear"]'::jsonb,
  'Welcome email sent to new users after registration'
),
(
  'invitation_email',
  'You''ve been invited to join ShowingSafe',
  '<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, ''Segoe UI'', Roboto, ''Helvetica Neue'', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
    <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px;">
      <h1 style="color: #1f2937; font-size: 32px; text-align: center; margin-bottom: 30px;">
        You''re invited to ShowingSafe
      </h1>

      <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
        <strong>{{inviterName}}</strong> ({{inviterEmail}}) has invited you to join ShowingSafe as a <strong>{{userRole}}</strong>.
      </p>

      <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
        ShowingSafe provides comprehensive protection for real estate showings, ensuring peace of mind for homeowners and agents alike.
      </p>

      <div style="text-align: center; margin: 40px 0;">
        <a href="{{inviteUrl}}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
          Accept Invitation
        </a>
      </div>

      <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 30px;">
        This invitation will expire in {{expiresInDays}} days. If you didn''t expect this invitation, you can safely ignore this email.
      </p>

      <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
        © {{currentYear}} ShowingSafe. All rights reserved.
      </p>
    </div>
  </body>
</html>',
  '["inviterName", "inviterEmail", "userRole", "inviteUrl", "expiresInDays", "currentYear"]'::jsonb,
  'Invitation email sent to new users'
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_email_templates_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_email_templates_updated_at
  BEFORE UPDATE ON email_templates
  FOR EACH ROW
  EXECUTE FUNCTION update_email_templates_updated_at();
