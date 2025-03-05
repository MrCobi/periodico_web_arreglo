// src/app/api/comments/list/[sourceId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: { sourceId: string } }
) {
  try {
    const { sourceId } = await params; // <-- Simplificado (sin await)

    // Validación 1: Parámetro sourceId vacío
    if (!sourceId?.trim()) {
      return NextResponse.json(
        { message: "El ID de la fuente es requerido" },
        { status: 400 }
      );
    }

    // Validación 2: Existencia de la fuente
    const sourceExists = await prisma.source.findUnique({
      where: { id: sourceId },
    });

    if (!sourceExists) {
      return NextResponse.json(
        { message: "La fuente especificada no existe" },
        { status: 404 }
      );
    }

    // Validación 3: Límite de resultados
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const maxDepth = parseInt(searchParams.get("maxDepth") || "3");

    if (limit > 500) {
      return NextResponse.json(
        { message: "El límite máximo permitido es 500" },
        { status: 400 }
      );
    }

    // Obtener comentarios principales con sus respuestas anidadas (hasta 3 niveles)
    const comments = await prisma.comment.findMany({
      where: {
        sourceId,
        parentId: null, // Solo comentarios principales
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, image: true } },
            replies: {
              include: {
                user: { select: { id: true, name: true, image: true } },
                replies: {
                  include: {
                    user: { select: { id: true, name: true, image: true } },
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "asc" }, // Ordenar respuestas por fecha ascendente
        },
      },
      orderBy: { createdAt: "desc" }, // Ordenar comentarios principales por fecha descendente
      take: limit, // Limitar el número de comentarios principales
    });

    // Validación 4: Resultados vacíos
    if (comments.length === 0) {
      return NextResponse.json({
        message: "No se encontraron comentarios",
        comments: [],
      });
    }

    return NextResponse.json({
      success: true,
      count: comments.length,
      comments,
    });
  } catch (error) {
    console.error("Error en GET /api/comments/list:", error);

    if (error instanceof Error && error.message.includes("PrismaClient")) {
      return NextResponse.json(
        { message: "Error de conexión con la base de datos" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}