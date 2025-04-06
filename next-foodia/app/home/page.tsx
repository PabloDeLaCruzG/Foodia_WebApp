"use client";

import { IRecipe } from "../lib/interfaces";
import { recipeApi, userApi } from "../lib/data";
import { useState, useEffect, useCallback } from "react";
import RecipeCard from "../components/RecipeCard";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/24/solid";
import WizardModal from "../components/WizardModal";
import { useAuth } from "../context/AuthContext";
import AsideSection from "../components/AsideSection";
import Image from "next/image";
import AdModal from "../components/AdModal";

export default function Home() {
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);

  const [dailyGenerationCount, setDailyGenerationCount] = useState<number>(3);
  const [rewardedGenerations, setRewardedGenerations] = useState<number>(0);

  const imageNumber = dailyGenerationCount + rewardedGenerations;
  

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

  const fetchGenerationsStatus = useCallback(() => {
    userApi
      .getDailyStatus()
      .then((data) => {
        // data = { dailyGenerationCount, rewardedGenerations, totalDisponibles... }
        setDailyGenerationCount(data.dailyGenerationCount);
        setRewardedGenerations(data.rewardedGenerations);
      })
      .catch((error) => {
        console.error("Error al obtener estado diario:", error);
      });
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  useEffect(() => {
    if (user && user._id) {
      fetchGenerationsStatus();
    }
  }, [user, fetchGenerationsStatus]);

  // Al pulsar el botón flotante:
  // 1) Actualizamos el status de créditos
  // 2) Comprobamos si hay créditos
  // 3) Si hay créditos, abrimos Wizard
  //    Si NO hay créditos, abrimos modal para ver anuncio
  const handleFloatingButtonClick = async () => {
    try {
      await fetchGenerationsStatus(); // nos aseguramos de tener datos actualizados

      const totalCredits = dailyGenerationCount + rewardedGenerations;
      if (totalCredits > 0) {
        // Sí hay créditos
        setShowWizard(true);
      } else {
        // No hay créditos
        setShowAdModal(true);
      }
    } catch (error) {
      console.error("Error checking credits:", error);
    }
  };

  const closeWizard = () => setShowWizard(false);

  // Cerrar el modal de anuncio
  const closeAdModal = () => setShowAdModal(false);

  // Función para cuando terminen de ver el anuncio
  // => Llamamos al backend, sumamos +1, refrescamos estado y abrimos wizard
  const handleWatchAd = async () => {
    try {
      await userApi.watchAdReward(); // esto da +1
      await fetchGenerationsStatus(); // recargamos para ver la nueva cifra de créditos
      setShowAdModal(false); // cerramos modal de anuncio
      setShowWizard(true); // ahora sí abrimos wizard
    } catch (error) {
      console.error("Error al otorgar recompensa:", error);
    }
  };

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
          <button disabled className="flex items-center gap-2 text-gray-800 font-medium px-3 py-1 rounded-md hover:bg-gray-100">
            <span>All</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>
          <p className="text-gray-600 text-sm font-medium">Tus recetas</p>
          <button disabled className="flex items-center gap-2 text-gray-600 bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300">
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
              onClick={handleFloatingButtonClick}
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
          onClick={handleFloatingButtonClick}
        >
          <Image
            src={`/${imageNumber}off.webp`}
            alt="Wizard"
            width={40}
            height={40}
          />
        </button>

        {showWizard && <WizardModal onClose={closeWizard} />}

        {showAdModal && (
          <AdModal onClose={closeAdModal} onWatchAd={handleWatchAd} />
        )}
      </div>
    </main>
  );
}
