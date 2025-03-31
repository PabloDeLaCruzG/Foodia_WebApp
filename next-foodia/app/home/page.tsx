"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi } from "../lib/data";
import { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";
import AsideSection from "../components/home/AsideSection";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { user } = useAuth();

  const fetchRecipes = useCallback(() => {
    if (user && user._id) {
      recipeApi
        .getRecipesByAuthor(user._id)
        .then((recipes: IRecipe[]) => {
          if (Array.isArray(recipes)) {
            setRecipes(recipes);
          } else {
            console.error("La respuesta de la API no es un array:", recipes);
            setRecipes([]);
          }
        })
        .catch((error) => {
          console.error("Error al obtener recetas:", error);
          setRecipes([]);
        });
    }
  }, [user]);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const openWizard = () => setShowWizard(true);
  const closeWizard = () => setShowWizard(false);

  return (
    <main className="h-[calc(100vh-64px)] flex">
      {/* Aside: se muestra en pantallas grandes */}
      <aside className="hidden lg:block w-64 p-4 py-6">
        <AsideSection onRecipeSave={fetchRecipes} />
      </aside>
      {/* Listado de recetas: contenedor scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Fila de botones "All" y "Search" */}
        <div className="flex items-center justify-between px-2 py-2 mb-4 border-b border-gray-200">
          <button className="flex items-center gap-2 text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-100">
            <span>All</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          <p className="text-gray-600 text-sm font-medium">Tus recetas</p>
          <button className="flex items-center gap-2 text-gray-600 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">
            <span>Search</span>
          </button>
        </div>
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] gap-4">
            <h2 className="text-2xl font-semibold">
              Aún no tienes recetas creadas
            </h2>
            <p className="text-gray-600 text-center max-w-md">
              ¿Sin ideas? Genera tu primera receta con IA y descubre nuevas
              creaciones culinarias.
            </p>
            <button
              onClick={openWizard}
              className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors"
            >
              <SparklesIcon className="w-5 h-5" />
              Crear nueva receta
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-evenly">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        )}
        {/* Botón flotante para abrir el Wizard */}
        <button
          className="fixed bottom-8 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
          onClick={openWizard}
        >
          <SparklesIcon className="w-6 h-6" />
        </button>
        {showWizard && <WizardModal onClose={closeWizard} />}
      </div>
    </main>
  );
}
