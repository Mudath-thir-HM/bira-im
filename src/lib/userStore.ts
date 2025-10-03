import { hashPassword, verifyPassword } from "./auth";

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
  const userId = `user_${Date.now()}`;
  const verificationToken = generateVerificationToken();

  const newUser: StoredUser = {
    id: userId,
    email,
    name /*.split("@")[0].replace(/[^a-zA-Z]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())*/,
    password: hashedPassword,
    classLevel,
    emailVerified: false,
    verificationToken,
    createdAt: new Date(),
  };

  users.set(email.toLowerCase(), newUser);
  return newUser;
}

//Get user by email
export async function getUserByEmail(
  email: string
): Promise<StoredUser | null> {
  return users.get(email.toLowerCase()) || null;
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
  for (const user of users.values()) {
    if (user.verificationToken === token) {
      user.emailVerified = true;
      user.verificationToken = null;
      return true;
    }
  }
  return false;
}

//Generate a random verification token
function generateVerificationToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
