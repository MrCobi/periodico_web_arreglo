"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
  // Arreglo estático con los roles como string
  const roles = [
    { value: "user", label: "Usuario" },
    { value: "admin", label: "Admin" },
  ];
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUser() {
      const res = await fetch(`/api/users/${id}`);
      if (res.ok) {
        const data = await res.json();
        // Asegúrate de que el campo role sea el string correspondiente ("user" o "admin")
        setForm({ name: data.name, email: data.email, password: "", role: data.role });
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/users/edit/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
        <select name="role" value={form.role} onChange={handleChange} className="w-full p-2 border">
          {roles.map((role) => (
            <option key={role.value} value={role.value}>
              {role.label}
            </option>
          ))}
        </select>
        <button type="submit" className="w-full bg-blue-500 text-white py-2">
          Actualizar
        </button>
      </form>
    </div>
  );
}
