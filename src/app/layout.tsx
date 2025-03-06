// src/app/layout.tsx
import "./globals.css";
import Transitions from "./components/Animation/context";
import Animate from "./components/Animation/Animate";
import { SessionProvider } from "next-auth/react";
import ClientLayout from "./ClientLayout";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-gray-50 flex flex-col">
        <SessionProvider>
          <Transitions>
            <Animate>
            <ClientLayout>{children}</ClientLayout>
            </Animate>
          </Transitions>
        </SessionProvider>
      </body>
    </html>
  );
}