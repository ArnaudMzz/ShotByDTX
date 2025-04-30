import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// import AjouterImageForm from "./AddImageForm";

interface Photo {
  id: string;
  src: string;
  alt: string;
}

export default function Gallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedImage, setSelectedImage] = useState<Photo | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const photosPerPage: number = 15;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/images`)
      .then((res) => res.json())
      .then((data: Photo[]) => {
        const sorted = data.sort((a: Photo, b: Photo) =>
          a.id < b.id ? 1 : -1
        );
        setPhotos(sorted);
      });
  }, [API_URL]);

  const indexOfLastPhoto = currentPage * photosPerPage;
  const indexOfFirstPhoto = indexOfLastPhoto - photosPerPage;
  const currentPhotos = photos.slice(indexOfFirstPhoto, indexOfLastPhoto);
  const totalPages = Math.ceil(photos.length / photosPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <section className="bg-white dark:bg-gray-950 py-12 px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-800 dark:text-white">
        Galerie
      </h2>
      <div className="columns-1 sm:columns-2 md:columns-3 gap-4 max-w-6xl mx-auto space-y-4 mt-10">
        {currentPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            viewport={{ once: true }}
            className="break-inside-avoid relative rounded-xl overflow-hidden cursor-pointer group shadow-md"
            onClick={() => setSelectedImage(photo)}
          >
            <img
              src={`${API_URL}${photo.src}`}
              alt={photo.alt}
              className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 w-full bg-black/40 text-white text-center text-sm p-2 opacity-0 group-hover:opacity-100 transition">
              {photo.alt}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center gap-2 mt-10 flex-wrap">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === i + 1
                ? "bg-black text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {i + 1}
          </button>
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
              className="relative max-w-5xl w-full mx-4 max-h-[90vh] flex flex-col items-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image + Close button container */}
              <div className="relative w-fit max-h-[90vh]">
                <img
                  src={`${API_URL}${selectedImage.src}`}
                  alt={selectedImage.alt}
                  className="max-h-[90vh] object-contain rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-black/70 text-white p-2 rounded-full z-10 hover:bg-black"
                  onClick={() => setSelectedImage(null)}
                >
                  <X size={20} />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
