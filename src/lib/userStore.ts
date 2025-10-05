import { hashPassword, verifyPassword } from "./auth";
import { SUBJECTS } from "./constants";
import { prisma } from "./prisma";

export type StoredUser = {
  id: string;
  email: string;
  name: string;
  password: string; // This will be hashed
  classLevel: "JSS1" | "JSS2" | "JSS3";
  emailVerified: boolean;
  verificationToken: string | null;
  createdAt: Date;
};

//replace with Database later
const users: Map<string, StoredUser> = new Map();

//Create a new user
export async function createUser(
  email: string,
  password: string,
  name: string,
  classLevel: "JSS1" | "JSS2" | "JSS3"
): Promise<StoredUser> {
  //Checkin if a user exists:
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const hashedPassword = await hashPassword(password);
  const verificationToken = generateVerificationToken();

  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      classLevel,
      emailVerified: false,
      verificationToken,
      xp: 0,
      avatarUrl: `https://picsum.photos/seed/${name}/100`,
      courses: {
        create: SUBJECTS.map((subject) => ({
          subjectId: subject.id,
          subjectName: subject.name,
          lessonCompleted: 0,
          totalLessons: 7,
          level: subject.level,
          icon: subject.image,
        })),
      },
    },
  });

  return user as StoredUser;
}

//Get user by email
export async function getUserByEmail(
  email: string
): Promise<StoredUser | null> {
  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  return user as StoredUser | null;
}

//Verify credentials
export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<StoredUser | null> {
  const user = await getUserByEmail(email);
  if (!user) {
    return null;
  }

  const isValid = await verifyPassword(password, user.password);
  if (!isValid) {
    return null;
  }

  return user;
}

//verify email with token
export async function verifyEmail(token: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { verificationToken: token },
  });

  if (!user) {
    return false;
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      verificationToken: null,
    },
  });

  return true;
}

//Generate a random verification token
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
