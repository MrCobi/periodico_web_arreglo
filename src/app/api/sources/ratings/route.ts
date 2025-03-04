// src/app/api/sources/ratings/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/db";

// Manejar solicitudes GET
export async function GET(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const sourceId = searchParams.get("sourceId");

  if (!sourceId) {
    return NextResponse.json(
      { message: "sourceId es requerido" },
      { status: 400 }
    );
  }

  try {
    // Obtener la valoración del usuario actual
    const rating = await prisma.rating.findUnique({
      where: {
        userId_sourceId: {
          userId: session.user.id,
          sourceId,
        },
      },
      select: {
        value: true,
      },
    });

    return NextResponse.json({ rating: rating?.value || 0 });
  } catch (error) {
    console.error("Error al obtener la valoración:", error);
    return NextResponse.json(
      { message: "Error al obtener la valoración" },
      { status: 500 }
    );
  }
}

// Manejar solicitudes POST (ya existente)
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

export async function DELETE(req: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const sourceId = searchParams.get("sourceId");

  if (!sourceId) {
    return NextResponse.json(
      { message: "sourceId es requerido" },
      { status: 400 }
    );
  }

  try {
    // Eliminar la calificación de la base de datos
    await prisma.rating.deleteMany({
      where: {
        sourceId,
        userId: session.user.id,
      },
    });

    return NextResponse.json({ message: "Valoración eliminada" }, { status: 200 });
  } catch (error) {
    console.error("Error al eliminar la valoración:", error);
    return NextResponse.json(
      { message: "Error al eliminar la valoración" },
      { status: 500 }
    );
  }
}

