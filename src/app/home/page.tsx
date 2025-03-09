"use client";

import { User } from "next-auth";
import { Card } from "@/src/app/components/ui/card";
import { UserCircle2, Users, Newspaper, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface UserStats {
  favoriteSources: number;
  followers: number;
  following: number;
}

interface UserWelcomeProps {
  stats?: UserStats;
}

function Home({ stats }: UserWelcomeProps) {
  const { data: session, status } = useSession();

  // Si no hay sesión, redirigir al usuario a la página de inicio de sesión
  if (status === "unauthenticated") {
    redirect("/api/auth/signin");
  }

  // Si la sesión está cargando, mostrar un mensaje de carga
  if (status === "loading") {
    return <div>Cargando...</div>;
  }

  // Si hay sesión, mostrar el contenido
  const user = session?.user;

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Bienvenido, {user?.name || "Usuario"}
            </h1>
            <p className="text-gray-600 mt-1">
              Explora las últimas noticias y mantente informado
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full md:w-auto">
            <StatCard
              icon={<Newspaper className="h-5 w-5 text-blue-600" />}
              label="Fuentes"
              value={stats?.favoriteSources || 0}
            />
            <StatCard
              icon={<Users className="h-5 w-5 text-green-600" />}
              label="Seguidores"
              value={stats?.followers || 0}
            />
            <StatCard
              icon={<UserCircle2 className="h-5 w-5 text-purple-600" />}
              label="Siguiendo"
              value={stats?.following || 0}
            />
            <StatCard
              icon={<Star className="h-5 w-5 text-yellow-600" />}
              label="Valoraciones"
              value={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="p-4 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
      {icon}
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </Card>
  );
}

export default Home;