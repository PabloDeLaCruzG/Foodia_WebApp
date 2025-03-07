// services/aiRecipeService.ts
import { openai } from "../config/openai";
import JSON5 from "json5";
import { AIRecipeData } from "../interfaces/IAIRecipeData";

export class AIRecipeService {
  static async generateRecipeFromPrompt(prompt: string): Promise<AIRecipeData> {
    try {
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

      const aiResult = response.choices[0]?.message?.content?.trim();
      if (!aiResult) {
        throw new Error("La API de OpenAI no devolvió resultado");
      }

      // Limpiar backticks o fences
      let cleanedResponse = aiResult.replace(/```/g, "").trim();

      // Extraer el contenido JSON si hubiera texto adicional
      const match = cleanedResponse.match(/\{[\s\S]*\}/);
      if (match) {
        cleanedResponse = match[0];
      }

      // Parsear con JSON5
      const recipeData: AIRecipeData = JSON5.parse(cleanedResponse);
      return recipeData;
    } catch (error) {
      console.error("Error al generar receta con OpenAI:", error);
      throw error;
    }
  }
}
