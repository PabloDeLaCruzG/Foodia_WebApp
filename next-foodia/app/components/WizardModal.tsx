import React, { useRef, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

import StepOne from "./steps/StepOne";
import StepTwo from "./steps/StepTwo";
import StepThree from "./steps/StepThree";
import StepFour from "./steps/StepFour";
import StepIndicator from "./steps/StepIndicator";
import { recipeApi } from "../lib/data";
import { GenerateRecipeBody } from "../lib/interfaces";

interface WizardModalProps {
  onClose: () => void;
}

export default function WizardModal({ onClose }: WizardModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const scrollableRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Paso 1
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [dietRestrictions, setDietRestrictions] = useState<string[]>([]);
  const [extraAllergens, setExtraAllergens] = useState("");

  // Paso 2
  const [ingredientsToInclude, setIngredientsToInclude] = useState<string[]>(
    []
  );
  const [ingredientsToExclude, setIngredientsToExclude] = useState<string[]>(
    []
  );

  // Paso 3
  const [time, setTime] = useState("medium");
  const [difficulty, setDifficulty] = useState("basic");
  const [cost, setCost] = useState("low");
  const [servings, setServings] = useState(2);

  // Paso 4
  const [purpose, setPurpose] = useState("");
  const [extraDetails, setExtraDetails] = useState("");

  // Navegación
  const goNext = () => {
    setCurrentStep((prev) => {
      const next = prev + 1;
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return next;
    });
  };

  const goBack = () => {
    setCurrentStep((prev) => {
      const back = prev - 1;
      if (scrollableRef.current) {
        scrollableRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
      return back;
    });
  };

  const handleGenerateRecipe = async () => {
    setIsLoading(true); // Inicio de la carga

    const userPreferences: GenerateRecipeBody = {
      selectedCuisines,
      dietRestrictions,
      extraAllergens,
      ingredientsToInclude,
      ingredientsToExclude,
      time,
      difficulty,
      cost,
      servings,
      purpose,
      extraDetails,
    };

    try {
      const generatedRecipe = await recipeApi.generateRecipe(userPreferences);

      router.push(`/home/${generatedRecipe.recipe._id}`);

      // Cerramos el modal
      onClose();
    } catch (error) {
      console.error("Error generating recipe:", error);
      // Maneja el error si quieres mostrar un mensaje
    } finally {
      setIsLoading(false); // Fin de la carga
    }
  };

  const canGoBack = currentStep > 1;
  const canGoNext = currentStep < 4;

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <StepOne
            selectedCuisines={selectedCuisines}
            setSelectedCuisines={setSelectedCuisines}
            dietRestrictions={dietRestrictions}
            setDietRestrictions={setDietRestrictions}
          />
        );
      case 2:
        return (
          <StepTwo
            ingredientsToInclude={ingredientsToInclude}
            setIngredientsToInclude={setIngredientsToInclude}
            ingredientsToExclude={ingredientsToExclude}
            setIngredientsToExclude={setIngredientsToExclude}
            extraAllergens={extraAllergens}
            setExtraAllergens={setExtraAllergens}
          />
        );
      case 3:
        return (
          <StepThree
            time={time}
            setTime={setTime}
            difficulty={difficulty}
            setDifficulty={setDifficulty}
            cost={cost}
            setCost={setCost}
            servings={servings}
            setServings={setServings}
          />
        );
      case 4:
        return (
          <StepFour
            purpose={purpose}
            setPurpose={setPurpose}
            extraDetails={extraDetails}
            setExtraDetails={setExtraDetails}
            selectedCuisines={selectedCuisines}
            dietRestrictions={dietRestrictions}
            extraAllergens={extraAllergens}
            ingredientsToInclude={ingredientsToInclude}
            ingredientsToExclude={ingredientsToExclude}
            time={time}
            difficulty={difficulty}
            cost={cost}
            servings={servings}
          />
        );
      default:
        return null;
    }
  };

  const stepLabels = ["Cocina & dieta", "Ingredientes", "Detalles", "Resumen"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4 text-gray-900">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-xl relative overflow-hidden">
        {/* Contenedor scrollable */}
        <div
          ref={scrollableRef}
          className="max-h-[90vh] overflow-y-auto px-6 py-8"
        >
          {/* Botón de cierre */}
          <button
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            onClick={onClose}
            disabled={isLoading} // Evita cerrar si se está cargando
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          {/* Timeline / StepIndicator */}
          <StepIndicator currentStep={currentStep} steps={stepLabels} />

          {/* Contenido del wizard */}
          <div>{renderStep()}</div>

          {/* Footer de navegación */}
          <div className="mt-8 flex justify-between pb-4">
            {canGoBack ? (
              <button
                onClick={goBack}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
                disabled={isLoading}
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {canGoNext ? (
              <button
                onClick={goNext}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                disabled={isLoading}
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleGenerateRecipe}
                className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
                disabled={isLoading}
              >
                Generate Recipe
              </button>
            )}
          </div>
        </div>

        {/* LOADER OVERLAY */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-80 z-50 flex flex-col items-center justify-center">
            <div className="animate-spin inline-block w-12 h-12 border-4 border-current border-t-transparent text-orange-500 rounded-full mb-4" />
            <p className="text-gray-700 font-semibold">
              Generating your recipe...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
