import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    name: string;
    classLevel: "JSS1" | "JSS2" | "JSS3";
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      classLevel: "JSS1" | "JSS2" | "JSS3";
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    classLevel: "JSS1" | "JSS2" | "JSS3";
  }
}
