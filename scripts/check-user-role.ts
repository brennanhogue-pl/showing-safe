/**
 * Script to check and update user role
 *
 * Usage:
 * Run: npx tsx scripts/check-user-role.ts <email> <role>
 * Example: npx tsx scripts/check-user-role.ts user@example.com agent
 */

import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import * as path from "path";

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkAndUpdateRole() {
  const email = process.argv[2];
  const newRole = process.argv[3];

  if (!email) {
    console.error("❌ Please provide an email address");
    console.log("Usage: npx tsx scripts/check-user-role.ts <email> [role]");
    process.exit(1);
  }

  console.log(`🔍 Looking up user: ${email}\n`);

  // Check if user exists in users table
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    console.error("❌ Error fetching user:", error.message);
    process.exit(1);
  }

  console.log("✅ User found:");
  console.log(`   ID: ${user.id}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Role: ${user.role}`);
  console.log(`   Full Name: ${user.full_name}`);
  console.log(`   Agent Subscription: ${user.agent_subscription_status}`);

  // If new role is provided, update it
  if (newRole) {
    if (!["homeowner", "agent", "admin"].includes(newRole)) {
      console.error("\n❌ Invalid role. Must be: homeowner, agent, or admin");
      process.exit(1);
    }

    console.log(`\n📝 Updating role to: ${newRole}`);

    const { error: updateError } = await supabase
      .from("users")
      .update({ role: newRole })
      .eq("id", user.id);

    if (updateError) {
      console.error("❌ Failed to update role:", updateError.message);
      process.exit(1);
    }

    console.log("✅ Role updated successfully!");
  }
}

checkAndUpdateRole();
