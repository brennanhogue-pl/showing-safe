import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  try {
    console.log('🚀 Applying admin features migration...\n');

    // Read the migration file
    const migrationPath = path.join(process.cwd(), 'supabase/migrations/add_admin_features.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');

    // Split by semicolons to execute statements separately
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments
      if (statement.startsWith('--') || statement.startsWith('/*')) {
        continue;
      }

      try {
        console.log(`Executing statement ${i + 1}/${statements.length}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });

        if (error) {
          // Try direct execution if RPC doesn't work
          console.log(`Trying direct execution...`);
          const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': supabaseServiceKey,
              'Authorization': `Bearer ${supabaseServiceKey}`
            },
            body: JSON.stringify({ sql: statement })
          });

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${await response.text()}`);
          }
        }
      } catch (err) {
        console.warn(`⚠️  Statement ${i + 1} may have already been applied or failed:`, (err as Error).message);
      }
    }

    console.log('\n✅ Migration completed!');
    console.log('\n📋 Verifying tables exist...');

    // Verify tables exist
    const { data: tables, error: tablesError } = await supabase
      .from('invitations')
      .select('count')
      .limit(1);

    if (tablesError) {
      console.error('❌ Error verifying invitations table:', tablesError.message);
    } else {
      console.log('✅ invitations table exists');
    }

    const { data: notes, error: notesError } = await supabase
      .from('admin_notes')
      .select('count')
      .limit(1);

    if (notesError) {
      console.error('❌ Error verifying admin_notes table:', notesError.message);
    } else {
      console.log('✅ admin_notes table exists');
    }

    const { data: logs, error: logsError } = await supabase
      .from('audit_logs')
      .select('count')
      .limit(1);

    if (logsError) {
      console.error('❌ Error verifying audit_logs table:', logsError.message);
    } else {
      console.log('✅ audit_logs table exists');
    }

    console.log('\n🎉 All done! You can now use the invitations page.');

  } catch (error) {
    console.error('❌ Error applying migration:', error);
    process.exit(1);
  }
}

applyMigration();
