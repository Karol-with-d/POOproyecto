import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/terra-ciencia.css';

/**
 * BusquedaGamePage — "La Lupa de Detective" (Modo Laboratorio).
 *
 * 8 tarjetas con objetos (4 vivos, 4 sin vida). El niño debe tocar
 * "¡Ser Vivo! 🌿" o "Sin Vida ⚙️" en cada una. Solo se suman puntos
 * al identificar correctamente los 4 seres vivos. Al llegar a 4/4,
 * aparece la pantalla de celebración.
 *
 * UX: cursor personalizado con lupa solo en desktop (mouse fino);
 * en móvil/tablet se usa el cursor nativo (tap-first UI).
 */

const ASSETS = [
  {
    id: '/images/perro.webp',
    name: 'Cachorro',
    isLiving: true,
  },
  {
    id: '/images/bici',
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
    id: '/images/pelota.webp',
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
  const [score, setScore] = useState(0);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [shakingIndex, setShakingIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Record<number, string>>({});
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [useCustomCursor, setUseCustomCursor] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setUseCustomCursor(mq.matches);
    const handleChange = (e: MediaQueryListEvent) => setUseCustomCursor(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!useCustomCursor) return;
    const handleMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [useCustomCursor]);

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
          setTimeout(() => setView('finish'), 500);
        }
      }
    } else {
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
      className={`h-screen overflow-hidden tc-clay-texture ${useCustomCursor ? 'tc-cursor-none' : ''}`}
      style={{ color: 'var(--tc-on-surface)' }}
    >
      {/* Custom Magnifier Cursor (desktop only) */}
      {useCustomCursor && (
        <div
          className="tc-custom-cursor flex items-center justify-center opacity-80"
          style={{ left: cursorPos.x, top: cursorPos.y }}
          aria-hidden="true"
        >
          <span
            className="material-symbols-outlined text-primary text-6xl"
            style={{
              fontVariationSettings: "'FILL' 0",
              filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))',
            }}
          >
            search
          </span>
        </div>
      )}

      {/* Background Decoration */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden opacity-20"
        aria-hidden="true"
      >
        <div
          className="absolute top-10 left-10 w-32 h-32 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--tc-primary-container)' }}
        />
        <div
          className="absolute bottom-10 right-10 w-64 h-64 rounded-full blur-3xl"
          style={{ backgroundColor: 'var(--tc-tertiary-container)' }}
        />
      </div>

      {/* Intro Screen */}
      {view === 'intro' && (
        <main
          className="relative z-10 flex items-center justify-center h-full p-6"
          key="intro"
        >
          <div
            className="bg-surface rounded-xl p-12 text-center max-w-xl tc-card-shadow tc-fade-in"
            style={{ border: '4px solid var(--tc-primary-container)' }}
          >
            <div className="mb-8 flex justify-center">
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-primary)',
                }}
              >
                <span
                  className="material-symbols-outlined text-7xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  biotech
                </span>
              </div>
            </div>
            <h1
              className="text-5xl font-tc-headline font-black mb-4 leading-tight"
              style={{ color: 'var(--tc-primary)' }}
            >
              ¡La Lupa de Detective!
            </h1>
            <p
              className="text-xl font-tc-body mb-10"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              ¿Eres capaz de distinguir qué cosas tienen vida y cuáles no? ¡Únete a la misión
              del Laboratorio de Terra!
            </p>
            <button
              onClick={startGame}
              className="text-2xl font-bold py-6 px-12 rounded-xl transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg flex items-center gap-4 mx-auto"
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
          className="relative z-10 h-full flex flex-col p-6 overflow-y-auto"
          key="game"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto w-full">
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
              className="px-8 py-4 rounded-full flex items-center gap-4 tc-card-shadow"
              style={{ backgroundColor: 'var(--tc-surface-container-highest)' }}
            >
              <span
                className="font-tc-label font-black text-xl uppercase tracking-wider"
                style={{ color: 'var(--tc-primary)' }}
              >
                Seres vivos encontrados:
              </span>
              <div
                className="px-6 py-2 rounded-full font-tc-headline font-black text-3xl"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-on-primary-container)',
                }}
              >
                {score} / {TOTAL_LIVING}
              </div>
            </div>
            <button
              onClick={() => navigate('/semana/5')}
              aria-label="Salir de Búsqueda"
              className="flex items-center gap-2 font-bold py-3 px-4 rounded-xl transition-colors tc-card-shadow active:scale-95"
              style={{
                backgroundColor: 'var(--tc-surface)',
                color: 'var(--tc-on-surface-variant)',
                border: '1px solid var(--tc-outline-variant)',
              }}
            >
              <span className="material-symbols-outlined">logout</span>
              <span className="hidden md:inline">Salir</span>
            </button>
          </div>

          {/* Grid */}
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-7xl mx-auto w-full pb-12"
            key={`grid-${view}`}
          >
            {ASSETS.map((asset, index) => {
              const isSolved = solved.has(index);
              const isShaking = shakingIndex === index;
              return (
                <div
                  key={`${asset.name}-${index}`}
                  className={`bg-white rounded-xl p-4 flex flex-col items-center tc-card-shadow relative overflow-hidden transition-all duration-300 ${
                    isSolved
                      ? 'border-4'
                      : 'border border-outline-variant hover:-translate-y-1'
                  } ${isShaking ? 'tc-shake' : ''}`}
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
                    className="w-full aspect-square rounded-lg mb-4 flex items-center justify-center p-4"
                    style={{ backgroundColor: 'var(--tc-surface-container-low)' }}
                  >
                    <img
                      src={asset.id}
                      alt={asset.name}
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  </div>
                  <div className="flex flex-col gap-2 w-full">
                    <button
                      onClick={() => handleAnswer(index, true)}
                      disabled={isSolved}
                      className="w-full py-3 rounded-lg font-tc-label font-black text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
                      Ser Vivo! 🌿
                    </button>
                    <button
                      onClick={() => handleAnswer(index, false)}
                      disabled={isSolved}
                      className="w-full py-3 rounded-lg font-tc-label font-black text-sm uppercase flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
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
            className="rounded-xl p-16 text-center tc-card-shadow"
            style={{
              backgroundColor: 'var(--tc-surface)',
              border: '8px solid var(--tc-primary-container)',
              transform: 'scale(1.1)',
            }}
          >
            <div className="mb-6 flex justify-center">
              <div
                className="w-40 h-40 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: 'var(--tc-primary-container)',
                  color: 'var(--tc-primary)',
                  animation: 'tc-float 3s ease-in-out infinite',
                }}
              >
                <span
                  className="material-symbols-outlined text-8xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  star
                </span>
              </div>
            </div>
            <h2
              id="finish-title"
              className="text-7xl font-tc-headline font-black mb-4"
              style={{ color: 'var(--tc-primary)' }}
            >
              ¡Bien hecho!
            </h2>
            <p
              className="text-2xl font-tc-body font-bold mb-8"
              style={{ color: 'var(--tc-on-surface-variant)' }}
            >
              ¡Has completado la misión con éxito!
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={startGame}
                className="text-xl font-bold py-4 px-8 rounded-xl transition-all active:scale-95 tc-card-shadow flex items-center gap-2"
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
                className="text-xl font-bold py-4 px-8 rounded-xl transition-all active:scale-95 tc-card-shadow flex items-center gap-2"
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
