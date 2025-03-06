// components/StepIndicator.tsx
"use client";
import React from "react";

interface StepIndicatorProps {
  currentStep: number;
  steps: string[];
}

export default function StepIndicator({
  currentStep,
  steps,
}: StepIndicatorProps) {
  const totalSteps = steps.length;
  // Calcula el ancho de la línea de progreso en porcentaje
  const progressWidth =
    totalSteps > 1 ? ((currentStep - 1) / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="relative w-full max-w-2xl mb-8">
      {/* Línea de fondo completa */}
      <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-300" />
      {/* Línea de progreso (se alarga dinámicamente) */}
      <div
        className="absolute top-4 left-0 h-0.5 bg-orange-500"
        style={{ width: `${progressWidth}%` }}
      />
      <div className="flex justify-between relative">
        {steps.map((label, index) => {
          const stepIndex = index + 1;
          const isActive = stepIndex === currentStep;
          const isCompleted = stepIndex < currentStep;
          return (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full border-2
                  ${
                    isCompleted
                      ? "bg-orange-500 border-orange-500"
                      : isActive
                      ? "bg-white border-orange-500"
                      : "bg-white border-gray-300"
                  }
                `}
              >
                {isCompleted ? (
                  <span className="text-white font-bold">{stepIndex}</span>
                ) : isActive ? (
                  <span className="text-orange-500 font-bold">{stepIndex}</span>
                ) : (
                  <span className="text-gray-500 font-bold">{stepIndex}</span>
                )}
              </div>
              {/* Texto visible solo en pantallas medianas o superiores */}
              <span
                className={`mt-2 text-sm hidden md:block ${
                  isActive || isCompleted
                    ? "text-orange-600 font-semibold"
                    : "text-gray-600"
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
