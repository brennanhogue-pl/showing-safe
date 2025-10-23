import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import {
  HomeownerClaimRequest,
  AgentSubscriptionClaimRequest,
  AgentListingClaimRequest,
} from "@/types";

export async function GET(req: Request) {
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

    // Fetch claims for this user
    // Include both policy-based claims and agent subscription claims
    const { data: claims, error } = await supabaseAdmin
      .from("claims")
      .select(`
        *,
        policies(
          id,
          user_id,
          property_address
        )
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error);
      return new NextResponse("Failed to fetch claims", { status: 500 });
    }

    return NextResponse.json({ claims: claims || [] });
  } catch (err) {
    console.error("Claims GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    // Parse request body
    const body = await req.json();
    const claimType = body.claimType || "homeowner_showing";

    // Handle different claim types
    if (claimType === "agent_subscription") {
      return handleAgentSubscriptionClaim(user.id, body as AgentSubscriptionClaimRequest);
    } else if (claimType === "agent_listing") {
      return handleAgentListingClaim(user.id, body as AgentListingClaimRequest);
    } else {
      return handleHomeownerClaim(user.id, body as HomeownerClaimRequest);
    }
  } catch (err) {
    console.error("Claims POST error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// Handle homeowner showing claims (original flow)
async function handleHomeownerClaim(userId: string, body: HomeownerClaimRequest) {
  const { policyId, incidentDate, damagedItems, supaShowingNumber, description, proofUrl } = body;

  // Validate required fields
  if (!policyId || !incidentDate || !damagedItems || !supaShowingNumber || !description) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Verify the policy belongs to this user
  const { data: policy, error: policyError } = await supabaseAdmin
    .from("policies")
    .select("id, user_id")
    .eq("id", policyId)
    .eq("user_id", userId)
    .single();

  if (policyError || !policy) {
    return new NextResponse("Policy not found or unauthorized", { status: 404 });
  }

  // Create the claim
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("claims")
    .insert([
      {
        policy_id: policyId,
        user_id: userId,
        claim_type: "homeowner_showing",
        incident_date: incidentDate,
        damaged_items: damagedItems,
        supra_showing_number: supaShowingNumber,
        description,
        proof_url: proofUrl || null,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (claimError) {
    console.error("Error creating homeowner claim:", claimError);
    return new NextResponse("Failed to create claim", { status: 500 });
  }

  return NextResponse.json({ claim, success: true });
}

// Handle agent subscription claims (no policy required)
async function handleAgentSubscriptionClaim(
  userId: string,
  body: AgentSubscriptionClaimRequest
) {
  const {
    incidentDate,
    damagedItems,
    supaShowingNumber,
    description,
    proofUrl,
    atFaultParty,
    atFaultName,
    atFaultPhone,
    atFaultEmail,
    homeownerName,
    homeownerPhone,
    homeownerEmail,
    homeownerAddress,
    showingProofUrl,
  } = body;

  // Validate required fields
  if (
    !incidentDate ||
    !damagedItems ||
    !supaShowingNumber ||
    !description ||
    !atFaultParty ||
    !homeownerName ||
    !homeownerPhone ||
    !homeownerEmail ||
    !homeownerAddress ||
    !showingProofUrl
  ) {
    return new NextResponse("Missing required fields for agent subscription claim", { status: 400 });
  }

  // Verify user has active agent subscription
  const { data: userProfile } = await supabaseAdmin
    .from("users")
    .select("agent_subscription_status, role")
    .eq("id", userId)
    .single();

  if (!userProfile || userProfile.role !== "agent" || userProfile.agent_subscription_status !== "active") {
    return new NextResponse("Active agent subscription required", { status: 403 });
  }

  // Create the claim with $1,000 max payout
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("claims")
    .insert([
      {
        policy_id: null, // No policy for subscription claims
        user_id: userId,
        claim_type: "agent_subscription",
        incident_date: incidentDate,
        damaged_items: damagedItems,
        supra_showing_number: supaShowingNumber,
        description,
        proof_url: proofUrl || null,
        at_fault_party: atFaultParty,
        at_fault_name: atFaultName || null,
        at_fault_phone: atFaultPhone || null,
        at_fault_email: atFaultEmail || null,
        homeowner_name: homeownerName,
        homeowner_phone: homeownerPhone,
        homeowner_email: homeownerEmail,
        homeowner_address: homeownerAddress,
        showing_proof_url: showingProofUrl,
        max_payout_amount: 1000, // $1,000 max for agent subscription claims
        status: "pending",
      },
    ])
    .select()
    .single();

  if (claimError) {
    console.error("Error creating agent subscription claim:", claimError);
    return new NextResponse("Failed to create claim", { status: 500 });
  }

  return NextResponse.json({ claim, success: true });
}

// Handle agent listing claims (agent protecting their own listing)
async function handleAgentListingClaim(userId: string, body: AgentListingClaimRequest) {
  const { policyId, incidentDate, damagedItems, supaShowingNumber, description, proofUrl } = body;

  // Validate required fields
  if (!policyId || !incidentDate || !damagedItems || !supaShowingNumber || !description) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  // Verify user is an agent
  const { data: userProfile } = await supabaseAdmin
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (!userProfile || userProfile.role !== "agent") {
    return new NextResponse("Only agents can file agent listing claims", { status: 403 });
  }

  // Verify the policy belongs to this user
  const { data: policy, error: policyError } = await supabaseAdmin
    .from("policies")
    .select("id, user_id")
    .eq("id", policyId)
    .eq("user_id", userId)
    .single();

  if (policyError || !policy) {
    return new NextResponse("Policy not found or unauthorized", { status: 404 });
  }

  // Create the claim
  const { data: claim, error: claimError } = await supabaseAdmin
    .from("claims")
    .insert([
      {
        policy_id: policyId,
        user_id: userId,
        claim_type: "agent_listing",
        incident_date: incidentDate,
        damaged_items: damagedItems,
        supra_showing_number: supaShowingNumber,
        description,
        proof_url: proofUrl || null,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (claimError) {
    console.error("Error creating agent listing claim:", claimError);
    return new NextResponse("Failed to create claim", { status: 500 });
  }

  return NextResponse.json({ claim, success: true });
}
