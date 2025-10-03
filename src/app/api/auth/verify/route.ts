import { verifyEmail } from "@/lib/userStore";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const success = await verifyEmail(token);

    if (success) {
      return NextResponse.json(
        { success: true, message: "Email verified successfully" },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: "Invalid or expired verification token" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify Email" },
      { status: 500 }
    );
  }
}
