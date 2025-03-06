"use client";
import React, { useState } from "react";

interface StepTwoProps {
  ingredientsToInclude: string[];
  setIngredientsToInclude: React.Dispatch<React.SetStateAction<string[]>>;
  ingredientsToExclude: string[];
  setIngredientsToExclude: React.Dispatch<React.SetStateAction<string[]>>;
  extraAllergens: string;
  setExtraAllergens: React.Dispatch<React.SetStateAction<string>>;
}

export default function StepTwo({
  ingredientsToInclude,
  setIngredientsToInclude,
  ingredientsToExclude,
  setIngredientsToExclude,
  extraAllergens,
  setExtraAllergens,
}: StepTwoProps) {
  const [inputInclude, setInputInclude] = useState("");
  const [inputExclude, setInputExclude] = useState("");

  const handleAddInclude = () => {
    if (inputInclude.trim() !== "") {
      setIngredientsToInclude([...ingredientsToInclude, inputInclude.trim()]);
      setInputInclude("");
    }
  };

  const handleAddExclude = () => {
    if (inputExclude.trim() !== "") {
      setIngredientsToExclude([...ingredientsToExclude, inputExclude.trim()]);
      setInputExclude("");
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">
          Add ingredients to exclude or include
        </h1>
        <p className="text-gray-600">
          Type any ingredient you want in or out of your recipe.
        </p>
      </div>

      {/* Include */}
      <div>
        <h2 className="font-semibold mb-2">Include</h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={inputInclude}
            onChange={(e) => setInputInclude(e.target.value)}
            placeholder="e.g. chicken, tomatoes..."
          />
          <button
            onClick={handleAddInclude}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Add
          </button>
        </div>

        {/* Chips de ingredientes a incluir */}
        <div className="flex flex-wrap gap-2">
          {ingredientsToInclude.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center bg-orange-100 text-orange-600 px-3 py-1 rounded-full cursor-pointer hover:bg-orange-200"
              onClick={() =>
                setIngredientsToInclude(
                  ingredientsToInclude.filter((i) => i !== ingredient)
                )
              }
            >
              {ingredient} <span className="ml-2 text-sm">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* Exclude */}
      <div>
        <h2 className="font-semibold mb-2">Exclude</h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            className="border border-gray-300 p-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={inputExclude}
            onChange={(e) => setInputExclude(e.target.value)}
            placeholder="e.g. cilantro, olives..."
          />
          <button
            onClick={handleAddExclude}
            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600"
          >
            Add
          </button>
        </div>

        {/* Chips de ingredientes a excluir */}
        <div className="flex flex-wrap gap-2">
          {ingredientsToExclude.map((ingredient, idx) => (
            <span
              key={idx}
              className="inline-flex items-center bg-red-100 text-red-600 px-3 py-1 rounded-full cursor-pointer hover:bg-red-200"
              onClick={() =>
                setIngredientsToExclude(
                  ingredientsToExclude.filter((i) => i !== ingredient)
                )
              }
            >
              {ingredient} <span className="ml-2 text-sm">×</span>
            </span>
          ))}
        </div>
      </div>

      {/* EXTRA ALLERGENS FIELD */}
      <div>
        <label className="block font-semibold mb-2" htmlFor="extraAllergens">
          Additional allergens or restrictions
        </label>
        <input
          id="extraAllergens"
          type="text"
          placeholder="e.g. peanut allergy, shellfish allergy..."
          value={extraAllergens}
          onChange={(e) => setExtraAllergens(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}
