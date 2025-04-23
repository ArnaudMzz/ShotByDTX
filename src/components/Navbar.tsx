import { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <nav className=" shadow-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-primary dark:text-primary">
          <Link to="/" className="hover:opacity-80">
            ShotByDTX
          </Link>
        </h2>
        {/* Desktop Menu */}
        <ul className="hidden text-xl md:flex gap-6 text-gray-900 dark:text-gray-300">
          <li>
            <Link to="/" className="hover:text-primary dark:hover:text-primary">
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/galerie"
              className="hover:text-primary dark:hover:text-primary"
            >
              Galerie
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className="hover:text-primary dark:hover:text-primary"
            >
              Contact
            </Link>
          </li>
        </ul>

        {/* Mobile Icon */}
        <button
          className="md:hidden text-gray-800 dark:text-white"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden px-6 overflow-hidden"
          >
            <ul className="flex flex-col gap-4 pb-4 text-gray-700 dark:text-gray-300">
              <li>
                <Link
                  to="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary dark:hover:text-primary"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/galerie"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary dark:hover:text-primary"
                >
                  Galerie
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-primary dark:hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
