import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

/**
 * GET /api/policies
 * Fetch all policies for the authenticated user
 */
export async function GET(req: Request) {
  try {
    // Get the authenticated user from the request
    // We need to use the supabase client to get the session from cookies
    const authHeader = req.headers.get("authorization");

    if (!authHeader) {
      return NextResponse.json(
        { error: "Unauthorized - No authorization header" },
        { status: 401 }
      );
    }

    // Extract the token from the Bearer token
    const token = authHeader.replace("Bearer ", "");

    // Create a server-side Supabase client for user verification
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }

    // Fetch policies for this user
    const { data: policies, error: policiesError } = await supabaseAdmin
      .from("policies")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (policiesError) {
      console.error("Error fetching policies:", policiesError);
      return NextResponse.json(
        { error: "Failed to fetch policies" },
        { status: 500 }
      );
    }

    return NextResponse.json({ policies: policies || [] });
  } catch (error) {
    console.error("Unexpected error in GET /api/policies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/policies
 * Create a new policy (typically called from Stripe webhook, but can be used directly)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user_id, property_address, coverage_type, status = "pending" } = body;

    // Validate required fields
    if (!user_id || !property_address || !coverage_type) {
      return NextResponse.json(
        { error: "Missing required fields: user_id, property_address, coverage_type" },
        { status: 400 }
      );
    }

    // Validate coverage_type
    const validCoverageTypes = ["single", "subscription"];
    if (!validCoverageTypes.includes(coverage_type)) {
      return NextResponse.json(
        { error: "Invalid coverage_type. Must be 'single' or 'subscription'" },
        { status: 400 }
      );
    }

    // Create the policy
    const { data: policy, error: insertError } = await supabaseAdmin
      .from("policies")
      .insert([
        {
          user_id,
          property_address,
          coverage_type,
          status,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("Error creating policy:", insertError);
      return NextResponse.json(
        { error: "Failed to create policy" },
        { status: 500 }
      );
    }

    return NextResponse.json({ policy }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in POST /api/policies:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
