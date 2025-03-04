import { Article } from "@/src/interface/article";
import { Source } from "@/src/interface/source";
import prisma from "./db";

export async function fetchArticlesBySource(
    sourceId: string,
    sortBy: string = "popularity",
    language: string = "es" // Nuevo parámetro para el idioma
  ): Promise<Article[]> {
    try {
      const apiUrl = new URL("https://newsapi.org/v2/everything");
  
      // Configurar parámetros dinámicos
      apiUrl.searchParams.set("sources", sourceId);
      apiUrl.searchParams.set("pageSize", "6");
      apiUrl.searchParams.set("sortBy", sortBy);
      apiUrl.searchParams.set("language", language); // Añadir parámetro de idioma
      apiUrl.searchParams.set("apiKey", "b8aceaf4472c40d786284bcf90cf6b75");

    const response = await fetch(apiUrl.toString());

    if (!response.ok) {
      console.error("Error en la respuesta:", response.status);
      return [];
    }

    const data = await response.json();

    // Verificar si la respuesta contiene artículos
    if (!data.articles || !Array.isArray(data.articles)) {
      return [];
    }

    return data.articles.map((article: Article) => ({
      sourceId: article.source?.id || sourceId,
      author: article.author || null,
      title: article.title,
      description: article.description || null,
      url: article.url,
      urlToImage: article.urlToImage || null,
      publishedAt: article.publishedAt,
      content: article.content || null,
    }));
  } catch (error) {
    console.error("Error fetching articles:", error);
    return [];
  }
}

export async function fetchSourceById(id: string): Promise<Source | null> {
  try {
    const source = await prisma.source.findUnique({
      where: { id },
    });
    console.log("Fetched source:", source);
    return source;
  } catch (error) {
    console.error("Error fetching source:", error);
    return null;
  }
}