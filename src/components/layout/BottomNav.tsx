"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/constants";
import BuddyButton from "./BuddyButton";

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const navItems = [
    { href: "/homepage", icon: "home", label: "Home" },
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/leaderboard", icon: "leaderboard", label: "Leaderboard" },
    { href: "/notification", icon: "notification", label: "Notifications" },
  ];

  const activeLinkClass = "text-brand-secondary";
  const inactiveLinkClass =
    "text-brand-text-primary hover:text-brand-secondary";

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-brand-surface border-t-2 border-brand-primary shadow-lg z-40">
      <BuddyButton />
      <div className="flex justify-around max-w-2xl mx-auto py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center w-20 transition-colors ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <Icon name={item.icon} className="w-7 h-7 mb-1" />
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
