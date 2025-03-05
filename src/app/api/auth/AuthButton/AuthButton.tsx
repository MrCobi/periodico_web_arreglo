"use client";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "@mui/material";
import Link from "@/src/app/components/Animation/Link";
import React from "react";
import styled from "styled-components";
import Image from "next/image";

const AuthButton = () => {
  const { data: session } = useSession();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    signOut();
    handleClose();
  };

  if (session) {
    return (
      <div style={{ position: "relative" }}>
        <button
          onClick={handleMenu}
          className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <Image
                src={session.user?.image || "/images/AvatarPredeterminado.webp"}
                alt={session.user?.name || "Usuario"}
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-white">
                {session.user?.name || "Usuario"}
              </span>
              <span className="text-xs text-gray-200">
                {session.user?.email || ""}
              </span>
            </div>
            <svg
              className="w-4 h-4 text-gray-200 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </button>

        <Menu
          className="custom-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledWrapper>
            <div className="input">
              <Link
                href="/api/auth/dashboard"
                animated={false}
                passHref
                legacyBehavior
              >
                <button className="value" onClick={handleClose}>
                  <svg
                    viewBox="0 0 16 16"
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="Layer 2"
                  >
                    <path
                      fill="#7D8590"
                      d="m1.5 13v1a.5.5 0 0 0 .3379.4731 18.9718 18.9718 0 0 0 6.1621 1.0269 18.9629 18.9629 0 0 0 6.1621-1.0269.5.5 0 0 0 .3379-.4731v-1a6.5083 6.5083 0 0 0 -4.461-6.1676 3.5 3.5 0 1 0 -4.078 0 6.5083 6.5083 0 0 0 -4.461 6.1676zm4-9a2.5 2.5 0 1 1 2.5 2.5 2.5026 2.5026 0 0 1 -2.5-2.5zm2.5 3.5a5.5066 5.5066 0 0 1 5.5 5.5v.6392a18.08 18.08 0 0 1 -11 0v-.6392a5.5066 5.5066 0 0 1 5.5-5.5z"
                    />
                  </svg>
                  Perfil Público
                </button>
              </Link>

              <button className="value" onClick={handleSignOut}>
                <svg
                  fill="none"
                  viewBox="0 0 24 25"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    clipRule="evenodd"
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"
                    fill="#7D8590"
                    fillRule="evenodd"
                  />
                </svg>
                Cerrar Sesión
              </button>
            </div>
          </StyledWrapper>
        </Menu>
      </div>
    );
  }

  return (
    <div className="contenedor-botones">
      <StyledWrapper>
        <Link
          href="/api/auth/signin"
          animated={false}
          passHref
          legacyBehavior
        >
          <button className="boton-elegante">Iniciar Sesión</button>
        </Link>
        <Link
          href="/api/auth/signup"
          animated={false}
          passHref
          legacyBehavior
        >
          <button className="boton-elegante">Registrarse</button>
        </Link>
      </StyledWrapper>
    </div>
  );
};

const StyledWrapper = styled.div`
  .menu-appbar {
    background-color: #0d1117;
  }

  .input {
    display: flex;
    flex-direction: column;
    width: 200px;
    background-color: #0d1117;
    justify-content: center;
    border-radius: 5px;
  }

  .value {
    background-color: transparent;
    border: none;
    padding: 10px;
    color: white;
    display: flex;
    position: relative;
    gap: 5px;
    cursor: pointer;
    border-radius: 4px;
  }

  .value:not(:active):hover,
  .value:focus {
    background-color: #1e3a8a;
  }

  .value:focus,
  .value:active {
    background-color: #1e40af;
    outline: none;
  }

  .value::before {
    content: "";
    position: absolute;
    top: 5px;
    left: -10px;
    width: 5px;
    height: 80%;
    background-color: #3b82f6;
    border-radius: 5px;
    opacity: 0;
  }

  .value:focus::before,
  .value:active::before {
    opacity: 1;
  }

  .value svg {
    width: 15px;
  }

  .input:hover > :not(.value:hover) {
    transition: 300ms;
    filter: blur(1px);
    transform: scale(0.95, 0.95);
  }

  .contenedor-botones {
    display: flex;
    text-align: center;
    white-space: nowrap;
  }

  .boton-elegante {
    display: inline-block;
    padding: 10px 20px;
    border: 2px solid #3b82f6;
    background-color: #1e3a8a;
    color: #ffffff;
    font-size: 1rem;
    cursor: pointer;
    border-radius: 20px;
    transition: all 0.4s ease;
    outline: none;
    position: relative;
    overflow: hidden;
    font-weight: bold;
    margin: 5px;
  }

  .boton-elegante::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle,
      rgba(255, 255, 255, 0.25) 0%,
      rgba(255, 255, 255, 0) 70%
    );
    transform: scale(0);
    transition: transform 0.5s ease;
  }

  .boton-elegante:hover::after {
    transform: scale(4);
  }

  .boton-elegante:hover {
    border-color: #2563eb;
    background: #1e40af;
  }
`;

export default AuthButton;
