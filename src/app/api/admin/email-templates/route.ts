import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getAllEmailTemplates } from "@/lib/emailTemplates";

// GET - List all email templates
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

    // Verify user is an admin (use supabaseAdmin to bypass RLS)
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    const templates = await getAllEmailTemplates();

    console.log(`📧 Fetched ${templates.length} email templates`);

    return NextResponse.json({ templates });
  } catch (err) {
    console.error("Email templates GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
