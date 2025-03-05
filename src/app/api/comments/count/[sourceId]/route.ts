// src/app/api/comments/count/[sourceId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _: Request,
  context: { params: { sourceId: string } }
) {
  try {
    const { sourceId } = await context.params;

    // Contar todos los comentarios (principales y respuestas) asociados a la fuente
    const count = await prisma.comment.count({
      where: {
        sourceId,
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error obteniendo conteo de comentarios:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}