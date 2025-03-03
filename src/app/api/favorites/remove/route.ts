import { NextResponse } from "next/server";
import { auth } from "@/auth"; // Importa la función auth
import prisma from "@/lib/db";

export async function DELETE(request: Request) {
  const session = await auth(); // Obtén la sesión

  if (!session?.user?.id) {
    return NextResponse.json({ message: "No autorizado" }, { status: 401 });
  }

  const { sourceId } = await request.json();

  try {
    await prisma.favoriteSource.delete({
      where: {
        userId_sourceId: {
          userId: session.user.id,
          sourceId,
        },
      },
    });
    return NextResponse.json({ message: "Fuente eliminada de favoritos" });
  } catch (error) {
    console.error("Error al eliminar fuente de favoritos:", error);
    return NextResponse.json(
      { message: "Error al eliminar fuente de favoritos" },
      { status: 500 }
    );
  }
}