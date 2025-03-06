"use client";
import React from "react";

interface StepOneProps {
  selectedCuisines: string[];
  setSelectedCuisines: React.Dispatch<React.SetStateAction<string[]>>;
  dietRestrictions: string[];
  setDietRestrictions: React.Dispatch<React.SetStateAction<string[]>>;
}

// Ejemplo de arrays
const CUISINE_OPTIONS = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "Japanese",
  "American",
  "Thai",
  "Vietnamese",
  "Korean",
  "French",
  "Greek",
  "Spanish",
  "German",
  "British", // etc...
];

const DIET_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Gluten-Free",
  "Dairy-Free",
  "Pescatarian",
  "Paleo",
  "Low-Carb",
  "Keto",
  "Nut-Free",
  "Soy-Free",
  "No Sugar Added",
  "Mediterranean",
  "DASH",
  "Weight Watchers",
];

export default function StepOne({
  selectedCuisines,
  setSelectedCuisines,
  dietRestrictions,
  setDietRestrictions,
}: StepOneProps) {
  // Función para toggle en un array (chips)
  const toggleCuisine = (cuisine: string) => {
    if (selectedCuisines.includes(cuisine)) {
      setSelectedCuisines(selectedCuisines.filter((c) => c !== cuisine));
    } else {
      setSelectedCuisines([...selectedCuisines, cuisine]);
    }
  };

  const toggleDiet = (diet: string) => {
    if (dietRestrictions.includes(diet)) {
      setDietRestrictions(dietRestrictions.filter((d) => d !== diet));
    } else {
      setDietRestrictions([...dietRestrictions, diet]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Find the perfect recipe</h1>
        <p className="text-gray-600">
          Choose one or more cuisines and dietary restrictions to tailor your
          recipe.
        </p>
      </div>

      {/* CUISINE TYPE */}
      <div>
        <h2 className="font-semibold mb-4">Cuisine type</h2>
        <div className="flex flex-wrap gap-3">
          {CUISINE_OPTIONS.map((cuisine) => {
            const isActive = selectedCuisines.includes(cuisine);
            return (
              <button
                key={cuisine}
                type="button"
                onClick={() => toggleCuisine(cuisine)}
                className={`px-4 py-2 rounded-full border 
                  ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {cuisine}
              </button>
            );
          })}
        </div>
      </div>

      {/* DIETARY RESTRICTIONS */}
      <div>
        <h2 className="font-semibold mb-4">Dietary restrictions</h2>
        <div className="flex flex-wrap gap-3">
          {DIET_OPTIONS.map((diet) => {
            const isActive = dietRestrictions.includes(diet);
            return (
              <button
                key={diet}
                type="button"
                onClick={() => toggleDiet(diet)}
                className={`px-4 py-2 rounded-full border 
                  ${
                    isActive
                      ? "bg-orange-500 text-white border-orange-500"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                  }
                `}
              >
                {diet}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
