interface AdModalProps {
  onClose: () => void;
  onWatchAd: () => void;
}

export default function AdModal({ onClose, onWatchAd }: AdModalProps) {
  const closeAdModal = () => onClose();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleWatchAd = () => onWatchAd();
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-md relative max-w-sm w-full">
        <button
          onClick={closeAdModal}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-4">
          Has llegado al limite de creditos diarios
        </h2>
        <p className="mb-4">
          {/* ¿Deseas ver un anuncio para obtener 1 generación adicional? */}
          Vuelve mañana o instalese la aplicación y obten una generación
          adicional.
        </p>
        {/* <button
          onClick={handleWatchAd}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Ver anuncio
        </button> */}
      </div>
    </div>
  );
}
