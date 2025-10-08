"use client";
import Card from "@/components/ui/Card";
import { useUser } from "@/hooks/useUser";
import React, { useEffect, useState } from "react";

type LeaderboardEndtry = {
  rank: number;
  id: string;
  name: string;
  xp: number;
  avatarUrl: string | null;
};

const Leaderboard: React.FC = () => {
  const { user } = useUser();
  const [Leaderboard, setLeaderboard] = useState<LeaderboardEndtry[]>([]);
  const [isloading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!user?.class) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/leaderboard?classLevel=${user.class}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch leaderboard");
        }

        const data = await response.json();
        setLeaderboard(data);
      } catch (err) {
        console.error("Error loading leaderboard: ", err);
        setError("Failed to load leaderboard. Please try again");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [user?.class]);

  if (isloading) {
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
        Leaderboard - {user?.class}
      </h1>
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-brand-secondary mx-auto"></div>
          <p className="mt-4 text-brand-text-secondary">Loading rankings...</p>
        </div>
      </Card>
    </div>;
  }

  if (error) {
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-primary mb-8">
        Leaderboard - {user?.class}
      </h1>
      <Card className="max-w-2xl mx-auto">
        <div className="text-center py-10">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 bg-brand-secondary text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </Card>
    </div>;
  }

  //Find user's rank
  const userRank = Leaderboard.find((entry) => entry.id === user?.id);
  const isUserInTop10 = !!userRank;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center text-brand-text-primary mb-8">
        Leaderboard
      </h1>
      <p className="text-center text-brand-text-secondary mb-8">
        Top 10 Students in {user?.class}
      </p>
      {/* User's Current rank card (if not in top 10) */}
      {!isUserInTop10 && user && (
        <Card className="max-w-2 mx-auto mb-4 bg-blue-50 border-2 border-blue-300">
          <div className="p-4">
            <p className="text-center text-sm font-semibold text-blue-800 mb-2">
              Your Current Position
            </p>
            <div className="flext items-center justify-between">
              <div className="flex items-center">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div>
                  <span className="font font-semibold text-brand-text-primary">
                    {user.name} (You)
                  </span>
                  <p className="text-xs text-brand-text-secondary">
                    Keep Learning to reach the top 10!
                  </p>
                </div>
              </div>
              <span className="font-bold text-lg text-brand-secondary">
                {user.xp} XP
              </span>
            </div>
          </div>
        </Card>
      )}
      <Card className="max-w-2xl mx-auto">
        {Leaderboard.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-brand-text-secondary">
              No students in your class yet. Be the first to start a lesson!
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {Leaderboard.map((entry) => (
              <li
                key={entry.id}
                className={`flex items-center p-4 rounded-lg transition-all ${
                  entry.id === user?.id
                    ? "bg-brand-primary scale-105 shadow-lg border-2 border-brand-secondary"
                    : "bg-brand-background hover:bg-brand-surface"
                }`}
              >
                {/* Rank */}
                <div className="w-12 flex items-center justify-center">
                  {entry.rank <= 3 ? (
                    <div className="text-3xl">
                      {entry.rank === 1 && "🥇"}
                      {entry.rank === 2 && "🥈"}
                      {entry.rank === 3 && "🥉"}
                    </div>
                  ) : (
                    <span className="text-xl font-bold text-brand-text-secondary">
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* Avatar */}
                <img
                  src={
                    entry.avatarUrl ||
                    `https://picsum.photos/seed/${entry.name}/100`
                  }
                  alt={entry.name}
                  className="w-12 h-12 rounded-full mx-4"
                />

                {/* Name */}
                <span className="flex-grow font-semibold text-brand-text-primary">
                  {entry.name}
                  {entry.id === user?.id && (
                    <span className="ml-2 text-xs bg-brand-secondary text-white px-2 py-1 rounded-full">
                      You
                    </span>
                  )}
                </span>

                {/* XP */}
                <span className="font-bold text-lg text-brand-secondary">
                  {entry.xp} XP
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Tips */}
      <Card className="max-w-2xl mx-auto mt-6 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="p-4">
          <h3 className="font-bold text-lg mb-2 text-orange-800">
            💡 Tips to Climb the Leaderboard
          </h3>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>✅ Complete lessons to earn XP</li>
            <li>✅ Score high on quizzes for bonus XP</li>
            <li>✅ Finish all subjects to unlock achievements</li>
            <li>✅ Practice daily to stay ahead!</li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Leaderboard;
