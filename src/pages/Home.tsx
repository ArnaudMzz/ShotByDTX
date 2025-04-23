import GalleryPreview from "../components/GalleryPreview";

export default function Home() {
  return (
    <main className="text-gray-900 dark:text-white">
      <section className="max-w-3xl mx-auto text-center py-20 px-6">
        <h2 className="text-3xl font-bold mb-6">À propos</h2>
        <p className="text-lg leading-relaxed">
          Je m'appelle David, photographe amateur passionné par l'automobile.
          Autodidacte, j’ai appris à capturer les lignes, les reflets et l’âme
          des voitures à travers l’objectif. Basé à Lyon, je suis toujours à la
          recherche de nouveaux modèles, de belles mécaniques et de lieux
          inspirants pour mettre en valeur chaque détail.
        </p>
      </section>
      <GalleryPreview />
    </main>
  );
}
