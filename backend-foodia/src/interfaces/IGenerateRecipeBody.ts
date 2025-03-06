export interface GenerateRecipeBody {
  selectedCuisines: string[];
  dietRestrictions: string[];
  extraAllergens: string;
  ingredientsToInclude: string[];
  ingredientsToExclude: string[];
  time: string;
  difficulty: string;
  cost: string;
  servings: number;
  purpose: string;
  extraDetails: string;
}
