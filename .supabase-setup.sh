#!/bin/bash

echo "🔧 Supabase CLI Setup"
echo ""
echo "Please follow these steps:"
echo ""
echo "1. Go to https://supabase.com/dashboard/account/tokens"
echo "2. Click 'Generate New Token'"
echo "3. Give it a name like 'CLI Access'"
echo "4. Copy the token and paste it below"
echo ""
read -p "Enter your Supabase access token: " SUPABASE_TOKEN
echo ""

# Add to .env.local if not already there
if ! grep -q "SUPABASE_ACCESS_TOKEN" .env.local; then
  echo "SUPABASE_ACCESS_TOKEN=$SUPABASE_TOKEN" >> .env.local
  echo "✅ Added SUPABASE_ACCESS_TOKEN to .env.local"
else
  echo "⚠️  SUPABASE_ACCESS_TOKEN already exists in .env.local"
fi

# Export for current session
export SUPABASE_ACCESS_TOKEN=$SUPABASE_TOKEN

# Link the project
echo ""
echo "🔗 Linking Supabase project..."
supabase link --project-ref lwtrwyuohweoucgpxmfn

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Project linked successfully!"
  echo ""
  echo "You can now run migrations with:"
  echo "  supabase db push"
else
  echo ""
  echo "❌ Failed to link project. You may need to enter your database password."
  echo ""
  echo "To get your database password:"
  echo "1. Go to https://supabase.com/dashboard/project/lwtrwyuohweoucgpxmfn/settings/database"
  echo "2. Click 'Reset Database Password' if needed"
  echo "3. Copy the password"
fi
