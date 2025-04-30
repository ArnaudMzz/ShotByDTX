import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Si l'utilisateur est déjà connecté, le rediriger vers /admin
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("http://localhost:3001/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      const { token } = await res.json();
      localStorage.setItem("authToken", token);
      navigate("/admin"); // Rediriger vers /admin après login
    } else {
      alert("Identifiants invalides");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-900 p-8 rounded shadow-md space-y-4 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold text-center text-primary">
          Admin Login
        </h1>
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
        >
          Se connecter
        </button>
      </form>
      <ThemeToggle />
    </section>
  );
}
