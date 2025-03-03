// src/app/api/sources/ratings/average/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId");

  if (!sourceId) {
    return NextResponse.json(
      { message: "sourceId es requerido" },
      { status: 400 }
    );
  }

  try {
    // Obtener todas las valoraciones de la fuente
    const ratings = await prisma.rating.findMany({
      where: {
        sourceId,
      },
      select: {
        value: true,
      },
    });

    // Calcular la media
    const total = ratings.reduce((sum, rating) => sum + rating.value, 0);
    const average = ratings.length > 0 ? total / ratings.length : 0;

    return NextResponse.json({ average });
  } catch (error) {
    console.error("Error al obtener la valoración media:", error);
    return NextResponse.json(
      { message: "Error al obtener la valoración media" },
      { status: 500 }
    );
  }
}