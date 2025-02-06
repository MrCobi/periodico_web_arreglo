// src/app/admin/users/delete/[id]/page.tsx
"use client";
import { useRouter, useParams } from "next/navigation";

export default function DeleteUserPage() {
  const { id } = useParams();
  const router = useRouter();

  const handleDelete = async () => {
    const res = await fetch(`/api/users/delete/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      alert("Error al eliminar el usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 text-center">
      <h1 className="text-2xl font-bold mb-4">¿Seguro que deseas eliminar este usuario?</h1>
      <button onClick={handleDelete} className="bg-red-500 text-white px-4 py-2 mr-2">Eliminar</button>
      <button onClick={() => router.push("/admin/users")} className="bg-gray-500 text-white px-4 py-2">Cancelar</button>
    </div>
  );
}
