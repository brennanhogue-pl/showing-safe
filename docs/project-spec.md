# ShowingSafe – Project Specification

## Overview
**ShowingSafe** is an open-house insurance platform that allows listing agents or homeowners to purchase temporary or subscription-based coverage to protect against property damage or theft during showings.

The application provides a **single unified portal** for all user types (Homeowners, Agents, and Admins) under one authentication system. It includes integrated payments, claims, notifications, and a full admin dashboard — all coded within the same system.

---

## 🎯 Project Goals
- Allow users to easily purchase coverage for open houses.
- Provide subscription options for agents managing multiple listings.
- Allow users to submit and track claims.
- Give admins visibility into all policies, payments, and claims.
- Automate payment updates and policy status changes through Stripe webhooks.

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-------------|----------|
| **Frontend** | Next.js 14 (App Router) + TypeScript | Core web framework for pages and routes |
| **Styling** | TailwindCSS + ShadCN/UI | Component styling and layout system |
| **Backend** | Supabase (PostgreSQL + Edge Functions) | Database, auth, and API logic |
| **Authentication** | Supabase Auth | Single sign-on for all roles |
| **Payments** | Stripe Billing + Webhooks | Subscription and one-time payments |
| **Notifications** | Resend (email) + Twilio (SMS) | Automated updates for claims and status |
| **Hosting** | Vercel + Supabase Cloud | Scalable deployment environment |
| **Dev Environment** | Cursor + GitHub + Turbopack | AI-powered local dev and version control |

---

## 👥 User Roles & Permissions

| Role | Permissions |
|------|--------------|
| **Homeowner** | Purchase a one-time policy, submit claims, view claim status |
| **Listing Agent** | Manage multiple properties, purchase coverage per listing, manage subscriptions, view claims |
| **Admin** | View all users, policies, and claims; approve or deny claims; manage Stripe subscriptions; access analytics |

All roles authenticate through the same login system but see role-specific dashboards.

---

## 🗄️ Database Schema

### users
| Column | Type | Notes |
|---------|------|-------|
| id | uuid (PK) | Matches `auth.users.id` |
| email | text | Unique |
| role | text (`homeowner` / `agent` / `admin`) | Role-based access |
| full_name | text |  |
| phone | text |  |
| created_at | timestamp | Default now() |

### policies
| Column | Type | Notes |
|---------|------|-------|
| id | uuid (PK) |  |
| user_id | uuid (FK → users.id) | Owner or agent |
| property_address | text | Address of listing |
| coverage_type | text (`single` / `subscription`) | Type of plan |
| stripe_subscription_id | text | Stripe subscription reference |
| status | text (`pending` / `active` / `expired`) | Policy lifecycle |
| created_at | timestamp | Default now() |

### claims
| Column | Type | Notes |
|---------|------|-------|
| id | uuid (PK) |  |
| policy_id | uuid (FK → policies.id) | Related policy |
| description | text | Claim details |
| proof_url | text | Uploaded image/file link |
| status | text (`pending` / `approved` / `denied`) | Claim state |
| created_at | timestamp | Default now() |

---

## 💳 Stripe Product Configuration

| Product Name | Type | Price | Audience | Notes |
|---------------|------|--------|-----------|-------|
| Single-Use Policy | One-time | $99 | Homeowner | Covers one showing |
| Listing Agent Subscription | Recurring | $99/mo | Agent | Includes one listing |
| Buyer Agent Subscription | Recurring | $14.99/mo | Agent | Basic coverage |
| Add-On Listing | Add-on | $59 | Agent | Each extra property |

**Webhook Triggers**
- `checkout.session.completed` → Activate policy
- `customer.subscription.deleted` → Mark policy as expired
- `invoice.payment_failed` → Notify user and admin

---

## 🧩 Application Routes

/auth/login
/auth/register
/dashboard/homeowner
/dashboard/agent
/dashboard/admin
/api/policies
/api/claims
/api/webhooks/stripe

---

## 🧠 Core Features

### 1. Authentication
- Supabase Auth for all user types
- Role-based dashboards after login
- Profile completion for first-time users

### 2. Policy Management
- Create and view policies
- Auto-update status from Stripe webhook
- Agents can manage multiple properties

### 3. Claims
- Homeowners and Agents can submit claims
- Admins can review, approve, or deny
- Claim updates trigger email/SMS notifications

### 4. Payments
- Stripe Checkout for single-use and subscriptions
- Stripe Webhooks update policy statuses in Supabase
- Subscription management through Stripe Billing Portal

### 5. Admin Dashboard
- Claim management table (approve/deny)
- Policy overview with filters
- Revenue and subscription metrics (via Recharts)
- User management (role-based filtering)

---

## 📦 Folder Structure (Target)

/src
/app
/auth
login/page.tsx
register/page.tsx
/dashboard
/homeowner
/agent
/admin
/api
/policies
/claims
/webhooks
/components
Navbar.tsx
Sidebar.tsx
PolicyCard.tsx
ClaimForm.tsx
/lib
supabase.ts
stripe.ts
auth.ts
/utils
/docs
project-spec.md

---

## 🔐 Row Level Security (RLS) Rules (Supabase)

| Table | Rule | Description |
|--------|------|--------------|
| users | `auth.uid() = id` | Each user can see only their own record |
| policies | `auth.uid() = user_id` | Only owners can view or update their policies |
| claims | `EXISTS (SELECT 1 FROM policies WHERE policies.id = policy_id AND policies.user_id = auth.uid())` | Users see claims related to their policies |
| admins | bypass | Admins have unrestricted access |

---

## 🧮 API Endpoints (Edge Functions)

| Endpoint | Method | Description |
|-----------|---------|--------------|
| `/api/policies` | POST | Create a new policy after Stripe payment |
| `/api/claims` | POST | Submit a new claim |
| `/api/webhooks/stripe` | POST | Listen to Stripe events and update policy records |
| `/api/admin/approve-claim` | POST | Approve or deny claim (admin only) |

---

## 📈 Phase Plan

1. **Setup & Configuration**
   - Initialize Supabase + Stripe
   - Configure `.env.local`
   - Add Supabase client + Stripe utilities

2. **Authentication**
   - Implement Supabase Auth with role redirection

3. **Database + APIs**
   - Add Edge Functions for policies and claims
   - Connect webhooks for Stripe events

4. **Frontend**
   - Build role-based dashboards
   - Integrate UI components with ShadCN/UI

5. **Admin Portal**
   - Add tables, filters, and analytics charts

6. **Notifications**
   - Add email (Resend) and SMS (Twilio)

7. **Deployment**
   - Deploy to Vercel
   - Connect custom domain
   - Test live Stripe transactions

---

## 🧩 Next Steps (For Cursor)
1. Scaffold the folder structure based on this spec.
2. Create placeholder routes and API stubs.
3. Generate initial UI components (Navbar, Sidebar, etc.).
4. Prepare to integrate Supabase and Stripe utilities.

---
