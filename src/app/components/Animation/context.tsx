// context.tsx
"use client";

import { useRouter } from "next/navigation";
import { PropsWithChildren, createContext, use, useTransition, useState } from "react";
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

export default function Transitions({ children }: PropsWithChildren) {
  const [pending, start] = useTransition();
  const [isAnimated, setIsAnimated] = useState(true);
  const router = useRouter();

  const navigate = (href: string, animated = true) => {
    // Actualización síncrona del estado
    flushSync(() => {
      setIsAnimated(animated);
    });

    if (!animated) {
      router.push(href);
      return;
    }

    start(async () => {
      await Promise.all([router.push(href), sleep(DELAY)]);
    });
  };

  return (
    <Context.Provider value={{ pending, isAnimated, navigate }}>
      {children}
    </Context.Provider>
  );
}