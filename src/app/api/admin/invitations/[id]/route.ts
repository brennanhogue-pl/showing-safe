import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { renderEmailTemplate } from "@/lib/emailTemplates";
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

        // Calculate days until expiration
        const expiresAt = new Date(invitation.expires_at);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiresAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Render invitation email template
        const rendered = await renderEmailTemplate("invitation_email", {
          inviterName: inviter?.full_name || "ShowingSafe Admin",
          inviterEmail: inviter?.email || "admin@showingsafe.com",
          userRole: roleDisplayName,
          inviteUrl,
          expiresInDays: String(daysUntilExpiry > 0 ? daysUntilExpiry : 1),
        });

        if (!rendered) {
          console.error("Failed to render invitation email template");
          throw new Error("Failed to render email template");
        }

        const { data, error: emailError } = await resend.emails.send({
          from: 'ShowingSafe <hello@notifications.showingsafe.co>',
          to: invitation.email,
          subject: `Reminder: ${rendered.subject}`,
          html: rendered.html,
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
