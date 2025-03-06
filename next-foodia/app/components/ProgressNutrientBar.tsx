export default function ProgressNutrientBar({
  label,
  value,
  low,
  high,
}: {
  label: string;
  value: number;
  low: number;
  high: number;
}) {
  const percentage = Math.min((value / high) * 100, 100);

  const getColor = () => {
    if (value <= low) return "bg-green-500"; // Bajo (verde)
    if (value <= high) return "bg-yellow-500"; // Moderado (amarillo)
    return "bg-red-500"; // Alto (rojo)
  };

  return (
    <div className="mb-4">
      <span className="block font-semibold mb-1">
        {label}: {value}
      </span>
      <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
