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

        const classLevel = (credentials.classLevel as string) || "JSS1";

        // Validate classLevel is one of the allowed values
        const validClassLevels = ["JSS1", "JSS2", "JSS3"];
        const validatedClassLevel = validClassLevels.includes(classLevel)
          ? (classLevel as "JSS1" | "JSS2" | "JSS3")
          : "JSS1";

        // In a real app, you'd check against your database here
        // For demo purposes, we'll create a user object
        const user = {
          id: `user_${Date.now()}`,
          email: credentials.email as string,
          name: (credentials.email as string)
            .split("@")[0]
            .replace(/[^a-zA-Z]/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase()),
          classLevel: validatedClassLevel,
        };

        return user;
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
