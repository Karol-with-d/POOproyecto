import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/terra-ciencia.css';

/**
 * QuizIntroPage — Pantalla de inicio del Quiz de Semana 5.
 *
 * Muestra al personaje "Sabio" (búho) con un globo de diálogo, las 3
 * insignias de los temas cubiertos (Superpoderes, Siembra, Búsqueda),
 * stats del quiz (3 preguntas, 30 puntos, insignia) y el botón CTA
 * "¡Empezar Quiz!" con animación de pulso.
 *
 * El botón navega a /semana/5/quiz/play (stub por implementar) o
 * muestra "Próximamente" si no existe la ruta aún.
 */

const THEME_CARDS = [
  { icon: 'star', color: 'var(--tc-tertiary)', label: 'Los 4 Superpoderes' },
  { icon: 'sledding', color: 'var(--tc-primary)', label: 'Siembra tu Semilla' },
  { icon: 'search', color: 'var(--tc-secondary)', label: 'La Lupa de Detective' },
] as const;

const BG_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDdj7moStYm82MxIKHzmZ--K5n5RLBBhvZEzOipyVuG4QwRRQAtrr4ObZ2Ck86xEC0ciTzmYbrQ0RW1BcNoubyicHBo2fq4J0CMqHf6orRa0evP-DS_qPiJjuVGxNti7FnWLD0vM61-gZjtYmBbZmo1DD_IM-XA-NaGLjbvg1dCSpugFJiQPSLoU_2sloVWBL-BJOzzmqf7r6sMMWOT7H4r4MWFVt8wJ8_JdkVsvkO4mHi_i-fYXppb4MVLLSS-_EBlZdZQt7C304CD';
const SABIO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAyRt4JmvNNGfiEG1Xky_d0PD7hEQ5voJ_L2cI1whXmL5k8xwZV7I5ZVRoWcvUM8Bb4DB3235HTdxBidR3vuXcc1hBVJNbX8t_b1RSUV3J59q6yvlc8ggcU0me7sawD3_wlkGqkfka1PFVmjcJ_q2KNOXrMXY6sjBTrGMjOo69K_sRxZ2psuB9G2nmk0aeF3u8VGipENt7tPcwEMSIcDX0F4j28R30JrhsYUvMqhJNhdD-_6AeC7_oVuWVxjkvr9wekZqlEHAPLQju1';

export default function QuizIntroPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleStart = () => {
    setLoading(true);
    setTimeout(() => {
      // Por ahora no hay /play implementado → fallback
      alert('Próximamente');
      setLoading(false);
    }, 500);
  };

  return (
    <div
      className="h-screen w-full flex flex-col items-center relative"
      style={{ backgroundColor: 'var(--tc-background)' }}
    >
      {/* Full Bleed Background */}
      <div className="absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        <img
          alt="Paisaje natural orgánico de fondo"
          className="w-full h-full object-cover"
          src={BG_IMG}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to bottom, transparent 0%, transparent 80%, color-mix(in srgb, var(--tc-background) 20%, transparent) 100%)',
          }}
        />
      </div>

      {/* Top Header */}
      <header className="z-20 flex justify-between items-center px-6 py-4 w-full bg-transparent flex-shrink-0">
        <h1
          className="font-tc-headline text-3xl font-black drop-shadow-sm"
          style={{ color: 'var(--tc-primary)' }}
        >
          Terra Kids
        </h1>
        <button
          onClick={() => navigate('/semana/5')}
          aria-label="Salir del Quiz"
          className="flex items-center gap-2 font-bold py-2 px-4 rounded-xl transition-colors active:scale-95"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--tc-surface) 80%, transparent)',
            color: 'var(--tc-on-surface-variant)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="hidden md:inline">Salir</span>
        </button>
      </header>

      {/* Main Content Area (Sabio & Speech Bubble) */}
      <main className="z-10 flex-1 flex flex-col items-center justify-center w-full px-4 py-2 min-h-0">
        {/* Speech Bubble */}
        <div
          className="relative tc-speech-bubble bg-white p-5 md:p-6 rounded-3xl shadow-xl max-w-sm mb-4 md:mb-6 tc-float-anim"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <p className="text-base md:text-xl font-bold leading-relaxed text-center font-tc-body">
            ¡Hola! Soy Sabio, tu guía del quiz. ¿Estás listo para demostrar lo que aprendiste?
          </p>
        </div>

        {/* Sabio the Owl */}
        <div
          className="relative w-56 md:w-80 lg:w-96"
          style={{ filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))' }}
        >
          <img
            alt="Sabio el búho sabio, personaje guía del quiz"
            className="w-full h-auto"
            src={SABIO_IMG}
          />
        </div>

        {/* Theme Cards Row */}
        <div className="flex flex-row gap-3 mt-4 md:mt-6 overflow-x-auto pb-2 tc-scroll-hide max-w-full">
          {THEME_CARDS.map((card) => (
            <div
              key={card.label}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl shadow-sm border shrink-0 transition-transform hover:scale-105"
              style={{
                backgroundColor: 'color-mix(in srgb, #ffffff 90%, transparent)',
                color: 'var(--tc-on-surface)',
                borderColor: 'color-mix(in srgb, var(--tc-outline-variant) 30%, transparent)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                className="material-symbols-outlined"
                style={{ color: card.color, fontVariationSettings: "'FILL' 1" }}
              >
                {card.icon}
              </span>
              <span className="text-sm font-bold whitespace-nowrap font-tc-body">{card.label}</span>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Area (Stats & CTA) */}
      <footer className="z-20 w-full flex flex-col items-center gap-4 md:gap-6 px-6 pb-8 md:pb-12 pt-2 md:pt-4 flex-shrink-0">
        {/* Quiz Stats */}
        <div
          className="flex items-center justify-center gap-4 md:gap-8 font-bold text-base font-tc-body flex-wrap"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ color: 'var(--tc-primary)' }}>
              help
            </span>
            <span>3 preguntas</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ color: 'var(--tc-tertiary)' }}>
              military_tech
            </span>
            <span>30 puntos posibles</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined" style={{ color: 'var(--tc-secondary)' }}>
              emoji_events
            </span>
            <span>Gana tu insignia</span>
          </div>
        </div>

        {/* CTA Button */}
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full max-w-sm text-2xl font-black py-5 rounded-[32px] tc-pulse-custom active:scale-95 transition-all disabled:opacity-80 font-tc-label"
          style={{
            backgroundColor: 'var(--tc-primary)',
            color: 'var(--tc-on-primary)',
            boxShadow: '0 10px 25px -5px rgba(74, 124, 89, 0.4), 0 4px 6px -2px rgba(74, 124, 89, 0.2)',
          }}
        >
          {loading ? '¡Cargando...' : '¡Empezar Quiz!'}
        </button>
      </footer>
    </div>
  );
}
