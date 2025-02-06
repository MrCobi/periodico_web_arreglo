// src/app/admin/users/create/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateUserPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/users/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/admin/users");
    } else {
      const data = await res.json();
      setError(data.error || "Error al crear el usuario");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Crear Usuario Admin</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="name" placeholder="Nombre" value={form.name} onChange={handleChange} className="w-full p-2 border" required />
        <input name="email" type="email" placeholder="Correo" value={form.email} onChange={handleChange} className="w-full p-2 border" required />
        <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} className="w-full p-2 border" required />
        <button type="submit" className="w-full bg-blue-500 text-white py-2">Crear</button>
      </form>
    </div>
  );
}
