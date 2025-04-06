"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import AuthForm from "./components/AuthForm";
import FeatureSection from "./components/FeatureSection";
import Image from "next/image";

export default function Landing() {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Barra de navegación */}
      <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
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
          <button
            onClick={() =>
              document
                .getElementById("auth-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="px-4 py-2 bg-orange-500 text-white rounded-md font-medium shadow-md hover:bg-orange-600 transition"
          >
            Accede
          </button>
        </div>
      </header>

      {/* Espacio para que el contenido no quede oculto tras la cabecera fija */}
      <div className="pt-20"></div>

      {/* Hero Section */}
      <section
        className="relative w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-hero.jpeg')" }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Contenido del hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-10 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          {/* Texto del Hero */}
          <div className="text-white max-w-lg md:flex-1">
            <h1 className="text-5xl font-bold leading-tight animate-fade-in">
              Crea recetas <span className="text-orange-500">únicas</span> con
              IA
            </h1>
            <p className="mt-4 text-lg text-gray-200 animate-fade-in delay-100">
              Foodia te ayuda a generar recetas personalizadas según tus
              preferencias y los ingredientes que tienes en casa.
            </p>
            <button className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-md text-lg font-semibold shadow-lg hover:bg-orange-600 transition animate-fade-in delay-200">
              Descubre más
            </button>
          </div>

          {/* Formulario de login/registro con fondo diferente */}
          <div
            id="auth-section"
            className="bg-white border p-6 rounded-3xl shadow-lg w-full max-w-md md:flex-1 animate-slide-in"
          >
            <GoogleOAuthProvider clientId={clientId}>
              <AuthForm />
            </GoogleOAuthProvider>
          </div>
        </div>
      </section>

      {/* Sección informativa */}
      <FeatureSection />
    </div>
  );
}
