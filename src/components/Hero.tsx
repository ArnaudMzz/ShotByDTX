import { useEffect, useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function HeroImage() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const root = window.document.documentElement;
    const observer = new MutationObserver(() => {
      setTheme(root.classList.contains("dark") ? "dark" : "light");
    });

    observer.observe(root, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Initial theme set
    setTheme(root.classList.contains("dark") ? "dark" : "light");

    return () => observer.disconnect();
  }, []);

  const bgImage =
    theme === "dark"
      ? "../../public/Voiture.jpeg"
      : "../../public/Voiture3.jpeg";

  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `url(${bgImage})`,
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />

      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">ShotByDTX</h1>
        <p className="text-lg md:text-2xl">
          Capturant l’instant. Rendant chaque image inoubliable.
        </p>
      </div>
      <ThemeToggle />
    </section>
  );
}
