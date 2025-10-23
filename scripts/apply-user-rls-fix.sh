#!/bin/bash

# Script to apply the user RLS fix migration to Supabase
# This fixes the issue where users cannot fetch their profile after registration

echo "🔧 Applying user RLS fix migration..."

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found"
    echo "Please create .env.local with your Supabase credentials"
    exit 1
fi

# Load environment variables
source .env.local

# Check if required variables are set
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo "❌ Error: Missing required environment variables"
    echo "Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local"
    exit 1
fi

# Apply the migration using psql (requires psql to be installed)
# Alternatively, you can use Supabase CLI: supabase db push

echo "📝 Reading migration file..."
MIGRATION_FILE="supabase/migrations/fix_user_rls_final.sql"

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration file found"
echo ""
echo "⚠️  You have two options to apply this migration:"
echo ""
echo "Option 1: Using Supabase Dashboard (Recommended)"
echo "  1. Go to your Supabase project dashboard"
echo "  2. Navigate to SQL Editor"
echo "  3. Copy and paste the contents of: $MIGRATION_FILE"
echo "  4. Run the SQL"
echo ""
echo "Option 2: Using Supabase CLI"
echo "  Run: npx supabase db push"
echo ""
echo "Would you like to see the migration SQL to copy? (y/n)"
read -r response

if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
    echo ""
    echo "=========================================="
    echo "MIGRATION SQL:"
    echo "=========================================="
    cat "$MIGRATION_FILE"
    echo ""
    echo "=========================================="
fi

echo ""
echo "✅ After applying the migration, your user registration should work properly!"
