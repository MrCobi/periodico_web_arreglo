import bcryptjs from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginSchema } from "./lib/zod"
import prisma from "./lib/db"
import { nanoid } from "nanoid"


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
      
        // Return the user object if everything is valid
        console.log("User authenticated:", user);
        return user;
      },
    }),
  ],
} satisfies NextAuthConfig