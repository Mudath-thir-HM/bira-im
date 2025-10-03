import { sendWelcomeEmail } from "@/lib/emailService";
import { createUser } from "@/lib/userStore";
import { error } from "console";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, classLevel } = body;

    //Validate input
    if (!email || !password || !name || !classLevel) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    //create user
    const user = await createUser(email, password, name, classLevel);

    //Send welcome email with verification link
    await sendWelcomeEmail(email, name, user.verificationToken!);

    return NextResponse.json(
      {
        message:
          "Account created successfully! Please check your email to verify your account",
        userId: user.id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Signup error: ", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account" },
      { status: 400 }
    );
  }
}
