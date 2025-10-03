"use client";
import Card from "@/components/ui/Card";
import { MOCK_LEADERBOARD } from "@/lib/constants";
import { useUser } from "@/hooks/useUser";
import React from "react";

const Leaderboard: React.FC = () => {
  const { user } = useUser();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
        Leaderboard
      </h1>
      <Card className="max-w-2xl mx-auto">
        <ul className="space-y-4">
          {MOCK_LEADERBOARD.map((entry) => (
            <li
              key={entry.rank}
              className={`flex items-center p-4 rounded-lg transition-all ${
                entry.name === user?.name
                  ? "bg-brand-primary scale-105 shadow-lg"
                  : "bg-brand-background"
              }`}
            >
              <span className="text-xl font-bold w-10 text-brand-text-secondary">
                {entry.rank}
              </span>
              <img
                src={entry.avatarUrl}
                alt={entry.name}
                className="w-12 h-12 rounded-full mx-4"
              />
              <span className="flex-grow font-semibold text-brand-text-primary">
                {entry.name}
              </span>
              <span className="font-bold text-lg text-brand-secondary">
                {entry.xp} XP
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};

export default Leaderboard;
