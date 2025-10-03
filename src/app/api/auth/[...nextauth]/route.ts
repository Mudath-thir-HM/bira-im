import { verifyUserCredentials } from "@/lib/userStore";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        classLevel: { label: "Class Level", type: "text" },
      },
      async authorize(credentials) {
        // This is where you'd verify credentials against your database
        // For now, we'll accept any email/password combination
        if (!credentials?.email || !credentials.password) {
          throw new Error("Please enter your email and password");
        }

        const user = await verifyUserCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (!user) {
          return null;
        }

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
      if (user) {
        token.id = user.id;
        token.classLevel = (user as any).classLevel;
      }
      return token;
    },
    async session({ session, token }) {
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

export const GET = handlers.GET;
export const POST = handlers.POST;
