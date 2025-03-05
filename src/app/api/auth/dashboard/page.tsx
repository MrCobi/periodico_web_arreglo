"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import styled from "styled-components";
import { Source } from "@/src/interface/source";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();

  const [favoriteSources, setFavoriteSources] = useState<Source[]>([]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (session?.user?.id) {
        try {
          // Obtener los IDs de los periódicos favoritos
          const favoritesResponse = await fetch("/api/favorites/list");
          const favoritesData = await favoritesResponse.json();
          const favoriteIds = favoritesData.favoriteIds;
    
          // Obtener los detalles de los periódicos favoritos
          const detailsResponse = await fetch("/api/sources/details", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sourceIds: favoriteIds }), // Asegúrate de que el cuerpo sea un JSON válido
          });
    
          if (!detailsResponse.ok) {
            throw new Error("Error al obtener detalles de los periódicos");
          }
    
          const detailsData = await detailsResponse.json();
          setFavoriteSources(detailsData.sources || []);
        } catch (error) {
          console.error("Error al cargar favoritos:", error);
        }
      }
    };

    loadFavorites();
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const { user } = session;
  console.log("sesion",session);
  console.log("user",user);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <div className="max-w-[1280px] mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}

          <StyledWrapper>
            <label className="container mt-14">
              <input
                defaultChecked={true}
                type="checkbox"
                onChange={() => setIsOpen(!isOpen)}
              />
              <svg
                viewBox="0 0 320 512"
                height="1em"
                xmlns="http://www.w3.org/2000/svg"
                className="chevron-right fill-white"
              >
                <path d="M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" />
              </svg>
            </label>
          </StyledWrapper>
          <aside
            className={`transition-all duration-300 mt-4 ${
              isOpen ? "w-64" : "w-0"
            } overflow-hidden`}
          >
            {isOpen && (
              <nav className="bg-[#21262D] p-4 rounded-md space-y-2">
                <Link
                  href="/api/auth/dashboard"
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#30363D] rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zM5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
                  </svg>
                  Información General
                </Link>
                <Link
                  href={`/users/edit/${user.username}`}
                  className="flex items-center px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-[#30363D] rounded-md"
                >
                  <svg
                    className="w-5 h-5 mr-3"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                  </svg>
                  Editar perfil
                </Link>
              </nav>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-[#161B22] rounded-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Avatar Section */}
                <div className="md:w-1/4">
                  <div className="relative">
                    <Image
                      src={user?.image || "/images/AvatarPredeterminado.webp"}
                      alt={user?.name || "Avatar"}
                      width={260}
                      height={260}
                      className="rounded-full"
                    />
                    <button
                      className="mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-[#21262D] border border-gray-700 rounded-md hover:bg-[#30363D] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      onClick={() =>
                        router.push(`/users/edit/${user.username}`)
                      }
                    >
                      Editar foto de perfil
                    </button>
                  </div>
                </div>

                {/* User Info Section */}
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-4">
                    {user?.name || "Nombre del usuario"}
                  </h1>
                  <div className="text-gray-400 mb-6">
                    @{user?.username || "username"}
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z" />
                      </svg>
                      {user?.email || "email@example.com"}
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z" />
                      </svg>
                      {user?.role || "Usuario"}
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Periódicos favoritos
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteSources.map((source) => (
                        <div
                          key={source.id}
                          className="p-4 bg-[#21262D] rounded-lg border border-gray-700"
                        >
                          <h3 className="text-blue-400 font-medium mb-2">
                            {source.name}
                          </h3>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <StyledWrapper>
              <button
                className="Btn"
                onClick={() =>
                  signOut({ redirect: false }).then(() => {
                    router.push("/signin");
                  })
                }
              >
                <div className="sign">
                  <svg viewBox="0 0 512 512">
                    <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                  </svg>
                </div>
                <div className="text">Logout</div>
              </button>
            </StyledWrapper>
          </main>
        </div>
      </div>
    </div>
  );
}

const StyledWrapper = styled.div`
  /*------ Settings ------*/
  .container {
    --color: #a5a5b0;
    --size: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    cursor: pointer;
    font-size: var(--size);
    user-select: none;
    fill: var(--color);
  }

  .container .chevron-right {
    position: absolute;
    animation: keyframes-return 0.5s backwards;
  }

  /* ------ On check event ------ */
  .container input:checked ~ .chevron-right {
    animation: keyframes-rotate 0.5s backwards;
    transform: rotate(180deg);
  }

  /* ------ Hide the default checkbox ------ */
  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* ------ Animation ------ */
  @keyframes keyframes-rotate {
    0% {
      transform: rotate(0deg);
      opacity: 0;
    }

    100% {
      transform: rotate(180deg);
    }
  }

  @keyframes keyframes-return {
    0% {
      transform: rotate(180deg);
      opacity: 0;
    }

    100% {
      transform: rotate(0deg);
    }
  }
  .Btn {
    --black: #000000;
    --ch-black: #141414;
    --eer-black: #1b1b1b;
    --night-rider: #2e2e2e;
    --white: #ffffff;
    --af-white: #f3f3f3;
    --ch-white: #e1e1e1;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 45px;
    height: 45px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition-duration: 0.3s;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.199);
    background-color: var(--night-rider);
  }

  /* plus sign */
  .sign {
    width: 100%;
    transition-duration: 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .sign svg {
    width: 17px;
  }

  .sign svg path {
    fill: var(--af-white);
  }
  /* text */
  .text {
    position: absolute;
    right: 0%;
    width: 0%;
    opacity: 0;
    color: var(--af-white);
    font-size: 1.2em;
    font-weight: 600;
    transition-duration: 0.3s;
  }
  /* hover effect on button width */
  .Btn:hover {
    width: 125px;
    border-radius: 5px;
    transition-duration: 0.3s;
  }

  .Btn:hover .sign {
    width: 30%;
    transition-duration: 0.3s;
    padding-left: 20px;
  }
  /* hover effect button's text */
  .Btn:hover .text {
    opacity: 1;
    width: 70%;
    transition-duration: 0.3s;
    padding-right: 10px;
  }
  /* button click effect*/
  .Btn:active {
    transform: translate(2px, 2px);
  }
`;
