// auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

declare module "next-auth" {
  interface User {
    createdAt?: Date;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      role: string;
      username?: string | null;
      email?: string | null;
      image?: string | null;
      createdAt?: Date;
    };
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
        token.name = user.name;
        token.image = user.image || "/images/AvatarPredeterminado.webp";
        token.createdAt = user.createdAt; // Añadir esta línea
      }
      return token;
    },
    async session({ session, token }) {
      const user = await prisma.user.findUnique({
        where: { id: token.id },
        select: {
          image: true,
          createdAt: true // Incluir este campo
        }
      });
      
      session.user = {
        ...session.user,
        id: token.id as string,
        name: token.name as string,
        role: token.role as string,
        username: token.username as string,
        email: token.email as string,
        image: user?.image || "/images/AvatarPredeterminado.webp",
        createdAt: user?.createdAt // Añadir esta propiedad
      };
      return session;
    }
  },
});