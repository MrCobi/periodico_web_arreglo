"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { User } from "@/src/interface/user";

export default function EditUserPage() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const params = useParams();
  const username = params.username as string; // Obtiene el username de la URL
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  useEffect(() => {
    if (status === "loading") return;


    if (!session || !session.user) {
      setError("Usuario no autenticado");
      setLoading(false);
      return;
    }

    if (session.user.username !== username) {
      setError("No tienes permisos para editar este usuario");
      setLoading(false);
      return;
    }

    setUser(session.user as User);
    setFormData({
      name: session.user.name || "",
      email: session.user.email || "",
      role: session.user.role || "user",
      password: "",
    });
    setLoading(false);
  }, [session, status, username]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      // Realiza la solicitud PUT para actualizar el usuario
      const response = await fetch(`/api/users/edit/${session?.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          password: formData.password || undefined,
        }),
      });
  
      if (!response.ok) throw new Error("Error actualizando usuario");
  
      // Actualiza la sesión con los nuevos datos
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
          role: formData.role,
        },
      });
  
      // Redirige al dashboard
      router.push("/api/auth/dashboard");
    } catch (err) {
      setError("Error al guardar cambios");
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>Usuario no encontrado</div>;

  return (
    <div className="min-h-screen bg-[#0D1117] p-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/api/auth/dashboard"
          className="text-gray-400 hover:text-white mb-4 inline-block"
        >
          ← Volver al dashboard
        </Link>

        <h1 className="text-2xl font-bold text-white mb-6">
          Editar perfil de @{username}
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-[#161B22] p-6 rounded-lg"
        >
          {error && <div className="text-red-500 mb-4">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Rol
            </label>
            <input
              type="text"
              value={formData.role}
              readOnly
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nueva contraseña (dejar en blanco para no cambiar)
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-[#0D1117] border border-gray-700 rounded-md text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar cambios
          </button>
        </form>
      </div>
    </div>
  );
}
