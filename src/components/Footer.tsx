// src/components/Footer.tsx
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center py-4 text-gray-500 text-sm dark:bg-gray-800 dark:text-gray-400">
      © {new Date().getFullYear()} ShotByDTX. Tous droits réservés.
    </footer>
  );
}
