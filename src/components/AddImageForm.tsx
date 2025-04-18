import { useEffect, useRef, useState } from "react";

type ImageToUpload = {
  file: File;
  preview: string;
  alt: string;
};

type Props = {
  onNewImage: (image: { id: number; src: string; alt: string }) => void;
};

export default function AjouterImageForm({ onNewImage }: Props) {
  const [images, setImages] = useState<ImageToUpload[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Génère les previews
  useEffect(() => {
    return () => {
      images.forEach((img) => URL.revokeObjectURL(img.preview));
    };
  }, [images]);

  // Handle file drop or selection
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    for (const img of images) {
      const formData = new FormData();
      formData.append("image", img.file);
      formData.append("alt", img.alt);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/images`, {
        method: "POST",
        body: formData,
      });

      const newImage = await res.json();
      onNewImage(newImage);
    }

    // Reset form
    setImages([]);
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
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto flex flex-col gap-6"
    >
      {/* Dropzone */}
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
          className="hidden"
        />
      </div>

      {/* Previews */}
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
  );
}
