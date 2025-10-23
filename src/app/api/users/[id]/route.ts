import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;

    console.log("API: Fetching user profile for ID:", userId);

    // Fetch user from the users table using admin client (bypasses RLS)
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("API: Error fetching user:", error);
      return new NextResponse(
        JSON.stringify({ error: "Failed to fetch user profile" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    if (!user) {
      console.error("API: User not found:", userId);
      return new NextResponse(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("API: User profile fetched successfully");
    return NextResponse.json({ user });
  } catch (err) {
    console.error("API: Exception in user fetch:", err);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
