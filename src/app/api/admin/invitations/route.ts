import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { SendInvitationRequest } from "@/types";
import crypto from "crypto";
import { resend } from "@/lib/resend";
import { renderEmailTemplate } from "@/lib/emailTemplates";
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

        // Render invitation email template
        const rendered = await renderEmailTemplate("invitation_email", {
          inviterName: inviter?.full_name || "ShowingSafe Admin",
          inviterEmail: inviter?.email || "admin@showingsafe.com",
          userRole: roleDisplayName,
          inviteUrl,
          expiresInDays: String(expiresInDays),
        });

        if (!rendered) {
          console.error("Failed to render invitation email template");
          throw new Error("Failed to render email template");
        }

        const { data, error: emailError } = await resend.emails.send({
          from: 'ShowingSafe <hello@notifications.showingsafe.co>',
          to: email,
          subject: rendered.subject,
          html: rendered.html,
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
