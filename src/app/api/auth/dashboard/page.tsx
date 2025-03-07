"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Source } from "@/src/interface/source";
import { Button } from "@/components/ui/button";
import { Card } from "@/src/app/components/ui/card";
import { LogOut, ChevronRight, Mail, User2, Newspaper, Settings, Home } from "lucide-react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const [favoriteSources, setFavoriteSources] = useState<Source[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (session?.user?.id) {
        try {
          const favoritesResponse = await fetch("/api/favorites/list");
          const favoritesData = await favoritesResponse.json();
          const favoriteIds = favoritesData.favoriteIds;

          const detailsResponse = await fetch("/api/sources/details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sourceIds: favoriteIds }),
          });

          if (!detailsResponse.ok) {
            throw new Error("Error al obtener detalles de los periódicos");
          }

          const detailsData = await detailsResponse.json();
          setFavoriteSources(detailsData.sources || []);
        } catch (error) {
          console.error("Error al cargar favoritos:", error);
        }
      }
    };
    loadFavorites();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;

  const menuItems = [
    { icon: Home, label: "Información General", href: "/api/auth/dashboard", active: true },
    { icon: Settings, label: "Editar perfil", href: `/users/edit/${user.username}`, active: false },
    { icon: Newspaper, label: "Mis Periódicos", href: "/newspapers", active: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-200/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-blue-100/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className={`transition-all duration-300 ${isOpen ? "lg:w-64" : "lg:w-20"} bg-white/70 backdrop-blur-lg rounded-2xl p-4 shadow-lg hidden lg:block`}>
            <div className="flex justify-end mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="text-gray-600 hover:bg-white/50"
              >
                <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </div>
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? "bg-blue-600 text-white"
                      : "text-gray-600 hover:bg-white/50"
                  } ${!isOpen ? "justify-center" : ""}`}
                >
                  <item.icon className="h-5 w-5" />
                  {isOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Mobile Navigation */}
          <div className="lg:hidden flex justify-between items-center mb-6 bg-white/70 backdrop-blur-lg rounded-xl p-4 shadow-lg">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:bg-white/50"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </Button>
          </div>

          {/* Main Content */}
          <main className="flex-1 space-y-6">
            <Card className="bg-white/70 backdrop-blur-lg shadow-lg border-0">
              <div className="p-6">
                <div className="flex flex-col md:flex-row gap-8">
                  {/* Avatar Section */}
                  <div className="md:w-1/4 max-w-[300px]">
                    <div className="relative group">
                      <div className="relative rounded-2xl overflow-hidden w-full aspect-square max-w-[300px]">
                        <Image
                          src={user?.image || "/images/AvatarPredeterminado.webp"}
                          alt={user?.name || "Avatar"}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <Button
                        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
                        onClick={() => router.push(`/users/edit/${user.username}`)}
                      >
                        Editar foto de perfil
                      </Button>
                    </div>
                  </div>

                  {/* User Info Section */}
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {user?.name || "Nombre del usuario"}
                    </h1>
                    <div className="text-blue-600 mb-6">@{user?.username || "username"}</div>

                    <div className="grid gap-4">
                      <div className="flex items-center text-gray-700 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                        <Mail className="h-5 w-5 mr-3 text-blue-600" />
                        {user?.email || "email@example.com"}
                      </div>
                      <div className="flex items-center text-gray-700 bg-white/50 backdrop-blur-sm rounded-lg p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
                        <User2 className="h-5 w-5 mr-3 text-blue-600" />
                        {user?.role || "Usuario"}
                      </div>
                    </div>

                    {/* Favorites Section */}
                    <div className="mt-8">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center">
                        <Newspaper className="h-6 w-6 mr-2 text-blue-600" />
                        Periódicos favoritos
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {favoriteSources.map((source) => (
                          <div
                            key={source.id}
                            className="p-4 bg-white/50 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border border-white/20"
                          >
                            <h3 className="text-blue-600 font-medium mb-2">
                              {source.name}
                            </h3>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Logout Button */}
            <Button
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
              onClick={() => signOut({ redirect: false }).then(() => router.push("/signin"))}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Cerrar sesión
            </Button>
          </main>
        </div>
      </div>
    </div>
  );
}