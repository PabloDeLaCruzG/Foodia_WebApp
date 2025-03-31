"use client";

import { createContext, useContext } from "react";
import { IRecipe } from "../lib/interfaces";

interface RecipeContextType {
  recipes: IRecipe[];
  refreshRecipes: () => void;
}

export const RecipeContext = createContext<RecipeContextType | undefined>(undefined);

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error("useRecipeContext must be used within a RecipeProvider");
  }
  return context;
};
