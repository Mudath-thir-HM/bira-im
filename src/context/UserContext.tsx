"use client";
import { createContext, ReactNode, useCallback, useState } from "react";
import { MOCK_ACHIEVEMENTS, SUBJECTS } from "@/lib/constants";
import { CourseProgress, User } from "@/lib/types";

const NEW_USER_COURSES: CourseProgress[] = SUBJECTS.map((subject) => ({
  subjectId: subject.id,
  subjectName: subject.name,
  lessonsCompleted: 0,
  totalLessons: 7,
  level: subject.level,
  icon: subject.image,
}));

const createNewUser = (
  email: string,
  classLevel: "JSS1" | "JSS2" | "JSS3"
): User => {
  const name = email
    .split("@")[0]
    .replace(/[^a-zA-Z]/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    id: `user_${Date.now()}`,
    name: name || "New Student",
    email: email,
    class: classLevel,
    xp: 0,
    avatarUrl: `https://picsum.photos/seed/${name}/100`,
    courses: NEW_USER_COURSES,
    achievements: [],
  };
};

interface UserContextType {
  user: User | null;
  login: (email: string, classLevel: "JSS1" | "JSS2" | "JSS3") => void;
  logout: () => void;
  addXp: (amount: number) => void;
  completeLesson: (subjectId: string) => void;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (email: string, classLevel: "JSS1" | "JSS2" | "JSS3") => {
      //Logic for checking if user exists
      const newUser = createNewUser(email, classLevel);
      setUser(newUser);
      // Return a promise that resolves when the user is set
      return Promise.resolve();
    },
    []
  );

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const awardAchievement = useCallback((achievementId: string) => {
    setUser((currentUser) => {
      if (!currentUser) return null;

      const achievement = MOCK_ACHIEVEMENTS.find((a) => a.id === achievementId);
      if (
        !achievement ||
        currentUser.achievements.some((a) => a.id === achievementId)
      ) {
        return currentUser;
      }

      console.log(`Awarding achievement: ${achievement.name}`);
      return {
        ...currentUser,
        achievements: [...currentUser.achievements, achievement],
      };
    });
  }, []);
  const addXp = useCallback(
    (amount: number) => {
      setUser((currentUser) => {
        if (!currentUser) return null;
        const newXp = currentUser.xp + amount;

        if (newXp >= 1000 && currentUser.xp < 1000) {
          awardAchievement("7");
        }

        return { ...currentUser, xp: newXp };
      });
    },
    [awardAchievement]
  );

  const completeLesson = useCallback(
    (subjectId: string) => {
      setUser((currentUser) => {
        if (!currentUser) return null;

        let courseCompleted = false;

        const updatedCourses = currentUser.courses.map((course) => {
          if (
            course.subjectId === subjectId &&
            course.lessonsCompleted < course.totalLessons
          ) {
            const newCompletedCount = course.lessonsCompleted + 1;
            if (newCompletedCount === course.totalLessons) {
              courseCompleted = true;
            }
            return { ...course, lessonsCompleted: newCompletedCount };
          }
          return course;
        });

        if (currentUser.achievements.length === 0) {
          awardAchievement("1");
        }

        if (courseCompleted) {
          switch (subjectId) {
            case "mathematics":
              awardAchievement("2");
              break;
            case "science":
              awardAchievement("3");
              break;
            case "english":
              awardAchievement("4");
              break;
            case "history":
              awardAchievement("5");
              break;
          }
        }

        return { ...currentUser, courses: updatedCourses };
      });
    },
    [awardAchievement]
  );

  return (
    <UserContext.Provider
      value={{ user, login, logout, addXp, completeLesson }}
    >
      {children}
    </UserContext.Provider>
  );
};
