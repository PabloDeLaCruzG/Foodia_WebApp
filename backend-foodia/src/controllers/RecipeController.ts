import { Request, Response } from "express";
import Recipe from "../models/Recipe";
import { openai } from "../config/openai";
import JSON5 from "json5";
import { GenerateRecipeBody } from "../interfaces/IGenerateRecipeBody";
import { AIRecipeData } from "../interfaces/IAIRecipeData";
import axios from "axios";
import { translate } from "@vitalets/google-translate-api";

class RecipeController {
  // Funcion generar imagen de la receta
  static fetchFoodImage = async (
    recipeTitle: string
  ): Promise<string | null> => {
    try {
      // Se traduce el título a inglés
      const { text: translatedTitle } = await translate(recipeTitle, {
        to: "en",
      });

      const pexelsApiKey = process.env.PEXELS_KEY;
      const response = await axios.get("https://api.pexels.com/v1/search", {
        params: { query: `food ${translatedTitle}`, per_page: 1 },
        headers: { Authorization: pexelsApiKey },
      });

      if (response.data.photos.length > 0) {
        return response.data.photos[0].src.medium;
      }

      return null;
    } catch (error) {
      console.error("Error al obtener imagen de Pexels:", error);
      return null;
    }
  };

  static generateRecipe = async (
    req: Request<{}, {}, GenerateRecipeBody>,
    res: Response
  ) => {
    try {
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

      // Convertir arrays a cadenas para el prompt
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

      // Llamada a la API de OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a professional Chef with high creativity and expertise. Respond ONLY with JSON.",
          },
          { role: "user", content: prompt },
        ],
      });

      // Extraer y limpiar la respuesta de OpenAI
      const aiResult = response.choices[0]?.message?.content?.trim();
      if (!aiResult) {
        res.status(500).json({ message: "No se pudo generar la receta." });
        return;
      }

      console.log("Respuesta de OpenAI:", aiResult);

      // Limpiar los backticks y cualquier code fence
      let cleanedResponse = aiResult.replace(/```/g, "").trim();

      // Si es necesario, extraer solo la parte JSON (entre llaves)
      const match = cleanedResponse.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedResponse = match[0];
      }

      let recipeData: AIRecipeData;
      try {
        recipeData = JSON5.parse(cleanedResponse);
      } catch (parseError) {
        console.error("Error al parsear la respuesta de OpenAI:", parseError);
        res.status(500).json({
          message: "La respuesta de OpenAI no es un JSON válido",
          error: parseError.message,
        });
        return;
      }

      console.log("Datos de la receta:", recipeData);

      const imageUrl = await RecipeController.fetchFoodImage(recipeData.title);

      // Crear el documento de la receta usando el nuevo esquema
      const newRecipe = new Recipe({
        title: recipeData.title,
        description: recipeData.description,
        cookingTime: recipeData.cookingTime,
        difficulty: recipeData.difficulty,
        costLevel: recipeData.costLevel,
        cuisine: recipeData.cuisine,
        nutritionalInfo: recipeData.nutritionalInfo,
        ingredients: recipeData.ingredients,
        steps: recipeData.steps,
        imageUrl: imageUrl,
        // En el futuro, podrías relacionar con el usuario: authorId: req.user.id
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
