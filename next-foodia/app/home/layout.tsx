"use client";

import "../globals.css";
import { useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import { AuthProvider } from "../context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { authApi } from "../lib/data";
import { useRouter } from "next/navigation";

export default function HomeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [menuOpen, setMenuOpen] = useState(false);

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  const router = useRouter();
  const handleLogout = async () => {
    try {
      await authApi.logoutUser();
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      router.push("/");
    }
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <div className="relative min-h-screen">
          {/* Navbar */}
          <div className="px-4 py-2 text-center flex justify-between border-b border-gray-200">
            <h4 className="font-bold text-2xl text-gray-900">
              Food With AI (FoodWai)
            </h4>

            {/* Botón para abrir el menú */}
            <button onClick={() => setMenuOpen(true)} className="p-2">
              <Bars3Icon className="w-6 h-6 text-gray-900" />
            </button>
          </div>

          {/* Overlay y Sidebar */}
          {menuOpen && (
            <>
              {/* Overlay con oscurecimiento sutil */}
              <div
                className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300"
                onClick={() => setMenuOpen(false)}
              />

              {/* Sidebar */}
              <div
                className={`rounded-tl-lg rounded-bl-lg fixed right-0 top-0 h-full w-80 bg-[#F9FAFB] shadow-xl transform transition-all duration-500 ease-out ${
                  menuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-full opacity-0"
                } z-50`}
              >
                <div className="p-4 border-b flex justify-between items-center">
                  <h4 className="font-bold text-lg text-gray-900">
                    Nombre de usuario
                  </h4>
                  <button onClick={() => setMenuOpen(false)}>
                    <XMarkIcon className="w-6 h-6 text-gray-900" />
                  </button>
                </div>

                <ul className="p-4 space-y-2">
                  <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
                    Inicio
                  </li>
                  <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
                    Recetas
                  </li>
                  <li className="text-gray-700 hover:text-gray-900 cursor-pointer">
                    Perfil
                  </li>
                  <li
                    className="text-gray-700 hover:text-gray-900 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Cerrar Sesión
                  </li>
                </ul>
              </div>
            </>
          )}

          {/* Contenido principal */}
          <div
            className={`grid grid-cols-[auto] ${
              menuOpen ? "brightness-75 pointer-events-none" : ""
            }`}
          >
            {children}
          </div>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
