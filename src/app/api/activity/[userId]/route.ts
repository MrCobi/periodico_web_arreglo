import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(
  _: Request,
  { params }: { params: { userId: string } }
) {
  // 1. Corregir manejo de parámetros según Next.js
  const { userId } = await params; // <-- Await requerido

  try {
    // 2. Consulta SQL corregida (sin comentarios inválidos)
    const activities = await prisma.$queryRaw`
      (
        SELECT 
          'favorite_added' AS type,
          fh.created_at AS createdAt,
          s.name AS sourceName,
          s.id AS sourceId
        FROM favorite_sources fh
        JOIN sources s ON fh.source_id = s.id
        WHERE fh.user_id = ${userId}
        ORDER BY fh.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'favorite_removed' AS type,
          fh.created_at AS createdAt,
          s.name AS sourceName,
          s.id AS sourceId
        FROM favorite_sources fh
        JOIN sources s ON fh.source_id = s.id
        WHERE fh.user_id = ${userId}
        ORDER BY fh.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'comment' AS type,
          c.created_at AS createdAt,
          s.name AS sourceName,
          s.id AS sourceId
        FROM comments c
        JOIN sources s ON c.source_id = s.id
        WHERE c.user_id = ${userId}
        ORDER BY c.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'rating' AS type,
          r.created_at AS createdAt,
          s.name AS sourceName,
          s.id AS sourceId
        FROM ratings r
        JOIN sources s ON r.source_id = s.id
        WHERE r.user_id = ${userId}
        ORDER BY r.created_at DESC
        LIMIT 5
      )
      UNION ALL
      (
        SELECT 
          'follow' AS type,
          f.created_at AS createdAt,
          u.name AS userName,  -- Comentario SQL válido
          u.id AS userId
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ${userId}
        ORDER BY f.created_at DESC
        LIMIT 5
      )
      ORDER BY createdAt DESC
      LIMIT 5
    `;

    return NextResponse.json({ activities });
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
}