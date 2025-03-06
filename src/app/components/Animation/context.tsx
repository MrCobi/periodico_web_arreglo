// context.tsx
"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, use, useTransition, useState, useEffect } from "react";
import { flushSync } from "react-dom"; // Importar flushSync

export const DELAY = 400;

const sleep = (ms: number) => 
  new Promise<void>((resolve) => setTimeout(resolve, ms));

type TransitionContext = {
  pending: boolean;
  isAnimated: boolean;
  navigate: (url: string, animated?: boolean) => void;
};

const Context = createContext<TransitionContext>({
  pending: false,
  isAnimated: true,
  navigate: () => {}
});

export const useNavigationTransition = () => use(Context);

// context.tsx
export default function Transitions({ children }: PropsWithChildren) {
  const [pending, start] = useTransition();
  const [isAnimated, setIsAnimated] = useState(true);
  const router = useRouter();
  // Lista centralizada de rutas no animadas
  const nonAnimatedPaths = ['/dashboard', '/auth/login', '/auth/register', '/api/auth/signin', '/api/auth/signup'];

  const navigate = (href: string, animated = true) => {
    const path = new URL(href, window.location.origin).pathname;
    const shouldAnimate = animated && !nonAnimatedPaths.includes(path);
    
    flushSync(() => setIsAnimated(shouldAnimate));

    start(async () => {
      await Promise.all([router.push(href), sleep(shouldAnimate ? DELAY : 0)]);
    });
  };

  useEffect(() => {
    const path = window.location.pathname;
    setIsAnimated(!nonAnimatedPaths.includes(path));
  }, []); // Añadir nonAnimatedPaths como dependencia si es dinámico

  return (
    <Context.Provider value={{ pending, isAnimated, navigate }}>
      {children}
    </Context.Provider>
  );
}