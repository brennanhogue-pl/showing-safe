import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    if (!token) {
      return new NextResponse("Missing token", { status: 400 });
    }

    // Find invitation by token
    const { data: invitation, error } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (error || !invitation) {
      return new NextResponse("Invalid invitation token", { status: 404 });
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      return new NextResponse(`Invitation has already been ${invitation.status}`, { status: 400 });
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      // Update status to expired
      await supabaseAdmin
        .from("invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return new NextResponse("Invitation has expired", { status: 400 });
    }

    return NextResponse.json({ invitation });
  } catch (err) {
    console.error("Error verifying invitation:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
