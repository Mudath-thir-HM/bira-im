"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon } from "@/lib/constants";
import BuddyButton from "./BuddyButton";
import { useUser } from "@/hooks/useUser";

const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/notifications?userId=${user.id}`);
        if (response.ok) {
          const notifications = await response.json();
          const unread = notifications.filter((n: any) => !n.read).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error("Failed to fetch unread count:", error);
      }
    };

    // Fetch on mount and when user changes
    fetchUnreadCount();

    // Refresh every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);

    // Listen for custom event to refresh immediately
    const handleRefresh = () => fetchUnreadCount();
    window.addEventListener("notifications-updated", handleRefresh);

    return () => {
      clearInterval(interval);
      window.removeEventListener("notifications-updated", handleRefresh);
    };
  }, [user?.id]);

  const navItems = [
    { href: "/homepage", icon: "home", label: "Home" },
    { href: "/dashboard", icon: "dashboard", label: "Dashboard" },
    { href: "/leaderboard", icon: "leaderboard", label: "Leaderboard" },
    {
      href: "/notification",
      icon: "notification",
      label: "Notifications",
      badge: unreadCount,
    },
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
              className={` transition-colors ${
                isActive ? activeLinkClass : inactiveLinkClass
              }`}
            >
              <div className="relative flex flex-col items-center justify-center w-20">
                <Icon name={item.icon} className="w-7 h-7 mb-1" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 right-1 bg-red-500 text-white text-xs font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
                <span className="text-xs font-semibold">{item.label}</span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
