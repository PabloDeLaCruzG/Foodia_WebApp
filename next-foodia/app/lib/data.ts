import axios from "axios";
import { GenerateRecipeBody, IRecipe } from "./interfaces";

const API_URL = "http://localhost:4000/api/recipes";

export const recipeApi = {
  /**
   * Obtiene todas las recetas del backend.
   * Promete recibir un array de Recetas de tipo Receta
   */
  getAllRecipes: async (): Promise<IRecipe[]> => {
    try {
      const response = await axios.get(API_URL);
      console.log("response: ", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las recetas:", error);
      throw error;
    }
  },

  /**
   * Obtiene una receta por su ID.
   * @param id ID de la receta a buscar
   */
  getRecipeById: async (id: string): Promise<IRecipe> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener la receta con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Elimina una receta por su ID.
   * @param id ID de la receta a eliminar
   */
  deleteRecipeById: async (id: string) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar la receta con ID ${id}:`, error);
      throw error;
    }
  },

  /**
   * Crea una nueva receta.
   * @param recipe Datos de la nueva receta
   */
  createRecipe: async (recipe: IRecipe) => {
    try {
      const response = await axios.post(API_URL, recipe);
      return response.data;
    } catch (error) {
      console.error("Error al crear la receta:", error);
      throw error;
    }
  },

  /**
   * Genera una receta automáticamente con base en los parámetros enviados.
   * @param recipeParams Parámetros para generar la receta
   */
  generateRecipe: async (recipeParams: GenerateRecipeBody) => {
    console.log("Parámetros de la receta:", recipeParams);
    try {
      const response = await axios.post(`${API_URL}/generate`, recipeParams, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error al generar la receta:", error);
      throw error;
    }
  },
};
