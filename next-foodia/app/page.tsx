"use client"

//import Image from "next/image";
import AuthForm from "./components/AuthForm";
import FeatureSection from "./components/FeatureSection";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegación */}
      <header className="w-full fixed top-0 left-0 bg-white shadow-md z-50">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Foodia</h1>
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

      {/* Hero Section */}
      <section
        className="relative w-full h-[90vh] flex items-center justify-center bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/bg-hero.jpg')" }}
      >
        {/* Overlay oscuro */}
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>

        {/* Contenido del hero */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 lg:flex lg:items-center lg:justify-between">
          {/* Texto del Hero */}
          <div className="text-white max-w-lg">
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

          {/* Formulario de login/registro */}
          <div
            id="auth-section"
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mt-10 lg:mt-0 lg:w-auto animate-slide-in"
          >
            <AuthForm />
          </div>
        </div>
      </section>

      {/* Sección informativa */}
      <FeatureSection />
    </div>
  );
}
