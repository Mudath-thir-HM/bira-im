// src/app/api/user/[userId]/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        courses: true,
        achievements: {
          include: {
            achievement: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Format the response
    const formattedUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      class: user.classLevel,
      xp: user.xp,
      avatarUrl: user.avatarUrl,
      courses: user.courses.map((course) => ({
        subjectId: course.subjectId,
        subjectName: course.subjectName,
        lessonsCompleted: course.lessonsCompleted,
        totalLessons: course.totalLessons,
        level: course.level,
        icon: course.icon,
      })),
      achievements: user.achievements.map((ua) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
      })),
    };

    return NextResponse.json(formattedUser);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data" },
      { status: 500 }
    );
  }
}
