export default function FeatureSection() {
  return (
    <section className="py-16 bg-white text-gray-800 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-4xl font-bold">¿Cómo funciona Foodia?</h2>
        <p className="mt-4 text-lg text-gray-600">
          Foodia usa inteligencia artificial para crear recetas personalizadas
          en segundos.
        </p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-500">
              1. Elige tus ingredientes
            </h3>
            <p className="text-gray-700 mt-2">
              Ingresa lo que tienes en casa y deja que la IA haga su magia.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-500">
              2. Personaliza tus preferencias
            </h3>
            <p className="text-gray-700 mt-2">
              Selecciona dietas, tipos de cocina o restricciones alimentarias.
            </p>
          </div>

          <div className="p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-orange-500">
              3. Genera tu receta
            </h3>
            <p className="text-gray-700 mt-2">
              Recibe una receta única con instrucciones paso a paso.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
