"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Loader2, UserCheck, UserPlus } from "lucide-react";
import { useToast } from "@/src/app/components/ui/use-toast";

type FollowStatusResponse = {
  isFollowing: boolean;
  followerCount?: number;
};

export function FollowButton({
  targetUserId,
  onSuccess, // <- Nueva prop añadida
}: {
  targetUserId: string;
  onSuccess?: () => void; // <- Definir como prop opcional
}) {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  const [isFollowing, setIsFollowing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkFollowStatus = useCallback(async () => {
    try {
      if (!session?.user?.id) return;

      const res = await fetch(`/api/follow/check?targetUserId=${targetUserId}`);
      if (!res.ok) throw new Error("Error checking follow status");

      const data: FollowStatusResponse = await res.json();
      setIsFollowing(data.isFollowing);
      if (data.followerCount !== undefined) {
        await update({ followerCount: data.followerCount });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo verificar el estado de seguimiento",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [session?.user?.id, targetUserId, toast, update]);

  useEffect(() => {
    checkFollowStatus();
  }, [checkFollowStatus]);

  const handleFollow = async () => {
    if (!session) return;

    setIsUpdating(true);
    const originalState = isFollowing;

    try {
      // Optimistic update
      setIsFollowing(!isFollowing);

      const method = originalState ? "DELETE" : "POST";
      const res = await fetch("/api/follow", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ followingId: targetUserId }),
      });

      if (!res.ok) throw new Error("Error updating follow status");

      const data: FollowStatusResponse = await res.json();
      await update({ followerCount: data.followerCount });

      toast({
        title: originalState ? "Dejaste de seguir" : "¡Nuevo seguidor!",
        description: originalState
          ? "Has dejado de seguir a este usuario"
          : "Ahora estás siguiendo a este usuario",
      });
      if (res.ok) {
        setIsFollowing(!isFollowing);
        onSuccess?.(); // <- Ejecutar callback después del éxito
      }
    } catch (error) {
      setIsFollowing(originalState);
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
      disabled={isLoading || isUpdating}
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
