import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get the authorization token from the request headers
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");

    // Verify the user with the token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Await params to get the id
    const { id: claimId } = await params;

    // Verify the claim belongs to this user
    const { data: claim } = await supabaseAdmin
      .from("claims")
      .select(`
        id,
        policies!inner(user_id)
      `)
      .eq("id", claimId)
      .single();

    if (!claim || (claim.policies as unknown as { user_id: string }).user_id !== user.id) {
      return new NextResponse("Claim not found or unauthorized", { status: 404 });
    }

    // Parse request body
    const body = await req.json();
    const { proofUrl } = body;

    // Update the claim with proof URLs
    const { data: updatedClaim, error: updateError } = await supabaseAdmin
      .from("claims")
      .update({ proof_url: proofUrl })
      .eq("id", claimId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating claim:", updateError);
      return new NextResponse("Failed to update claim", { status: 500 });
    }

    return NextResponse.json({ claim: updatedClaim, success: true });
  } catch (err) {
    console.error("Claims PATCH error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
