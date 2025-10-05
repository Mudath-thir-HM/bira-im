// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get the session token from cookies
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Define route types
  const isAuthPage = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/" || pathname === "/landingPage";
  const isApiRoute = pathname.startsWith("/api");
  const isVerifyPage = pathname.startsWith("/auth/verify");
  const isStaticFile = pathname.includes(".");

  // Allow static files, API routes, and verify page to pass through
  if (isStaticFile || isApiRoute || isVerifyPage) {
    return NextResponse.next();
  }

  // If user is logged in and tries to access auth page, redirect to homepage
  if (isLoggedIn && isAuthPage && !isVerifyPage) {
    return NextResponse.redirect(new URL("/homepage", request.url));
  }

  // If user is not logged in and tries to access protected pages, redirect to auth
  if (!isLoggedIn && !isAuthPage && !isLandingPage) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files with extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)",
  ],
};
