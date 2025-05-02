import { useEffect, useRef, useState } from "react";

type ImageToUpload = {
  file: File;
  preview: string;
  alt: string;
};

type Props = {
  onNewImage: (image: { id: string; src: string; alt: string }) => void;
};

export default function AjouterImageForm({ onNewImage }: Props) {
  const [images, setImages] = useState<ImageToUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;

    const newImages: ImageToUpload[] = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        alt: "",
      }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  // 🔐 fetch avec token pour formulaire
  const authFetchFormData = (url: string, formData: FormData) => {
    const token = localStorage.getItem("authToken"); // Récupère le token du localStorage
    if (!token) {
      console.error("Token manquant !");
      return Promise.reject("Token manquant");
    }

    return fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // Envoie le token dans l'en-tête
      },
      body: formData,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const img of images) {
      const formData = new FormData();
      formData.append("image", img.file); // L'image
      formData.append("alt", img.alt); // Le texte alternatif

      try {
        const res = await authFetchFormData(`${API_URL}/api/images`, formData);

        if (!res.ok) {
          const msg = await res.text();
          console.error("❌ Erreur serveur:", msg);
          continue;
        }

        const newImage = await res.json();
        onNewImage({
          id: newImage.id,
          alt: newImage.alt,
          src: `${API_URL}${newImage.src}`,
        });
      } catch (err) {
        console.error("❌ Erreur fetch:", err);
      }
    }

    setImages([]); // Réinitialiser la liste des images
  };

  const handleAltChange = (index: number, value: string) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, alt: value } : img))
    );
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <div>
        <form action="http://localhost:3001/api/images" method="POST">
          <input type="file" name="image" />
          <input type="text" name="alt" placeholder="Description de l'image" />
          <button type="submit">Envoyer</button>
        </form>
      </div>
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto flex flex-col gap-6"
      >
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-gray-400 p-6 text-center rounded-lg cursor-pointer bg-white hover:border-black transition"
        >
          <p className="text-gray-500">
            Glisse ici plusieurs images ou clique pour en sélectionner
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => handleFiles(e.target.files)}
            name="image" // Assure-toi que le nom de l'input est bien 'image'
            className="hidden"
          />
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img, index) => (
              <div key={index} className="relative border rounded-lg p-2">
                <img
                  src={img.preview}
                  alt={`preview-${index}`}
                  className="w-full h-auto object-contain rounded mb-2"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={img.alt}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  className="border p-2 rounded w-full"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {images.length > 0 && (
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Ajouter {images.length} image{images.length > 1 ? "s" : ""}
          </button>
        )}
      </form>
    </>
  );
}
