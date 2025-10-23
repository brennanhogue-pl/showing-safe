# Vercel Deployment Guide for ShowingSafe

## Prerequisites
- GitHub repository pushed (✅ Complete)
- Vercel account (sign up at https://vercel.com)
- Supabase project set up
- Stripe account with API keys
- (Optional) Resend account for email invitations

## Step 1: Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your GitHub account and find `showing-safe` repository
4. Click "Import"

## Step 2: Configure Project Settings

### Framework Preset
- **Framework Preset**: Next.js (should auto-detect)
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)

### Node.js Version
- Click "Environment Variables" section
- The project uses Node.js 18+ (should work by default)

## Step 3: Add Environment Variables

Click on "Environment Variables" and add the following:

### Required Variables

#### Next.js Public URL
```
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```
(You'll update this after first deployment with your actual Vercel URL)

#### Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Get these from your Supabase project:
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings > API
- Copy the values

#### Stripe
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Important**: You'll need to set up a NEW webhook in Stripe for production:
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter: `https://your-app.vercel.app/api/webhooks/stripe`
4. Select events: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`
5. Copy the webhook signing secret and use it for `STRIPE_WEBHOOK_SECRET`

### Optional Variables

#### Resend (for email invitations)
```
RESEND_API_KEY=re_...
```

Only needed if you want email invitations to work. See `docs/resend-setup.md` for setup.

## Step 4: Deploy

1. After adding all environment variables, click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Once deployed, you'll get a URL like: `https://showing-safe-xyz.vercel.app`

## Step 5: Post-Deployment Configuration

### Update Environment Variables
1. Go to your Vercel project settings
2. Go to "Environment Variables"
3. Update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL
4. Redeploy to apply changes

### Update Supabase Auth Redirect URLs
1. Go to your Supabase project
2. Navigate to Authentication > URL Configuration
3. Add your Vercel URL to:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: `https://your-app.vercel.app/**`

### Test Stripe Webhooks
1. Make a test purchase on your deployed site
2. Check Stripe Dashboard > Webhooks to see if events are being received
3. If issues, verify the webhook URL and secret are correct

## Step 6: Database Migrations

Your Supabase database should already have the schema applied from local development. If starting fresh:

1. Go to your Supabase project SQL Editor
2. Run the schema from `supabase/schema.sql`
3. Apply any migrations from `supabase/migrations/`

## Step 7: Create Admin User

You'll need to create an admin user to access the admin dashboard:

### Option 1: Via Supabase Dashboard
1. Go to Supabase Dashboard > Authentication > Users
2. Click "Add user"
3. Enter email and password
4. After user is created, go to Table Editor > users table
5. Find the user and update their `role` to `admin`

### Option 2: Via SQL
```sql
-- First, create the auth user in Supabase Dashboard
-- Then run this SQL to update their role:
UPDATE users
SET role = 'admin'
WHERE email = 'your-admin-email@example.com';
```

## Vercel-Specific Features

### Custom Domain (Optional)
1. Go to your Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_APP_URL` and Supabase redirect URLs

### Environment Variables by Environment
- Vercel supports different variables for Production, Preview, and Development
- You can use this to have separate Stripe test/live keys

### Automatic Deployments
- Every push to `main` branch will trigger a new production deployment
- Pull requests will create preview deployments

## Monitoring and Logs

- **Build Logs**: Vercel Dashboard > Deployments > [Select deployment] > Build Logs
- **Runtime Logs**: Vercel Dashboard > [Project] > Logs
- **Error Tracking**: Consider adding Sentry or similar

## Common Issues

### Build Failures
- Check build logs in Vercel dashboard
- Verify all environment variables are set correctly
- Ensure Node.js version compatibility

### Database Connection Issues
- Verify Supabase environment variables are correct
- Check Supabase project is not paused (free tier pauses after inactivity)
- Verify RLS policies are set up correctly

### Stripe Webhook Not Working
- Verify webhook URL matches your Vercel deployment URL
- Check webhook signing secret is correct
- View webhook logs in Stripe dashboard

### Authentication Issues
- Verify redirect URLs in Supabase match your Vercel URL
- Check `NEXT_PUBLIC_APP_URL` is set correctly

## Production Checklist

Before going live:

- [ ] All environment variables configured
- [ ] Admin user created and tested
- [ ] Stripe webhook verified and working
- [ ] Supabase RLS policies tested
- [ ] Custom domain configured (if applicable)
- [ ] Test user flows (signup, login, purchase, claim filing)
- [ ] Test admin features (user management, claim approval)
- [ ] Verify email invitations work (if using Resend)
- [ ] Mobile responsiveness tested
- [ ] Switch Stripe to live mode (update keys)

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Supabase logs
3. Verify all environment variables
4. Test locally with production environment variables

## Next Steps After Deployment

1. Set up custom domain
2. Configure Resend with custom domain for email
3. Switch Stripe from test mode to live mode
4. Set up monitoring/analytics
5. Configure backup strategy for Supabase
