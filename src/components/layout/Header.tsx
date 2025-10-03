import { Icon } from "@/lib/constants";
import { useUser } from "@/hooks/useUser";
import React from "react";

const Header: React.FC = () => {
  const { user } = useUser();

  if (!user) return null;

  const completedSubjects = user.courses
    .filter((c) => c.lessonsCompleted === c.totalLessons)
    .map((c) => c.subjectName)
    .join(", ");

  return (
    <header className="bg-brand-surface p-3 shadow-md sticky top-0 z-30 m-4 rounded-xl">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-brand-primary rounded-full flex items-center justify-center">
            <Icon name="user" className="w-8 h-8 text-brand-text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-brand-text-primary">{user.name}</h1>
            <p className="text-sm text-brand-text-secondary hidden sm:block">
              Completed Subjects: {completedSubjects || "None yet"}
            </p>
            <p className="text-sm text-brand-secondary">User's Xp: {user.xp}</p>
          </div>
          <div className="p-2 bg-brand-primary rounded-full">
            <Icon name="trophy" className="w-8 h-8 text-brand-secondary" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
