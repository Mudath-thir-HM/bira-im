import { auth } from "./app/api/auth/[...nextauth]/route";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
  const isLandingPage =
    req.nextUrl.pathname === "/" || req.nextUrl.pathname === "/landingPage";

  // If user is logged in and tries to access auth page, redirect to homepage
  if (isLoggedIn && isAuthPage) {
    return Response.redirect(new URL("/homepage", req.nextUrl));
  }

  // If user is not logged in and tries to access protected pages, redirect to auth
  if (!isLoggedIn && !isAuthPage && !isLandingPage) {
    return Response.redirect(new URL("/auth", req.nextUrl));
  }
});

export const config = {
  matcher: [
    "/homepage/:path*",
    "/dashboard/:path*",
    "/leaderboard/:path*",
    "/notification/:path*",
    "/auth",
  ],
};
