"use client";

import "../globals.css";
import { useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { authApi } from "../lib/data";
import { useRouter } from "next/navigation";
// icono configuracion
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/solid";
import Image from "next/image";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <AuthProvider>
        <InnerLayout
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          router={router}
        >
          {children}
        </InnerLayout>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

{
  /* La funcion se crea porque los hooks con contexto se tienen que llamar 
  en componentes que esten dentro del proveedor, Antes saltaba el error 
  "seAuth must be used within an AuthProvider" porque useAuth se renderizaba
  antes que el proveedor. Ahora al separar se garantice que useAuth se llame
  cuando ya ha sido envuelto por el proveedor */
}
function InnerLayout({
  children,
  dropdownOpen,
  setDropdownOpen,
  router,
}: {
  children: React.ReactNode;
  dropdownOpen: boolean;
  setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  router: ReturnType<typeof useRouter>;
}) {
  const { user } = useAuth();

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
    <div className="relative min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-3 flex items-center justify-between bg-white shadow-md">
        <div className="flex items-center gap-2">
          <Image
            src="/FoodwaiLogo.png"
            alt="Logo de FoodWai"
            width={50}
            height={50}
          />
          {/* <h1 className="text-2xl font-bold text-gray-900">FoodWai</h1> */}
          <Image
            src="/Foodwai.png"
            alt="Logo de FoodWai"
            width={100}
            height={50}
          />
        </div>
        <p className="ml-2 text-sm text-gray-500 hidden sm:block">
          Descubre y crea recetas con inteligencia artificial
        </p>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="p-2 flex items-center space-x-2"
          >
            <AdjustmentsHorizontalIcon className="w-6 h-6" />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full right-0 mt-2 z-50">
              <div className="relative">
                {/* Outer arrow for border */}
                <div className="absolute right-2 -top-2 w-4 h-4 bg-white transform rotate-45 border-t border-l border-gray-200"></div>
                <div className="max-w-64 min-w-52 bg-white border border-gray-200 rounded shadow-xl">
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:text-red-500 transition-colors"
                  >
                    Cerrar la sesión de {user?.name || user?.email}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="pt-16">{children}</div>
    </div>
  );
}
