// ============================================================================
// USER TYPES
// ============================================================================

export type UserRole = "homeowner" | "agent" | "admin";

export type AgentSubscriptionStatus = "none" | "active" | "cancelled";

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  phone: string | null;
  agent_subscription_status: AgentSubscriptionStatus;
  agent_subscription_id: string | null;
  agent_subscription_start: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// POLICY TYPES
// ============================================================================

export type PolicyCoverageType = "single" | "subscription";
export type PolicyStatus = "pending" | "active" | "expired";

export interface Policy {
  id: string;
  user_id: string;
  property_address: string;
  coverage_type: PolicyCoverageType;
  status: PolicyStatus;
  stripe_session_id: string | null;
  stripe_payment_intent: string | null;
  stripe_subscription_id: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// CLAIM TYPES
// ============================================================================

export type ClaimType = "homeowner_showing" | "agent_subscription" | "agent_listing";
export type ClaimStatus = "pending" | "approved" | "denied";
export type AtFaultParty = "agent" | "client";

export interface Claim {
  id: string;
  policy_id: string | null; // Nullable for agent subscription claims
  user_id: string | null; // Direct user reference for agent subscription claims
  claim_type: ClaimType;
  incident_date: string;
  damaged_items: string;
  supra_showing_number: string;
  description: string;
  proof_url: string | null;
  status: ClaimStatus;

  // Agent-specific fields
  at_fault_party: AtFaultParty | null;
  at_fault_name: string | null;
  at_fault_phone: string | null;
  at_fault_email: string | null;

  // Homeowner info (for agent claims where payout goes to homeowner)
  homeowner_name: string | null;
  homeowner_phone: string | null;
  homeowner_email: string | null;
  homeowner_address: string | null;

  // Showing proof (for agent claims)
  showing_proof_url: string | null;

  // Max payout
  max_payout_amount: number | null;

  created_at: string;
  updated_at: string;

  // Joined data
  policies?: {
    property_address: string;
    user_id: string;
  };
}

// ============================================================================
// API REQUEST/RESPONSE TYPES
// ============================================================================

// Homeowner claim request (existing flow)
export interface HomeownerClaimRequest {
  policyId: string;
  incidentDate: string;
  damagedItems: string;
  supaShowingNumber: string;
  description: string;
  proofUrl?: string;
}

// Agent subscription claim request (new flow)
export interface AgentSubscriptionClaimRequest {
  incidentDate: string;
  damagedItems: string;
  supaShowingNumber: string;
  description: string;
  proofUrl?: string;

  // At-fault info
  atFaultParty: AtFaultParty;
  atFaultName?: string;
  atFaultPhone?: string;
  atFaultEmail?: string;

  // Homeowner info (required for agent claims)
  homeownerName: string;
  homeownerPhone: string;
  homeownerEmail: string;
  homeownerAddress: string;

  // Showing proof (required)
  showingProofUrl: string;
}

// Agent listing claim request (agent protecting their own listing)
export interface AgentListingClaimRequest {
  policyId: string;
  incidentDate: string;
  damagedItems: string;
  supaShowingNumber: string;
  description: string;
  proofUrl?: string;
}

// Union type for all claim requests
export type ClaimRequest =
  | HomeownerClaimRequest
  | AgentSubscriptionClaimRequest
  | AgentListingClaimRequest;

// Agent subscription info
export interface AgentSubscription {
  status: AgentSubscriptionStatus;
  subscriptionId: string | null;
  subscriptionStart: string | null;
  canFileClaims: boolean;
}

// ============================================================================
// STRIPE TYPES
// ============================================================================

export interface StripeCheckoutSession {
  sessionId: string;
  url: string;
}

export interface StripeSubscriptionInfo {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

// ============================================================================
// ADMIN TYPES
// ============================================================================

export type InvitationStatus = "pending" | "accepted" | "expired" | "cancelled";

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  invited_by: string;
  token: string;
  status: InvitationStatus;
  custom_message: string | null;
  expires_at: string;
  created_at: string;
  accepted_at: string | null;
}

export interface InvitationWithInviter extends Invitation {
  inviter?: {
    full_name: string;
    email: string;
  };
}

export interface SendInvitationRequest {
  email: string;
  role: UserRole;
  customMessage?: string;
  expiresInDays?: number; // Default: 7
}

export type AdminNoteResourceType = "claim" | "user" | "policy";

export interface AdminNote {
  id: string;
  resource_type: AdminNoteResourceType;
  resource_id: string;
  admin_id: string;
  note: string;
  created_at: string;
  updated_at: string;
}

export interface AdminNoteWithAdmin extends AdminNote {
  admin?: {
    full_name: string;
    email: string;
  };
}

export interface CreateAdminNoteRequest {
  resourceType: AdminNoteResourceType;
  resourceId: string;
  note: string;
}

export type AuditLogResourceType = "claim" | "user" | "policy" | "invitation" | "system";

export interface AuditLog {
  id: string;
  admin_id: string;
  action: string;
  resource_type: AuditLogResourceType;
  resource_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface AuditLogWithAdmin extends AuditLog {
  admin?: {
    full_name: string;
    email: string;
  };
}

export interface CreateAuditLogRequest {
  action: string;
  resourceType: AuditLogResourceType;
  resourceId?: string;
  details?: Record<string, unknown>;
}

// Admin dashboard analytics
export interface AdminDashboardStats {
  totalUsers: number;
  totalHomeowners: number;
  totalAgents: number;
  totalAdmins: number;
  activeAgentSubscriptions: number;
  totalPolicies: number;
  activePolicies: number;
  expiredPolicies: number;
  totalClaims: number;
  pendingClaims: number;
  approvedClaims: number;
  deniedClaims: number;
  totalRevenue: number;
  monthlyRecurringRevenue: number;
}

export interface AdminUserWithDetails extends UserProfile {
  policies_count?: number;
  claims_count?: number;
}

export interface AdminClaimWithDetails extends Claim {
  user?: {
    full_name: string;
    email: string;
    role: UserRole;
  };
  policy?: {
    property_address: string;
  };
  notes?: AdminNote[];
}

export interface AdminPolicyWithDetails extends Policy {
  user?: {
    full_name: string;
    email: string;
    role: UserRole;
  };
  claims_count?: number;
  claims?: Claim[];
  expiry_date?: string;
}

// Claim approval/denial
export interface ApproveClaimRequest {
  payoutAmount?: number; // Optional: can adjust payout
  adminNote?: string;
}

export interface DenyClaimRequest {
  reason: string;
  adminNote?: string;
}

// User management
export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  sendWelcomeEmail?: boolean;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  role?: UserRole;
  agentSubscriptionStatus?: AgentSubscriptionStatus;
}
