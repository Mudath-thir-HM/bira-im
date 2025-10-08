// src/app/api/notifications/mark-read/route.ts
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notificationId, userId } = body;

    if (notificationId) {
      // Mark single notification as read
      await prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    } else if (userId) {
      // Mark all notifications as read for user
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });
    } else {
      return NextResponse.json(
        { error: "notificationId or userId required" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { error: "Failed to mark notification as read" },
      { status: 500 }
    );
  }
}
