export default function HeroImage() {
  return (
    <section
      className="relative w-full min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center text-white text-center px-4"
      style={{
        backgroundImage: `url("/Voiture.jpeg")`,
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Contenu */}
      <div className="relative z-10 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">ShotByDTX</h1>
        <p className="text-lg md:text-2xl">
          Capturant l’instant. Rendant chaque image inoubliable.
        </p>
      </div>
    </section>
  );
}
