"use client";

import BottomNav from "@/components/layout/BottomNav";
import Header from "@/components/layout/Header";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <main className="flex-grow overflow-y-auto pb-24 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export default Layout;
