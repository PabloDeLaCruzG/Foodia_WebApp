"use client"; // Si vas a usar hooks, slick, etc. en este componente

import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { recommendedRecipes } from "../../lib/recommendRecipes";
import Image from "next/image";

const funFacts = [
  {
    id: "fact-1",
    text: "¿Sabías que la cocina japonesa ha sido declarada Patrimonio Cultural Inmaterial de la Humanidad por la UNESCO?",
    likes: 0,
  },
  {
    id: "fact-2",
    text: "Se estima que existen más de 100 tipos de pasta en todo el mundo, cada una con su forma y nombre distintivos.",
    likes: 0,
  },
  {
    id: "fact-3",
    text: "Esta receta de ‘Hot Honey Chicken’ está dando la vuelta al mundo. ¡Pruébala y cuéntanos qué tal!",
    likes: 0,
  },
];

export default function AsideSection() {
  const [currentFunFactIndex, setCurrentFunFactIndex] = useState(0);

  useEffect(() => {
    if (funFacts.length > 0) {
      const randomIndex = Math.floor(Math.random() * funFacts.length);
      setCurrentFunFactIndex(randomIndex);
    }
  }, []);

  const handleSaveRecommendedRecipe = (id: string) => {
    console.log(`Save recommended recipe with id: ${id}`);
    // Lógica para guardar receta (API, etc.)
  };

  // Opciones de configuración para react-slick
  const carouselSettings = {
    dots: true, // Muestra paginación (puntitos)
    infinite: true, // Permite que el carrusel haga loop
    speed: 500, // Velocidad de transición en ms
    slidesToShow: 1, // Número de slides visibles a la vez
    slidesToScroll: 1, // De a cuántos slides avanza
    adaptiveHeight: true, // Ajusta la altura al contenido
    arrows: false, // Si quieres ocultar flechas, etc.
    autoplay: true, // Si deseas que se deslice solo
    autoplaySpeed: 5000, // Intervalo en ms para autoplay
  };

  return (
    <>
      {/* Sección de Recetas en Carrusel */}
      <div>
        <h2 className="text-lg font-bold mb-2">Recetas sugeridas</h2>
        <Slider {...carouselSettings}>
          {recommendedRecipes.map((rec) => (
            <div
              key={rec.id}
              className="border rounded-2xl bg-white shadow-md max-w-xs overflow-hidden"
            >
              {/* Imagen */}
              <Image
                src={rec.imageUrl}
                alt={rec.title}
                className="w-full h-36 object-cover"
                width={400}
                height={300}
              />

              {/* Contenido */}
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-1">{rec.title}</h3>
                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                <button
                  onClick={() => handleSaveRecommendedRecipe(rec.id)}
                  className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-orange-600"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Sección Curiosidades */}
      <div className="mt-8">
        <h2 className="text-lg font-bold mb-2">Curiosidades</h2>
        <p className="text-gray-700 text-sm">
          {funFacts[currentFunFactIndex].text}
        </p>
      </div>
    </>
  );
}
