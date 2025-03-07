// services/imageService.ts
import axios from "axios";
import { translate } from "@vitalets/google-translate-api";

export class ImageService {
  static async fetchFoodImage(recipeTitle: string): Promise<string | null> {
    try {
      // Traducir el título a inglés
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
  }
}
