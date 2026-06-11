import { useNavigate } from 'react-router-dom';

/**
 * RescataPulgarcitoStartPage — Pantalla de inicio antes de lanzar el juego.
 *
 * Diseño exacto según mockup UNIVO: tarjeta central con ilustración,
 * instrucción y botón "¡Jugar!".
 */
export default function RescataPulgarcitoStartPage() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/semana/1');
  const handleHome = () => navigate('/home');
  const handlePlay = () => {
    navigate('/semana/1/rescata-pulgarcito/play');
  };

  return (
    <div className="bg-surface-container-low min-h-screen flex flex-col font-body-md text-on-surface">
      {/* TopAppBar */}
      <header className="w-full top-0 bg-background flex justify-between items-center px-margin-mobile md:px-margin-desktop py-sm z-50 sticky">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Go Back"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors text-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              arrow_back
            </span>
          </button>
          <span className="font-headline-md text-headline-md text-primary">Science Quest</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleHome}
            aria-label="Home"
            className="w-12 h-12 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest transition-colors text-primary"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>
              home
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop bg-surface-container-low">
        {/* Game Start Card */}
        <div className="bg-surface-container-lowest rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)] border-2 border-surface-container relative">
          {/* Decorative Top Ribbon */}
          <div className="h-4 w-full bg-tertiary-fixed"></div>

          <div className="p-lg flex flex-col items-center text-center">
            {/* Hero Illustration */}
            <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden bg-tertiary-fixed-dim/20 mb-lg relative border-2 border-surface-container flex items-center justify-center">
              <img
                alt="Rescata a Pulgarcito Illustration"
                className="w-full h-full object-cover"
                src="/images/Pulgarcito.png"
              />
            </div>

            {/* Title & Description */}
            <div className="space-y-sm mb-lg max-w-lg">
              <h1 className="font-headline-lg text-headline-lg font-headline-lg-mobile text-headline-lg-mobile text-primary">
                Rescata a Pulgarcito
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Ayuda a Pulgarcito a medir el puente para cruzar.
              </p>
            </div>

            {/* Action Button */}
            <button
              onClick={handlePlay}
              className="bg-primary hover:bg-primary-container hover:text-on-primary-container text-on-primary px-xl py-md rounded-full font-label-lg text-label-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_0_#334d33] hover:shadow-[0_2px_0_0_#334d33] hover:translate-y-1 active:translate-y-2 active:shadow-none flex items-center gap-sm group"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: '"FILL" 1' }}
              >
                play_arrow
              </span>
              ¡Jugar!
            </button>
          </div>

          {/* Decorative Bottom Element */}
          <div className="h-2 w-full bg-surface-container-high mt-auto"></div>
        </div>
      </main>
    </div>
  );
}
