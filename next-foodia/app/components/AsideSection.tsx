"use client";

import Slider from "react-slick";
import { recommendedRecipes } from "../lib/recommendRecipes";
// import { funFacts } from "../lib/funFacts";
import Image from "next/image";
import { recipeApi } from "@/app/lib/data";
import { useAuth } from "@/app/context/AuthContext";
import { IRecipe } from "@/app/lib/interfaces";
import Script from "next/script";

interface IAsideSectionProps {
  onRecipeSave: () => void;
}

export default function AsideSection({ onRecipeSave }: IAsideSectionProps) {
  const currentUserId = useAuth().user?._id;

  const handleSaveRecommendedRecipe = async (
    recipe: IRecipe & { id?: string }
  ) => {
    // Creamos una copia y añadimos authorId (eliminando la propiedad id)
    const newRecipe = { ...recipe, authorId: currentUserId };
    delete newRecipe.id;

    try {
      await recipeApi.createRecipe(newRecipe);

      onRecipeSave();
    } catch (error) {
      console.error("Error al guardar la receta:", error);
    }
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    adaptiveHeight: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 7000,
  };

  return (
    <>
      <div>
        <h2 className="text-lg font-bold mb-2">Recetas sugeridas</h2>
        <Slider {...carouselSettings}>
          {recommendedRecipes.map((rec) => (
            <div
              key={rec.id}
              className="border rounded-2xl bg-white shadow-md max-w-xs overflow-hidden relative"
            >
              <Image
                src={rec.imageUrl}
                alt={rec.title}
                className="w-full h-36 object-cover"
                width={400}
                height={300}
              />
              <button
                onClick={() => handleSaveRecommendedRecipe(rec)}
                className="absolute bottom-2 right-2 bg-orange-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
              >
                +
              </button>
              <div className="p-4 pr-6">
                <h3 className="text-lg font-semibold mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
              </div>
            </div>
          ))}
        </Slider>
      </div>
      {/* Google AdSense block */}
      <div className="my-4">
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
          strategy="afterInteractive"
        />
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-XXXXXXXXXXXX" // Replace with your AdSense client ID
          data-ad-slot="YYYYYYYYYY" // Replace with your AdSense slot ID
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <Script id="adsbygoogle-init" strategy="afterInteractive">
          {`(adsbygoogle = window.adsbygoogle || []).push({});`}
        </Script>
      </div>
      {/* <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Curiosidades</h2>
        <Slider {...carouselSettings}>
          {funFacts.map((fact, index) => (
            <div
              key={index}
              className="border rounded-2xl p-2 bg-white shadow-md max-w-xs overflow-hidden"
            >
              <p className="text-gray-700 text-sm">{fact.text}</p>
            </div>
          ))}
        </Slider>
      </div> */}
    </>
  );
}
