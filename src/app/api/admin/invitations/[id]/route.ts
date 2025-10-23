import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { publicEnv } from "@/lib/env";

// DELETE - Cancel an invitation
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user is an admin
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    const { id: invitationId } = await params;

    // Get invitation details for audit log
    const { data: invitation } = await supabaseAdmin
      .from("invitations")
      .select("email, role")
      .eq("id", invitationId)
      .single();

    // Delete the invitation
    const { error } = await supabaseAdmin
      .from("invitations")
      .delete()
      .eq("id", invitationId);

    if (error) {
      console.error("Error deleting invitation:", error);
      return new NextResponse("Failed to delete invitation", { status: 500 });
    }

    // Create audit log
    if (invitation) {
      await supabaseAdmin.from("audit_logs").insert({
        admin_id: user.id,
        action: "cancel_invitation",
        resource_type: "invitation",
        resource_id: invitationId,
        details: {
          email: invitation.email,
          role: invitation.role,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin invitation DELETE error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// PATCH - Resend an invitation
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Verify user is an admin
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    const { id: invitationId } = await params;

    // Get invitation
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("id", invitationId)
      .single();

    if (fetchError || !invitation) {
      return new NextResponse("Invitation not found", { status: 404 });
    }

    // Extend expiry by 7 days
    const newExpiresAt = new Date();
    newExpiresAt.setDate(newExpiresAt.getDate() + 7);

    // Update invitation
    const { error: updateError } = await supabaseAdmin
      .from("invitations")
      .update({
        expires_at: newExpiresAt.toISOString(),
        status: "pending", // Reset to pending if it was expired
      })
      .eq("id", invitationId);

    if (updateError) {
      console.error("Error updating invitation:", updateError);
      return new NextResponse("Failed to resend invitation", { status: 500 });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "resend_invitation",
      resource_type: "invitation",
      resource_id: invitationId,
      details: {
        email: invitation.email,
        role: invitation.role,
      },
    });

    // Resend invitation email if Resend is configured
    const inviteUrl = `${publicEnv.app.url}/auth/accept-invite?token=${invitation.token}`;

    if (resend) {
      try {
        // Get inviter details
        const { data: inviter } = await supabaseAdmin
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        const roleDisplayName = invitation.role.charAt(0).toUpperCase() + invitation.role.slice(1);

        const { data, error: emailError } = await resend.emails.send({
          from: 'ShowingSafe <hello@notifications.showingsafe.co>',
          to: invitation.email,
          subject: `Reminder: You've been invited to join ShowingSafe`,
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
                    Reminder: You're invited to ShowingSafe
                  </h1>

                  <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 20px;">
                    <strong>${inviter?.full_name || 'ShowingSafe Admin'}</strong> (${inviter?.email || 'admin@showingsafe.com'}) has invited you to join ShowingSafe as a <strong>${roleDisplayName}</strong>.
                  </p>

                  <p style="color: #374151; font-size: 16px; line-height: 24px; margin-bottom: 30px;">
                    ShowingSafe provides comprehensive protection for real estate showings, ensuring peace of mind for homeowners and agents alike.
                  </p>

                  <div style="text-align: center; margin: 40px 0;">
                    <a href="${inviteUrl}" style="background-color: #3b82f6; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; display: inline-block;">
                      Accept Invitation
                    </a>
                  </div>

                  <p style="color: #6b7280; font-size: 14px; line-height: 20px; margin-top: 30px;">
                    This invitation will expire in 7 days. If you didn't expect this invitation, you can safely ignore this email.
                  </p>

                  <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 40px;">
                    © ${new Date().getFullYear()} ShowingSafe. All rights reserved.
                  </p>
                </div>
              </body>
            </html>
          `,
        });

        if (emailError) {
          throw emailError;
        }
        console.log(`✅ Invitation email resent to ${invitation.email}`);
      } catch (emailError) {
        console.error("Error resending invitation email:", emailError);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.log(`⚠️  Resend not configured. Invitation updated but email not sent to ${invitation.email}`);
      console.log(`Invite URL: ${inviteUrl}`);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin invitation PATCH error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
