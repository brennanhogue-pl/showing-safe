import { supabaseAdmin } from "../src/lib/supabaseAdmin";
import * as fs from "fs";
import * as path from "path";

async function runMigration() {
  try {
    console.log("📧 Running email templates migration...");

    const migrationPath = path.join(
      __dirname,
      "../supabase/migrations/20250123_create_email_templates.sql"
    );

    const sql = fs.readFileSync(migrationPath, "utf8");

    // Split by statement and execute each one
    const statements = sql
      .split(";")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const statement of statements) {
      console.log(`Executing statement: ${statement.substring(0, 50)}...`);
      const { error } = await supabaseAdmin.rpc("exec_sql", { sql: statement });

      if (error) {
        console.error("Error executing statement:", error);
        // Try direct query if RPC doesn't work
        const { error: directError } = await supabaseAdmin.from("_").select().limit(0);
        if (!directError || directError.message.includes("relation")) {
          // This means we can't execute raw SQL directly
          console.log("ℹ️  Need to run migration manually via Supabase dashboard");
          console.log("\nPlease run this SQL in your Supabase SQL Editor:");
          console.log("\n" + sql);
          return;
        }
      }
    }

    console.log("✅ Migration completed successfully!");
  } catch (err) {
    console.error("❌ Migration error:", err);
  }
}

runMigration();
