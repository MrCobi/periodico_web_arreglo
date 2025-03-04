"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Source } from "@/src/interface/source";

interface SourcesListProps {
  sources: Source[];
}

export default function SourcesList({ sources }: SourcesListProps) {
  const { data: session } = useSession();

  // Estados inicializados desde sessionStorage
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return sessionStorage.getItem("sources_selectedLanguage") || "all";
  });
  
  const [searchTerm, setSearchTerm] = useState(() => {
    return sessionStorage.getItem("sources_searchTerm") || "";
  });
  
  const [currentPage, setCurrentPage] = useState(() => {
    return Number(sessionStorage.getItem("sources_currentPage")) || 1;
  });

  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [isLoaded, setIsLoaded] = useState(false);
  const sourcesPerPage = 9;

  // Sincronizar estados con sessionStorage
  useEffect(() => {
    sessionStorage.setItem("sources_selectedLanguage", selectedLanguage);
    sessionStorage.setItem("sources_searchTerm", searchTerm);
    sessionStorage.setItem("sources_currentPage", currentPage.toString());
  }, [selectedLanguage, searchTerm, currentPage]);

  // Cargar favoritos
  useEffect(() => {
    const loadFavorites = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/favorites/list");
          if (response.ok) {
            const data = await response.json();
            setFavorites(new Set(data.favoriteIds));
            setIsLoaded(true);
          }
        } catch (error) {
          console.error("Error cargando favoritos:", error);
          setIsLoaded(true);
        }
      }
    };
    loadFavorites();
  }, [session]);

  // Manejar el cambio de idioma y reiniciar currentPage
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
    setCurrentPage(1); // Reiniciamos la página al cambiar el filtro
  };

  // Manejar el cambio en el input de búsqueda y reiniciar currentPage
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reiniciamos la página al cambiar el término de búsqueda
  };

  // Cargar favoritos desde la API
  useEffect(() => {
    const loadFavorites = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch("/api/favorites/list", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.ok) {
            const data = await response.json();
            setFavorites(new Set(data.favoriteIds));
          } else {
            console.error("Error al cargar favoritos");
          }
        } catch (error) {
          console.error("Error al cargar favoritos:", error);
        }
      }
    };

    loadFavorites();
  }, [session]);

  // Filtrado de fuentes según idioma y término de búsqueda
  const filteredSources = sources.filter((source) => {
    const matchesLanguage =
      selectedLanguage === "all" || source.language === selectedLanguage;
    const matchesSearchTerm = source.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesLanguage && matchesSearchTerm;
  });

  const totalPages = Math.ceil(filteredSources.length / sourcesPerPage);
  const currentSources = filteredSources.slice(
    (currentPage - 1) * sourcesPerPage,
    currentPage * sourcesPerPage
  );

  const getLanguageName = (code: string) => {
    const languages: Record<string, string> = {
      es: "Español",
      en: "Inglés",
      fr: "Francés",
      pt: "Portugués",
      it: "Italiano",
      de: "Alemán",
      ar: "Árabe",
      zh: "Chino",
      ru: "Ruso",
    };
    return languages[code] || code;
  };

  const getLanguageFlag = (code: string) => {
    const flags: Record<string, string> = {
      es: "🇪🇸",
      en: "🇬🇧",
      fr: "🇫🇷",
      pt: "🇵🇹",
      it: "🇮🇹",
      de: "🇩🇪",
      ar: "🇸🇦",
      zh: "🇨🇳",
      ru: "🇷🇺",
    };
    return flags[code] || "🌐";
  };

  // Manejador para favoritos (sin cambios)
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div
          className={`mb-12 transition-all duration-700 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Explora Nuestras Fuentes de Noticias
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Descubre periódicos y medios de comunicación de todo el mundo,
              organizados por idioma y relevancia.
            </p>
            <div className="h-1 w-32 bg-blue-600 mx-auto mt-6"></div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 items-end">
              <div className="flex-1">
                <label
                  htmlFor="language"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Filtrar por idioma:
                </label>
                <select
                  id="language"
                  name="language"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="w-full p-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white"
                >
                  <option value="all">Todos los idiomas</option>
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                  <option value="fr">Francés</option>
                  <option value="pt">Portugués</option>
                  <option value="it">Italiano</option>
                  <option value="de">Alemán</option>
                  <option value="ar">Árabe</option>
                  <option value="zh">Chino</option>
                  <option value="ru">Ruso</option>
                </select>
              </div>
              <div className="flex-1">
                <label
                  htmlFor="search"
                  className="block mb-2 text-sm font-medium text-gray-700"
                >
                  Buscar periódico:
                </label>
                <div className="relative">
                  <input
                    id="search"
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full p-4 pl-12 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Nombre del periódico..."
                  />
                  <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-gray-600 mb-6 text-center">
            Mostrando{" "}
            {Math.min(currentPage * sourcesPerPage, filteredSources.length) -
              (currentPage - 1) * sourcesPerPage}{" "}
            de {filteredSources.length} fuentes disponibles
            {totalPages > 1 && ` (Página ${currentPage} de ${totalPages})`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentSources.map((source, index) => (
              <div
                key={source.id}
                className={`group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl ${
                  isLoaded
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="relative h-40 bg-gradient-to-r from-blue-600 to-blue-800 overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>

                  {source.imageUrl ? (
                    <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg z-10">
                      <Image
                        src={source.imageUrl}
                        alt={source.name}
                        fill
                        className="object-cover"
                        sizes="112px"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src =
                            "/images/default_periodico.jpg";
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center shadow-lg z-10">
                      <span className="text-4xl font-bold text-blue-700">
                        {source.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800 flex items-center">
                    <span className="mr-1">
                      {getLanguageFlag(source.language)}
                    </span>
                    {getLanguageName(source.language)}
                  </div>

                  <button
                    onClick={() => handleFavoriteClick(source.id)}
                    className="absolute top-4 left-4 bg-white/90 p-2 rounded-full text-xl hover:bg-white transition-all"
                    title={
                      favorites.has(source.id)
                        ? "Eliminar de favoritos"
                        : "Agregar a favoritos"
                    }
                  >
                    {favorites.has(source.id) ? "★" : "☆"}
                  </button>
                </div>

                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {source.name}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {source.description || "Sin descripción disponible"}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <Link
                      href={`/sources/${source.id}`}
                      className="text-sm text-blue-600 font-medium flex items-center"
                    >
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Ver detalles
                    </Link>

                    <span className="text-sm text-gray-500 flex items-center">
                      <svg
                        className="w-5 h-5 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                        />
                      </svg>
                      {source.category || "General"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredSources.length === 0 && (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o cambia el filtro de
                idioma
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex flex-col items-center space-y-4">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-md flex items-center justify-center ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 5l7 7-7 7M5 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>

              <p className="text-sm text-gray-600">
                Mostrando {(currentPage - 1) * sourcesPerPage + 1} -{" "}
                {Math.min(currentPage * sourcesPerPage, filteredSources.length)}{" "}
                de {filteredSources.length} fuentes
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
