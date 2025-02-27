"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "./components/Animation/Link";

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [featuredArticles] = useState([
    {
      id: 1,
      title: "La transformación digital de los medios",
      excerpt: "Cómo la tecnología está cambiando el panorama periodístico actual",
      image: "/images/default_periodico.jpg",
      date: "15 Jun 2023"
    },
    {
      id: 2,
      title: "Historia de la prensa en España",
      excerpt: "Un recorrido por los momentos clave del periodismo español",
      image: "/images/default_periodico.jpg",
      date: "3 May 2023"
    },
    {
      id: 3,
      title: "Periodismo de investigación",
      excerpt: "Los reportajes que cambiaron el curso de la historia",
      image: "/images/default_periodico.jpg",
      date: "27 Abr 2023"
    }
  ]);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-700 to-blue-900">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-24 pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className={`lg:w-1/2 text-white transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Tu Biblioteca Digital <span className="text-blue-300">de Noticias</span>
            </h1>
            <p className="text-xl mb-8 text-blue-100 max-w-lg">
              Explora nuestra extensa colección de artículos y mantente informado con las últimas noticias y acontecimientos históricos.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/Articulos"
                className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Artículos
              </Link>
              <Link
                href="/sources"
                className="inline-block bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Ver Fuentes
              </Link>
            </div>
          </div>
          <div className={`lg:w-1/2 transition-all duration-700 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              <div className="absolute -inset-4 bg-blue-400/20 rounded-2xl blur-xl"></div>
              <Image
                src="/images/default_periodico.jpg"
                alt="Hemeroteca Digital"
                width={600}
                height={400}
                className="rounded-lg shadow-2xl relative z-10"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Artículos Destacados */}
      <section className="bg-white/5 backdrop-blur-lg py-20">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-12 transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl font-bold text-white mb-2">
              Artículos Destacados
            </h2>
            <div className="h-1 w-24 bg-blue-400 mx-auto"></div>
            <p className="text-blue-100 mt-4 max-w-2xl mx-auto">
              Descubre algunos de nuestros artículos más relevantes y populares
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredArticles.map((article, index) => (
              <div 
                key={article.id}
                className={`bg-white/10 backdrop-blur-md rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${index * 150 + 500}ms` }}
              >
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-3 left-3 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {article.date}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-2">{article.title}</h3>
                  <p className="text-blue-100 mb-4">{article.excerpt}</p>
                  <Link
                    href={`/articulo/${article.id}`}
                    className="text-blue-300 hover:text-blue-100 inline-flex items-center"
                  >
                    Leer más
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}