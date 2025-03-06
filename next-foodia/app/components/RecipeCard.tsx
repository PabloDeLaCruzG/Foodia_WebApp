import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IRecipe } from "../lib/interfaces";

export default function RecipeCard({ recipe }: { recipe: IRecipe }) {

  //console.log("URL de la imagen CARD:", recipe.imageURL);

  return (
    <Link href={`/home/${recipe._id}`}>
      <article
        className="
        w-40
        max-h-50
        sm:w-60
        sm:max-h-75
        rounded-lg
        hover:shadow-md
        cursor-pointer
        overflow-hidden
        transition-shadow
        flex flex-col
        line-clamp-2
      "
      >
        <div className="relative w-full h-40 sm:h-48 md:h-52">
          {recipe.imageUrl ? (
          <Image
            src={recipe.imageUrl}
            alt={recipe.title || "Imagen de la receta"}
            fill
            className="object-cover rounded-xl"
          />
          ) : (
          <Image
            src="/pollo.jpg"
            alt={recipe.title || "Imagen de la receta"}
            fill
            className="object-cover rounded-xl"
          />
          )}
        </div>

        <div className="p-2 flex flex-col flex-1">
          <h1 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-3">
            {recipe.title}
          </h1>
          <p className="text-xs sm:text-sm text-orange-300 mt-1">
            {recipe.cuisine}, {recipe.cookingTime} min
          </p>
        </div>
      </article>
    </Link>
  );
}
