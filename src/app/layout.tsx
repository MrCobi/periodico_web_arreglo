"use client";
import type { Metadata } from "next";
import "./globals.css";
import { useRouter } from "next/navigation";
import Transitions from "./components/Animation/context";
import Animate from "./components/Animation/Animate";
import Link from "./components/Animation/Link";
import { SessionProvider, useSession } from "next-auth/react";
import AuthButton from "@/src/app/api/auth/AuthButton/AuthButton";
import Image from "next/image";
import { useState } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden flex flex-col">
        <SessionProvider>
          <Transitions>
            <Navbar />
            <Animate>
              <main className="mt-16">{children}</main>
            </Animate>
            <footer></footer>
          </Transitions>
        </SessionProvider>
      </body>
    </html>
  );
}

// Componente separado para la Navbar
function Navbar() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "admin";
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleNavbarSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      router.push(`/Articulos?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="bg-[#161B22] border-b border-[#30363D] fixed top-0 left-0 w-full z-50">
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

            {/* Enlaces de navegación */}
            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#21262C]"
              >
                Home
              </Link>
              <Link
                href="/Articulos"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#21262C]"
              >
                Artículos
              </Link>
              {isAdmin && (
                <Link
                  href="/admin/users"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-[#21262C]"
                >
                  Users
                </Link>
              )}
            </nav>
          </div>

          {/* Búsqueda */}
          <div className="flex-1 max-w-xl px-8 hidden md:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleNavbarSearch}
                className="w-full bg-[#0D1117] text-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm border border-[#30363D] focus:outline-none focus:border-[#58a6ff] focus:ring-1 focus:ring-[#58a6ff]"
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

          {/* Menú móvil y AuthButton */}
          <div className="flex items-center">
            {/* Botón de menú móvil */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-[#21262C] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
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

            {/* AuthButton */}
            <div className="ml-4">
              <AuthButton />
            </div>
          </div>
        </div>
      </div>

      {/* Menú móvil */}
      <div className="sm:hidden hidden">
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            href="/"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </Link>
          <Link
            href="/Articulos"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Artículos
          </Link>
          {isAdmin && (
            <Link
              href="/admin/users"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Users
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
