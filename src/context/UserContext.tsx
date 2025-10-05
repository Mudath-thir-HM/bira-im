"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { CourseProgress, User } from "@/lib/types";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: User | null;
  addXp: (amount: number) => void;
  completeLesson: (subjectId: string) => void;
  refreshUser: () => Promise<void>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);

  // Fetch user data from database
  const fetchUserData = useCallback(async (userId: string) => {
    try {
      const response = await fetch(`/api/user/${userId}`);
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  }, []);

  // Initialize user from session
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      fetchUserData(session.user.id);
    }

    // Clear user when logged out
    if (status === "unauthenticated") {
      setUser(null);
    }
  }, [session, status, fetchUserData]);

  const refreshUser = useCallback(async () => {
    if (session?.user?.id) {
      await fetchUserData(session.user.id);
    }
  }, [session, fetchUserData]);

  const addXp = useCallback(
    async (amount: number) => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/xp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, amount }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser((prev) =>
            prev
              ? { ...prev, xp: data.xp, achievements: data.achievements }
              : null
          );
        }
      } catch (error) {
        console.error("Failed to add XP:", error);
      }
    },
    [user]
  );

  const completeLesson = useCallback(
    async (subjectId: string) => {
      if (!user) return;

      try {
        const response = await fetch("/api/user/complete-lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, subjectId }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser((prev) =>
            prev
              ? {
                  ...prev,
                  courses: data.courses,
                  achievements: data.achievements,
                }
              : null
          );
        }
      } catch (error) {
        console.error("Failed to complete lesson:", error);
      }
    },
    [user]
  );

  return (
    <UserContext.Provider value={{ user, addXp, completeLesson, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};
