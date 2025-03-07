import bcryptjs from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod"
import prisma from "./lib/db"
import { nanoid } from "nanoid"
import { sendEmailVerification } from "@/lib/mail"


// auth.config.ts
export default {
  providers: [
    Credentials({
      authorize: async (credentials) => {
        const { data, success } = loginSchema.safeParse(credentials);
        
        if (!success) {
          throw new Error("Datos inválidos");
        }

        const user = await prisma.user.findUnique({
          where: { email: data.email.toLowerCase() },
        });

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        if (!user.password) {
          throw new Error("Cuenta registrada con otro método");
        }

        const isValid = await bcryptjs.compare(data.password, user.password);
        
        if (!isValid) {
          throw new Error("Contraseña incorrecta");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          username: user.username ?? undefined
        };
      },
    }),
  ],
} satisfies NextAuthConfig;