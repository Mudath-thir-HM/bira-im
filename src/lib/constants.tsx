import React from "react";
import type {
  Subject,
  LeaderboardEntry,
  Notification,
  Achievement,
} from "./types";

export const SUBJECTS: Subject[] = [
  {
    id: "mathematics",
    name: "Mathematics",
    level: 1,
    image: "/mathematics.png",
  },
  {
    id: "science",
    name: "Science",
    level: 2,
    image: "/science.png",
  },
  {
    id: "english",
    name: "English",
    level: 1,
    image: "/english.png",
  },
  {
    id: "history",
    name: "History",
    level: 1,
    image: "/history.png",
  },
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: "Tunde Adebayo",
    xp: 1250,
    avatarUrl: "https://picsum.photos/seed/1/40",
  },
  {
    rank: 2,
    name: "Maya Bright",
    xp: 835,
    avatarUrl: "https://picsum.photos/seed/you/40",
  },
  {
    rank: 3,
    name: "Chiamaka Nwosu",
    xp: 780,
    avatarUrl: "https://picsum.photos/seed/3/40",
  },
  {
    rank: 4,
    name: "David Okon",
    xp: 650,
    avatarUrl: "https://picsum.photos/seed/4/40",
  },
  {
    rank: 5,
    name: "Aisha Bello",
    xp: 590,
    avatarUrl: "https://picsum.photos/seed/5/40",
  },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    text: 'Congratulations! You unlocked the "Math Whiz" achievement.',
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    text: "You just completed Lesson 2 in Science. Keep it up!",
    timestamp: "1 day ago",
    read: false,
  },
  {
    id: "3",
    text: "Your weekly progress report is ready.",
    timestamp: "3 days ago",
    read: true,
  },
  {
    id: "4",
    text: "New lesson available in English.",
    timestamp: "5 days ago",
    read: true,
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "1",
    name: "First Steps",
    description: "Complete your first lesson.",
    icon: "trophy",
  },
  {
    id: "2",
    name: "Math Whiz",
    description: "Complete all Mathematics lessons.",
    icon: "trophy",
  },
  {
    id: "3",
    name: "Scientist",
    description: "Complete all Science lessons.",
    icon: "trophy",
  },
  {
    id: "4",
    name: "Bookworm",
    description: "Complete all English lessons.",
    icon: "trophy",
  },
  {
    id: "5",
    name: "Historian",
    description: "Complete all History lessons.",
    icon: "trophy",
  },
  {
    id: "6",
    name: "Quiz Master",
    description: "Score 100% on any quiz.",
    icon: "trophy",
  },
  {
    id: "7",
    name: "XP Collector",
    description: "Reach 1000 XP.",
    icon: "trophy",
  },
];

export const Icon = ({
  name,
  className,
}: {
  name: string;
  className?: string;
}) => {
  // Fix: Use React.ReactElement instead of the global JSX.Element to avoid namespace conflicts.
  const icons: { [key: string]: React.ReactElement } = {
    home: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5"
      />
    ),
    dashboard: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
      />
    ),
    leaderboard: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Zm-4.5-3.75a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-.75Zm7.5-3a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-.75ZM9 3.75a3 3 0 0 0-3-3H4.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3V3.75Z"
      />
    ),
    notification: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
      />
    ),
    user: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
      />
    ),
    trophy: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Zm-4.5-3.75a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-.75Zm7.5-3a3 3 0 0 0-3-3h-1.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3v-.75ZM9 3.75a3 3 0 0 0-3-3H4.5a3 3 0 0 0-3 3v.75a3 3 0 0 0 3 3h1.5a3 3 0 0 0 3-3V3.75Z"
      />
    ),
    robot: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 0 0 2.25-2.25V8.25a2.25 2.25 0 0 0-2.25-2.25H6.75A2.25 2.25 0 0 0 4.5 8.25v10.5A2.25 2.25 0 0 0 6.75 21H7.5"
      />
    ),
    logout: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H21"
      />
    ),
    close: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18 18 6M6 6l12 12"
      />
    ),
    send: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
      />
    ),
    chevronLeft: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 19.5 8.25 12l7.5-7.5"
      />
    ),
    chevronRight: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m8.25 4.5 7.5 7.5-7.5 7.5"
      />
    ),
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className || "w-6 h-6"}
    >
      {icons[name] || <circle cx="12" cy="12" r="10" />}
    </svg>
  );
};
