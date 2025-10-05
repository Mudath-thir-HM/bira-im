// src/context/UserContext.tsx
"use client";
import {
  createContext,
  ReactNode,
  useCallback,
  useState,
  useEffect,
} from "react";
import { User } from "@/lib/types";
import { useSession } from "next-auth/react";

interface UserContextType {
  user: User | null;
  addXp: (amount: number) => void;
  completeLesson: (subjectId: string) => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data from database
  const fetchUserData = useCallback(async (userId: string) => {
    setIsLoading(true);
    try {
      console.log("Fetching user data for:", userId);
      const response = await fetch(`/api/user/${userId}`);

      if (response.ok) {
        const userData = await response.json();
        console.log("User data loaded:", userData);
        setUser(userData);
      } else {
        console.error(
          "Failed to fetch user:",
          response.status,
          await response.text()
        );
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize user from session
  useEffect(() => {
    console.log("Session status:", status);
    console.log("Session data:", session);

    if (status === "authenticated" && session?.user) {
      console.log("User authenticated, fetching data...");
      fetchUserData(session.user.id);
    }

    // Clear user when logged out
    if (status === "unauthenticated") {
      console.log("User unauthenticated, clearing data");
      setUser(null);
      setIsLoading(false);
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
    <UserContext.Provider
      value={{ user, addXp, completeLesson, refreshUser, isLoading }}
    >
      {children}
    </UserContext.Provider>
  );
};
