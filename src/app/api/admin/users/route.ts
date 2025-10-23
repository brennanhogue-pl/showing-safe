import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { CreateUserRequest } from "@/types";

// GET - List all users with details
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

    // Verify user is an admin
    const { data: profile } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return new NextResponse("Forbidden: Admin access required", { status: 403 });
    }

    // Get all users
    const { data: users, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      return new NextResponse("Failed to fetch users", { status: 500 });
    }

    // Get policy counts for all users
    const { data: policyCounts } = await supabaseAdmin
      .from("policies")
      .select("user_id");

    // Get claim counts for all users
    const { data: claimCounts } = await supabaseAdmin
      .from("claims")
      .select("user_id");

    // Count occurrences
    const policyCountMap = new Map<string, number>();
    const claimCountMap = new Map<string, number>();

    policyCounts?.forEach((policy) => {
      policyCountMap.set(policy.user_id, (policyCountMap.get(policy.user_id) || 0) + 1);
    });

    claimCounts?.forEach((claim) => {
      claimCountMap.set(claim.user_id, (claimCountMap.get(claim.user_id) || 0) + 1);
    });

    // Get agent subscription statuses
    const { data: subscriptions } = await supabaseAdmin
      .from("agent_subscriptions")
      .select("user_id, status");

    const subscriptionMap = new Map<string, string>();
    subscriptions?.forEach((sub) => {
      subscriptionMap.set(sub.user_id, sub.status);
    });

    // Transform the data to include counts
    const usersWithCounts = users?.map((user) => ({
      ...user,
      policies_count: policyCountMap.get(user.id) || 0,
      claims_count: claimCountMap.get(user.id) || 0,
      agent_subscription_status: user.role === "agent" ? (subscriptionMap.get(user.id) || "inactive") : undefined,
    }));

    return NextResponse.json({ users: usersWithCounts || [] });
  } catch (err) {
    console.error("Admin users GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// POST - Create a new user
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

    const body: CreateUserRequest = await req.json();
    const { fullName, email, password, role, sendWelcomeEmail } = body;

    // Validate required fields
    if (!fullName || !email || !password || !role) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (!["homeowner", "agent", "admin"].includes(role)) {
      return new NextResponse("Invalid role", { status: 400 });
    }

    // Create the user in Supabase Auth
    // Note: The handle_new_user() trigger will automatically create the profile in users table
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name: fullName,
        role,
      },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return new NextResponse(createError.message, { status: 400 });
    }

    if (!newUser.user) {
      return new NextResponse("Failed to create user", { status: 500 });
    }

    // Wait a moment for the trigger to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    // Verify the user profile was created by the trigger
    const { data: userProfile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("id")
      .eq("id", newUser.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("User profile not created by trigger:", profileError);
      // Try to delete the auth user if profile wasn't created
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new NextResponse("Failed to create user profile", { status: 500 });
    }

    // TODO: Send welcome email if requested
    if (sendWelcomeEmail) {
      // Implement email sending logic here
      console.log("TODO: Send welcome email to", email);
    }

    // Create audit log (optional - won't fail if table doesn't exist)
    try {
      await supabaseAdmin.from("audit_logs").insert({
        admin_id: user.id,
        action: "create_user",
        resource_type: "user",
        resource_id: newUser.user.id,
        details: {
          email,
          role,
          full_name: fullName,
        },
      });
    } catch (auditError) {
      console.warn("Failed to create audit log:", auditError);
      // Continue anyway - audit log is not critical
    }

    return NextResponse.json({
      user: {
        id: newUser.user.id,
        email,
        full_name: fullName,
        role,
      },
      success: true,
    });
  } catch (err) {
    console.error("Admin users POST error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
