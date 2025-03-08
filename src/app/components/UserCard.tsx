// components/UserCard.tsx
import { User } from "@prisma/client";
import Image from 'next/image'; 

interface UserCardProps {
  user: Pick<User, "id" | "name" | "username" | "image"> & {
    bio?: string | null;
  };
  action?: React.ReactNode;
  variant?: string;
}

export function UserCard({ user, action }: UserCardProps) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={user.image || "/default-avatar.png"}
              alt={user.name || "Usuario"}
              width={48}
              height={48}
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-sm text-gray-600">@{user.username}</p>
            {user.bio && (
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