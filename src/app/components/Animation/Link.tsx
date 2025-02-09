"use client";

import NextLink from "next/link";
import { ComponentProps } from "react";
import { useNavigationTransition } from "./context";
import { usePathname } from "next/navigation";

type Props = ComponentProps<typeof NextLink> & {
  animated?: boolean;
};

const Link = ({ animated = true, ...props }: Props) => {
  const routePath = usePathname();
  const { navigate } = useNavigationTransition();

  if (!animated) {
    return <NextLink {...props} />;
  }

  return (
    <NextLink
      {...props}
      onClick={(e) => {
        e.preventDefault();
        const href = e.currentTarget.getAttribute("href");
        if (href === routePath) return;
        if (href) navigate(href, animated); // Pasar estado de animación
      }}
    />
  );
};

export default Link;