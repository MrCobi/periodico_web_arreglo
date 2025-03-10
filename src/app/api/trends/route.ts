// src/app/api/trends/route.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

async function fetchWithRetry(url: string, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url);
      console.log(`Intento ${i + 1}: Status ${response.status}`); // ← Nuevo log
      
      if (response.ok) return response;
      
      // Capturar errores de la API
      const errorData = await response.json();
      console.error("Error de NewsAPI:", errorData);
      return NextResponse.json(
        { error: errorData.message || "NewsAPI Error" },
        { status: response.status }
      );
      
    } catch (error) {
      console.error(`Error de red: ${error}`);
    }
    await new Promise(resolve => setTimeout(resolve, delay));
  }
  throw new Error(`Failed after ${retries} retries`);
}

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
    const newsApiResponse = await fetchWithRetry(
      `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${process.env.NEXT_PUBLIC_NEWS_API_KEY}`
    );

    if (!(newsApiResponse instanceof Response)) {
      return newsApiResponse; // Devuelve el error ya manejado
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
    console.error("Error completo:", error);
    return NextResponse.json(
      { error: "Error interno - Ver logs del servidor" },
      { status: 500 }
    );
  }
}