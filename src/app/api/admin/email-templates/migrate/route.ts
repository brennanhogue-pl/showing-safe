import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

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

    // Check if table already exists
    const { data: existingTable } = await supabaseAdmin
      .from("email_templates")
      .select("id")
      .limit(1);

    if (existingTable) {
      return NextResponse.json({
        success: true,
        message: "Email templates table already exists",
      });
    }

    // Note: We can't run DDL statements directly from the client
    // The migration should be run via Supabase dashboard SQL editor
    return NextResponse.json({
      success: false,
      message: "Please run the migration SQL in Supabase dashboard",
      sql: `
-- Run this in your Supabase SQL Editor

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

CREATE INDEX IF NOT EXISTS idx_email_templates_name ON email_templates(name);

ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

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

-- Insert default templates
INSERT INTO email_templates (name, subject, html_content, variables, description) VALUES
(
  'welcome_email',
  'Welcome to ShowingSafe!',
  '<!DOCTYPE html>...</html>',
  '["userName", "userRole", "dashboardUrl", "currentYear"]'::jsonb,
  'Welcome email sent to new users after registration'
);
      `,
    });
  } catch (err) {
    console.error("Email templates migration error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
