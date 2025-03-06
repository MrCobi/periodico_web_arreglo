// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    emailVerified?: Date | null;
    role: string;
    username?: string | null;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      role: string;
      username?: string | null;
      image?: string | null;
    };
  }
}