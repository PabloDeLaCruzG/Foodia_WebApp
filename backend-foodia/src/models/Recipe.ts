import { Document, Schema, model, Types } from "mongoose";

export interface INutritionalInfo {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

export interface IIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface IStep {
  stepNumber: number;
  description: string;
}

export interface IRecipe extends Document {
  title: string;
  description: string;
  cookingTime: number; // minutos de cocción / preparación
  difficulty: string; // "Fácil", "Media", "Difícil", etc.
  costLevel: string; // "Barato", "Medio", "Caro"
  cuisine: string; // "Italiana", "Mexicana", "Americana", etc.
  nutritionalInfo: INutritionalInfo;
  ingredients: IIngredient[];
  steps: IStep[];
  authorId?: Types.ObjectId; // referencia a un usuario
  createdAt?: Date;
  updatedAt?: Date;
  imageUrl?: string;
}

const RecipeSchema = new Schema<IRecipe>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    cookingTime: {
      type: Number,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
      trim: true,
    },
    costLevel: {
      type: String,
      required: true,
      trim: true,
    },
    cuisine: {
      type: String,
      required: true,
      trim: true,
    },
    nutritionalInfo: {
      type: {
        calories: { type: Number, required: true },
        protein: { type: Number, required: true },
        fat: { type: Number, required: true },
        carbs: { type: Number, required: true },
      },
      required: true,
    },
    ingredients: [
      {
        name: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true },
        unit: { type: String, required: true, trim: true },
      },
    ],
    steps: [
      {
        stepNumber: { type: Number, required: true },
        description: { type: String, required: true, trim: true },
      },
    ],
    imageUrl: {
      type: String,
      required: false,
    },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt automáticamente
  }
);

const Recipe = model<IRecipe>("Recipe", RecipeSchema);

export default Recipe;
