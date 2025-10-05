// src/components/AuthGuard.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/auth");
  const isLandingPage = pathname === "/" || pathname === "/landingPage";
  const isVerifyPage = pathname === "/auth/verify";

  useEffect(() => {
    if (status === "loading") return;

    // Redirect logged-in users away from auth page
    if (session && isAuthPage && !isVerifyPage) {
      router.push("/homepage");
    }

    // Redirect non-logged-in users to auth page
    if (!session && !isAuthPage && !isLandingPage && !isVerifyPage) {
      router.push("/auth");
    }
  }, [
    session,
    status,
    pathname,
    router,
    isAuthPage,
    isLandingPage,
    isVerifyPage,
  ]);

  return <>{children}</>;
}
