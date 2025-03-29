"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi } from "../lib/data";
import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";
import AsideSection from "../components/home/AsideSection";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user && user._id) {
      recipeApi
        .getRecipesByAuthor(user._id)
        .then((recipes: IRecipe[]) => {
          if (Array.isArray(recipes)) {
            setRecipes(recipes);
          } else {
            console.error("API response is not an array:", recipes);
            setRecipes([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching recipes:", error);
          setRecipes([]);
        });
    }
  }, [user]);

  const openWizard = () => {
    setShowWizard(true);
  };
  const closeWizard = () => {
    setShowWizard(false);
  };

  return (
    <main className="relative flex flex-col gap-6 py-4 w-full mx-auto">
      <div className="flex w-full">
        <aside className="hidden lg:block w-72 py-2 mr-4 rounded-md h-fit sticky top-24 self-start">
          <AsideSection />
        </aside>
        <div className="flex-1 flex flex-col gap-6">
          {/* Fila de botones All y Search */}
          <div className="flex items-center justify-between w-full px-2 py-2 border-b border-gray-200">
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
            <div className="flex flex-wrap gap-4 justify-evenly w-full">
              {recipes.map((recipe) => (
                <RecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          )}

          {/* Botón flotante (FAB) - abre wizard */}
          <button
            className="fixed bottom-8 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
            onClick={openWizard}
          >
            <SparklesIcon className="w-6 h-6" />
          </button>

          {showWizard && <WizardModal onClose={closeWizard} />}
        </div>
      </div>
    </main>
  );
}
