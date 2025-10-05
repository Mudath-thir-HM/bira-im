// src/lib/auth.config.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/userStore";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Verify credentials against database using Prisma
        const user = await verifyUserCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) {
          return null; // Invalid credentials
        }

        // Check if email is verified (optional - remove if you want to allow unverified users to login)
        if (!user.emailVerified) {
          throw new Error("Please verify your email before signing in");
        }

        // Return user object
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          classLevel: user.classLevel,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add custom fields to the token on first signin
      if (user) {
        token.id = user.id;
        token.classLevel = (user as any).classLevel;
      }
      return token;
    },
    async session({ session, token }) {
      // Add custom fields to the session
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).classLevel = token.classLevel;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth",
  },
  session: {
    strategy: "jwt",
  },
});
