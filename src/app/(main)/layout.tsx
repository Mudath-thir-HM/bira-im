"use client";

import AuthGuard from "@/components/AuthGuard";
import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <AuthGuard>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow overflow-y-auto pb-24 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
        <BottomNav />
      </div>
    </AuthGuard>
  );
};

export default Layout;
