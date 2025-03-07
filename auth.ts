// auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

// auth.ts
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  callbacks: {
    // auth.ts
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name; // Añade esto
        token.image = user.image || "/images/AvatarPredeterminado.webp"; // Fallback directo
      }
      return token;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({ where: { id: token.id } });
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        role: token.role as string,
        username: token.username as string,
        email: token.email as string,
        image: user?.image || "/images/AvatarPredeterminado.webp",
      };
      return session;
    }
  },
});