import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";
import { UpdateUserRequest } from "@/types";

// GET - Get single user details
export async function GET(req: Request, { params }: { params: { id: string } }) {
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

    const userId = params.id;

    // Get user with related data
    const { data: userData, error } = await supabaseAdmin
      .from("users")
      .select(`
        *,
        policies:policies(
          id,
          property_address,
          coverage_type,
          status,
          created_at
        ),
        claims:claims(
          id,
          claim_type,
          status,
          incident_date,
          damaged_items,
          created_at
        )
      `)
      .eq("id", userId)
      .single();

    if (error || !userData) {
      return new NextResponse("User not found", { status: 404 });
    }

    return NextResponse.json({ user: userData });
  } catch (err) {
    console.error("Admin user GET error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// PATCH - Update user
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
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

    const userId = params.id;
    const body: UpdateUserRequest = await req.json();
    const { fullName, email, role, agentSubscriptionStatus } = body;

    // Build update object
    const updates: Partial<{
      full_name: string;
      email: string;
      role: string;
      agent_subscription_status: string;
    }> = {};
    if (fullName !== undefined) updates.full_name = fullName;
    if (email !== undefined) updates.email = email;
    if (role !== undefined) {
      if (!["homeowner", "agent", "admin"].includes(role)) {
        return new NextResponse("Invalid role", { status: 400 });
      }
      updates.role = role;
    }
    if (agentSubscriptionStatus !== undefined) {
      updates.agent_subscription_status = agentSubscriptionStatus;
    }

    if (Object.keys(updates).length === 0) {
      return new NextResponse("No updates provided", { status: 400 });
    }

    // Update user in database
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user:", updateError);
      return new NextResponse("Failed to update user", { status: 500 });
    }

    // If email was updated, also update in auth
    if (email) {
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        email,
      });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "update_user",
      resource_type: "user",
      resource_id: userId,
      details: updates,
    });

    return NextResponse.json({ user: updatedUser, success: true });
  } catch (err) {
    console.error("Admin user PATCH error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}

// DELETE - Delete user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
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

    const userId = params.id;

    // Prevent deleting yourself
    if (userId === user.id) {
      return new NextResponse("Cannot delete your own account", { status: 400 });
    }

    // Get user details for audit log before deletion
    const { data: userToDelete } = await supabaseAdmin
      .from("users")
      .select("email, full_name, role")
      .eq("id", userId)
      .single();

    // Delete user from auth (this will cascade delete from users table due to foreign key)
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error("Error deleting user:", deleteError);
      return new NextResponse("Failed to delete user", { status: 500 });
    }

    // Create audit log
    await supabaseAdmin.from("audit_logs").insert({
      admin_id: user.id,
      action: "delete_user",
      resource_type: "user",
      resource_id: userId,
      details: {
        email: userToDelete?.email,
        full_name: userToDelete?.full_name,
        role: userToDelete?.role,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin user DELETE error:", err);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
