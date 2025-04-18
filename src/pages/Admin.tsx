// src/pages/Admin.tsx
import { useState } from "react";
import AjouterImageForm from "../components/AddImageForm";

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "nono") {
      setIsLoggedIn(true);
    } else {
      alert("Mot de passe incorrect");
    }
  };

  return (
    <section className="min-h-screen bg-white dark:bg-gray-950 text-center py-20 px-4">
      {!isLoggedIn ? (
        <form
          onSubmit={handleLogin}
          className="max-w-md mx-auto flex flex-col gap-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            Connexion Admin
          </h2>
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Se connecter
          </button>
        </form>
      ) : (
        <>
          <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">
            Ajouter une image 📸
          </h2>
          <AjouterImageForm onNewImage={() => {}} />
        </>
      )}
    </section>
  );
}
