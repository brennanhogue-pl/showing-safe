/**
 * Script to fix missing user profiles in the database
 *
 * This script checks auth.users and creates corresponding profiles in the users table
 * for any users that are missing their profile.
 *
 * Usage:
 * 1. Make sure your .env.local has SUPABASE_SERVICE_ROLE_KEY
 * 2. Run: npx tsx scripts/fix-user-profile.ts
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
  console.error("Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUserProfiles() {
  try {
    console.log("🔍 Checking for users without profiles...\n");

    // Get all auth users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();

    if (authError) {
      throw new Error(`Failed to fetch auth users: ${authError.message}`);
    }

    console.log(`Found ${authUsers.users.length} auth users\n`);

    // Check each user for a profile
    for (const authUser of authUsers.users) {
      console.log(`Checking user: ${authUser.email}`);

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("id")
        .eq("id", authUser.id)
        .single();

      if (profileError && profileError.code === "PGRST116") {
        // Profile doesn't exist, create it
        console.log(`  ❌ Profile missing for ${authUser.email}`);
        console.log(`  📝 Creating profile...`);

        const role = authUser.user_metadata?.role || "homeowner";
        const fullName = authUser.user_metadata?.full_name || authUser.email?.split("@")[0];

        const { error: insertError } = await supabase.from("users").insert([
          {
            id: authUser.id,
            email: authUser.email,
            role: role,
            full_name: fullName,
            phone: authUser.phone || null,
            agent_subscription_status: "none",
            agent_subscription_id: null,
            agent_subscription_start: null,
          },
        ]);

        if (insertError) {
          console.error(`  ❌ Failed to create profile: ${insertError.message}`);
        } else {
          console.log(`  ✅ Profile created successfully!`);
          console.log(`     - Email: ${authUser.email}`);
          console.log(`     - Role: ${role}`);
          console.log(`     - Full Name: ${fullName}\n`);
        }
      } else if (profileError) {
        console.error(`  ❌ Error checking profile: ${profileError.message}`);
      } else {
        console.log(`  ✅ Profile already exists\n`);
      }
    }

    console.log("\n✅ Done! All users have been checked.");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  }
}

fixUserProfiles();
