-- Insert default email templates (if they don't exist)
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
        © 2025 ShowingSafe. All rights reserved.
      </p>
    </div>
  </body>
</html>',
  '["userName", "userRole", "dashboardUrl"]'::jsonb,
  'Welcome email sent to new users after registration'
)
ON CONFLICT (name) DO NOTHING;

INSERT INTO email_templates (name, subject, html_content, variables, description) VALUES
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
        © 2025 ShowingSafe. All rights reserved.
      </p>
    </div>
  </body>
</html>',
  '["inviterName", "inviterEmail", "userRole", "inviteUrl", "expiresInDays"]'::jsonb,
  'Invitation email sent to new users'
)
ON CONFLICT (name) DO NOTHING;
