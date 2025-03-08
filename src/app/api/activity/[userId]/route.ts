import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export const dynamic = 'force-dynamic';

interface ActivityResult {
  type: string;
  createdAt: Date;
  sourceName: string | null;
  userName: string | null;
  total: number | bigint;
}

export async function GET(
  request: Request,
  context: { params: Promise<{ userId: string }> } // params como promesa
) {
  try {
    // Esperar y desestructurar el objeto params
    const { userId } = await context.params;
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = (page - 1) * limit;

    if (!userId || typeof userId !== 'string') {
      return NextResponse.json(
        { success: false, error: "ID de usuario inválido" },
        { status: 400 }
      );
    }

    // Consulta SQL compatible con MySQL
    const query = await prisma.$queryRaw<ActivityResult[]>`
      WITH combined_activities AS (
        SELECT 
          'favorite_added' AS type,
          fh.created_at AS createdAt,
          s.name AS sourceName,
          NULL AS userName
        FROM favorite_sources fh
        JOIN sources s ON fh.source_id = s.id
        WHERE fh.user_id = ${userId}
        
        UNION ALL
        
        SELECT 
          'favorite_removed' AS type,
          fh.created_at AS createdAt,
          s.name AS sourceName,
          NULL AS userName
        FROM favorite_sources fh
        JOIN sources s ON fh.source_id = s.id
        WHERE fh.user_id = ${userId}
        
        UNION ALL
        
        SELECT 
          'comment' AS type,
          c.created_at AS createdAt,
          s.name AS sourceName,
          NULL AS userName
        FROM comments c
        JOIN sources s ON c.source_id = s.id
        WHERE c.user_id = ${userId}
        
        UNION ALL
        
        SELECT 
          'rating' AS type,
          r.created_at AS createdAt,
          s.name AS sourceName,
          NULL AS userName
        FROM ratings r
        JOIN sources s ON r.source_id = s.id
        WHERE r.user_id = ${userId}
        
        UNION ALL
        
        SELECT 
          'follow' AS type,
          f.created_at AS createdAt,
          NULL AS sourceName,
          u.name AS userName
        FROM follows f
        JOIN users u ON f.following_id = u.id
        WHERE f.follower_id = ${userId}
      )
      SELECT 
        *,
        (SELECT COUNT(*) FROM combined_activities) AS total
      FROM combined_activities
      ORDER BY createdAt DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    // Convertir el total a number para evitar conflictos entre BigInt y number
    const total = Number(query[0]?.total || 0);
    const activities = query.map(({ total, ...rest }) => rest);

    return NextResponse.json({
      success: true,
      data: {
        activities,
        total,
        totalPages: Math.ceil(total / limit),
        currentPage: page
      }
    });
    
  } catch (error) {
    console.error("Error detallado:", error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Error al obtener actividades",
        detalle: error instanceof Error ? error.message : "Error desconocido"
      },
      { status: 500 }
    );
  }
}
