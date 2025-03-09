// src/app/users/[username]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { User } from "@prisma/client";
import { Card, CardHeader, CardContent } from "@/src/app/components/ui/card";
import { Badge } from "@/src/app/components/ui/badge";
import { User2, Calendar, MessageSquare, Users, Activity, Heart } from "lucide-react";
import LoadingSpinner from "@/src/app/components/ui/LoadingSpinner";
import { Source } from "@/src/interface/source";
import Link from "next/link";

// Define the Activity type
type Activity = {
  id: string;
  type: string;
  createdAt: string;
  sourceName?: string;
  userName?: string;
};

export default function UserProfilePage() {
  const { username } = useParams();
  const { data: session } = useSession();
  const [userData, setUserData] = useState<{
    user: User & { stats: any };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Source[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [privacy, setPrivacy] = useState({
    showFavorites: true,
    showActivity: true
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(`/api/users/by-username/${username}`);
        const data = await response.json();
        
        if (!response.ok) throw new Error(data.error || "User not found");
        
        setUserData({
          user: {
            ...data,
            stats: data.stats
          }
        });
        setFavorites(data.favorites || []);
        setActivity(data.activity || []);
        setPrivacy(data.privacySettings || {
          showFavorites: true,
          showActivity: true
        });
      } catch (error) {
        console.error("Error loading profile:", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [username]);

  if (loading) return <LoadingSpinner />;

  if (!userData?.user) {
    return (
      <div className="container mx-auto p-4 text-center text-destructive">
        User not found
      </div>
    );
  }

  function renderActivityMessage(type: string, sourceName?: string, userName?: string) {
    const messages = {
      favorite_added: `Agregó ${sourceName || "un periódico"} a favoritos`,
      comment: `Comentó en ${sourceName || "un periódico"}`,
      follow: `Comenzó a seguir a ${userName || "un usuario"}`,
      unfollow: `Dejó de seguir a ${userName || "un usuario"}`,
      rating_added: `Calificó ${sourceName || "un periódico"}`,
      rating_removed: `Eliminó calificación de ${sourceName || "un periódico"}`,
      comment_reply: `Respondió un comentario en ${sourceName || "un periódico"}`,
    };
    
    return messages[type as keyof typeof messages] || "Realizó una acción";
  }

  const { user } = userData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 dark:from-gray-900 dark:via-blue-900/30 dark:to-blue-800/20">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-xl">
          <CardHeader>
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg">
                <Image
                  src={user.image || "/default-avatar.png"}
                  alt={user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  {user.name}
                </h1>
                <Badge className="mt-2 text-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  @{user.username}
                </Badge>
              </div>
            </div>
          </CardHeader>

          <CardContent>
        {/* Sección de Favoritos */}
        {privacy.showFavorites && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="h-5 w-5 mr-2 text-red-500" />
              Periódicos favoritos ({favorites.length})
            </h2>
            
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {favorites.map((source) => (
                  <Link 
                    href={`/sources/${source.id}`} 
                    key={source.id}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <h3 className="font-medium">{source.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {source.category}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {user.username} no tiene periódicos favoritos públicos
              </div>
            )}
          </div>
        )}

        {/* Sección de Actividad */}
        {privacy.showActivity && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              Actividad reciente
            </h2>
            
            {activity.length > 0 ? (
              <div className="space-y-3">
                {activity.map((act, index) => (
                  <div 
                    key={index}
                    className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <p className="text-sm">
                      {renderActivityMessage(act.type, act.sourceName, act.userName)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(act.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                {user.username} no tiene actividad pública
              </div>
            )}
          </div>
        )}
      </CardContent>
        </Card>
      </div>
    </div>
  );
}