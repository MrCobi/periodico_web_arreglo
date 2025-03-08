import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  context: { params: { userId: string } } // Tipo correcto (sin Promise)
) {
  try {
    // Usa await para obtener los valores de params
    const { userId } = context.params;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    const activities = await prisma.$queryRaw`
      (
        SELECT 
          'favorite_added' AS type,
          fh.created_at AS createdAt,
          s.name AS sourceName,
          s.id AS sourceId,
          NULL AS userName,
          NULL AS userId
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
          s.id AS sourceId,
          NULL AS userName,
          NULL AS userId
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
          s.id AS sourceId,
          NULL AS userName,
          NULL AS userId
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
          s.id AS sourceId,
          NULL AS userName,
          NULL AS userId
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
          NULL AS sourceName,
          NULL AS sourceId,
          u.name AS userName,
          u.id AS userId
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ${userId}
        ORDER BY f.created_at DESC
        LIMIT 5
      )
      ORDER BY createdAt DESC
      LIMIT 20
    `;

    return NextResponse.json({
      success: true,
      data: activities
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: "Error al obtener actividades" },
      { status: 500 }
    );
  }
}