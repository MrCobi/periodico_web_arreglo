// app/explore/page.tsx
import { auth } from "@/auth";
import prisma from "@/lib/db";
import { UserCard } from "@/src/app/components/UserCard";
import { FollowButton } from "@/src/app/components/FollowButton";

// app/explore/page.tsx
export default async function ExplorePage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  // Obtener usuarios desde la API
  const usersRes = await fetch(`/api/users/suggestions?userId=${currentUserId}`);
  if (!usersRes.ok) return <div>Error cargando usuarios</div>;
  const { data: users } = await usersRes.json();

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Descubrir Usuarios</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((user: any) => (
          <UserCard
            key={user.id}
            user={user}
            action={<FollowButton targetUserId={user.id} />}
          />
        ))}
      </div>
    </div>
  );
}
