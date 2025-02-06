"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function ViewUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        setError("Usuario no encontrado");
      }
    }
    fetchUser();
  }, [id]);

  if (error) return <p className="text-center text-red-500 mt-10">{error}</p>;
  if (!user) return <p className="text-center mt-10">Cargando...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">Detalles del Usuario</h1>
      <p className="text-lg"><strong>Nombre:</strong> {user.name}</p>
      <p className="text-lg"><strong>Correo:</strong> {user.email}</p>
      <p className="text-lg"><strong>Rol:</strong> {user.role.name}</p>

      <div className="mt-5 space-x-2">
        <Link href="/admin/users" className="bg-gray-500 text-white px-4 py-2 rounded">Volver</Link>
        <Link href={`/admin/users/edit/${user.id}`} className="bg-yellow-500 text-white px-4 py-2 rounded">Editar</Link>
        <Link href={`/admin/users/delete/${user.id}`} className="bg-red-500 text-white px-4 py-2 rounded">Eliminar</Link>
      </div>
    </div>
  );
}
