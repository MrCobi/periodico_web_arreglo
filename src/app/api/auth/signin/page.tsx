// src/app/api/auth/signin/page.tsx
"use client"; // Añade esta línea

import SigninForm from "./_components/signin-form";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div>
      <SigninForm isVerified={false} />
      {error === "auth_error" && (
        <p style={{ color: "red" }}>
          Credenciales inválidas. Verifique su email y contraseña.
        </p>
      )}
    </div>
  );
}