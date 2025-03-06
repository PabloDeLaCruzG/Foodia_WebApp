import { Router } from "express";
import { param, body } from "express-validator";
import RecipeController from "../controllers/RecipeController";
import { validateRequest } from "../middleware/validation";
import verifyToken from "../middleware/auth";

const recipeRoutes = Router();

/**
 * Endpoint para generar receta con IA
 */
recipeRoutes.post(
  "/generate",
  body("selectedCuisines")
    .optional()
    .isArray()
    .withMessage("selectedCuisines debe ser un array de strings"),
  body("selectedCuisines.*")
    .optional()
    .isString()
    .withMessage("Cada elemento de selectedCuisines debe ser un string"),

  body("dietRestrictions")
    .optional()
    .isArray()
    .withMessage("dietRestrictions debe ser un array de strings"),
  body("dietRestrictions.*")
    .optional()
    .isString()
    .withMessage("Cada elemento de dietRestrictions debe ser un string"),

  body("extraAllergens")
    .optional()
    .isString()
    .withMessage("extraAllergens debe ser un string"),

  body("ingredientsToInclude")
    .optional()
    .isArray()
    .withMessage("ingredientsToInclude debe ser un array de strings"),
  body("ingredientsToInclude.*")
    .optional()
    .isString()
    .withMessage("Cada ingrediente a incluir debe ser un string"),

  body("ingredientsToExclude")
    .optional()
    .isArray()
    .withMessage("ingredientsToExclude debe ser un array de strings"),
  body("ingredientsToExclude.*")
    .optional()
    .isString()
    .withMessage("Cada ingrediente a excluir debe ser un string"),

  body("time").optional().isString().withMessage("time debe ser un string"),

  body("difficulty")
    .optional()
    .isString()
    .withMessage("difficulty debe ser un string"),

  body("cost").optional().isString().withMessage("cost debe ser un string"),

  body("servings")
    .optional()
    .isInt()
    .withMessage("servings debe ser un número entero"),

  body("purpose")
    .optional()
    .isString()
    .withMessage("purpose debe ser un string"),

  body("extraDetails")
    .optional()
    .isString()
    .withMessage("extraDetails debe ser un string"),
  verifyToken,
  validateRequest,
  RecipeController.generateRecipe
);

recipeRoutes.get("/", verifyToken, RecipeController.getAllRecipes);

recipeRoutes.get(
  "/:id",
  param("id").isMongoId().withMessage("ID inválido"),
  verifyToken,
  validateRequest,
  RecipeController.getRecipeById
);

recipeRoutes.delete(
  "/:id",
  param("id").isMongoId().withMessage("ID inválido"),
  verifyToken,
  validateRequest,
  RecipeController.deleteRecipeById
);

recipeRoutes.post(
  "/",
  body("title")
    .notEmpty()
    .withMessage("title es requerido")
    .isString()
    .withMessage("title debe ser un string"),
  body("description")
    .notEmpty()
    .withMessage("description es requerida")
    .isString()
    .withMessage("description debe ser un string"),
  body("cookingTime")
    .notEmpty()
    .withMessage("cookingTime es requerido")
    .isInt()
    .withMessage("cookingTime debe ser un número entero"),
  body("difficulty")
    .notEmpty()
    .withMessage("difficulty es requerido")
    .isString()
    .withMessage("difficulty debe ser un string"),
  body("costLevel")
    .notEmpty()
    .withMessage("costLevel es requerido")
    .isString()
    .withMessage("costLevel debe ser un string"),
  body("cuisine")
    .notEmpty()
    .withMessage("cuisine es requerido")
    .isString()
    .withMessage("cuisine debe ser un string"),

  // nutritionalInfo
  body("nutritionalInfo.calories")
    .notEmpty()
    .withMessage("nutritionalInfo.calories es requerido")
    .isNumeric()
    .withMessage("calories debe ser numérico"),
  body("nutritionalInfo.protein")
    .notEmpty()
    .withMessage("nutritionalInfo.protein es requerido")
    .isNumeric()
    .withMessage("protein debe ser numérico"),
  body("nutritionalInfo.fat")
    .notEmpty()
    .withMessage("nutritionalInfo.fat es requerido")
    .isNumeric()
    .withMessage("fat debe ser numérico"),
  body("nutritionalInfo.carbs")
    .notEmpty()
    .withMessage("nutritionalInfo.carbs es requerido")
    .isNumeric()
    .withMessage("carbs debe ser numérico"),

  // ingredients
  body("ingredients")
    .isArray({ min: 1 })
    .withMessage("ingredients debe ser un array con al menos un elemento"),
  body("ingredients.*.name")
    .notEmpty()
    .withMessage("Cada ingrediente debe tener un name")
    .isString()
    .withMessage("El nombre del ingrediente debe ser un string"),
  body("ingredients.*.quantity")
    .isNumeric()
    .withMessage("La cantidad del ingrediente debe ser numérica"),
  body("ingredients.*.unit")
    .notEmpty()
    .withMessage("Cada ingrediente debe tener una unidad (unit)")
    .isString()
    .withMessage("La unidad del ingrediente debe ser un string"),

  // steps
  body("steps")
    .isArray({ min: 1 })
    .withMessage("steps debe ser un array con al menos un paso"),
  body("steps.*.stepNumber")
    .isNumeric()
    .withMessage("stepNumber debe ser numérico"),
  body("steps.*.description")
    .notEmpty()
    .withMessage("Cada paso debe tener una descripción")
    .isString()
    .withMessage("La descripción del paso debe ser un string"),

  verifyToken,
  validateRequest,
  RecipeController.createRecipe
);

export default recipeRoutes;
