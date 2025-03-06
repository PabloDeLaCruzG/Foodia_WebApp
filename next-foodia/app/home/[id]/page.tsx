"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  ArrowLongLeftIcon,
  ClockIcon,
  BanknotesIcon,
} from "@heroicons/react/24/solid";
import { IRecipe } from "../../lib/interfaces"; // Ajusta la ruta según tu proyecto
import { recipeApi } from "../../lib/data";     // Ajusta según tu API
import SquareBar from "@/app/components/SquareBar";

// Rango de ejemplo para calcular las barras (o cuadrados) de nutrientes
const NUTRIENT_RANGES = {
  calories: { min: 100, max: 600 },
  protein: { min: 10, max: 50 },
  carbs: { min: 10, max: 50 },
  fat: { min: 5, max: 30 },
};

function getFilledSquares(value: number, nutrient: keyof typeof NUTRIENT_RANGES) {
  const { min, max } = NUTRIENT_RANGES[nutrient];
  // Se mapean 5 cuadrados en total
  return Math.round(((value - min) / (max - min)) * 4) + 1;
}

export default function RecipeDetailsPage() {
  const { id }: { id: IRecipe["_id"] } = useParams();
  const [recipe, setRecipe] = useState<IRecipe | null>(null);

  // Traer la receta del API
  useEffect(() => {
    if (id) {
      recipeApi
        .getRecipeById(id)
        .then((data) => setRecipe(data))
        .catch((error) => console.error("Error fetching recipe:", error));
    }
  }, [id]);

  if (!recipe) {
    return (
      <div className="text-black p-4">
        <p>Cargando la receta...</p>
      </div>
    );
  }

  return (
    <div className="xl:w-4/5 mx-auto px-4 py-8 text-gray-800">
      {/* Botón Volver */}
      <div className="flex items-center mb-6">
        <Link
          href="/home"
          className="inline-flex items-center text-gray-700 hover:text-gray-900"
        >
          <ArrowLongLeftIcon className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Volver</span>
        </Link>
      </div>

      {/* Encabezado / Imagen principal */}
      <header className="relative w-full h-64 mb-6">
        <Image
          src={recipe.imageUrl || "/pollo.jpg"}
          alt={recipe.title}
          fill
          className="object-cover rounded-xl shadow-md"
        />
      </header>

      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
          {recipe.title}
        </h1>
        <p className="text-base text-gray-600">{recipe.description}</p>
      </div>

      <main>
        {/* GRID con Info General + Info Nutricional */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-6 sm:gap-6">
          {/* Sección Info General */}
          <section className="col-span-2 bg-white p-4 rounded-xl shadow-md">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <ClockIcon className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">Tiempo</span>
              </div>
              <p>{recipe.cookingTime} min</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold">Dificultad</span>
              </div>
              <p>{recipe.difficulty}</p>
            </div>

            <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <BanknotesIcon className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">Coste</span>
              </div>
              <p>{recipe.costLevel}</p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-gray-600">
                <span className="font-semibold">Cocina</span>
              </div>
              <p>{recipe.cuisine}</p>
            </div>
          </section>
          {/* Sección Información Nutricional */}
          <aside className="bg-white p-4 rounded-xl shadow-md">
            <h2 className="text-lg font-semibold mb-4">Información Nutricional</h2>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Calorías</span>
                <span className="font-bold">{recipe.nutritionalInfo.calories} Kcal</span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.calories, "calories")}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Proteína</span>
                <span className="font-bold">{recipe.nutritionalInfo.protein} g</span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.protein, "protein")}
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Carbohidratos</span>
                <span className="font-bold">{recipe.nutritionalInfo.carbs} g</span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.carbs, "carbs")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-sm text-gray-700">
                <span>Grasas</span>
                <span className="font-bold">{recipe.nutritionalInfo.fat} g</span>
              </div>
              <SquareBar
                filled={getFilledSquares(recipe.nutritionalInfo.fat, "fat")}
              />
            </div>
          </aside>
        </div>

        {/* Sección de Ingredientes - estilo “tarjetado” en grid */}
        <section className="bg-white p-4 mt-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Ingredientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recipe.ingredients.map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg shadow-sm"
              >
                <span className="text-sm font-semibold text-orange-500">
                  {item.quantity} {item.unit}
                </span>
                <span className="text-gray-700">{item.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Pasos - estilo “timeline” */}
        <section className="bg-white p-4 mt-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Preparación</h2>

          {/* Contenedor con una línea a la izquierda simulando un timeline */}
          <div className="relative border-l-4 border-orange-300 pl-6">
            {recipe.steps.map((step, index) => (
              <div key={index} className="mb-6 relative">
                {/* Pequeño círculo para cada paso */}
                <div className="w-4 h-4 bg-orange-300 rounded-full absolute -left-2 top-1" />
                <h3 className="font-semibold mb-1 ml-4">Paso {step.stepNumber}</h3>
                <p className="text-gray-700">{step.description}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}