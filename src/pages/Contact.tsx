import { Mail, Phone, MapPin, Instagram } from "lucide-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import ThemeToggle from "../components/ThemeToggle";
export default function Contact() {
  return (
    <section className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Navbar />
      <div className="max-w-6xl py-20 text-xl mx-auto grid md:grid-cols-2 gap-12">
        {/* Infos de contact */}
        <div className="">
          <h2 className="text-3xl font-bold mb-4">Me contacter</h2>
          <p className="text-gray-600  dark:text-gray-300 mb-6">
            Tu peux me joindre via ce formulaire ou sur mes réseaux. Je réponds
            en général dans les 24h.
          </p>

          <ul className="space-y-4 text-m">
            <li className="flex items-center gap-3">
              <MapPin className="w-5 h-5" /> Lyon, France
            </li>
            <li className="flex items-center gap-3">
              <Phone className="w-5 h-5" /> +33 6 00 00 00 00
            </li>
            <li className="flex items-center gap-3">
              <Mail className="w-5 h-5" />
              <a href="mailto:contact@shotbydtx.fr" className="underline">
                contact@shotbydtx.fr
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Instagram className="w-5 h-5" />
              <a
                href="https://instagram.com/shotbydtx"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                @shotbydtx
              </a>
            </li>
          </ul>
          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-4">FAQ</h2>
            <ul className="text-lg space-y-3 text-gray-600 dark:text-gray-400">
              <li>
                <strong>📸 Quel type de photos fais-tu ?</strong> Car spotting,
                car shooting.
              </li>
              <li>
                <strong>📍 Tu te déplaces ?</strong> Oui, sur Lyon et alentours.
              </li>
              <li>
                <strong>💬 Combien de temps pour les retouches ?</strong>{" "}
                Environ 48h.
              </li>
            </ul>
          </div>
        </div>

        {/* Formulaire */}
        <div>
          <h2 className="text-3xl font-bold mb-6">Formulaire</h2>
          <form className="space-y-6">
            <input
              type="text"
              placeholder="Nom"
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <textarea
              placeholder="Ton message"
              rows={5}
              className="w-full px-4 py-2 rounded bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white"
              required
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 transition"
            >
              Envoyer
            </button>
          </form>
        </div>
      </div>
      <Footer />
      <ThemeToggle />
    </section>
  );
}
