"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";

export default function CommentForm({ sourceId, onCommentAdded }: {
  sourceId: string;
  onCommentAdded: () => void;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, sourceId }),
      });

      if (!response.ok) {
        throw new Error("Error al publicar comentario");
      }

      setContent("");
      onCommentAdded();
      
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Escribe tu comentario..."
        className="w-full p-4 border rounded-lg mb-2 resize-none"
        rows={3}
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {isSubmitting ? "Publicando..." : "Publicar comentario"}
      </button>
    </form>
  );
}