import type { Metadata } from "next";
import "./globals.css";
import Transitions from "./components/Animation/context";
import Animate from "./components/Animation/Animate";
import Link from "./components/Animation/Link";
import { Button } from "@mui/material";
import { SessionProvider } from "next-auth/react"; // Importa SessionProvider

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden flex flex-col">
        {/* Envuelve toda la aplicación con SessionProvider */}
        <SessionProvider>
          <Transitions>
            <header className="py-8 bg-black fixed top-0 left-0 w-full z-50 flex flex-col items-center">
              <nav className="container flex items-center ml-20">
                <Link className="mr-4 text-white" href="/">
                  Home
                </Link>
                <Link className="mr-4 text-white" href="/Articulos">
                  Artículos
                </Link>
                <Link className="mr-4 text-white" href="/api/auth/signin">
                  Login
                </Link>
                <Link className="mr-4 text-white" href="/api/auth/signup">
                  Sign up
                </Link>
                <Link className="mr-4 text-white" href="/admin/users">
                  Users
                </Link>
                <Link className="mr-4 text-white" href="/api/auth/dashboard">
                  Dashboard
                </Link>
                <Link className="mr-4 text-white" href="/admin">
                  Admin
                </Link>
              </nav>
            </header>
            <Animate>
              <main className="pt-20 mt-0">{children}</main>
            </Animate>
            <footer></footer>
          </Transitions>
        </SessionProvider>
      </body>
    </html>
  );
}