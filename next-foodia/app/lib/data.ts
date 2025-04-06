import axios from "axios";
import { GenerateRecipeBody, IRecipe, IUser } from "./interfaces";

// Ponerlo en .env
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/recipes`;
const API_URL_AUTH = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/`;
const API_URL_USER = `${process.env.NEXT_PUBLIC_API_URL}/api/users/`;

export const recipeApi = {
  /**
   * Obtiene todas las recetas del backend.
   * Promete recibir un array de Recetas de tipo Receta
   */
  getAllRecipes: async (): Promise<IRecipe[]> => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error al obtener todas las recetas:", error);
      throw error;
    }
  },

  getRecipesByAuthor: async (authorId: string): Promise<IRecipe[]> => {
    try {
      const response = await axios.get(`${API_URL}/author`, {
        params: {
          authorId,
        },
        withCredentials: true,
      });
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
      const response = await axios.get(`${API_URL}/${id}`, {
        withCredentials: true,
      });
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
      const response = await axios.delete(`${API_URL}/${id}`, {
        withCredentials: true,
      });
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
      const response = await axios.post(API_URL, recipe, {
        withCredentials: true,
      });
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
    try {
      const response = await axios.post(`${API_URL}/generate`, recipeParams, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error al generar la receta:", error);
      throw error;
    }
  },
};

export const authApi = {
  googleAuth: async (idToken: string) => {
    try {
      const response = await axios.post(
        API_URL_AUTH + "google",
        {
          idToken,
        },
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error);
      throw error;
    }
  },
  /**
   * Registra un usuario en el backend.
   * @param user Datos del usuario a registrar
   */
  registerUser: async (user: IUser) => {
    try {
      const response = await axios.post(API_URL_AUTH + "register", user, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      throw error;
    }
  },

  /**
   * Loginea un usuario en el backend.
   * @param user Datos del usuario a loginear
   */
  loginUser: async (user: IUser) => {
    try {
      const response = await axios.post(API_URL_AUTH + "login", user, {
        withCredentials: true,
      });

      return response.data;
    } catch (error) {
      console.error("Error al loginear el usuario:", error);
      throw error;
    }
  },

  logoutUser: async () => {
    try {
      const response = await axios.post(
        API_URL_AUTH + "logout",
        {},
        {
          withCredentials: true,
        }
      );

      return response.data;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  },

  /**
   * Verifica si un email existe en la base de datos.
   * @param email Email a verificar
   */
  checkEmailExists: async (email: string) => {
    try {
      const response = await axios.post(API_URL_AUTH + "checkEmailExists", {
        email,
      });
      return response.data;
    } catch (error) {
      console.error("Error al verificar el email:", error);
      throw error;
    }
  },
};

export const userApi = {
  getCurrentUser: async () => {
    try {
      const response = await axios.get(API_URL_USER + "user", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  },

  watchAdReward: async () => {
    try {
      const response = await axios.post(
        API_URL_USER + "watchAdReward",
        {},
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error al procesar la recompensa:", error);
      throw error;
    }
  },

  getDailyStatus: async () => {
    try {
      const response = await axios.get(API_URL_USER + "dailyStatus", {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error al obtener el estado diario:", error);
      throw error;
    }
  },
};
