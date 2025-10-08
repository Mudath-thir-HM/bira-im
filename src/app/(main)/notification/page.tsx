"use client";
import Card from "@/components/ui/Card";
import { useUser } from "@/hooks/useUser";
import { Icon } from "@/lib/constants";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
};

const Notifications = () => {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;

      try {
        const response = await fetch(`/api/notifications?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, [user?.id]);

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });

      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      await fetch("/api/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "achievement":
        return "🏆";
      case "lesson":
        return "📚";
      case "milestone":
        return "🎯";
      case "system":
        return "📢";
      default:
        return "🔔";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
          Notifications
        </h1>
        <Card className="max-w-2xl mx-auto">
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-secondary mx-auto"></div>
            <p className="mt-4 text-brand-text-secondary">
              Loading notifications...
            </p>
          </div>
        </Card>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-text-primary">
            Notifications
          </h1>
          {unreadCount > 0 && (
            <p className="text-sm text-brand-text-secondary mt-1">
              {unreadCount} unread notification{unreadCount > 1 ? "s" : ""}
            </p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-sm text-brand-secondary hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      <Card className="max-w-2xl mx-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-10">
            <Icon
              name="notification"
              className="w-16 h-16 mx-auto mb-4 text-brand-text-secondary opacity-50"
            />
            <p className="text-brand-text-secondary">
              No notifications yet. Complete lessons and earn achievements to
              get updates!
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {notifications.map((notif) => (
              <li
                key={notif.id}
                onClick={() => !notif.read && markAsRead(notif.id)}
                className={`p-4 rounded-lg flex items-start space-x-4 cursor-pointer transition-colors ${
                  notif.read
                    ? "bg-brand-background"
                    : "bg-brand-primary hover:bg-brand-surface"
                }`}
              >
                <div className="flex-shrink-0 mt-1 text-2xl">
                  {getNotificationIcon(notif.type)}
                </div>
                <div className="flex-grow">
                  <h3
                    className={`font-semibold text-brand-text-primary ${
                      !notif.read && "font-bold"
                    }`}
                  >
                    {notif.title}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${
                      notif.read
                        ? "text-brand-text-secondary"
                        : "text-brand-text-primary"
                    }`}
                  >
                    {notif.message}
                  </p>
                  <p className="text-xs text-brand-text-secondary mt-2">
                    {formatDate(notif.createdAt)}
                  </p>
                </div>
                {!notif.read && (
                  <div className="flex-shrink-0">
                    <div className="w-2 h-2 bg-brand-secondary rounded-full"></div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
};

export default Notifications;
