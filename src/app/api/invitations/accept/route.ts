import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return new NextResponse("Missing token", { status: 400 });
    }

    // Find invitation by token
    const { data: invitation, error: fetchError } = await supabaseAdmin
      .from("invitations")
      .select("*")
      .eq("token", token)
      .single();

    if (fetchError || !invitation) {
      return new NextResponse("Invalid invitation token", { status: 404 });
    }

    // Check if invitation is still pending
    if (invitation.status !== "pending") {
      return new NextResponse(`Invitation has already been ${invitation.status}`, { status: 400 });
    }

    // Check if invitation has expired
    const expiresAt = new Date(invitation.expires_at);
    if (expiresAt < new Date()) {
      await supabaseAdmin
        .from("invitations")
        .update({ status: "expired" })
        .eq("id", invitation.id);

      return new NextResponse("Invitation has expired", { status: 400 });
    }

    // Update invitation status to accepted
    const { error: updateError } = await supabaseAdmin
      .from("invitations")
      .update({
        status: "accepted",
        accepted_at: new Date().toISOString(),
      })
      .eq("id", invitation.id);

    if (updateError) {
      console.error("Error updating invitation:", updateError);
      return new NextResponse("Failed to accept invitation", { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error accepting invitation:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
