import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { resend } from "@/lib/resend";
import { renderEmailTemplate } from "@/lib/emailTemplates";
import { publicEnv } from "@/lib/env";

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

    // Get user profile
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("full_name, email, role")
      .eq("id", user.id)
      .single();

    if (!profile) {
      return new NextResponse("User profile not found", { status: 404 });
    }

    if (!resend) {
      console.log("⚠️  Resend not configured. Welcome email not sent.");
      return NextResponse.json({
        success: false,
        message: "Email service not configured",
      });
    }

    // Determine dashboard URL based on role
    const dashboardPath =
      profile.role === "admin"
        ? "/dashboard/admin"
        : profile.role === "agent"
        ? "/dashboard/agent"
        : "/dashboard/homeowner";

    const dashboardUrl = `${publicEnv.app.url}${dashboardPath}`;

    // Render welcome email template
    const rendered = await renderEmailTemplate("welcome_email", {
      userName: profile.full_name || "User",
      userRole: profile.role.charAt(0).toUpperCase() + profile.role.slice(1),
      dashboardUrl,
    });

    if (!rendered) {
      console.error("Failed to render welcome email template");
      return new NextResponse("Failed to render email template", { status: 500 });
    }

    // Send welcome email
    const { data, error: emailError } = await resend.emails.send({
      from: 'ShowingSafe <hello@notifications.showingsafe.co>',
      to: profile.email,
      subject: rendered.subject,
      html: rendered.html,
    });

    if (emailError) {
      console.error("Error sending welcome email:", emailError);
      return new NextResponse("Failed to send welcome email", { status: 500 });
    }

    console.log(`✅ Welcome email sent to ${profile.email}`);

    return NextResponse.json({
      success: true,
      message: "Welcome email sent successfully",
      emailId: data?.id,
    });
  } catch (err) {
    console.error("Send welcome email error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
