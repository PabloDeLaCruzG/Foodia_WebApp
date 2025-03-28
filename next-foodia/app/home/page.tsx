"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi } from "../lib/data";
import { useState, useEffect } from "react";
import RecipeCard from "../components/RecipeCard";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const { user } = useAuth();

  console.log("user: ", user);

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
    <main className="relative flex flex-col gap-6 px-6 py-4 w-full max-w-6xl mx-auto">
      <div className="flex items-center justify-between w-full">
        <button className="flex items-center gap-2 text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-100">
          <span>All</span>
          <ChevronDownIcon className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 text-gray-600 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">
          <span>Search</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-evenly w-full">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe._id} recipe={recipe} />
        ))}
      </div>

      {/* Botón flotante (FAB) - abre wizard */}
      <button
        className="fixed bottom-8 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        onClick={openWizard}
      >
        <SparklesIcon className="w-6 h-6" />
      </button>

      {/* Wizard Modal - se muestra según showWizard */}
      {showWizard && <WizardModal onClose={closeWizard} />}
    </main>
  );
}
