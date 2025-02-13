import React, { useEffect, useState } from "react";
import { Article } from "../../interface/article";
import Image from "next/image";
import Link from "next/link";

interface Props {
  articles: Article[];
}

export default function ArticleList({ articles }: Props) {
  const [showArticles, setShowArticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArticles(true);
    }, 100);

    return () => clearTimeout(timer);
  }, [articles]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  return (
    <div className="px-16 sm:px-16 lg:px-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles && articles.length > 0 ? (
          articles.map((article, index) => (
            <article
              key={index}
              className={`group relative bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:z-10 ${
                showArticles ? "opacity-100 animate-fadeIn" : "opacity-0"
              }`}
            >
              {/* Capa de imagen de fondo en hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                <Image
                  src={article.urlToImage || "/images/default_periodico.jpg"}
                  alt=""
                  fill
                  className="object-cover blur-sm brightness-[0.2]"
                />
              </div>

              {/* Contenido normal */}
              <div className="relative h-48">
                <Image
                  src={article.urlToImage || "/images/default_periodico.jpg"}
                  alt={article.title}
                  width={500}
                  height={300}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/images/default_periodico.jpg"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <h2 className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg font-bold p-2 line-clamp-2">
                  {article.title}
                </h2>
              </div>

              {/* Contenido principal */}
              <div className="relative p-6 transition-colors duration-500 group-hover:bg-transparent">
                <p className="text-gray-600 mb-4 line-clamp-3 group-hover:text-white group-hover:line-clamp-none transition-all duration-500">
                  {article.description}
                </p>
                
                {/* Metadatos */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4 group-hover:text-gray-300">
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
                    {article.author || 'Anónimo'}
                  </span>
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                {/* Enlaces */}
                <div className="flex items-center justify-between relative z-10">
                  <Link 
                    href={`/sources/${article.source.id}`}
                    className="text-sm text-gray-500 hover:text-white transition-colors cursor-pointer group-hover:text-gray-300"
                    aria-label={`Ver más noticias de ${article.source.name}`}
                  >
                    {article.source.name || 'Fuente desconocida'}
                  </Link>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-400 transition-colors group-hover:text-blue-400"
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
                </div>
              </div>
            </article>
          ))
        ) : (
          <p>No hay artículos disponibles.</p>
        )}
      </div>
    </div>
  );
}