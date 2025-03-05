"use client";

import { useState, useEffect } from "react";
import { Source } from "@/src/interface/source";
import { Article } from "@/src/interface/article";
import { SourceImage } from "./SourceImage.client";
import { StarRating } from "@/src/app/components/StarRating.client";
import Image from "next/image";
import { fetchArticlesBySource } from "@/lib/api";
import { useSession } from "next-auth/react";
import CommentForm from "@/src/app/components/CommentForm";
import CommentList from "@/src/app/components/CommentList";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface SourcePageClientProps {
  source: Source;
  articles: Article[];
}

const sortLabels: Record<string, string> = {
  popularity: "popularidad",
  publishedAt: "fecha",
  relevancy: "relevancia",
};

export default function SourcePageClient({
  source,
  articles: initialArticles,
}: SourcePageClientProps) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [sortBy, setSortBy] = useState<
    "popularity" | "publishedAt" | "relevancy"
  >("popularity");
  const [isAnimating, setIsAnimating] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { data: session } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [commentsCount, setCommentsCount] = useState(0);

  useEffect(() => {
    const loadFavorites = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/favorites/list");
          if (response.ok) {
            const data = await response.json();
            setFavorites(new Set(data.favoriteIds));
          }
        } catch (error) {
          console.error("Error cargando favoritos:", error);
        }
      }
    };
    loadFavorites();
  }, [session]);

  const handleFavoriteClick = async (sourceId: string) => {
    if (!session?.user?.id) {
      alert("Debes iniciar sesión para agregar a favoritos");
      return;
    }
    try {
      if (favorites.has(sourceId)) {
        await fetch("/api/favorites/remove", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceId }),
        });
        setFavorites((prev) => {
          const newFav = new Set(prev);
          newFav.delete(sourceId);
          return newFav;
        });
      } else {
        await fetch("/api/favorites/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sourceId }),
        });
        setFavorites((prev) => new Set(prev).add(sourceId));
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  const loadArticles = async (order: typeof sortBy) => {
    const cacheKey = `articles_${source.id}_${order}`;
    const cachedArticles = sessionStorage.getItem(cacheKey);

    if (cachedArticles) {
      setArticles(JSON.parse(cachedArticles));
    } else {
      const fetchedArticles = await fetchArticlesBySource(
        source.id,
        order,
        source.language
      );
      setArticles(fetchedArticles);
      sessionStorage.setItem(cacheKey, JSON.stringify(fetchedArticles));
    }
  };

  const rotateSort = () => {
    setIsAnimating(true);
    const sortOrder: (typeof sortBy)[] = [
      "relevancy",
      "popularity",
      "publishedAt",
    ];
    const currentIndex = sortOrder.indexOf(sortBy);
    const nextIndex = (currentIndex + 1) % sortOrder.length;
    const nextSort = sortOrder[nextIndex];

    setTimeout(() => {
      setSortBy(nextSort);
      loadArticles(nextSort);
      setIsAnimating(false);
    }, 300);
  };

  const fetchComments = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const fetchCommentsCount = async () => {
    try {
      const response = await fetch(`/api/comments/${source.id}/count`);
      if (response.ok) {
        const { count } = await response.json();
        setCommentsCount(count);
      }
    } catch (error) {
      console.error("Error obteniendo conteo de comentarios:", error);
    }
  };

  useEffect(() => {
    fetchCommentsCount();
  }, [refreshKey]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="relative bg-gradient-to-r from-blue-900 to-blue-700 py-16">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => handleFavoriteClick(source.id)}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full text-xl hover:bg-white transition-all"
            title={
              favorites.has(source.id)
                ? "Eliminar de favoritos"
                : "Agregar a favoritos"
            }
          >
            {favorites.has(source.id) ? "★" : "☆"}
          </button>

          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {source.name}
              </h1>
              <p className="text-xl text-gray-100 mb-6 max-w-2xl">
                {source.description}
              </p>
              <div className="max-w-xs">
                <StarRating sourceId={source.id} />
              </div>
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors mt-4"
              >
                Visitar sitio web
                <svg
                  className="ml-2 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {source.imageUrl && (
              <div className="md:ml-4">
                <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl">
                  <SourceImage
                    imageUrl={source.imageUrl}
                    name={source.name}
                    size="xlarge"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="border rounded-lg overflow-hidden">
          <button 
            onClick={() => setShowComments(!showComments)}
            className="w-full p-4 bg-gray-100 flex justify-between items-center"
          >
            <h2 className="text-xl font-semibold">Comentarios ({commentsCount})</h2>
            <ChevronDownIcon className={`w-6 h-6 transform transition-transform ${
              showComments ? "rotate-180" : ""
            }`}/>
          </button>
          
          {showComments && (
            <div className="p-6 bg-white">
              <CommentForm
                sourceId={source.id}
                onCommentAdded={() => {
                  fetchComments();
                  fetchCommentsCount();
                }}
              />
              <CommentList
                sourceId={source.id}
                refreshKey={refreshKey}
                onCommentsLoaded={(count) => setCommentsCount(count)}
              />
            </div>
          )}
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative">
              <h2 className="text-3xl font-bold text-gray-900">
                Artículos Destacados por{" "}
                <span
                  onClick={rotateSort}
                  className={`text-blue-600 cursor-pointer inline-block transition-all duration-300 ${
                    isAnimating
                      ? "opacity-0 transform -translate-y-4"
                      : "opacity-100"
                  }`}
                >
                  {sortLabels[sortBy]}
                </span>
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Haz clic en el criterio para cambiar el orden
              </p>
            </div>

            <div className="flex items-center gap-3 bg-white p-2 rounded-lg shadow-sm self-end">
              <span className="text-sm text-gray-500">Ordenar por:</span>
              <div className="flex gap-1">
                <span
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    sortBy === "relevancy"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Relevancia
                </span>
                <span
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    sortBy === "popularity"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Popularidad
                </span>
                <span
                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                    sortBy === "publishedAt"
                      ? "bg-blue-600 text-white"
                      : "text-gray-500"
                  }`}
                >
                  Fecha
                </span>
              </div>
            </div>
          </div>
        </section>

        {articles.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <p className="text-xl">No se encontraron artículos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.url}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <figure className="relative h-48">
                  {article.urlToImage ? (
                    <Image
                      src={article.urlToImage}
                      alt={article.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  )}
                </figure>

                <div className="p-6">
                  <header>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600">
                      {article.title}
                    </h3>
                  </header>

                  {article.description && (
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {article.description}
                    </p>
                  )}

                  <footer className="mt-auto">
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      {article.author && (
                        <span className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                          <span className="truncate max-w-[120px]">
                            {article.author}
                          </span>
                        </span>
                      )}
                      <time className="flex items-center">
                        <svg
                          className="w-4 h-4 mr-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {new Date(article.publishedAt).toLocaleDateString(
                          "es-ES",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>

                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      Leer más
                      <svg
                        className="ml-2 w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 5l7 7m0 0l-7 7m7-7H3"
                        />
                      </svg>
                    </a>
                  </footer>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
