import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import AjouterImageForm from "./AddImageForm";

type Photo = {
  id: string;
  src: string;
  alt: string;
};

type ApiImage = {
  _id: string;
  src: string;
  alt: string;
};

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/images`)
      .then((res) => res.json())
      .then((data: ApiImage[]) => {
        const updated = data.map((img) => ({
          id: img._id,
          alt: img.alt,
          src: img.src,
        }));
        setPhotos(updated);
      });
  }, [API_URL]);

  return (
    <section className="bg-white dark:bg-gray-950 py-12 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Galerie
      </h2>

      <AjouterImageForm
        onNewImage={(img) =>
          setPhotos((prev) => [
            ...prev,
            {
              id: img.id,
              alt: img.alt,
              src: `${API_URL}${img.src}`, // ✅ même logique ici
            },
          ])
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-10">
        {photos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-2xl shadow-md group cursor-pointer"
            onClick={() => setSelectedImage(photo)}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover transform group-hover:scale-105 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center">
              <p className="text-white text-lg font-medium">{photo.alt}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              className="relative max-w-3xl w-full mx-4"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-2 right-2 bg-white text-black p-2 rounded-full z-10"
                onClick={() => setSelectedImage(null)}
              >
                <X size={20} />
              </button>
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="rounded-xl w-full h-auto object-contain"
              />
              <p className="text-white text-center mt-4 text-lg">
                {selectedImage.alt}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
