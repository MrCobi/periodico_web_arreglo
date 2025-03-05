// src/app/api/comments/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return NextResponse.json({ message: "Debes iniciar sesión" }, { status: 401 });
  }

  try {
    const { content, sourceId } = await request.json();
    const trimmedContent = content?.trim() || "";

    // Validación de campos requeridos
    if (!trimmedContent || !sourceId) {
      return NextResponse.json(
        { message: "Contenido y sourceId son requeridos" },
        { status: 400 }
      );
    }

    // Validación de longitud
    if (trimmedContent.length < 3) {
      return NextResponse.json(
        { message: "El comentario debe tener al menos 3 caracteres" },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 500) {
      return NextResponse.json(
        { message: "Máximo 500 caracteres" },
        { status: 400 }
      );
    }

    // Verificar que el source existe
    const sourceExists = await prisma.source.findUnique({
      where: { id: sourceId }
    });

    if (!sourceExists) {
      return NextResponse.json(
        { message: "La fuente especificada no existe" },
        { status: 404 }
      );
    }

    // Crear comentario con contenido limpio
    const newComment = await prisma.comment.create({
      data: {
        content: trimmedContent, // Usar versión trimmeada
        userId: session.user.id,
        sourceId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true // Eliminar email de la respuesta
          }
        }
      }
    });

    return NextResponse.json(newComment);
    
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { message: "Error al crear comentario" },
      { status: 500 }
    );
  }
}