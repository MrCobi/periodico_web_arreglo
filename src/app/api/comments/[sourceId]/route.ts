// src/app/api/comments/[sourceId]/route.ts
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
    const trimmedContent = (content || "").trim();

    // Validación unificada
    const validations = [
      [!trimmedContent, "Contenido es requerido"],
      [!sourceId, "SourceId es requerido"],
      [trimmedContent.length < 3, "Mínimo 3 caracteres"],
      [trimmedContent.length > 500, "Máximo 500 caracteres"]
    ];

    for (const [condition, message] of validations) {
      if (condition) return NextResponse.json({ message }, { status: 400 });
    }

    // Verificación atómica de Source
    const [sourceExists] = await Promise.all([
      prisma.source.findUnique({ where: { id: sourceId } }),
      prisma.$queryRaw`SELECT 1` // Keep alive connection
    ]);

    if (!sourceExists) {
      return NextResponse.json(
        { message: "Fuente no encontrada" },
        { status: 404 }
      );
    }

    // Transacción de creación
    const newComment = await prisma.comment.create({
      data: {
        content: trimmedContent,
        userId: session.user.id,
        sourceId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    return NextResponse.json(newComment);

  } catch (error) {
    console.error("Error en POST /api/comments:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}