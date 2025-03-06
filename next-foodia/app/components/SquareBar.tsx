import React from "react";

interface SquareBarProps {
  filled: number;       // cuántos cuadrados están rellenos
  total?: number;       // cuántos cuadrados en total
  size?: number;        // tamaño (en px) de cada cuadrado
}

const SquareBar: React.FC<SquareBarProps> = ({
  filled,
  total = 5,
  size = 12,
}) => {
  return (
    <div className="flex items-center space-x-1">
      {Array.from({ length: total }).map((_, index) => {
        const isFilled = index < filled;
        return (
          <div
            key={index}
            style={{ width: size, height: size }}
            className={(`border border-black ${isFilled ? "bg-black" : "bg-gray-200"}`)}
          />
        );
      })}
    </div>
  );
};

export default SquareBar;