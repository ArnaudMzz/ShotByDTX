import { useEffect, useState } from "react";
import AjouterImageForm from "../components/AddImageForm";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";

interface Photo {
  id: string;
  src: string;
  alt: string;
}

export default function Admin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  // Fonction utilitaire pour fetch avec token
  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = localStorage.getItem("authToken");
    return fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
      },
    });
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Vérifie la présence du token au chargement
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  // Récupération des images
  useEffect(() => {
    fetch(`${API_URL}/api/images`)
      .then((res) => res.json())
      .then((data: Photo[]) => {
        const sorted = data.sort((a, b) => (a.id < b.id ? 1 : -1));
        setPhotos(sorted);
      });
  }, [API_URL]);

  // Suppression sécurisée
  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Supprimer cette image ?");
    if (!confirmDelete) return;

    try {
      const res = await authFetch(`${API_URL}/api/images/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("❌ Erreur serveur :", error);
        alert("Erreur lors de la suppression.");
      } else {
        setPhotos((prev) => prev.filter((img) => img.id !== id));
        console.log("✅ Image supprimée !");
      }
    } catch (err) {
      console.error("❌ Erreur réseau :", err);
      alert("Erreur réseau.");
    }
  };

  return (
    <section className="py-12 px-6 bg-white dark:bg-gray-950 min-h-screen text-gray-900 dark:text-white">
      <div className="relative mb-10">
        <h1 className="text-3xl font-bold text-center text-primary">
          Panneau d’administration
        </h1>

        <div className="mt-4 sm:mt-0 sm:absolute sm:top-1/2 sm:right-0 sm:-translate-y-1/2">
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition w-full sm:w-auto"
          >
            Se déconnecter
          </button>
        </div>
      </div>

      <AjouterImageForm
        onNewImage={(img) =>
          setPhotos((prev) => [
            { id: img.id, alt: img.alt, src: img.src },
            ...prev,
          ])
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto mt-12">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="relative group overflow-hidden rounded-lg shadow-md"
          >
            <img
              src={`${API_URL}${photo.src}`}
              alt={photo.alt}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition flex justify-center items-center">
              <button
                onClick={() => handleDelete(photo.id)}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <ThemeToggle />
    </section>
  );
}
