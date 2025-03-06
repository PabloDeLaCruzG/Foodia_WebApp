"use client";
import React from "react";

interface StepFourProps {
  purpose: string;
  setPurpose: React.Dispatch<React.SetStateAction<string>>;
  extraDetails: string;
  setExtraDetails: React.Dispatch<React.SetStateAction<string>>;
  // Para resumen
  selectedCuisines: string[];
  dietRestrictions: string[];
  extraAllergens: string;
  ingredientsToInclude: string[];
  ingredientsToExclude: string[];
  time: string;
  difficulty: string;
  cost: string;
  servings: number;
}

export default function StepFour({
  purpose,
  setPurpose,
  extraDetails,
  setExtraDetails,
  selectedCuisines,
  dietRestrictions,
  extraAllergens,
  ingredientsToInclude,
  ingredientsToExclude,
  time,
  difficulty,
  cost,
  servings,
}: StepFourProps) {
  // Helpers para mostrar en texto
  const mapTime = (val: string) => {
    switch (val) {
      case "quick":
        return "Quick (30 minutes or less)";
      case "medium":
        return "Medium (30-60 minutes)";
      case "long":
        return "Long (60+ minutes)";
      default:
        return val;
    }
  };

  const mapDifficulty = (val: string) => {
    switch (val) {
      case "basic":
        return "Basic (Easy)";
      case "intermediate":
        return "Intermediate";
      case "advanced":
        return "Advanced";
      default:
        return val;
    }
  };

  const mapCost = (val: string) => {
    switch (val) {
      case "low":
        return "Low";
      case "medium":
        return "Medium";
      case "high":
        return "High";
      default:
        return val;
    }
  };

  return (
    <div className="space-y-8">
      {/* Purpose & Details */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Purpose & Summary</h1>
        <p className="text-gray-600">
          Add any additional context, then review your choices.
        </p>
      </div>

      <div>
        <label className="block font-semibold mb-2" htmlFor="purpose">
          Purpose (optional)
        </label>
        <input
          id="purpose"
          type="text"
          placeholder="e.g. Romantic dinner, birthday, post-workout..."
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block font-semibold mb-2" htmlFor="extraDetails">
          Additional details
        </label>
        <textarea
          id="extraDetails"
          placeholder="Anything else we should know?"
          value={extraDetails}
          onChange={(e) => setExtraDetails(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Resumen final */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Summary of your selections</h2>
        <div className="bg-gray-50 p-4 rounded-md text-gray-700 space-y-2">
          <p>
            <strong>Cuisines:</strong> {selectedCuisines.join(", ") || "None"}
          </p>
          <p>
            <strong>Dietary restrictions:</strong>{" "}
            {dietRestrictions.join(", ") || "None"}
          </p>
          <p>
            <strong>Extra allergens:</strong> {extraAllergens || "None"}
          </p>
          <p>
            <strong>Ingredients to include:</strong>{" "}
            {ingredientsToInclude.join(", ") || "None"}
          </p>
          <p>
            <strong>Ingredients to exclude:</strong>{" "}
            {ingredientsToExclude.join(", ") || "None"}
          </p>
          <p>
            <strong>Time:</strong> {mapTime(time)}
          </p>
          <p>
            <strong>Difficulty:</strong> {mapDifficulty(difficulty)}
          </p>
          <p>
            <strong>Cost:</strong> {mapCost(cost)}
          </p>
          <p>
            <strong>Servings:</strong> {servings}
          </p>
          <p>
            <strong>Purpose:</strong> {purpose || "Not specified"}
          </p>
          <p>
            <strong>Extra details:</strong> {extraDetails || "None"}
          </p>
        </div>
      </div>
    </div>
  );
}
