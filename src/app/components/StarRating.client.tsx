// components/StarRating.client.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function StarRating({ sourceId }: { sourceId: string }) {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Obtener la valoración del usuario y la media
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        // Obtener valoración del usuario
        if (session?.user?.id) {
          const userRes = await fetch(
            `/api/sources/ratings?sourceId=${sourceId}`
          );
          if (!userRes.ok) {
            throw new Error("Error al obtener la valoración del usuario");
          }
          const userData = await userRes.json();
          setUserRating(userData.rating || 0);
        }

        // Obtener media de valoraciones
        const avgRes = await fetch(
          `/api/sources/ratings/average?sourceId=${sourceId}`
        );
        if (!avgRes.ok) {
          throw new Error("Error al obtener la media de valoraciones");
        }
        const avgData = await avgRes.json();
        setAverageRating(avgData.average);
      } catch (error) {
        console.error("Error fetching ratings:", error);
      }
    };

    fetchRatings();
  }, [sourceId, session]);

  const handleRate = async (value: number) => {
    if (!session?.user?.id || loading) return;

    try {
      setLoading(true);
      const response = await fetch("/api/sources/ratings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceId, value }),
      });

      if (!response.ok) {
        throw new Error("Error al guardar la valoración");
      }

      setUserRating(value);
      // Actualizar media después de votar
      const avgRes = await fetch(
        `/api/sources/ratings/average?sourceId=${sourceId}`
      );
      if (!avgRes.ok) {
        throw new Error("Error al obtener la media actualizada");
      }
      const avgData = await avgRes.json();
      setAverageRating(avgData.average);
    } catch (error) {
      console.error("Rating error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar las estrellas con medias estrellas (solo para visualización)
  const renderAverageRating = () => {
    const fullStars = Math.floor(averageRating);
    const partialStar = averageRating - fullStars;

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            // Estrella completa
            return (
              <span key={index} className="text-2xl text-yellow-400">★</span>
            );
          } else if (index === fullStars && partialStar > 0) {
            // Media estrella
            return (
              <div key={index} className="relative text-2xl">
                <span className="text-gray-300">★</span>
                <div
                  className="absolute top-0 left-0 overflow-hidden text-yellow-400"
                  style={{ width: `${partialStar * 100}%` }}
                >
                  ★
                </div>
              </div>
            );
          } else {
            // Estrella vacía
            return (
              <span key={index} className="text-2xl text-gray-300">★</span>
            );
          }
        })}
      </div>
    );
  };

  // Función para renderizar las estrellas interactivas para el usuario
  const renderUserRatingStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1;
          const filled = ratingValue <= (hoverRating || userRating);
          
          return (
            <button
              key={index}
              onClick={() => handleRate(ratingValue)}
              onMouseEnter={() => setHoverRating(ratingValue)}
              onMouseLeave={() => setHoverRating(0)}
              disabled={!session || loading}
              className={`text-2xl transition-all duration-200 ${
                filled 
                  ? "text-yellow-400 scale-110" 
                  : "text-gray-300 hover:text-yellow-300"
              }`}
              aria-label={`Valorar con ${ratingValue} ${ratingValue === 1 ? 'estrella' : 'estrellas'}`}
            >
              ★
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Sección de valoración media */}
      <div className="bg-blue-800/50 p-3 rounded-lg backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {renderAverageRating()}
          <span className="text-white font-medium">
            {averageRating ? averageRating.toFixed(1) : "0.0"}
          </span>
        </div>
        <p className="text-xs text-gray-200 mt-1">Valoración media</p>
      </div>

      {/* Sección de valoración del usuario */}
      <div className="bg-blue-800/30 p-3 rounded-lg backdrop-blur-sm">
        {session ? (
          <>
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm text-white font-medium">Tu valoración</p>
              {userRating > 0 && (
                <span className="text-sm text-yellow-300 font-bold">
                  {userRating} {userRating === 1 ? "estrella" : "estrellas"}
                </span>
              )}
            </div>
            {renderUserRatingStars()}
          </>
        ) : (
          <div className="flex items-center justify-center py-1">
            <p className="text-sm text-gray-300">
              <span className="inline-block mr-2">🔒</span>
              Inicia sesión para valorar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}