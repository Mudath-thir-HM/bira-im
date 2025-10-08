// src/lib/notifications.ts

export async function createNotification(
  userId: string,
  type: "achievement" | "lesson" | "system" | "milestone",
  title: string,
  message: string
) {
  try {
    await fetch("/api/notifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, title, message }),
    });
  } catch (error) {
    console.error("Failed to create notification:", error);
  }
}
