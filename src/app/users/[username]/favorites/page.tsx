// src/app/users/[username]/favorites/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { Source } from "@/src/interface/source";
import SourcesPage from "@/src/app/components/SourceList";
import { Button } from "@/src/app/components/ui/button";
import { Star, ExternalLink, Heart, User } from "lucide-react";
import Link from "next/link";
import { API_ROUTES } from "@/src/config/api-routes";

interface Favorite {
  id: string;
  source: Source;
  userId: string;
  createdAt: string;
}

interface UserData {
  id: string;
  name: string;
  username: string;
}

export default function UserFavoritesPage() {
  const params = useParams();
  const username = params.username as string;
  
  const [favoriteSources, setFavoriteSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  const loadUserData = useCallback(async () => {
    try {
      const userResponse = await fetch(API_ROUTES.users.byUsername(username));
      
      if (!userResponse.ok) {
        throw new Error("Usuario no encontrado");
      }
      
      const userData: UserData = await userResponse.json();
      setUserData(userData);
      return userData.id;
    } catch (error) {
      setError("No se pudo encontrar al usuario");
      console.error("Error al cargar datos del usuario:", error);
      return null;
    }
  }, [username]);

  const loadFavorites = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const favoritesResponse = await fetch(API_ROUTES.favorites.user(userId, 1, 50));
      
      if (!favoritesResponse.ok) {
        const errorData: { error?: string } = await favoritesResponse.json();
        throw new Error(errorData.error || "Error al obtener favoritos");
      }
      
      const favoritesData: { favorites: Favorite[] } = await favoritesResponse.json();
      const sources = favoritesData.favorites.map((fav: Favorite) => fav.source);
      setFavoriteSources(sources || []);
    } catch (error: unknown) {
      console.error("Error al cargar favoritos:", error);
      setError(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = await loadUserData();
      if (userId) {
        await loadFavorites(userId);
      }
    };
    
    fetchData();
  }, [loadUserData, loadFavorites]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 bg-red-50 dark:bg-red-900/20 rounded-xl max-w-lg">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <Link href="/sources">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Explorar periódicos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Heart className="h-8 w-8 mr-2 text-red-500" />
            {userData ? (
              <span>Periódicos favoritos de {userData.name || username}</span>
            ) : (
              <span>Cargando información del usuario...</span>
            )}
          </h1>
          <div className="flex space-x-2">
            {userData && (
              <Link href={`/users/${username}`}>
                <Button variant="outline" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Perfil de {username}
                </Button>
              </Link>
            )}
            <Link href="/sources">
              <Button variant="outline" className="flex items-center">
                <ExternalLink className="h-4 w-4 ml-2" />
                Explorar periódicos
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-blue-600">Cargando favoritos...</p>
        </div>
      ) : favoriteSources.length === 0 ? (
        <div className="text-center py-12 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
          <Star className="h-16 w-16 mx-auto text-blue-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {userData?.name || username} no tiene periódicos favoritos
          </p>
          <Link href="/sources">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white transition-transform hover:scale-105">
              Explorar periódicos
            </Button>
          </Link>
        </div>
      ) : (
        <div>
          <SourcesPage
            sources={favoriteSources}
            showFilters={true}
            showPagination={true}
            isFavoritePage={false}
          />
        </div>
      )}
    </div>
  );
}