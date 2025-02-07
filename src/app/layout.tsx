import type { Metadata } from "next";
import "./globals.css";
import Transitions from "./components/Animation/context";
import Animate from "./components/Animation/Animate";
import Link from "./components/Animation/Link";
import { SessionProvider } from "next-auth/react";
import AuthButton from "@/src/app/api/auth/AuthButton/AuthButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-dvh overflow-x-hidden flex flex-col">
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
                <AuthButton />
                <Link className="mr-4 text-white" href="/admin/users">
                  Users
                </Link>
                <Link className="mr-4 text-white" href="/api/auth/dashboard">
                  Dashboard
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