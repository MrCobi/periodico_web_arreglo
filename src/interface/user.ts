export interface User {
  id: string;
  name?: string | null;
  username?: string | null;
  password?: string | null;
  email?: string | null;
  emailVerified?: Date | null;
  image?: string | null;
  role: string;
  favoriteSourceIds?: string[]; // Solo los IDs de las fuentes favoritas
  createdAt: Date;
  updatedAt: Date;
}