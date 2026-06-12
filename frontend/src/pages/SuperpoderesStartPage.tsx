import { useNavigate, Link } from 'react-router-dom';
import '../styles/terra-ciencia.css';

/**
 * SuperpoderesStartPage — Pantalla de inicio de "Superpoderes" (Semana 5).
 *
 * Diseño "Exploradores de la Naturaleza" sobre las 4 funciones vitales
 * de los seres vivos (nacer, crecer, reproducirse, morir). 4 personajes:
 * Broti (semilla), Veloz (guepardo), Mamá Rana (rana), Comi (oruga).
 *
 * Tema visual Terra Ciencia: paleta sage/cream, tipografía Literata +
 * Nunito Sans, fondo jungle con hojas, animaciones float, botón bouncy 3D.
 */
export default function SuperpoderesStartPage() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/semana/5');
  const handleStart = () => {
    navigate('/semana/5/superpoderes/play');
  };

  return (
    <div
      className="min-h-screen flex flex-col relative tc-jungle-bg tc-body"
      style={{ color: 'var(--tc-on-surface)' }}
    >
      {/* Top Navigation Bar */}
      <header
        className="w-full top-0 sticky z-50 flex justify-between items-center px-[var(--tc-margin-mobile)] md:px-[var(--tc-margin-desktop)] py-[var(--tc-sm)] border-b-4 transition-all duration-300"
        style={{
          backgroundColor: 'var(--tc-surface)',
          borderColor: 'var(--tc-outline)',
          color: 'var(--tc-primary)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      >
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-3xl tc-headline tc-text-shadow-sm"
            style={{ color: 'var(--tc-primary)', fontVariationSettings: "'FILL' 1" }}
          >
            eco
          </span>
          <div className="flex flex-col">
            <span
              className="text-xs font-bold tracking-wider uppercase"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              Exploradores de la Naturaleza
            </span>
            <span className="font-bold text-tc-headline-lg-mobile md:text-tc-headline-lg">
              Las 4 Superpoderes de los Seres Vivos
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            aria-label="Volver a Semana 5"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-1 active:translate-x-1 border-2"
            style={{
              backgroundColor: 'var(--tc-surface-container)',
              borderColor: 'var(--tc-outline)',
              color: 'var(--tc-on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <button
            aria-label="Favoritos"
            className="w-10 h-10 rounded-full flex items-center justify-center hover:translate-y-0.5 hover:translate-x-0.5 transition-transform active:translate-y-1 active:translate-x-1 border-2"
            style={{
              backgroundColor: 'var(--tc-surface-container)',
              borderColor: 'var(--tc-outline)',
              color: 'var(--tc-on-surface-variant)',
            }}
          >
            <span className="material-symbols-outlined">star</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main
        className="flex-grow flex flex-col items-center justify-center relative px-4 py-12 md:py-24 overflow-hidden"
        id="main-content"
        style={{ transition: 'opacity 0.5s', opacity: 1 }}
      >
        {/* Character Placement (Midground) */}
        <div className="w-full max-w-6xl relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
          {/* Central Hero Content */}
          <div
            className="relative z-20 text-center flex flex-col items-center space-y-8 backdrop-blur-md p-8 md:p-12 rounded-3xl border-2 max-w-3xl mx-auto mt-12 md:mt-0"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--tc-surface) 80%, transparent)',
              borderColor: 'color-mix(in srgb, var(--tc-outline-variant) 30%, transparent)',
              boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
            }}
          >
            <div
              className="inline-flex items-center justify-center space-x-2 px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest mb-4"
              style={{
                backgroundColor: 'color-mix(in srgb, var(--tc-tertiary-container) 20%, transparent)',
                color: 'var(--tc-tertiary)',
              }}
            >
              <span className="material-symbols-outlined text-sm">explore</span>
              <span>Aventura Educativa</span>
            </div>

            <h1
              className="font-tc-headline text-tc-display-md md:text-tc-display-lg font-extrabold leading-tight"
              style={{ color: 'var(--tc-primary)', textShadow: '0 1px 2px rgba(0,0,0,0.15)' }}
            >
              Descubre los{' '}
              <span className="block mt-2" style={{ color: 'var(--tc-tertiary)' }}>
                4 Superpoderes
              </span>{' '}
              de los Seres Vivos
            </h1>

            <p
              className="text-lg md:text-xl max-w-xl mx-auto leading-relaxed"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              Únete a Broti, Veloz, Mamá Rana y Comi en un viaje mágico para aprender cómo
              nace, crece, se reproduce y muere la vida a nuestro alrededor.
            </p>

            {/* Bouncy Action Button */}
            <button
              onClick={handleStart}
              className="mt-8 relative group tc-bouncy-btn-wrap"
              id="start-btn"
            >
              <div
                className="tc-bouncy-btn-shadow"
                style={{ backgroundColor: 'var(--tc-on-primary-fixed-variant)' }}
              />
              <div
                className="tc-bouncy-btn-front space-x-3 px-10 py-5 font-bold text-xl md:text-2xl uppercase tracking-wider"
                style={{
                  backgroundColor: 'var(--tc-primary)',
                  color: 'var(--tc-on-primary)',
                  borderColor: 'var(--tc-on-primary-fixed-variant)',
                  boxShadow: '0 8px 0 rgba(42, 96, 56, 1)',
                }}
              >
                <span
                  className="material-symbols-outlined text-3xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  play_circle
                </span>
                <span>¡EMPEZAR AVENTURA!</span>
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav
        className="md:hidden fixed bottom-0 w-full z-50 rounded-t-lg font-tc-label text-base border-t-4 flex justify-around items-center h-20 px-2"
        style={{
          backgroundColor: 'var(--tc-surface-container-highest)',
          color: 'var(--tc-primary)',
          borderColor: 'var(--tc-outline)',
          boxShadow: '0px -4px 0px 0px rgba(0,0,0,1)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        <Link
          to="/home"
          className="flex flex-col items-center justify-center p-2 hover:bg-[var(--tc-primary-container)]/50 active:scale-95 transition-all duration-150 rounded-lg"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined text-2xl">rocket_launch</span>
          <span className="text-xs mt-1 font-medium">Misión</span>
        </Link>
        <Link
          to="/home"
          className="flex flex-col items-center justify-center p-2 hover:bg-[var(--tc-primary-container)]/50 active:scale-95 transition-all duration-150 rounded-lg"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined text-2xl">map</span>
          <span className="text-xs mt-1 font-medium">Mapa</span>
        </Link>
        <Link
          to="/semana/5/superpoderes"
          className="flex flex-col items-center justify-center rounded-lg p-2 border-2 active:scale-95 transition-all duration-150"
          style={{
            backgroundColor: 'var(--tc-primary-container)',
            color: 'var(--tc-on-primary-container)',
            borderColor: 'var(--tc-outline)',
          }}
        >
          <span
            className="material-symbols-outlined text-2xl"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            play_arrow
          </span>
          <span className="text-xs mt-1 font-bold">Jugar</span>
        </Link>
        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center p-2 hover:bg-[var(--tc-primary-container)]/50 active:scale-95 transition-all duration-150 rounded-lg"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined text-2xl">workspace_premium</span>
          <span className="text-xs mt-1 font-medium">Logros</span>
        </Link>
      </nav>
    </div>
  );
}
