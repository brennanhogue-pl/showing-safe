// Script to create a test policy in the database
// Run with: npx tsx scripts/create-test-policy.ts

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!');
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createTestPolicy() {
  // Replace this with your actual user ID from the auth.users table
  const USER_EMAIL = 'brennan@preferredlender.us'; // Change this to your email

  console.log('🔍 Looking up user by email:', USER_EMAIL);

  // Get user ID from email
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('email', USER_EMAIL)
    .single();

  if (userError || !userData) {
    console.error('❌ User not found:', userError);
    console.log('Please update the USER_EMAIL in the script to match your registered email');
    return;
  }

  console.log('✅ Found user:', userData.id);

  // Create a test policy
  const { data: policy, error: policyError } = await supabase
    .from('policies')
    .insert([
      {
        user_id: userData.id,
        property_address: '123 Main Street, Salt Lake City, UT 84101',
        coverage_type: 'single',
        status: 'active',
      },
    ])
    .select()
    .single();

  if (policyError) {
    console.error('❌ Error creating policy:', policyError);
    return;
  }

  console.log('✅ Test policy created successfully!');
  console.log('Policy ID:', policy.id);
  console.log('Property:', policy.property_address);
  console.log('Status:', policy.status);
  console.log('\n🎉 Refresh your dashboard to see the policy!');
}

createTestPolicy().catch(console.error);
