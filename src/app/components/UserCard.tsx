// components/UserCard.tsx
import { User } from "@prisma/client";

interface UserCardProps {
  user: Pick<User, "id" | "name" | "username" | "image"> & {
    bio?: string | null; // Hacer bio opcional y aceptar null
  };
  action?: React.ReactNode;
  variant?: string; // Añadir la propiedad variant
}

export function UserCard({ user, action, variant }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <img 
            src={user.image || "/default-avatar.png"} 
            alt={user.name || "Usuario"}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
            {user.bio && ( // Mostrar bio solo si existe
              <p className="text-sm text-gray-500 mt-1">{user.bio}</p>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {action}
        </div>
      </div>
    </div>
  );
}