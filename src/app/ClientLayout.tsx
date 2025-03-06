// src/app/ClientLayout.tsx
"use client";

import { useRouter } from "next/navigation";
import Animate from "./components/Animation/Animate";
import Link from "./components/Animation/Link";
import { useSession } from "next-auth/react";
import AuthButton from "@/src/app/api/auth/AuthButton/AuthButton";
import Image from "next/image";
import { useState } from "react";
import { Suspense } from "react";
import { useNavigationTransition } from "./components/Animation/context";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  return (
    <>
      <Navbar />
      <Animate>
        <main className="flex-1 mt-16">
          <Suspense fallback={<div className="text-center p-8">Cargando...</div>}>
            {children}
          </Suspense>
        </main>
      </Animate>
      <footer className="bg-gray-900 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm">© 2025 Hemeroteca Digital. Todos los derechos reservados.</p>
        </div>
      </footer>
    </>
  );
}

function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const { navigate } = useNavigationTransition();

  

  const handleNavbarSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      navigate(`/Articulos?q=${encodeURIComponent(searchQuery)}`, true);
    }
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-700 border-b border-gray-300 fixed top-0 left-0 w-full z-50 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* Logo y navegación principal */}
        <div className="flex items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/default_periodico.jpg"
                alt="Logo"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="ml-3 text-white font-semibold text-lg hidden sm:block">
                Hemeroteca Digital
              </span>
            </Link>
          </div>

          {/* Enlaces de navegación (solo para usuarios autenticados) */}
          {session && (
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/"
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-800"
              >
                Home
              </Link>
              <Link
                href="/Articulos"
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-800"
              >
                Artículos
              </Link>
              <Link
                href="/sources"
                className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-800"
              >
                Fuentes
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="text-gray-200 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-blue-800"
                >
                  Users
                </Link>
              )}
            </nav>
          )}
        </div>

        {/* Búsqueda (solo para usuarios autenticados) */}
        {session && (
          <div className="flex-1 max-w-xl px-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleNavbarSearch}
                className="w-full bg-gray-100 text-gray-800 rounded-lg pl-10 pr-4 py-2 text-sm border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Buscar artículos..."
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* Menú móvil y AuthButton */}
        <div className="flex items-center">
          {/* Botón de menú móvil (solo para usuarios autenticados) */}
          {session && (
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            </button>
          )}

          {/* AuthButton (siempre visible) */}
          <div className="ml-4">
            <AuthButton />
          </div>
        </div>
      </div>
    </div>

    {/* Menú móvil (solo para usuarios autenticados) */}
    {session && (
      <div className="sm:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/Articulos"
            className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Artículos
          </Link>
          {isAdmin && (
            <Link
              href="/admin/users"
              className="text-gray-200 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Users
            </Link>
          )}
        </div>
      </div>
    )}
  </header>
  );
}