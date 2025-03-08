// src/app/api/users/suggestions/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    
    if (!userId) {
      return NextResponse.json(
        { error: "ID de usuario requerido" },
        { status: 400 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          { followers: { none: { followerId: userId } } }
        ]
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        bio: true
      },
      take: 20,
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ data: users });
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}