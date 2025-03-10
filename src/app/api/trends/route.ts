// src/app/api/trends/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Fuentes más favoritadas
    const topFavorites = await prisma.favoriteSource.groupBy({
      by: ["sourceId"],
      _count: { sourceId: true },
      orderBy: { _count: { sourceId: "desc" } },
      take: 5,
    });

    // 2. Fuentes con más comentarios
    const topCommented = await prisma.comment.groupBy({
      by: ["sourceId"],
      _count: { sourceId: true },
      orderBy: { _count: { sourceId: "desc" } },
      take: 5,
    });

    // 3. Artículos trending desde NewsAPI
    const newsApiResponse = await fetch(
      `https://newsapi.org/v2/top-headlines?country=es&apiKey=${process.env.NEWS_API_KEY}`
    );
    
    if (!newsApiResponse.ok) {
      throw new Error('Error fetching NewsAPI data');
    }

    const newsApiData = await newsApiResponse.json();
    
    // Mapear datos para incluir información de fuente local
    const newsWithSources = await Promise.all(
      newsApiData.articles.map(async (article: any) => {
        const source = await prisma.source.findFirst({
          where: { url: article.url },
        });
        return {
          ...article,
          localSourceId: source?.id || null,
        };
      })
    );

    return NextResponse.json({
      topFavorites,
      topCommented,
      newsApiTrends: newsWithSources,
    });
    
  } catch (error) {
    console.error("Error in trends endpoint:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}