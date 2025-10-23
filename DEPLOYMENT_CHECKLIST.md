# Quick Deployment Checklist

## Pre-Deployment
- [x] Code pushed to GitHub
- [ ] Supabase project ready with schema applied
- [ ] Stripe account ready with test API keys
- [ ] Resend account (optional - for emails)

## Vercel Setup
1. [ ] Go to https://vercel.com/new
2. [ ] Import `showing-safe` repository from GitHub
3. [ ] Configure as Next.js project (auto-detected)

## Environment Variables to Add

Copy these from your `.env.local`:

### Required
```env
NEXT_PUBLIC_APP_URL=https://[will-be-filled-after-first-deploy].vercel.app
NEXT_PUBLIC_SUPABASE_URL=your_value
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_value
SUPABASE_SERVICE_ROLE_KEY=your_value
STRIPE_SECRET_KEY=your_value
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_value
STRIPE_WEBHOOK_SECRET=[create_new_webhook_in_stripe]
```

### Optional
```env
RESEND_API_KEY=your_value
```

## Post-Deployment Steps

1. [ ] Note your Vercel URL (e.g., `showing-safe-abc123.vercel.app`)
2. [ ] Update `NEXT_PUBLIC_APP_URL` in Vercel env vars with your URL
3. [ ] Redeploy to apply the updated URL

4. [ ] **Configure Stripe Webhook**:
   - Go to https://dashboard.stripe.com/webhooks
   - Add endpoint: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
   - Select events: checkout.session.completed, customer.subscription.*
   - Copy signing secret to `STRIPE_WEBHOOK_SECRET`

5. [ ] **Update Supabase Auth URLs**:
   - Go to Supabase > Authentication > URL Configuration
   - Site URL: `https://your-vercel-url.vercel.app`
   - Redirect URLs: `https://your-vercel-url.vercel.app/**`

6. [ ] **Create Admin User**:
   - Sign up via `/auth/register`
   - In Supabase, update user role to 'admin'

7. [ ] **Test Everything**:
   - [ ] Login works
   - [ ] User signup works
   - [ ] Purchase policy works
   - [ ] Stripe webhook receives events
   - [ ] Admin dashboard accessible
   - [ ] Mobile navigation works
   - [ ] File claim works

## You're Done! 🎉

Your app should be live at: `https://your-url.vercel.app`

## Quick Links
- Vercel Dashboard: https://vercel.com/dashboard
- Supabase Dashboard: https://supabase.com/dashboard
- Stripe Dashboard: https://dashboard.stripe.com
- Resend Dashboard: https://resend.com/overview (if using)
