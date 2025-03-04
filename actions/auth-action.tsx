"use server";

import { SignUpSchema } from "@/lib/zod";
import { loginSchema } from "@/lib/zod";
import { z } from "zod";
import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import prisma from "@/lib/db";
import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

export const loginAction = async (values: z.infer<typeof loginSchema>) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" };
        default:
          return { error: "Something went wrong" };
      }
    }
    return { error: "Internal Server Error" };
  }
};

export const registerAction = async (values: z.infer<typeof SignUpSchema>) => {
  try {
    const { data, success } = SignUpSchema.safeParse(values);
    if (!success) {
      return { error: "Datos de registro no válidos" };
    }

    // Verificar si el username ya existe
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username: data.username },
    });
    if (existingUserByUsername) {
      return { error: "El nombre de usuario ya está en uso" };
    }

    // Nueva verificación para el email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });
    if (existingUserByEmail) {
      return { error: "El correo electrónico ya está registrado" };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        username: data.username,
        email: data.email,
        password: hashedPassword,
        image: values.image || "/images/AvatarPredeterminado.webp",
      },
    });

    await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    return { success: true };
    
  } catch (error) {
    // Manejo adicional de errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return { error: "El correo electrónico ya está registrado" };
      }
    }
    
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    
    return { error: "Error interno del servidor" };
  }
};
