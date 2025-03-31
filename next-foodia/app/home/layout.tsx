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
}: {
  children: React.ReactNode;
}) {
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
          {/* Navbar fijo */}
          <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between bg-white shadow-md">
            <h4 className="font-bold text-2xl text-gray-900">
              Food With AI (FoodWai)
            </h4>
            <p className="ml-2 text-sm text-gray-500 hidden sm:block">
              Descubre y crea recetas con inteligencia artificial
            </p>
            <button onClick={() => setMenuOpen(true)} className="p-2">
              <Bars3Icon className="w-6 h-6 text-gray-900" />
            </button>
          </header>

          {/* Overlay y Sidebar (menú responsivo) */}
          {menuOpen && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-30 transition-opacity duration-300"
                onClick={() => setMenuOpen(false)}
              />
              <div
                className={`rounded-l-lg fixed right-0 top-0 h-full w-80 bg-white shadow-xl transform transition-all duration-500 ease-out ${
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

          {/* Contenedor principal: se deja un padding-top para no quedar tapado por el navbar */}
          <div className="pt-16">{children}</div>
        </div>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
