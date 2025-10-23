# Resend Email Setup Guide

This guide will help you set up Resend for sending invitation emails in ShowingSafe.

## Step 1: Sign Up for Resend

1. Go to https://resend.com
2. Click "Sign Up" and create a free account
3. Verify your email address

## Step 2: Get Your API Key

1. Once logged in, navigate to **API Keys** in the left sidebar
2. Click "Create API Key"
3. Give it a name like "ShowingSafe Development"
4. Select the appropriate permissions (you need "Sending access")
5. Click "Create"
6. **Copy the API key** - you won't be able to see it again!

## Step 3: Add API Key to Your Environment

1. Open your `.env.local` file (or create it if it doesn't exist)
2. Add this line:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```
3. Replace `re_your_api_key_here` with the actual API key you copied
4. **Restart your dev server** for the changes to take effect

## Step 4: Test Email Sending

### For Development (Free Tier)

With the free tier, you can:
- Send emails to **any email address** using the test domain `onboarding@resend.dev`
- Send up to **100 emails per day**
- Send up to **3,000 emails per month**

The current setup uses `onboarding@resend.dev` as the sender, so you can test immediately!

### Try It Out

1. Go to your admin dashboard
2. Navigate to **Invitations**
3. Click "Send Invitation"
4. Fill in the email details
5. Check your inbox - you should receive a beautifully formatted invitation email!

## Step 5: Verify Your Domain (Production)

For production, you'll want to send emails from your own domain.

1. In Resend dashboard, go to **Domains**
2. Click "Add Domain"
3. Enter your domain (e.g., `showingsafe.com`)
4. Follow the instructions to add DNS records:
   - **SPF Record**: Proves your domain is authorized to send emails
   - **DKIM Record**: Adds a digital signature to your emails
   - **DMARC Record**: Tells email providers how to handle failed authentication
5. Wait for DNS propagation (can take up to 48 hours, usually faster)
6. Once verified, update the email sender in your code:

### Update the Sender Email

In both API files, change:
```typescript
from: 'ShowingSafe <onboarding@resend.dev>'
```

To:
```typescript
from: 'ShowingSafe <noreply@yourdomain.com>'
```

Files to update:
- `/src/app/api/admin/invitations/route.ts` (line ~187)
- `/src/app/api/admin/invitations/[id]/route.ts` (line ~169)

## Email Features

### What's Included

✅ **Beautiful HTML emails** using React Email components
✅ **Responsive design** - looks great on mobile and desktop
✅ **Personalized content** - shows who invited them and their role
✅ **Clear call-to-action** - big blue "Accept Invitation" button
✅ **Automatic handling** - emails sent on invite creation and resend
✅ **Graceful fallback** - app works even if Resend isn't configured

### Email Template Customization

The email template is located at:
- `/src/emails/InvitationEmail.tsx`

You can customize:
- Colors and styling
- Logo and branding
- Email copy and messaging
- Footer content

## Monitoring & Logs

### Console Logs

The system logs email activity:
- ✅ `Invitation email sent to user@example.com` - Email sent successfully
- ⚠️ `Resend not configured...` - API key not set, invitation created but no email sent
- ❌ `Error sending invitation email:` - Email failed to send (invitation still created)

### Resend Dashboard

In your Resend dashboard, you can:
- View all sent emails
- Check delivery status
- See open and click rates
- Debug failed deliveries

## Troubleshooting

### Emails Not Sending?

1. **Check your API key**:
   ```bash
   echo $RESEND_API_KEY
   ```
   Should show your API key starting with `re_`

2. **Restart your dev server**:
   ```bash
   npm run dev
   ```

3. **Check the console** for error messages

4. **Verify email address** - Some providers block test emails

### Emails Going to Spam?

1. Verify your domain (see Step 5 above)
2. Add SPF, DKIM, and DMARC records
3. Warm up your sending domain gradually
4. Ask recipients to whitelist your domain

## Pricing

**Free Tier:**
- 3,000 emails/month
- 100 emails/day
- Test domain included

**Pro Plan ($20/month):**
- 50,000 emails/month
- Additional emails: $1 per 1,000
- Custom domain
- Priority support

## Support

- Resend Documentation: https://resend.com/docs
- Resend Support: support@resend.com
- React Email Docs: https://react.email/docs

---

**That's it!** Your invitation emails are now set up and ready to go! 🎉
