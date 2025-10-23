import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // TEMPORARY: Disable middleware protection to test redirect
  // The dashboard pages will handle auth checks on the client side
  console.log("🔐 Middleware - Path:", req.nextUrl.pathname, "Status: allowing all (client-side auth)");

  return res;

  /* TODO: Re-enable after fixing auth
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session to ensure we have the latest auth state
  const {
    data: { session },
  } = await supabase.auth.getSession();

  console.log("🔐 Middleware - Path:", req.nextUrl.pathname, "Session:", !!session);

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL("/auth/login", req.url);
    redirectUrl.searchParams.set("redirectTo", req.nextUrl.pathname);
    console.log("🚫 Redirecting to login - no session");
    return NextResponse.redirect(redirectUrl);
  }

  // Don't redirect auth pages on server side - let client handle it
  // This prevents redirect loops with client-side navigation
  if (req.nextUrl.pathname.startsWith("/auth/") && session) {
    console.log("ℹ️ Auth page accessed with session - allowing (client will redirect)");
  }

  return res;
  */
}

// Enable middleware to protect routes
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
