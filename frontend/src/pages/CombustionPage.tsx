import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CombustionPage — Actividad de la Semana 4: El Gran Drama Químico (Combustión).
 *
 * Administra dos pantallas:
 * 1. Bienvenida y contextualización con el personaje Combus.
 * 2. Laboratorio interactivo donde se observa la transformación molecular en 4 etapas:
 *    Papel -> Fuego -> Humo -> Cenizas.
 */
export default function CombustionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'lab'>('welcome');
  const [mounted, setMounted] = useState(false);

  // Interactive Stage States
  const [currentStage, setCurrentStage] = useState(1);
  const [visibleStage, setVisibleStage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeStageClass, setActiveStageClass] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    if (screen === 'lab') {
      setScreen('welcome');
      setCurrentStage(1);
      setVisibleStage(1);
    } else {
      navigate('/semana/4');
    }
  };

  const handleFinish = () => {
    alert('¡Lección de combustión completada!');
    navigate('/semana/4');
  };

  const nextStage = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setActiveStageClass(true);

    // Visual feedback on card
    setTimeout(() => {
      setActiveStageClass(false);
    }, 400);

    // Phase 1: Fade out current visible stage
    setCurrentStage(0);

    // Phase 2: After fade-out, switch to next stage and fade in
    setTimeout(() => {
      const next = visibleStage >= 4 ? 1 : visibleStage + 1;
      setVisibleStage(next);
      setCurrentStage(next);
      setIsTransitioning(false);
    }, 300);
  };

  const stages = [
    {
      id: 1,
      label: 'Papel',
      src: '/images/semana4/papel.png',
    },
    {
      id: 2,
      label: 'Fuego',
      src: '/images/semana4/fuego.png',
    },
    {
      id: 3,
      label: 'Humo',
      src: '/images/semana4/humo.png',
    },
    {
      id: 4,
      label: 'Cenizas',
      src: '/images/semana4/cenizas.png',
    },
  ];

  return (
    <div className="bg-[#faf9f5] text-[#1a1c1a] antialiased min-h-screen flex flex-col font-body-md relative overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quicksand-text {
          font-family: 'Quicksand', sans-serif;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          vertical-align: middle;
        }
        .active-scale:active {
          transform: scale(0.98);
        }
        .active-stage {
          transform: scale(1.02);
          border-color: #4a6549;
          box-shadow: 0 4px 20px rgba(74, 101, 73, 0.1);
        }
        .stage-transition {
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .character-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}} />

      {/* TopAppBar */}
      <header className="sticky top-0 z-50 w-full bg-[#faf9f5] shadow-sm py-4 px-margin-mobile md:px-margin-desktop flex justify-between items-center">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleBack}
            className="text-primary hover:scale-95 transition-transform active:scale-90 p-2 rounded-full hover:bg-surface-container-high flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-headline-md">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary truncate">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
      </header>

      {screen === 'welcome' ? (
        /* Screen 1: Welcome */
        <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop w-full min-h-[calc(100vh-64px)]">
          <div
            className="bg-surface-container-low max-w-2xl w-full p-stack-lg md:p-12 rounded-[32px] shadow-xl border border-outline-variant/30 flex flex-col items-center text-center space-y-stack-lg transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
            }}
          >
            <div className="space-y-stack-md">
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight quicksand-text">
                El Gran Drama Químico
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-lg mx-auto">
                ¡Transformación total con fuego! Descubre cómo las sustancias cambian permanentemente su estructura molecular durante la combustión, convirtiéndose en algo completamente nuevo en esta ardiente aventura de laboratorio.
              </p>
            </div>
            {/* CTA Section */}
            <div className="w-full flex flex-col items-center gap-stack-md">
              <button
                onClick={() => setScreen('lab')}
                className="bg-[#4a6549] text-white px-12 py-4 rounded-full font-label-lg text-label-lg active-scale hover:bg-primary transition-all shadow-lg flex items-center gap-3 group quicksand-text"
              >
                Comenzar Lección
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* Screen 2: Interactive Lab */
        <main className="flex-grow pt-12 pb-40 px-margin-mobile md:px-margin-desktop flex flex-col items-center max-w-7xl mx-auto w-full">
          {/* Main Title */}
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary text-center mb-12 quicksand-text">
            Combustión: ¡El Gran Drama Químico!
          </h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-gutter items-center">
            {/* Character Section (Left) */}
            <div className="md:col-span-4 flex flex-col items-center md:items-end relative mb-8 md:mb-0">
              <div className="character-float relative">
                <img
                  alt="Combus"
                  className="w-48 h-48 md:w-64 md:h-64 object-contain rounded-xl"
                  src="/images/semana4/combus.png"
                />
                {/* Speech Bubble */}
                <div className="absolute -top-12 -right-4 md:-top-16 md:-right-4 bg-primary-container text-white p-4 rounded-2xl rounded-bl-none shadow-lg max-w-[200px] z-10">
                  <p className="font-label-lg text-label-lg quicksand-text">
                    ¡Yo soy el más dramático de la familia!
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Stage Area (Center/Right) */}
            <div className="md:col-span-8 flex flex-col items-center">
              <div
                id="drama-stage"
                onClick={nextStage}
                className={`w-full bg-surface-container-low rounded-[24px] p-stack-lg shadow-sm border-2 border-transparent transition-all duration-300 cursor-pointer ${
                  activeStageClass ? 'active-stage' : 'hover:border-primary/20'
                }`}
              >
                <div className="text-center mb-8">
                  <span className="font-label-sm text-label-sm text-outline uppercase tracking-widest quicksand-text">
                    Transformación Molecular
                  </span>
                  <h3 className="font-headline-md text-headline-md text-primary mt-2 quicksand-text">
                    {stages.find((s) => s.id === visibleStage)?.label}
                  </h3>
                </div>

                {/* Stage Visualization Container */}
                <div className="relative h-64 flex items-center justify-center overflow-hidden mb-8 bg-white rounded-xl shadow-inner border border-outline-variant">
                  <div className="w-full h-full relative flex items-center justify-center p-4">
                    {stages.map((stage) => {
                      const isVisible = stage.id === visibleStage;
                      const isFullyActive = stage.id === currentStage;
                      return (
                        <div
                          key={stage.id}
                          className={`stage-transition flex flex-col items-center absolute inset-0 justify-center p-4 ${
                            isVisible ? 'block' : 'hidden'
                          } ${
                            isFullyActive ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                          }`}
                        >
                          <img
                            alt={stage.label}
                            className="max-h-56 object-contain"
                            src={stage.src}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Interaction Hint */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Avoid double click event
                    nextStage();
                  }}
                  className="w-full flex items-center justify-center gap-2 text-on-surface-variant active-scale transition-transform font-label-lg text-label-lg quicksand-text"
                >
                  Toca para ver el drama de la transformación
                  <span className="material-symbols-outlined animate-bounce">touch_app</span>
                </button>
              </div>
            </div>
          </div>

          {/* Dato Curioso Box */}
          <div className="mt-16 w-full max-w-2xl bg-surface-container rounded-2xl p-stack-md flex gap-4 items-center border border-outline-variant/30">
            <div className="bg-primary-container p-3 rounded-xl text-white flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                lightbulb
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">
              <b className="text-primary">Dato Curioso:</b> La combustión es una reacción química que libera energía en forma de luz y calor. ¡Es una transformación total!
            </p>
          </div>
        </main>
      )}

      {/* Bottom Navigation Footer */}
      <footer className="fixed bottom-0 left-0 w-full z-50 flex items-center px-margin-mobile py-stack-md md:px-margin-desktop bg-surface-container-low dark:bg-surface-container-highest shadow-lg rounded-t-xl justify-between">
        <button
          onClick={() => {
            if (screen === 'lab') {
              setScreen('welcome');
              setCurrentStage(1);
              setVisibleStage(1);
            } else {
              navigate('/semana/4');
            }
          }}
          className="flex flex-row items-center justify-center gap-2 text-on-surface-variant px-6 py-3 hover:bg-primary-fixed/20 transition-colors active:scale-95 duration-200 rounded-full font-label-lg text-label-lg quicksand-text"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span>Anterior</span>
        </button>
        <button
          onClick={screen === 'welcome' ? () => setScreen('lab') : handleFinish}
          className="flex flex-row items-center justify-center gap-2 bg-primary text-white rounded-full px-8 py-3 hover:opacity-90 transition-all active:scale-95 shadow-md font-label-lg text-label-lg quicksand-text"
        >
          <span>Siguiente</span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </footer>
    </div>
  );
}
