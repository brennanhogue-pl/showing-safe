import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { ApproveClaimRequest } from "@/types";

// POST - Approve a claim
export async function POST(
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

    const claimId = params.id;
    const body: ApproveClaimRequest = await req.json();
    const { payoutAmount, adminNote } = body;

    // Get claim details
    const { data: claim, error: claimError } = await supabaseAdmin
      .from("claims")
      .select("*")
      .eq("id", claimId)
      .single();

    if (claimError || !claim) {
      return new NextResponse("Claim not found", { status: 404 });
    }

    // Check if claim is already processed
    if (claim.status !== "pending") {
      return new NextResponse("Claim has already been processed", { status: 400 });
    }

    // Update claim status
    const { error: updateError } = await supabaseAdmin
      .from("claims")
      .update({
        status: "approved",
        updated_at: new Date().toISOString(),
      })
      .eq("id", claimId);

    if (updateError) {
      console.error("Error approving claim:", updateError);
      return new NextResponse("Failed to approve claim", { status: 500 });
    }

    // Add admin note if provided
    if (adminNote) {
      await supabaseAdmin.from("admin_notes").insert({
        resource_type: "claim",
        resource_id: claimId,
        admin_id: user.id,
        note: adminNote,
      });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "approve_claim",
      resource_type: "claim",
      resource_id: claimId,
      details: {
        claim_id: claimId,
        payout_amount: payoutAmount || claim.max_payout_amount,
        admin_note: adminNote,
      },
    });

    // TODO: Send notification email to user
    console.log(`TODO: Send claim approved email for claim ${claimId}`);

    return NextResponse.json({
      success: true,
      message: "Claim approved successfully",
    });
  } catch (err) {
    console.error("Admin claim approve error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
