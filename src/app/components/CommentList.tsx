"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
}

interface CommentListProps {
  sourceId: string;
  refreshKey?: number;
  onCommentsLoaded?: (count: number) => void;
}

export default function CommentList({
  sourceId,
  refreshKey,
  onCommentsLoaded,
}: CommentListProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/list/${sourceId}`);
      if (!response.ok) throw new Error("Error al cargar comentarios");
      const { comments } = await response.json();

      setComments(comments || []);
      onCommentsLoaded?.(comments?.length || 0); // Actualizar contador
      setError(null);
    } catch (error) {
      console.error("Error:", error);
      setError("No se pudieron cargar los comentarios");
      setComments([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [sourceId, refreshKey]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("¿Eliminar comentario permanentemente?")) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");
      await fetchComments(); // Esto actualizará automáticamente el contador
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(`Error al eliminar: ${errorMessage}`);
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="text-center text-gray-500">Cargando comentarios...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : comments.length === 0 ? (
        <div className="text-gray-500 text-center">
          Sé el primero en comentar
        </div>
      ) : (
        comments.map((comment) => (
          <div key={comment.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4 flex-1">
                <Image
                  src={comment.user.image || "/default-avatar.png"}
                  alt={comment.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{comment.user.name}</h3>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(comment.createdAt), {
                        addSuffix: true,
                        locale: es,
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>

              {(comment.userId === session?.user?.id ||
                session?.user?.role === "admin") && (
                <button
                  aria-label="Eliminar comentario"
                  onClick={() => handleDelete(comment.id)}
                  className="text-red-500 hover:text-red-700 ml-4"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
