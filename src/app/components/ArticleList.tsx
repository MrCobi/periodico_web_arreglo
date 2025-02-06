// components/ArticleList.tsx
import React, { useEffect, useState } from "react";
import { Article } from "../../interface/article";
import Image from "next/image";


interface Props {
  articles: Article[];
}

export default function ArticleList({ articles }: Props) {
  const [showArticles, setShowArticles] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowArticles(true);
    }, 100); // Puedes ajustar el tiempo de retraso

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
            <div
              key={index}
              className={`border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
                showArticles ? "opacity-100 animate-fadeIn" : "opacity-0"
              }`}
            >
              <div className="relative">
                <Image
                  src={article.urlToImage || "/images/default_periodico.jpg"}
                  alt={article.title}
                  width={500}
                  height={300}
                  loading="lazy"
                  placeholder="blur"
                  blurDataURL="/images/default_periodico.jpg"
                  className="w-full h-48 object-cover"
                />
                <h2 className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-lg font-bold p-2">
                  {article.title}
                </h2>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-700 mb-4">
                  {article.description}
                </p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Leer Mas
                </a>
              </div>
              <div className="p-4 bg-gray-100 flex flex-col justify-between h-full">
                <div>
                  <p className="text-sm text-gray-700 mb-4">{article.author}</p>
                  <p className="text-sm text-gray-700 mb-4">
                    {formatDate(article.publishedAt)}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay articulos disponibles.</p>
        )}
      </div>
    </div>
  );
}
