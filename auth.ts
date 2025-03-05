// auth.ts
import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/db";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { User } from "@prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  ...authConfig,
  pages: {
    error: "/api/auth/error", // Ruta personalizada para errores
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Validación estricta de tipos
          if (
            typeof credentials.email !== "string" ||
            typeof credentials.password !== "string"
          ) {
            return null;
          }

          // Buscar usuario
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          // Usuario no existe o no tiene contraseña
          if (!user || !user.password) return null;

          // Comparar contraseñas
          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) return null;

          // Devolver objeto de usuario sin campos null
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            role: user.role,
            username: user.username ?? undefined,
            image: user.image ?? "/images/AvatarPredeterminado.webp",
          };
        } catch (error) {
          console.error("Error en autorización:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.username = token.username as string;
      return session;
    },
  },
});