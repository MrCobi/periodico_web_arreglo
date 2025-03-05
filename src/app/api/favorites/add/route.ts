import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Importa la función auth
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const session = await auth();

  // Validar sesión y existencia del usuario
  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return NextResponse.json(
      { message: "Usuario no encontrado en la base de datos" },
      { status: 404 }
    );
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