import { Link } from "react-router-dom";
import { Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-white py-8 px-6 transition-colors">
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
        {/* Colonne 1 */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-primary">ShotByDTX</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Photographe passionné basé à Paris. Capturant l'instant avec style
            depuis 2020.
          </p>
        </div>

        {/* Colonne 2 */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-primary">Liens rapides</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-primary transition">
                Accueil
              </Link>
            </li>
            <li>
              <Link to="/galerie" className="hover:text-primary transition">
                Galerie
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary transition">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Colonne 3 */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-primary">Contact</h3>
          <div className="flex gap-4 items-center">
            <a
              href="https://instagram.com/shotbydtx"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#E1306C] transition"
            >
              <Instagram className="w-6 h-6" />
            </a>
            <a
              href="mailto:contact@shotbydtx.fr"
              className="hover:text-[#449DD1] transition"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-gray-500 dark:text-gray-400 text-sm mt-10 border-t border-gray-300 dark:border-gray-700 pt-6">
        © {new Date().getFullYear()}{" "}
        <span className="text-primary">ShotByDTX</span>. Tous droits réservés.
      </div>
    </footer>
  );
}
