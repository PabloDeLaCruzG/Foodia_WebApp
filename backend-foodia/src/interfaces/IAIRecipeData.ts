export interface AIRecipeData {
  title: string;
  description: string;
  cookingTime: number;
  difficulty: string;
  costLevel: string;
  cuisine: string;
  nutritionalInfo: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
  };
  ingredients: Array<{
    name: string;
    quantity: number;
    unit: string;
  }>;
  steps: Array<{
    stepNumber: number;
    description: string;
  }>;
}