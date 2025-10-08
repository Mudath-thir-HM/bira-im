import { prisma } from "@/lib/prisma";
import { ClassLevel } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const classLevel = searchParams.get("classLevel");

    if (!classLevel) {
      return NextResponse.json(
        { error: "Class level is required" },
        { status: 400 }
      );
    }

    if (!["JSS1", "JSS2", "JSS3"].includes(classLevel)) {
      return NextResponse.json(
        { error: "Invalid class level" },
        { status: 400 }
      );
    }

    const validClassLevel = classLevel as ClassLevel;

    const topUsers = await prisma.user.findMany({
      where: {
        classLevel: validClassLevel,
      },
      select: {
        id: true,
        name: true,
        xp: true,
        avatarUrl: true,
      },
      orderBy: {
        xp: "desc",
      },
      take: 10,
    });

    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      id: user.id,
      name: user.name,
      xp: user.xp,
      avatarUrl: user.avatarUrl,
    }));

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error("Error to fetch leaderboard", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
