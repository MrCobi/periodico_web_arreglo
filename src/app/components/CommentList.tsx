"use client";

import { useEffect, useState, useRef, useCallback, memo } from "react";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { es } from "date-fns/locale";
import { useSession } from "next-auth/react";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  userId: string;
  depth: number;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
  parent?: {
    user: {
      name: string;
    };
  };
  replies?: Comment[];
}

interface CommentListProps {
  sourceId: string;
  refreshKey?: number;
  onCommentsLoaded?: (count: number) => void;
}

// Memoizar el componente CommentItem para evitar rerenderizados innecesarios
const CommentItem = memo(
  ({
    comment,
    depth = 0,
    session,
    replyingTo,
    setReplyingTo,
    handleDelete,
    handleReply,
    replyContent,
    setReplyContent,
    textareaRef,
    visibleReplies,
    toggleReplyVisibility,
    isNewComment,
  }: {
    comment: Comment;
    depth?: number;
    session: any;
    replyingTo: { id: string; userName: string } | null;
    setReplyingTo: (value: { id: string; userName: string } | null) => void;
    handleDelete: (commentId: string) => void;
    handleReply: (commentId: string) => void;
    replyContent: string;
    setReplyContent: (value: string) => void;
    textareaRef: React.RefObject<HTMLTextAreaElement | null>;
    visibleReplies: Set<string>;
    toggleReplyVisibility: (commentId: string) => void;
    isNewComment: boolean;
  }) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const isVisible = isNewComment || visibleReplies.has(comment.id);

    return (
      <div className={`${depth > 0 ? "ml-8" : ""} mt-4 border-l-2 border-gray-100 pl-4 relative`}>
        <div className="bg-white p-4 rounded-lg shadow relative">
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
                  {comment.parent && (
                    <span className="text-sm text-gray-500">
                      (Respondiendo a {comment.parent.user.name})
                    </span>
                  )}
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
                {depth < 3 && (
                  <button
                    onClick={() => setReplyingTo({
                      id: comment.id,
                      userName: comment.user.name,
                    })}
                    className="text-blue-600 text-sm mt-2 hover:text-blue-800 flex items-center gap-1"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd" />
                    </svg>
                    Responder
                  </button>
                )}
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

          {replyingTo?.id === comment.id && (
            <div className="mt-4 ml-8">
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.707 3.293a1 1 0 010 1.414L5.414 7H11a7 7 0 017 7v2a1 1 0 11-2 0v-2a5 5 0 00-5-5H5.414l2.293 2.293a1 1 0 11-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Respondiendo a {replyingTo.userName}
              </div>
              <textarea
                ref={textareaRef}
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="w-full p-3 border-2 border-blue-100 rounded-lg mb-2 resize-none focus:border-blue-300 focus:ring-2 focus:ring-blue-200"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReply(comment.id)}
                  disabled={replyContent.trim().length < 3 || replyContent.trim().length > 500}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                >
                  Publicar respuesta
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        {hasReplies && (
          <button
            onClick={() => toggleReplyVisibility(comment.id)}
            className="text-blue-600 text-sm mt-2 hover:text-blue-800 flex items-center gap-1"
          >
            {isVisible ? "Ocultar respuestas" : "Mostrar respuestas"}
          </button>
        )}

        {isVisible &&
          comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              session={session}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              handleDelete={handleDelete}
              handleReply={handleReply}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              textareaRef={textareaRef}
              visibleReplies={visibleReplies}
              toggleReplyVisibility={toggleReplyVisibility}
              isNewComment={false}
            />
          ))}
      </div>
    );
  }
);

export default function CommentList({
  sourceId,
  refreshKey,
  onCommentsLoaded,
}: CommentListProps) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{
    id: string;
    userName: string;
  } | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [visibleReplies, setVisibleReplies] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Set<string>>(new Set());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments/list/${sourceId}?maxDepth=3`);
      if (!response.ok) throw new Error("Error al cargar comentarios");
      const { comments } = await response.json();

      setComments(comments || []);
      if (typeof onCommentsLoaded === 'function') {
        const countResponse = await fetch(`/api/comments/count/${sourceId}`);
        const { count } = await countResponse.json();
        onCommentsLoaded(count);
      }
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

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  const handleDelete = async (commentId: string) => {
    if (!confirm("¿Eliminar comentario permanentemente?")) return;

    try {
      const response = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar");
      await fetchComments();
    } catch (error) {
      console.error("Error eliminando comentario:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Error desconocido";
      setError(`Error al eliminar: ${errorMessage}`);
    }
  };

  const handleReply = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/replies`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: replyContent,
          sourceId,
        }),
      });

      if (!response.ok) throw new Error("Error al publicar respuesta");

      setReplyContent("");
      setReplyingTo(null);
      
      await fetchComments();
      if (typeof onCommentsLoaded === 'function') {
        const response = await fetch(`/api/comments/count/${sourceId}`);
        const { count } = await response.json();
        onCommentsLoaded(count);
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Error desconocido");
    }
  };

  const toggleReplyVisibility = (commentId: string) => {
    setVisibleReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
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
          <CommentItem
            key={comment.id}
            comment={comment}
            session={session}
            replyingTo={replyingTo}
            setReplyingTo={setReplyingTo}
            handleDelete={handleDelete}
            handleReply={handleReply}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            textareaRef={textareaRef}
            visibleReplies={visibleReplies}
            toggleReplyVisibility={toggleReplyVisibility}
            isNewComment={newComments.has(comment.id)}
          />
        ))
      )}
    </div>
  );
}