"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { UserCard } from "@/src/app/components/UserCard";
import { FollowButton } from "@/src/app/components/FollowButton";
import { Skeleton } from "@/src/app/components/ui/skeleton";
import { useToast } from "@/src/app/components/ui/use-toast";

export default function ExploreClient() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/users/suggestions", {
        headers: {
          Authorization: `Bearer ${session?.user?.id}`
        }
      });

      if (!response.ok) throw new Error("Error al cargar sugerencias");
      
      const { data } = await response.json();
      setUsers(data);
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setError("Error al cargar usuarios sugeridos");
      toast({
        title: "Error",
        description: "No se pudieron cargar las sugerencias",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id, toast]);

  useEffect(() => {
    if (session) loadSuggestions();
  }, [session, loadSuggestions]);

  const handleFollowUpdate = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
    toast({
      title: "¡Listo!",
      description: "Relación actualizada correctamente"
    });
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Descubrir Usuarios</h1>
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay usuarios sugeridos disponibles</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              action={
                <FollowButton 
                  targetUserId={user.id}
                  onSuccess={() => handleFollowUpdate(user.id)}
                />
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}