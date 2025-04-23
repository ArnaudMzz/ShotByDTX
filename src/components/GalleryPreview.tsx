import { Link } from "react-router-dom";

export default function GalleryPreview() {
  return (
    <section className="py-12 px-6 bg-white dark:bg-gray-950">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8">
        Aperçu de la galerie
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            className="overflow-hidden rounded-xl shadow-md hover:shadow-lg transition"
          >
            <img
              src={`../../public/${num}.jpeg`}
              alt={`Preview ${num}`}
              className="w-full h-[500px] object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>

      <div className="text-center bg-red mt-8">
        <Link
          to="/galerie"
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-gray-800 transition"
        >
          Voir la galerie complète
        </Link>
      </div>
    </section>
  );
}
