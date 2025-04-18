import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLoader({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAnimating, setIsAnimating] = useState(true);

  // La phrase à animer
  const phrase = "Capturer l’instant. Sublimer le réel.";
  const words = phrase.split(" ");

  // On stoppe le loader après 2.5s + 1s de fade
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsAnimating(false);
    }, 3500); // 2500 d'affichage + 1000 de fade

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative">
      {/* Contenu du site : déjà présent en fond */}
      <div className="relative z-0">{children}</div>

      {/* Loader par-dessus avec fondu + animation mot par mot */}
      <AnimatePresence>
        {isAnimating && (
          <motion.div
            key="loader"
            className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            <motion.div
              className="flex flex-wrap justify-center gap-2 px-4 text-white text-3xl md:text-5xl font-bold text-center"
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.2,
                  },
                },
              }}
            >
              {words.map((word, index) => (
                <motion.span
                  key={index}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
