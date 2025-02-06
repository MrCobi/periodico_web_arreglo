// src/app/admin/users/update/[id]/page.tsx

"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", roleId: 2 });
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({ name: data.name, email: data.email, password: "", roleId: data.roleId });
      }
    }

    async function fetchRoles() {
      
      const res = await fetch("/api/roles");
      if (res.ok) {
        const data = await res.json();
        setRoles(data);
      }
    }

    fetchUser();
    fetchRoles();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const dataToSend = {
      ...form,
      roleId: Number(form.roleId), // Asegúrate de que roleId sea un número
    };

    const res = await fetch(`/api/users/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataToSend),
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      const data = await res.json();
      setError(data.error || "Error al actualizar el usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full p-2 border" required />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-2 border" required />
        <input name="password" type="password" placeholder="Nueva Contraseña (Opcional)" value={form.password} onChange={handleChange} className="w-full p-2 border" />
        <select name="roleId" value={form.roleId} onChange={handleChange} className="w-full p-2 border">
          {roles.map((role: any) => (
            <option key={role.id} value={role.id}>{role.name}</option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2">Actualizar</button>
      </form>
    </div>
  );
}
