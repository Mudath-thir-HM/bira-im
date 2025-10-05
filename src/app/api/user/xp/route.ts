// src/app/api/user/xp/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, amount } = body;

    if (!userId || !amount) {
      return NextResponse.json(
        { error: "userId and amount are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
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

    const newXp = user.xp + amount;

    // Update user XP
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { xp: newXp },
    });

    // Check for XP milestone achievements
    if (newXp >= 1000 && user.xp < 1000) {
      const xpAchievement = await prisma.achievement.findUnique({
        where: { name: "XP Collector" },
      });

      if (xpAchievement) {
        const hasAchievement = user.achievements.some(
          (ua) => ua.achievementId === xpAchievement.id
        );

        if (!hasAchievement) {
          await prisma.userAchievement.create({
            data: {
              userId: userId,
              achievementId: xpAchievement.id,
            },
          });
        }
      }
    }

    // Fetch updated achievements
    const achievements = await prisma.userAchievement.findMany({
      where: { userId },
      include: { achievement: true },
    });

    return NextResponse.json({
      xp: newXp,
      achievements: achievements.map((ua) => ({
        id: ua.achievement.id,
        name: ua.achievement.name,
        description: ua.achievement.description,
        icon: ua.achievement.icon,
      })),
    });
  } catch (error) {
    console.error("Error adding XP:", error);
    return NextResponse.json({ error: "Failed to add XP" }, { status: 500 });
  }
}
