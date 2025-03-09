// middleware.ts
import { NextResponse } from 'next/server';
import NextAuth from "next-auth";
import authConfig from "./auth.config";

const { auth: middleware } = NextAuth(authConfig);

// Definición de rutas mejorada
const publicRoutes = new Set([
  "/",
  "/login",
  "/signup",
  "/acceso-denegado",
  "/api/auth/(.*)", // Expresión regular para todas las rutas de autenticación
  "/api/public/(.*)" // APIs públicas
]);

const adminRoutes = new Set([
  "/admin(.*)", // Todas las subrutas de admin
  "/api/admin(.*)" // APIs de administración
]);

const authRoutes = new Set(["/login", "/signup"]);

export default middleware(async (req) => {
  const { nextUrl, auth } = req;
  const pathname = nextUrl.pathname;
  const isLoggedIn = !!auth?.user;
  const isAdmin = auth?.user?.role === "admin";

  // 1. Verificar rutas públicas
  if (publicRoutes.has(pathname)) return NextResponse.next();

  // 2. Redirección para usuarios no autenticados
  if (!isLoggedIn) {
    const signInUrl = new URL("/login", nextUrl);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // 3. Verificación de rutas de administrador
  if (Array.from(adminRoutes).some(pattern => new RegExp(pattern).test(pathname))) {
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/acceso-denegado", nextUrl));
    }
    return NextResponse.next();
  }

  // 4. Redirección para usuarios autenticados en rutas de auth
  if (authRoutes.has(pathname)) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};