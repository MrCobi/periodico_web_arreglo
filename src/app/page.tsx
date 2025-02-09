import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-600 to-blue-800">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-20 pb-32">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 text-white">
            <h1 className="text-5xl font-extrabold mb-6">
              Tu Biblioteca Digital de Noticias
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Explora nuestra extensa colección de artículos y mantente informado con las últimas noticias y acontecimientos históricos.
            </p>
            <Link
              href="/Articulos"
              className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300"
            >
              Explorar Artículos
            </Link>
          </div>
          <div className="lg:w-1/2">
            <Image
              src="/images/default_periodico.jpg"
              alt="Hemeroteca Digital"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            ¿Por qué usar nuestra hemeroteca?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
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
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Búsqueda Avanzada
              </h3>
              <p className="text-gray-600">
                Encuentra rápidamente los artículos que necesitas con nuestro potente motor de búsqueda.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Contenido Actualizado
              </h3>
              <p className="text-gray-600">
                Accede a las últimas noticias y mantente al día con la actualidad.
              </p>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Acceso Digital
              </h3>
              <p className="text-gray-600">
                Consulta nuestra hemeroteca desde cualquier dispositivo, en cualquier momento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-900 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Comienza a explorar nuestra colección
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Miles de artículos te esperan. Descubre historias, noticias y acontecimientos que han marcado nuestra historia.
          </p>
          <Link
            href="/Articulos"
            className="inline-block bg-white text-blue-700 font-bold py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors duration-300"
          >
            Ir a la Hemeroteca
          </Link>
        </div>
      </section>
    </div>
  );
}