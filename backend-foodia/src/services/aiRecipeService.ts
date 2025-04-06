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
              "Eres un chef profesional con gran creatividad y experiencia. El usuario quiere la respuesta en un idioma específico, y debes responder ÚNICAMENTE en JSON estricto y con detalle en la elaboración. No incluyas texto adicional fuera del JSON",
          },
          {
            role: "user",
            content: `Idioma deseado: ${
              process.env.SYSTEM_LANGUAGE || "en"
            }, Prompt: ${prompt}`,
          },
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

      // Forzamos a que tenga un array de steps, y que no esté vacío
      if (
        !recipeData.steps ||
        !Array.isArray(recipeData.steps) ||
        !recipeData.steps.length
      ) {
        throw new Error(
          "La respuesta no contiene pasos de elaboración o su formato es inválido."
        );
      }

      return recipeData;
    } catch (error) {
      console.error("Error al generar receta con OpenAI:", error);
      throw error;
    }
  }

  static async generateRecipeImage(
    recipeTitle: string,
    ingredients: { name: string }[],
    steps: { description: string }[]
  ): Promise<string> {
    try {
      const ingString = ingredients.map((i) => i.name).join(", ");
      const stepsString = steps.map((s) => s.description).join(". ");

      const response = await openai.images.generate({
        prompt: `Foto realista y profesional del plato: ${recipeTitle}, que lleva: ${ingString}. Elaboración con pasos: ${stepsString}. Iluminacion natural, alta resolucion.`,
        n: 1,
        size: "1024x1024",
      });

      // Chequeo del resultado
      if (!response.data || !response.data[0].url) {
        throw new Error("No se pudo generar la imagen.");
      }

      return response.data[0].url;
    } catch (error) {
      console.error("Error al generar imagen con OpenAI:", error);
      throw error;
    }
  }
}
