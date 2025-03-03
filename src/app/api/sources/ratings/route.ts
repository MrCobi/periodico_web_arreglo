// src/app/api/sources/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { sourceId, value } = await request.json();

  if (!sourceId || value < 1 || value > 5) {
    return NextResponse.json(
      { message: "Datos inválidos" },
      { status: 400 }
    );
  }

  try {
    // Crear o actualizar la valoración
    const rating = await prisma.rating.upsert({
      where: {
        userId_sourceId: {
          userId: session.user.id,
          sourceId,
        },
      },
      update: {
        value,
      },
      create: {
        userId: session.user.id,
        sourceId,
        value,
      },
    });

    return NextResponse.json({ rating });
  } catch (error) {
    console.error("Error al guardar la valoración:", error);
    return NextResponse.json(
      { message: "Error al guardar la valoración" },
      { status: 500 }
    );
  }
}