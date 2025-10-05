"use client";
import AchievementsModal from "@/components/AchievementsModal";
import Card from "@/components/ui/Card";
import DonutChart from "@/components/ui/DonutChart";
import ProgressBar from "@/components/ui/ProgresBar";
import { Icon } from "@/lib/constants";
import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const [selectedCourseIndex, setSelectedCourseIndex] = useState(0);
  const [isAchievementsModalOpen, setAchievementsModalOpen] = useState(false);
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Icon
            name="robot"
            className="w-16 h-16 mx-auto mb-4 text-brand-secondary animate-bounce"
          />
          <p className="text-xl font-semibold">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl font-semibold text-red-600">
            Failed to load user data
          </p>
          <p className="text-sm text-brand-text-secondary mt-2">
            Please try refreshing the page
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>Loading user data...</div>;
  }

  const totalCourses = user.courses.length;
  const completedCoursesCount = user.courses.filter(
    (c) => c.lessonsCompleted === c.totalLessons
  ).length;
  const achievementsGained = user.achievements.length;
  const selectedCourse = user.courses[selectedCourseIndex];

  const nextCourse = () => {
    setSelectedCourseIndex((prev) => (prev + 1) % user.courses.length);
  };
  const prevCourse = () => {
    setSelectedCourseIndex(
      (prev) => (prev - 1 + user.courses.length) % user.courses.length
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h2 className="font-bold text-xl">{user.name}</h2>
                  <p className="text-sm text-brand-text-secondary">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="relative group">
                <button className="text-brand-text-secondary">•••</button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </a>
                  <button
                    onClick={() => {
                      signOut({ callbackUrl: "/" });
                    }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-center">
              <div className="bg-brand-primary p-3 rounded-lg">
                <p className="text-sm">Courses completed</p>
                <p className="font-bold text-lg">{completedCoursesCount}</p>
              </div>
              <div className="bg-brand-primary p-3 rounded-lg">
                <p className="text-sm">XP gained</p>
                <p className="font-bold text-lg">{user.xp}</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={prevCourse}
                className="p-2 rounded-full hover:bg-brand-primary"
              >
                <Icon name="chevronLeft" />
              </button>
              <h3 className="font-bold text-2xl">
                {selectedCourse.subjectName}
              </h3>
              <button
                onClick={nextCourse}
                className="p-2 rounded-full hover:bg-brand-primary"
              >
                <Icon name="chevronRight" />
              </button>
            </div>
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img
                src={selectedCourse.icon}
                alt={selectedCourse.subjectName}
                className="w-12 h-12"
              />
              <div>
                <p>Lv{selectedCourse.level}</p>
                <ProgressBar
                  value={selectedCourse.lessonsCompleted}
                  max={selectedCourse.totalLessons}
                />
              </div>
              <p>
                {selectedCourse.lessonsCompleted} /{" "}
                {selectedCourse.totalLessons}
              </p>
            </div>
            <div className="w-48 h-48 mx-auto">
              <DonutChart
                value={selectedCourse.lessonsCompleted}
                total={selectedCourse.totalLessons}
              />
            </div>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Card className="text-center bg-brand-primary">
              <h4 className="font-semibold">Total Courses</h4>
              <p className="text-3xl font-bold">{totalCourses}</p>
            </Card>
            <Card
              className="text-center bg-blue-200 cursor-pointer"
              onClick={() => setAchievementsModalOpen(true)}
            >
              <h4 className="font-semibold">Achievements gained</h4>
              <p className="text-3xl font-bold">{achievementsGained}</p>
            </Card>
            <Card className="text-center bg-pink-200">
              <h4 className="font-semibold">Completed Courses</h4>
              <p className="text-3xl font-bold">{completedCoursesCount}</p>
            </Card>
          </div>
          <Card>
            <h3 className="font-bold text-xl mb-4">Courses you are taking</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b-2 border-brand-primary">
                    <th className="py-2">Course title</th>
                    <th className="py-2">Lessons completed</th>
                    <th className="py-2 hidden sm:table-cell">Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {user.courses.map((course) => (
                    <tr
                      key={course.subjectId}
                      className="border-b border-brand-primary"
                    >
                      <td className="py-4 font-semibold">
                        {course.subjectName}
                      </td>
                      <td className="py-4">
                        {course.lessonsCompleted} / {course.totalLessons} (
                        {Math.round(
                          (course.lessonsCompleted / course.totalLessons) * 100
                        )}
                        %)
                      </td>
                      <td className="py-4 hidden sm:table-cell">
                        9/29/2025, 6:30:16 AM
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <Card className="text-center">
            <h3 className="font-bold text-xl mb-2">Current Lesson</h3>
            <p className="text-lg">
              Lesson {selectedCourse.lessonsCompleted + 1}
            </p>
            <p className="text-brand-text-secondary">xp:27</p>
          </Card>
        </div>
      </div>
      {isAchievementsModalOpen && (
        <AchievementsModal
          achievements={user.achievements}
          onClose={() => setAchievementsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
