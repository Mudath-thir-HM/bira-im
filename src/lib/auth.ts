import bcrypt from "bcrypt";

const SALT_ROUNDS = 47;

export async function hashPassword(password: string): Promise<string> {
  const hashedPasword = await bcrypt.hash(password, SALT_ROUNDS);
  return hashedPasword;
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  const isValid = await bcrypt.compare(password, hashedPassword);
  return isValid;
}
