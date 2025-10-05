// src/middleware.ts
import { auth } from "@/lib/auth.config"; // Changed import path
import { NextResponse } from "next/server";

export default auth(async (req) => {
  const isLoggedIn = !!req.auth;
  const pathname = req.nextUrl.pathname;

  const isAuthPage = pathname.startsWith("/auth");
  const isLandingPage = pathname === "/" || pathname === "/landingPage";
  const isApiRoute = pathname.startsWith("/api");
  const isVerifyPage = pathname.startsWith("/auth/verify");

  // Allow API routes and verify page to pass through
  if (isApiRoute || isVerifyPage) {
    return NextResponse.next();
  }

  // If user is logged in and tries to access auth page, redirect to homepage
  if (isLoggedIn && isAuthPage && !isVerifyPage) {
    return NextResponse.redirect(new URL("/homepage", req.nextUrl));
  }

  // If user is not logged in and tries to access protected pages, redirect to auth
  if (!isLoggedIn && !isAuthPage && !isLandingPage) {
    return NextResponse.redirect(new URL("/auth", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
