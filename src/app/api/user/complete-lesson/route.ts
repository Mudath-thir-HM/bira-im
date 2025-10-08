// src/app/api/user/complete-lesson/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, subjectId } = body;

    if (!userId || !subjectId) {
      return NextResponse.json(
        { error: "userId and subjectId are required" },
        { status: 400 }
      );
    }

    // Get course progress
    const courseProgress = await prisma.courseProgress.findUnique({
      where: {
        userId_subjectId: {
          userId,
          subjectId,
        },
      },
    });

    if (!courseProgress) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Update lesson completion
    const updatedCourse = await prisma.courseProgress.update({
      where: {
        userId_subjectId: {
          userId,
          subjectId,
        },
      },
      data: {
        lessonsCompleted: Math.min(
          courseProgress.lessonsCompleted + 1,
          courseProgress.totalLessons
        ),
      },
    });

    // Check for first lesson achievement
    const userAchievements = await prisma.userAchievement.findMany({
      where: { userId },
    });

    if (userAchievements.length === 0) {
      const firstStepsAchievement = await prisma.achievement.findUnique({
        where: { name: "First Steps" },
      });

      if (firstStepsAchievement) {
        await prisma.userAchievement.create({
          data: {
            userId,
            achievementId: firstStepsAchievement.id,
          },
        });
      }

      await prisma.notification.create({
        data: {
          userId,
          type: "achievement",
          title: "🎉 First Achievement!",
          message: "You completed your first lesson! Keep up the great work!",
        },
      });
    }

    // Check for course completion achievements
    if (updatedCourse.lessonsCompleted === updatedCourse.totalLessons) {
      const achievementMap: Record<string, string> = {
        mathematics: "Math Whiz",
        science: "Scientist",
        english: "Bookworm",
        history: "Historian",
      };

      const achievementName = achievementMap[subjectId];
      if (achievementName) {
        const achievement = await prisma.achievement.findUnique({
          where: { name: achievementName },
        });

        if (achievement) {
          const hasAchievement = await prisma.userAchievement.findUnique({
            where: {
              userId_achievementId: {
                userId,
                achievementId: achievement.id,
              },
            },
          });

          if (!hasAchievement) {
            await prisma.userAchievement.create({
              data: {
                userId,
                achievementId: achievement.id,
              },
            });
          }
        }
      }

      await prisma.notification.create({
        data: {
          userId,
          type: "milestone",
          title: "🎓 Course Completed!",
          message: `Congratulations! You've completed all lessons in ${updatedCourse.subjectName}!`,
        },
      });
    }

    // Fetch updated data
    const courses = await prisma.courseProgress.findMany({
      where: { userId },
    });

    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    return NextResponse.json({
      courses: courses.map((c) => ({
        subjectId: c.subjectId,
        subjectName: c.subjectName,
        lessonsCompleted: c.lessonsCompleted,
        totalLessons: c.totalLessons,
        level: c.level,
        icon: c.icon,
      })),
      achievements: achievements.map((ua) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
      })),
    });
  } catch (error) {
    console.error("Error completing lesson:", error);
    return NextResponse.json(
      { error: "Failed to complete lesson" },
      { status: 500 }
    );
  }
}
