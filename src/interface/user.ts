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

// src/interface/user.ts
export interface User {
  id: string; // Identificador único del usuario
  name?: string | null; // Nombre completo del usuario (opcional)
  email?: string | null; // Correo electrónico del usuario (opcional)
  image?: string | null; // URL de la imagen de perfil del usuario (opcional)
  username?: string | null; // Nombre de usuario (opcional)
  role: string; // Rol del usuario (por ejemplo, "user" o "admin")
  createdAt?: Date | string; // Fecha de creación del usuario (opcional)
  updatedAt?: Date | string; // Fecha de última actualización del usuario (opcional)
  favoriteSourceIds?: string[]; // IDs de fuentes favoritas del usuario (opcional)
}