import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { SendInvitationRequest } from "@/types";
import crypto from "crypto";
import { resend } from "@/lib/resend";
import { publicEnv } from "@/lib/env";
import * as React from "react";

// GET - List all invitations
export async function GET(req: Request) {
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

    // Get all invitations
    const { data: invitations, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching invitations:", error);
      return new NextResponse("Failed to fetch invitations", { status: 500 });
    }

    // Get inviter details separately
    const inviterIds = [...new Set(invitations?.map((inv) => inv.invited_by) || [])];
    const { data: inviters } = await supabaseAdmin
      .from("users")
      .select("id, full_name, email")
      .in("id", inviterIds);

    // Map inviter details to invitations
    const inviterMap = new Map(inviters?.map((u) => [u.id, u]) || []);
    const invitationsWithInviters = invitations?.map((inv) => ({
      ...inv,
      inviter: inviterMap.get(inv.invited_by),
    }));

    return NextResponse.json({ invitations: invitationsWithInviters || [] });
  } catch (err) {
    console.error("Admin invitations GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// POST - Create a new invitation
export async function POST(req: Request) {
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

    const body: SendInvitationRequest = await req.json();
    const { email, role, customMessage, expiresInDays = 7 } = body;

    // Validate required fields
    if (!email || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!["homeowner", "agent", "admin"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (existingUser) {
      return new NextResponse("User with this email already exists", { status: 400 });
    }

    // Check if there's already a pending invitation
    const { data: existingInvite } = await supabaseAdmin
      .from("invitations")
      .select("id")
      .eq("email", email)
      .eq("status", "pending")
      .single();

    if (existingInvite) {
      return new NextResponse("Pending invitation already exists for this email", { status: 400 });
    }

    // Generate unique token
    const inviteToken = crypto.randomBytes(32).toString("hex");

    // Calculate expiry date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create invitation
    const { data: invitation, error: inviteError } = await supabaseAdmin
      .from("invitations")
      .insert({
        email,
        role,
        invited_by: user.id,
        token: inviteToken,
        status: "pending",
        custom_message: customMessage || null,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (inviteError) {
      console.error("Error creating invitation:", inviteError);
      return new NextResponse("Failed to create invitation", { status: 500 });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "send_invitation",
      resource_type: "invitation",
      resource_id: invitation.id,
      details: {
        email,
        role,
      },
    });

    // Send invitation email if Resend is configured
    const inviteUrl = `${publicEnv.app.url}/auth/accept-invite?token=${inviteToken}`;

    if (resend) {
      try {
        // Get inviter details
        const { data: inviter } = await supabaseAdmin
          .from("users")
          .select("full_name, email")
          .eq("id", user.id)
          .single();

        const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);

        const { data, error: emailError } = await resend.emails.send({
          from: 'ShowingSafe <hello@notifications.showingsafe.co>',
          to: email,
          subject: `You've been invited to join ShowingSafe`,
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
                    You're invited to ShowingSafe
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
        console.log(`✅ Invitation email sent to ${email}`);
      } catch (emailError) {
        console.error("Error sending invitation email:", emailError);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.log(`⚠️  Resend not configured. Invitation created but email not sent to ${email}`);
      console.log(`Invite URL: ${inviteUrl}`);
    }

    return NextResponse.json({
      invitation,
      inviteUrl,
      success: true,
    });
  } catch (err) {
    console.error("Admin invitations POST error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
