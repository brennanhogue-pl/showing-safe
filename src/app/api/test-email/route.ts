import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function POST(req: Request) {
  try {
    const { to } = await req.json();

    if (!to) {
      return NextResponse.json({ error: "Email address is required" }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json({ error: "Resend is not configured" }, { status: 500 });
    }

    const { data, error } = await resend.emails.send({
      from: 'ShowingSafe <hello@notifications.showingsafe.co>',
      to,
      subject: 'Test Email from ShowingSafe',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Ubuntu, sans-serif; background-color: #f6f9fc; margin: 0; padding: 20px;">
            <div style="background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 40px; border-radius: 8px;">
              <h1 style="color: #1f2937; font-size: 32px; text-align: center; margin-bottom: 30px;">
                Test Email from ShowingSafe
              </h1>

              <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
                This is a test email to verify that your Resend integration is working correctly.
              </p>

              <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                If you're seeing this, your email configuration is working! 🎉
              </p>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
                <p style="color: #374151; font-size: 14px; margin: 0;">
                  <strong>Email sent at:</strong> ${new Date().toLocaleString()}
                </p>
              </div>

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
                © ${new Date().getFullYear()} ShowingSafe. All rights reserved.
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending test email:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully",
      data
    });
  } catch (err) {
    console.error("Test email error:", err);
    return NextResponse.json({ error: "Failed to send test email" }, { status: 500 });
  }
}
