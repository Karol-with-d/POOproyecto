import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetScrollOn } from '../components/WeekScrollReset';
import '../styles/terra-ciencia.css';
import { playLevelUp, playMiss, playSuccess } from '../services/sounds';

/**
 * BusquedaGamePage — "La Lupa de Detective" (Modo Laboratorio).
 *
 * 8 tarjetas con objetos (4 vivos, 4 sin vida). El niño debe tocar
 * "¡Ser Vivo! 🌿" o "Sin Vida ⚙️" en cada una. Solo se suman puntos
 * al identificar correctamente los 4 seres vivos. Al llegar a 4/4,
 * aparece la pantalla de celebración.
 *
 * UX: cursor lupa CSS solo en desktop (hover + pointer fino);
 * en móvil/tablet se usa el cursor nativo (tap-first UI).
 */

const ASSETS = [
  {
    id: '/images/perro.webp',
    name: 'Cachorro',
    isLiving: true,
  },
  {
    id: '/images/bici.avif',
    name: 'Bicicleta',
    isLiving: false,
  },
  {
    id: '/images/planta.avif',
    name: 'Planta',
    isLiving: true,
  },
  {
    id: '/images/piedra.avif',
    name: 'Piedra',
    isLiving: false,
  },
  {
    id: '/images/hongo.jpg',
    name: 'Hongo',
    isLiving: true,
  },
  {
    id: '/images/semana5/pelota.svg',
    name: 'Pelota',
    isLiving: false,
  },
  {
    id: '/images/mariposa.avif',
    name: 'Mariposa',
    isLiving: true,
  },
  {
    id: '/images/nube.avif',
    name: 'Nube',
    isLiving: false,
  },
];

const TOTAL_LIVING = 4;

type View = 'intro' | 'game' | 'finish';

export default function BusquedaGamePage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>('intro');
  useResetScrollOn(view);
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const startGame = () => {
    setView('game');
    setScore(0);
    setSolved(new Set());
    setShakingIndex(null);
    setFeedback({});
  };

  const goToIntro = () => {
    setView('intro');
    setScore(0);
    setSolved(new Set());
    setShakingIndex(null);
    setFeedback({});
  };

  const handleAnswer = (index: number, selectedLiving: boolean) => {
    const asset = ASSETS[index];
    if (solved.has(index)) return;

    if (selectedLiving === asset.isLiving) {
      const nextSolved = new Set(solved);
      nextSolved.add(index);
      setSolved(nextSolved);
      if (asset.isLiving) {
        const newScore = score + 1;
        setScore(newScore);
        if (newScore === TOTAL_LIVING) {
          playLevelUp();
          setTimeout(() => setView('finish'), 500);
        } else {
          playSuccess();
        }
      } else {
        playSuccess();
      }
    } else {
      playMiss();
      setShakingIndex(index);
      setFeedback((prev) => ({ ...prev, [index]: '¡Inténtalo de nuevo!' }));
      setTimeout(() => {
        setShakingIndex(null);
        setFeedback((prev) => {
          const next = { ...prev };
          delete next[index];
          return next;
        });
      }, 1000);
    }
  };

  return (
    <div
      className="busqueda-root min-h-[100dvh] w-full tc-clay-texture tc-cursor-magnifier relative"
      style={{ color: 'var(--tc-on-surface)' }}
    >
      <div className="tc-life-atmosphere" aria-hidden="true">
        <span className="tc-life-blob" />
      </div>

      {/* Intro Screen */}
      {view === 'intro' && (
        <main
          className="relative z-10 flex items-center justify-center min-h-[100dvh] p-4 sm:p-6"
          key="intro"
        >
          <button
            onClick={() => navigate('/semana/5')}
            className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 font-bold py-3 px-5 rounded-xl tc-card-shadow active:scale-95"
            style={{
              backgroundColor: 'var(--tc-surface)',
              color: 'var(--tc-primary)',
              border: '1px solid var(--tc-outline-variant)',
            }}
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Volver</span>
          </button>
          <div
            className="bg-surface rounded-3xl p-6 sm:p-12 text-center max-w-xl w-full tc-card-shadow tc-fade-in"
            style={{ border: '4px solid var(--tc-primary-container)' }}
          >
            <div className="mb-6 sm:mb-8 flex justify-center">
              <div
                className="w-20 h-20 sm:w-32 sm:h-32 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-primary)',
                }}
              >
                <span
                  className="material-symbols-outlined text-5xl sm:text-7xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  biotech
                </span>
              </div>
            </div>
            <h1
              className="text-3xl sm:text-5xl font-tc-headline font-black mb-4 leading-tight"
              style={{ color: 'var(--tc-primary)' }}
            >
              ¡La Lupa de Detective!
            </h1>
            <p
              className="text-base sm:text-xl font-tc-body mb-6 sm:mb-10"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              ¿Eres capaz de distinguir qué cosas tienen vida y cuáles no? ¡Únete a la misión
              del Laboratorio de Terra!
            </p>
            <button
              onClick={startGame}
              className="text-lg sm:text-2xl font-bold py-4 px-6 sm:py-6 sm:px-12 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3 sm:gap-4 mx-auto w-full sm:w-auto"
              style={{
                backgroundColor: 'var(--tc-primary)',
                color: 'var(--tc-on-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tc-primary-container)';
                e.currentTarget.style.color = 'var(--tc-on-primary-container)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tc-primary)';
                e.currentTarget.style.color = 'var(--tc-on-primary)';
              }}
            >
              <span>¡Empezar la misión!</span>
              <span className="material-symbols-outlined">rocket_launch</span>
            </button>
          </div>
        </main>
      )}

      {/* Game Screen */}
      {view === 'game' && (
        <main
          className="relative z-10 flex flex-col p-3 sm:p-6 w-full scroll-board"
          key="game"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 items-center mb-4 sm:mb-8 max-w-7xl mx-auto w-full">
            <button
              onClick={goToIntro}
              className="flex items-center gap-2 font-bold py-3 px-6 rounded-xl transition-colors duration-200 tc-card-shadow active:scale-95"
              style={{
                backgroundColor: 'var(--tc-surface)',
                color: 'var(--tc-primary)',
                border: '1px solid var(--tc-outline-variant)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tc-surface-container-high)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--tc-surface)';
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Volver</span>
            </button>
            <div
              className="px-4 py-2 sm:px-8 sm:py-4 rounded-full flex flex-wrap items-center justify-center gap-2 sm:gap-4 tc-card-shadow max-w-full text-center"
              style={{ backgroundColor: 'var(--tc-surface-container-highest)' }}
            >
              <span
                className="font-tc-label font-black text-sm sm:text-xl uppercase tracking-wider"
                style={{ color: 'var(--tc-primary)' }}
              >
                Seres vivos encontrados:
              </span>
              <div
                className="px-3 py-1 sm:px-6 sm:py-2 rounded-full font-tc-headline font-black text-xl sm:text-3xl"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-on-primary-container)',
                }}
              >
                {score} / {TOTAL_LIVING}
              </div>
            </div>
          </div>

          {/* Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 max-w-7xl mx-auto w-full pb-6 sm:pb-12"
            key={`grid-${view}`}
          >
            {ASSETS.map((asset, index) => {
              const isSolved = solved.has(index);
              const isShaking = shakingIndex === index;
              return (
                <div
                  key={`${asset.name}-${index}`}
                  className={`bg-white rounded-3xl p-3 sm:p-4 flex flex-col items-center tc-card-shadow relative overflow-hidden transition-all duration-300 tc-rise-in tc-rise-delay-${(index % 4) + 1} ${
                    isSolved
                      ? 'border-4'
                      : 'border border-outline-variant hover:-translate-y-1'
                  } ${isShaking ? 'tc-shake kid-wrong' : ''}`}
                  style={
                    isSolved
                      ? {
                          borderColor: 'var(--tc-primary)',
                          boxShadow:
                            '0 0 0 4px color-mix(in srgb, var(--tc-primary) 20%, transparent)',
                        }
                      : undefined
                  }
                >
                  <div
                    className="w-full rounded-2xl mb-2 sm:mb-4 flex items-center justify-center p-2 sm:p-4"
                    style={{
                      backgroundColor: 'var(--tc-surface-container-low)',
                      aspectRatio: '1 / 1',
                    }}
                  >
                    <img
                      src={asset.id}
                      alt={asset.name}
                      className="w-full h-full object-contain pointer-events-none rounded-2xl"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleAnswer(index, true)}
                      disabled={isSolved}
                      className="w-full min-h-[44px] py-3 px-1 rounded-lg font-tc-label font-black text-xs sm:text-sm uppercase leading-tight flex items-center justify-center gap-1 sm:gap-2 transition-all active:scale-95 disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--tc-primary-fixed)',
                        color: 'var(--tc-primary)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSolved) {
                          e.currentTarget.style.backgroundColor = 'var(--tc-primary-container)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--tc-primary-fixed)';
                      }}
                    >
                      ¡Ser Vivo! 🌿
                    </button>
                    <button
                      onClick={() => handleAnswer(index, false)}
                      disabled={isSolved}
                      className="w-full min-h-[44px] py-3 px-1 rounded-lg font-tc-label font-black text-xs sm:text-sm uppercase leading-tight flex items-center justify-center gap-1 sm:gap-2 transition-all active:scale-95 disabled:opacity-50"
                      style={{
                        backgroundColor: 'var(--tc-secondary-container)',
                        color: 'var(--tc-secondary)',
                      }}
                      onMouseEnter={(e) => {
                        if (!isSolved) {
                          e.currentTarget.style.backgroundColor =
                            'var(--tc-surface-container-highest)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--tc-secondary-container)';
                      }}
                    >
                      Sin Vida ⚙️
                    </button>
                  </div>
                  {feedback[index] && (
                    <div
                      className="absolute bottom-2 left-0 w-full text-center text-xs font-bold tc-fade-in"
                      style={{ color: 'var(--tc-error)' }}
                    >
                      {feedback[index]}
                    </div>
                  )}
                  {isSolved && (
                    <div
                      className="absolute top-2 right-2 rounded-full w-8 h-8 flex items-center justify-center shadow-md flex items-center justify-center"
                      style={{
                        backgroundColor: 'var(--tc-primary)',
                        color: 'var(--tc-on-primary)',
                        animation: 'tc-bounce-pop 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
                      }}
                      aria-label="Correcto"
                    >
                      <span
                        className="material-symbols-outlined text-sm"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        check_circle
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* Finish Overlay */}
      {view === 'finish' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center tc-fade-in"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--tc-primary) 20%, transparent)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="finish-title"
        >
          <div
            className="rounded-3xl p-6 sm:p-12 text-center tc-card-shadow max-w-lg w-[92vw] max-h-[90vh] overflow-y-auto tc-rise-in"
            style={{
              backgroundColor: 'var(--tc-surface)',
              border: '8px solid var(--tc-primary-container)',
            }}
          >
            <div className="mb-4 sm:mb-6 flex justify-center">
              <div
                className="w-24 h-24 sm:w-40 sm:h-40 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-primary)',
                  animation: 'tc-float 3s ease-in-out infinite',
                }}
              >
                <span
                  className="material-symbols-outlined text-5xl sm:text-8xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
            </div>
            <h2
              id="finish-title"
              className="text-4xl sm:text-7xl font-tc-headline font-black mb-4 leading-tight"
              style={{ color: 'var(--tc-primary)' }}
            >
              ¡Bien hecho!
            </h2>
            <p
              className="text-lg sm:text-2xl font-tc-body font-bold mb-6 sm:mb-8"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              ¡Has completado la misión con éxito!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <button
                onClick={startGame}
                className="text-base sm:text-xl font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl transition-all active:scale-95 tc-card-shadow flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  backgroundColor: 'var(--tc-primary)',
                  color: 'var(--tc-on-primary)',
                }}
              >
                <span className="material-symbols-outlined">refresh</span>
                Jugar otra vez
              </button>
              <button
                onClick={() => navigate('/semana/5')}
                className="text-base sm:text-xl font-bold py-3 px-4 sm:py-4 sm:px-8 rounded-xl transition-all active:scale-95 tc-card-shadow flex items-center justify-center gap-2 w-full sm:w-auto"
                style={{
                  backgroundColor: 'var(--tc-tertiary-container)',
                  color: 'var(--tc-on-tertiary-container)',
                }}
              >
                <span className="material-symbols-outlined">arrow_forward</span>
                Volver a semana
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
