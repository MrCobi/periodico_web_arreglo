"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useToast } from "@/src/app/components/ui/use-toast";
import { API_ROUTES } from "@/src/config/api-routes";

type FollowStatusResponse = {
  isFollowing: boolean;
  followerCount?: number;
};

export function FollowButton({
  targetUserId,
  isFollowing: initialFollowingStatus = false,
  onSuccess,
}: {
  targetUserId: string;
  isFollowing?: boolean;
  onSuccess?: (newStatus: boolean, serverFollowerCount?: number) => void;
}) {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(initialFollowingStatus);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    setIsFollowing(initialFollowingStatus);
  }, [initialFollowingStatus]);

  const handleFollow = async () => {
    if (!session) return;

    setIsUpdating(true);
    const originalState = isFollowing;

    try {
      // Actualización optimista solo del botón
      setIsFollowing(!originalState);

      const method = originalState ? "DELETE" : "POST";
      const url = originalState
        ? API_ROUTES.relationships.unfollow(targetUserId)
        : API_ROUTES.relationships.follow;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: method === "POST" 
          ? JSON.stringify({ followingId: targetUserId })
          : undefined,
      });

      if (!res.ok) throw new Error();

      const data: FollowStatusResponse = await res.json();
      
      // Actualización basada en respuesta del servidor
      onSuccess?.(data.isFollowing, data.followerCount);

      toast({
        title: data.isFollowing ? "¡Nuevo seguidor!" : "Dejaste de seguir",
        description: data.isFollowing
          ? "Ahora estás siguiendo a este usuario"
          : "Has dejado de seguir a este usuario",
      });
    } catch {
      // Revertir en caso de error
      setIsFollowing(originalState);
      onSuccess?.(originalState);
      toast({
        title: "Error",
        description: "No se pudo completar la acción",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (!session) {
    return (
      <Button asChild variant="ghost" className="gap-2">
        <Link href="/login">
          <UserPlus className="h-4 w-4" />
          Seguir
        </Link>
      </Button>
    );
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={isUpdating}
      variant={isFollowing ? "outline" : "default"}
      className="gap-2 transition-all"
      aria-live="polite"
    >
      {isUpdating ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isFollowing ? (
        <>
          <UserCheck className="h-4 w-4" />
          Siguiendo
        </>
      ) : (
        <>
          <UserPlus className="h-4 w-4" />
          Seguir
        </>
      )}
    </Button>
  );
}