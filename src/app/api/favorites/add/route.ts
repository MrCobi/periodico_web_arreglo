import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Importa la función auth
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth(); // Obtén la sesión

  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { sourceId } = await request.json();

  try {
    await prisma.favoriteSource.create({
      data: {
        userId: session.user.id,
        sourceId,
      },
    });
    return NextResponse.json({ message: "Fuente agregada a favoritos" });
  } catch (error) {
    console.error("Error al agregar fuente a favoritos:", error);
    return NextResponse.json(
      { message: "Error al agregar fuente a favoritos" },
      { status: 500 }
    );
  }
}