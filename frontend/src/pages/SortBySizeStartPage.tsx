import { useNavigate } from 'react-router-dom';

/**
 * SortBySizeStartPage — Pantalla de inicio antes de lanzar el juego.
 *
 * Diseño exacto según mockup UNIVO: fondo blanco, ilustración central flotante,
 * título grande y botón "¡Iniciar!" con efecto squishy.
 */
export default function SortBySizeStartPage() {
  const navigate = useNavigate();

  const handlePlay = () => {
    navigate('/semana/1/sort-by-size/play');
  };

  return (
    <div className="bg-white text-on-background min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop antialiased">
      {/* Main Content Container */}
      <main className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-lg md:space-y-xl">
        {/* Header Section */}
        <header className="flex flex-col items-center space-y-sm">
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg font-bold text-primary tracking-tight">
            Sort by Size
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
            Organicemos cosas de menor a mayor!
          </p>
        </header>

        {/* Illustration Section */}
        <div className="relative w-full max-w-[280px] md:max-w-[400px] aspect-square rounded-3xl bg-surface-container-lowest p-md flex items-center justify-center">
          <img
            alt="Sort by Size Illustration"
            className="w-full h-full object-contain animate-float"
            style={{ filter: 'drop-shadow(rgba(74, 101, 73, 0.15) 0px 10px 15px)' }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC11AnZnniwWpLXgMxquqkQDzWUf8P8LrCxGofU7Ssj5VZxisW0YLa6mU-gcLbQC02jTsryzDh6GEOv_KcXCg1yTAHa0XfTfjdDMdjG0rZbjhpzV5ak4Ci6wEQduT1nnsVoDCPI4MeeK28OHFqHmZrfqA-gg0K8eR-oUWKFzv-mFIcnBgH4C1ARzS-tXvtC4kcsHjQB9O28uYZzznZ_AUt7DyGuF91Gi8PxzDBCdmfBXTneNKSGCDxHivGELrFrgoeaFc7a2s87CO3l"
          />
        </div>

        {/* Call to Action Section */}
        <div className="w-full max-w-xs md:max-w-sm pt-md">
          <button
            onClick={handlePlay}
            className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-4 px-8 rounded-2xl flex items-center justify-center gap-md hover:bg-surface-tint focus:outline-none focus:ring-4 focus:ring-secondary-fixed focus:ring-offset-4 focus:ring-offset-white transition-all border-b-[6px] border-[#334d33] active:translate-y-1 active:border-b-2"
          >
            <span>¡Iniciar!</span>
            <span
              className="material-symbols-outlined"
              style={{ fontSize: '32px', fontVariationSettings: '"FILL" 1' }}
            >
              play_arrow
            </span>
          </button>
        </div>
      </main>
    </div>
  );
}
