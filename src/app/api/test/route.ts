import { supabaseAdmin } from "@/lib/supabaseAdmin";  // ✅ Use admin client
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabaseAdmin.from("users").select("*").limit(1);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}
