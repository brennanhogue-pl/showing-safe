import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { updateEmailTemplate } from "@/lib/emailTemplates";

// GET - Get a single email template
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
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

    const { data: template, error } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !template) {
      return new NextResponse("Email template not found", { status: 404 });
    }

    return NextResponse.json({ template });
  } catch (err) {
    console.error("Email template GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// PATCH - Update an email template
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
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

    const body = await req.json();
    const { subject, html_content, description, is_active } = body;

    const updates: any = {};
    if (subject !== undefined) updates.subject = subject;
    if (html_content !== undefined) updates.html_content = html_content;
    if (description !== undefined) updates.description = description;
    if (is_active !== undefined) updates.is_active = is_active;

    const updatedTemplate = await updateEmailTemplate(params.id, updates);

    if (!updatedTemplate) {
      return new NextResponse("Failed to update email template", { status: 500 });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "update_email_template",
      resource_type: "email_template",
      resource_id: params.id,
      details: {
        template_name: updatedTemplate.name,
        updated_fields: Object.keys(updates),
      },
    });

    return NextResponse.json({ template: updatedTemplate });
  } catch (err) {
    console.error("Email template PATCH error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// POST - Send a test email using this template
export async function POST(
  req: Request,
  { params }: { params: { id: string } }
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
      .select("role, email")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    const body = await req.json();
    const { test_email, variables } = body;

    if (!test_email) {
      return new NextResponse("Test email address is required", { status: 400 });
    }

    // Get the template
    const { data: template, error } = await supabaseAdmin
      .from("email_templates")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !template) {
      return new NextResponse("Email template not found", { status: 404 });
    }

    // Import resend dynamically to avoid circular dependencies
    const { resend } = await import("@/lib/resend");
    const { renderEmailTemplate } = await import("@/lib/emailTemplates");

    if (!resend) {
      return new NextResponse("Email service not configured", { status: 500 });
    }

    // Render the template with test variables
    const rendered = await renderEmailTemplate(template.name, variables || {});

    if (!rendered) {
      return new NextResponse("Failed to render email template", { status: 500 });
    }

    // Send test email
    const { data, error: emailError } = await resend.emails.send({
      from: 'ShowingSafe <hello@notifications.showingsafe.co>',
      to: test_email,
      subject: `[TEST] ${rendered.subject}`,
      html: rendered.html,
    });

    if (emailError) {
      console.error("Error sending test email:", emailError);
      return new NextResponse("Failed to send test email", { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${test_email}`,
      emailId: data?.id,
    });
  } catch (err) {
    console.error("Email template test POST error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
