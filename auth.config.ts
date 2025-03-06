import bcryptjs from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod"
import prisma from "./lib/db"
import { nanoid } from "nanoid"
import { sendEmailVerification } from "@/lib/mail"


// Notice this is only an object, not a full Auth.js instance
export default {
  
  providers: [
    Credentials({
      authorize: async (credentials) => {
        // Validate the credentials using Zod
        const { data, success } = loginSchema.safeParse(credentials);
        if (!success) {
          console.log("Validation failed:", loginSchema.safeParse(credentials).error);
          throw new Error("Invalid credentials");
        }
      
        // Fetch the user from the database
        const user = await prisma.user.findUnique({
          where: {
            email: data.email,
          },
        });
      
        // Check if the user exists and has a password
        if (!user || !user.password) {
          console.log("User not found or password missing:", data.email);
          throw new Error("Invalid credentials");
        }
      
        // Compare the provided password with the hashed password in the database
        const isPasswordCorrect = await bcryptjs.compare(data.password, user.password);
        if (!isPasswordCorrect) {
          console.log("Invalid password for user:", data.email);
          throw new Error("Invalid credentials");
        }
      
        /*
        //verificacion email
        if (!user.emailVerified) {
          const verifyTokenExists = await prisma.verificationToken.findFirst({
            where: {
             identifier: user.email as string,
            },
          })

          //si existe un token lo eliminamos
          if (verifyTokenExists?.identifier) {
            await prisma.verificationToken.delete({
              where: {
                identifier: user.email as string,
              },
            })
          }

          const token = nanoid()

          await prisma.verificationToken.create({
            data: {
              identifier: user.email as string,
              token,
              expires: new Date(Date.now() + 60 * 60 * 1000),
            },
          })

          // enviar email de verificacion
          await sendEmailVerification(user.email as string , token);

          throw new Error("Correo de verificacion pendiente")

        }
          */

        // Return the user object if everything is valid
        console.log("User authenticated:", user);
        return {
          ...user,
          username: user.username ?? undefined
        };
        
      },
    }),
  ],
} satisfies NextAuthConfig