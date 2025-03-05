"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "./components/Animation/Link";

export default function HomePage() {
  const router = useRouter();

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[80vh] w-full overflow-hidden">
        {/* Imagen de fondo con overlay */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-800/70"></div>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute top-10 left-10 md:top-20 md:left-20 w-40 h-40 md:w-64 md:h-64 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full opacity-60 blur-xl"></div>
        <div className="absolute bottom-10 right-10 md:bottom-20 md:right-20 w-52 h-52 md:w-80 md:h-80 bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 rounded-full opacity-60 blur-xl"></div>

        {/* Contenido del hero */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-3xl">
            <p className="text-blue-300 font-medium mb-3 tracking-wider uppercase">
              Archivo histórico digital
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Descubre el Mundo <br />
              de las Noticias Históricas
            </h1>
            <p className="text-base sm:text-lg text-gray-200 mb-8 max-w-2xl">
              Explora nuestra vasta colección de artículos, periódicos y documentos históricos 
              digitalizados que abarcan más de cinco décadas de historia.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => router.push('/api/auth/signin')}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => router.push('/api/auth/signup')}
                className="px-6 py-3 sm:px-8 sm:py-4 bg-transparent border-2 border-white text-white font-medium rounded-xl transition-all hover:bg-white/10"
              >
                Registrarse
              </button>
            </div>
            <p className="text-blue-200 mt-4 italic">
              Inicia sesión para acceder a todos nuestros artículos y fuentes históricas
            </p>
          </div>
        </div>

        {/* Indicadores de desplazamiento */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`h-2 rounded-full ${
                i === 0 ? "w-8 bg-blue-500" : "w-2 bg-gray-400/60"
              }`}
            ></div>
          ))}
        </div>
      </section>

      {/* Sección de características */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Explora Nuestra Colección Digital
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Accede a miles de documentos históricos, organizados y digitalizados para facilitar tu investigación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                ),
                title: "Artículos Históricos",
                description:
                  "Más de 10,000 artículos de periódicos y revistas que abarcan eventos históricos significativos.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Búsqueda Avanzada",
                description:
                  "Encuentra rápidamente lo que buscas con nuestras herramientas de búsqueda y filtrado avanzadas.",
              },
              {
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                ),
                title: "Fuentes Verificadas",
                description:
                  "Contenido procedente de más de 200 fuentes verificadas y catalogadas por expertos.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="text-blue-500 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de estadísticas */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "10,000+", label: "Artículos" },
              { value: "50+", label: "Años de historia" },
              { value: "200+", label: "Fuentes" },
              { value: "5,000+", label: "Usuarios" },
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Nueva sección: Cómo funciona */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Cómo Funciona Nuestra Hemeroteca
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Descubre el proceso que seguimos para preservar y hacer accesible la historia a través de nuestros documentos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Recopilación",
                description: "Seleccionamos cuidadosamente fuentes históricas relevantes de archivos y bibliotecas.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                )
              },
              {
                number: "02",
                title: "Digitalización",
                description: "Utilizamos tecnología avanzada para digitalizar los documentos con alta resolución.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                )
              },
              {
                number: "03",
                title: "Catalogación",
                description: "Expertos clasifican y etiquetan cada documento para facilitar su búsqueda.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                )
              },
              {
                number: "04",
                title: "Acceso",
                description: "Ponemos a tu disposición todo el archivo para consulta e investigación.",
                icon: (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                )
              }
            ].map((step, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold mr-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                </div>
                <div className="text-blue-500 mb-4">
                  {step.icon}
                </div>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de línea de tiempo - Versión responsiva */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Explora Nuestra Línea del Tiempo
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Navega por nuestros documentos organizados cronológicamente desde 2025.
            </p>
          </div>

          {/* Versión para pantallas medianas y grandes */}
          <div className="hidden md:block relative">
            {/* Línea central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-indigo-600"></div>
            
            {/* Eventos */}
            <div className="space-y-24">
              {[
                {
                  year: "Febrero 2025",
                  title: "Lanzamiento de la Plataforma",
                  description: "Inauguración de nuestra hemeroteca digital con los primeros 5,000 artículos.",
                  align: "right"
                },
                {
                  year: "Abril 2025",
                  title: "Expansión de Contenido",
                  description: "Incorporación de nuevas fuentes y ampliación de la cobertura temática.",
                  align: "left"
                },
                {
                  year: "Julio 2025",
                  title: "Mejoras de Búsqueda",
                  description: "Implementación de herramientas avanzadas de filtrado y categorización.",
                  align: "right"
                },
                {
                  year: "Octubre 2025",
                  title: "Colaboraciones Internacionales",
                  description: "Alianzas con archivos históricos de diferentes países para ampliar nuestra colección.",
                  align: "left"
                },
              ].map((event, i) => (
                <div key={i} className={`relative flex ${event.align === 'left' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`w-5/12 ${event.align === 'right' && 'ml-auto'}`}>
                    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                      <div className="text-2xl font-bold text-blue-600 mb-2">{event.year}</div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                      <button 
                        onClick={() => router.push('/api/auth/signin')}
                        className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-sm rounded-lg transition-all"
                      >
                        Iniciar sesión para explorar
                      </button>
                    </div>
                  </div>
                  
                  {/* Punto en la línea */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500 top-6"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Versión para móviles */}
          <div className="md:hidden">
            <div className="space-y-8">
              {[
                {
                  year: "Febrero 2025",
                  title: "Lanzamiento de la Plataforma",
                  description: "Inauguración de nuestra hemeroteca digital con los primeros 5,000 artículos."
                },
                {
                  year: "Abril 2025",
                  title: "Expansión de Contenido",
                  description: "Incorporación de nuevas fuentes y ampliación de la cobertura temática."
                },
                {
                  year: "Julio 2025",
                  title: "Mejoras de Búsqueda",
                  description: "Implementación de herramientas avanzadas de filtrado y categorización."
                },
                {
                  year: "Octubre 2025",
                  title: "Colaboraciones Internacionales",
                  description: "Alianzas con archivos históricos de diferentes países para ampliar nuestra colección."
                },
              ].map((event, i) => (
                <div key={i} className="relative pl-10 border-l-4 border-blue-500">
                  <div className="absolute left-0 top-0 transform -translate-x-1/2 w-6 h-6 rounded-full bg-white border-4 border-blue-500"></div>
                  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100">
                    <div className="text-xl font-bold text-blue-600 mb-2">{event.year}</div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{event.title}</h3>
                    <p className="text-gray-600 text-sm">{event.description}</p>
                    <button 
                      onClick={() => router.push('/api/auth/signin')}
                      className="mt-4 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-xs rounded-lg transition-all"
                    >
                      Iniciar sesión para explorar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="py-16 bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Comienza a explorar nuestra hemeroteca digital hoy mismo
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Accede a nuestra colección completa y descubre la historia a través de las noticias que la documentaron.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => router.push('/api/auth/signin')}
              className="px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 font-medium rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => router.push('/api/auth/signup')}
              className="px-8 py-4 bg-transparent border-2 border-white text-white hover:bg-white/10 font-medium rounded-xl transition-all"
            >
              Registrarse
            </button>
          </div>
        </div>
      </section>
    </>
  );
}