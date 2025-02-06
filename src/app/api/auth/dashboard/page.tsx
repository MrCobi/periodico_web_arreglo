// src/app/(protected)/dashboard/page.tsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { Button } from "@mui/material";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status !== "loading" && !session) {
      console.log("Not authenticated");
      router.push("/api/auth/signin"); // Redirige solo después de la renderización
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Mostrar pantalla de carga mientras se obtiene la sesión
  }

  if (!session) {
    return null; // Evita renderizar contenido antes de la redirección
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <Button
        onClick={() =>
          signOut({ redirect: false }).then(() => {
            router.push("/signin"); // Redirige al login después del logout
          })
        }
      >
        Logout
      </Button>
    </div>
  );
}
