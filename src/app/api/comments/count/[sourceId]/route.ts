// src/app/api/comments/count/[sourceId]/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _: Request,
  context: { params: { sourceId: string } }
) {
  try {
    // Esperamos a que se resuelvan los parámetros dinámicos
    const { sourceId } = await context.params;
    const count = await prisma.comment.count({
      where: { sourceId }
    });
    
    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json(
      { message: "Error obteniendo conteo de comentarios" },
      { status: 500 }
    );
  }
}