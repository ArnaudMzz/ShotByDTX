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
    <nav className="bg-white shadow-md bg-black bg-opacity-0 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white-800 dark:text-white">
          <Link to="/" className="hover:text-black dark:hover:text-white">
            ShotByDTX
          </Link>
        </h2>

        {/* Desktop Menu */}
        <ul className="hidden text-xl md:flex gap-6 text-white dark:text-gray-300">
          <li>
            <Link to="/" className="hover:text-black dark:hover:text-white">
              Accueil
            </Link>
          </li>
          <li>
            <Link
              to="/galerie"
              className="hover:text-black dark:hover:text-white"
            >
              Galerie
            </Link>
          </li>
          <li>
            <a
              href="#contact"
              className="hover:text-black dark:hover:text-white"
            >
              Contact
            </a>
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
            <ul className="flex flex-col gap-4 pb-4 text-gray-600 dark:text-gray-300">
              <li className="hover:text-black dark:hover:text-white cursor-pointer">
                Accueil
              </li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">
                Portfolio
              </li>
              <li className="hover:text-black dark:hover:text-white cursor-pointer">
                Contact
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
