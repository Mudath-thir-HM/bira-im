// src/lib/auth.ts
import bcrypt from "bcryptjs"; // Changed from 'bcrypt' to 'bcryptjs'

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPassword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
