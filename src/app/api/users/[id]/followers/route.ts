// app/api/users/[id]/followers/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Validar formato del ID
    if (!params.id || !/^[a-z0-9-]+$/i.test(params.id)) {
      return NextResponse.json(
        { error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // 2. Verificar existencia del usuario
    const userExists = await prisma.user.findUnique({
      where: { id: params.id },
      select: { id: true }
    });

    if (!userExists) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    // 3. Configurar paginación
    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 100);
    const page = Number(searchParams.get("page")) || 1;

    // 4. Obtener seguidores con datos básicos
    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: { followingId: params.id },
        include: {
          follower: {
            select: {
              id: true,
              name: true,
              username: true,
              image: true,
              createdAt: true
            }
          }
        },
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.follow.count({
        where: { followingId: params.id }
      })
    ]);

    // 5. Formatear respuesta
    return NextResponse.json({
      data: followers.map(f => ({
        ...f.follower,
        followingSince: f.createdAt
      })),
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
        limit
      }
    });

  } catch (error) {
    console.error("Error fetching followers:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}