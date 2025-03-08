// src/interface/user.ts
export interface CustomUser {
  id: string;
  name?: string | null;
  username?: string | null;
  password?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: string;
  favoriteSourceIds?: string[];
  createdAt: Date;
  updatedAt: Date;
}