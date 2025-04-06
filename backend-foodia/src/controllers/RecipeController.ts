import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import { openai } from "../config/openai";
import JSON5 from "json5";
import { AIRecipeService } from "../services/aiRecipeService";
import { ImageService } from "../services/imageService";
import { GenerateRecipeBody } from "../interfaces/IGenerateRecipeBody";
import { AuthRequest } from "../interfaces/AuthRequest";
import User, { IUser } from "../models/User";
import { resetDailyUsage } from "./UserController";

class RecipeController {
  static generateRecipe = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user!._id;
      const user = await User.findById(userId);
      if (!user) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      resetDailyUsage(user);

      let hasCredit = false;

      if (user.dailyGenerationCount > 0) {
        user.dailyGenerationCount -= 1;
        hasCredit = true;
      } else if (user.rewardedGenerations > 0) {
        user.rewardedGenerations -= 1;
        hasCredit = true;
      }

      if (!hasCredit) {
        // Si el usuario no tiene créditos,
        // devolvemos 403 para evitar que generen
        // vía Postman sin pasar por la lógica del frontend.
        res.status(403).json({ message: "No tienes suficiente crédito" });
        return;
      }

      await user.save();

      const {
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
      } = req.body;

      // 1. Construir el prompt
      const cuisinesStr =
        selectedCuisines?.join(", ") || "no specific cuisines";
      const dietStr = dietRestrictions?.join(", ") || "no dietary restrictions";
      const includeStr = ingredientsToInclude?.join(", ") || "none";
      const excludeStr = ingredientsToExclude?.join(", ") || "none";

      const prompt = `
      You are a culinary assistant. Generate a recipe that satisfies the following parameters:
  - Cuisine types: ${cuisinesStr}.
  - Dietary restrictions: ${dietStr}.
  - Extra allergens: ${extraAllergens || "none"}.
  - Ingredients to include: ${includeStr}.
  - Ingredients to exclude: ${excludeStr}.
  - Preparation time preference: ${time}.
  - Difficulty level: ${difficulty}.
  - Cost level: ${cost}.
  - Servings: ${servings}.
  - Purpose: ${purpose || "general"}.
  - Extra details: ${extraDetails || "none"}.
  
  Generate a recipe that meets these criteria.
  
  Return a STRICTLY valid JSON with the following structure:
  {
    "title": "string",
    "description": "string",
    "cookingTime": 30,
    "difficulty": "string",
    "costLevel": "string",
    "cuisine": "string",
    "nutritionalInfo": {
      "calories": 300,
      "protein": 20,
      "fat": 10,
      "carbs": 50
    },
    "ingredients": [
      {
        "name": "Ingredient 1",
        "quantity": 100,
        "unit": "g"
      }
    ],
    "steps": [
      {
        "stepNumber": 1,
        "description": "Step description"
      }
    ]
  }
  
  - Do not include extra text, additional or missing brackets, or braces.
  - Do not use text values for "quantity".
  - If an ingredient is used "to taste," set "quantity" to 1 and "unit" to "to taste".
  - Do not leave the unit empty.

  Additional JSON Instructions:
	•	selectedCuisines: Must be an array of strings (e.g., ["Mexican", "Chinese"]). If there are no values, use an empty array.
	•	dietRestrictions: Must be an array of strings (e.g., ["Vegetarian"]). If there are no values, use an empty array.
	•	extraAllergens: Must be a string. If not applicable, use "none".
	•	ingredientsToInclude: Must be an array of strings representing the ingredients to include.
	•	ingredientsToExclude: Must be an array of strings representing the ingredients to exclude.
	•	time: Must be a string (e.g., "medium").
	•	difficulty: Must be a string (e.g., "intermediate").
	•	cost: Must be a string (e.g., "medium").
	•	servings: Must be an integer.
	•	purpose: Must be a string.
	•	extraDetails: Must be a string.

For any ingredient object that is part of the generated recipe, ensure that:
	•	name: Is a non-empty string.
	•	quantity: Is a numeric value (do not use text for quantities).
	•	unit: Is a non-empty string. If a specific unit is not available, do not leave it empty; assign a valid default value (for example, "to taste") to comply with the validation.

Please generate the JSON with no additional text or formatting outside the strict JSON structure, and ensure that all fields follow the above restrictions exactly.
      
      `;

      // 2. Llamar al servicio de OpenAI
      const recipeData = await AIRecipeService.generateRecipeFromPrompt(prompt);

      // 3. Obtener imagen desde el servicio
      const imageUrl = await ImageService.fetchFoodImage(recipeData.title);

      const authorId = req.user!._id;

      console.log("ID del autor:", authorId);

      // 4. Crear y guardar la receta
      const newRecipe = new Recipe({
        ...recipeData,
        imageUrl,
        authorId,
      });

      await newRecipe.save();

      res
        .status(201)
        .json({ message: "Receta generada exitosamente", recipe: newRecipe });
    } catch (error) {
      console.error("Error al generar la receta:", error);
      res
        .status(500)
        .json({ message: "Error al generar la receta", error: error.message });
    }
  };

  static getAllRecipes = async (req: any, res: Response) => {
    try {
      const recipes = await Recipe.find();
      res.status(200).json(recipes);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Controller: Error al obtener las recetas" });
    }
  };

  static getRecipesByAuthor = async (req: AuthRequest, res: Response) => {
    try {
      const authorId = req.user!._id;
      console.log("ID del autor:", authorId);

      console.log("USER:", req.user);

      if (!authorId) {
        res.status(401).json({ message: "Usuario no autenticado" });
        return;
      }

      const recipes = await Recipe.find({ authorId }).sort({ updatedAt: -1 });
      res.status(200).json(recipes);
    } catch (error) {
      console.error("Error al obtener recetas del autor:", error);
      res
        .status(500)
        .json({ message: "Error al obtener las recetas del autor" });
    }
  };

  static getRecipeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        res.status(404).json({ message: "No se encontró la receta" });
        return;
      }

      res.status(200).json(recipe);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener la receta" });
    }
  };

  static deleteRecipeById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const recipe = await Recipe.findById(id);
      if (!recipe) {
        res.status(404).json({ message: "No se encontró la receta" });
        return;
      }
      await recipe.deleteOne();
      res.status(200).json({ message: "La receta se eliminó correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar la receta" });
    }
  };

  static createRecipe = async (req: Request, res: Response) => {
    console.log("Controlador alcanzado con datos:", req.body);
    try {
      const recipe = new Recipe(req.body);
      await recipe.save();
      res.status(201).json({ message: "Receta creada exitosamente" });
    } catch (error) {
      console.error("Errpr al crear la receta", error);
      res.status(500).json({ message: "Error al crear la receta" });
    }
  };
}

export default RecipeController;
