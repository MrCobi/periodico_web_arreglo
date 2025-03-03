// components/StarRating.client.tsx
"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function StarRating({ sourceId }: { sourceId: string }) {
  const { data: session } = useSession();
  const [userRating, setUserRating] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(false);

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

  // Función para renderizar las estrellas con medias estrellas
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating); // Estrellas completas
    const partialStar = rating - fullStars; // Fracción de la media estrella

    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, index) => {
          if (index < fullStars) {
            // Estrella completa
            return (
              <button
                key={index}
                onClick={() => handleRate(index + 1)}
                disabled={!session || loading}
                className="text-2xl text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                ★
              </button>
            );
          } else if (index === fullStars && partialStar > 0) {
            // Media estrella
            return (
              <div key={index} className="relative">
                <button
                  onClick={() => handleRate(index + 1)}
                  disabled={!session || loading}
                  className="text-2xl text-gray-300 hover:text-yellow-300 transition-colors"
                >
                  ★
                </button>
                <div
                  className="absolute top-0 left-0 overflow-hidden"
                  style={{ width: `${partialStar * 100}%` }}
                >
                  <button
                    onClick={() => handleRate(index + 1)}
                    disabled={!session || loading}
                    className="text-2xl text-yellow-400 hover:text-yellow-300 transition-colors"
                  >
                    ★
                  </button>
                </div>
              </div>
            );
          } else {
            // Estrella vacía
            return (
              <button
                key={index}
                onClick={() => handleRate(index + 1)}
                disabled={!session || loading}
                className="text-2xl text-gray-300 hover:text-yellow-300 transition-colors"
              >
                ★
              </button>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Estrellas que muestran la media */}
      {renderStars(averageRating)}

      {/* Mostrar la valoración del usuario */}
      {session?.user?.id && userRating > 0 && (
        <div className="text-sm text-gray-100">
          Tu valoración: {userRating} estrellas
        </div>
      )}

      {/* Mostrar mensaje si el usuario no ha votado */}
      {session?.user?.id && userRating === 0 && (
        <div className="text-sm text-gray-100">
          Aún no has valorado esta fuente.
        </div>
      )}

      {/* Mostrar mensaje si el usuario no está autenticado */}
      {!session && (
        <p className="text-sm text-gray-300">Inicia sesión para valorar</p>
      )}
    </div>
  );
}