// app/home/page.tsx
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Redirigiendo a la página de inicio...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
      <h1 className="text-4xl font-bold text-blue-800 mb-8">
        Bienvenido, {session.user?.name || "Usuario"}
      </h1>
      <p className="text-lg text-gray-600">
        Esta es tu página principal. Aquí puedes ver tus noticias, artículos y más.
      </p>
    </div>
  );
}