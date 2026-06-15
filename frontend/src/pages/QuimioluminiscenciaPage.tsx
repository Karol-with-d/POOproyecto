import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * QuimioluminiscenciaPage — Actividad de la Semana 4: Lumi y la Quimioluminiscencia.
 *
 * Administra dos pantallas:
 * 1. Bienvenida y contextualización con Lumi.
 * 2. Laboratorio interactivo con barra luminosa (glow stick) con física de doblado.
 */
export default function QuimioluminiscenciaPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'lab'>('welcome');
  const [mounted, setMounted] = useState(false);

  // Glow stick interactive state
  const [isActivated, setIsActivated] = useState(false);
  const [isScaling, setIsScaling] = useState(false);
  const [shouldShake, setShouldShake] = useState(false);

  // Bending progress (0 to 100)
  const [topProgress, setTopProgress] = useState(0);
  const [bottomProgress, setBottomProgress] = useState(0);

  // Drag states
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for cracking threshold
  useEffect(() => {
    if (isActivated) return;
    if (topProgress >= 80 && bottomProgress >= 80) {
      setIsActivated(true);
      setTopProgress(0);
      setBottomProgress(0);
      setIsDraggingTop(false);
      setIsDraggingBottom(false);
      setShouldShake(true);
      setIsScaling(true);

      setTimeout(() => {
        setShouldShake(false);
      }, 500);

      setTimeout(() => {
        setIsScaling(false);
      }, 200);
    }
  }, [topProgress, bottomProgress, isActivated]);

  const handleBack = () => {
    if (screen === 'lab') {
      setScreen('welcome');
      // Reset stick state when going back
      setIsActivated(false);
      setTopProgress(0);
      setBottomProgress(0);
    } else {
      navigate('/semana/4');
    }
  };

  const handleFinish = () => {
    alert('¡Lección de quimioluminiscencia completada!');
    navigate('/semana/4');
  };

  // Pointer drag event handlers for top end
  const handleTopPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isActivated) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingTop(true);
  };

  const handleTopPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingTop || isActivated) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const centerY = rect.height / 2;
    // Calculate progress (from 0 at top to 100 at center)
    const progress = Math.min(100, Math.max(0, (y / centerY) * 100));
    setTopProgress(progress);
  };

  const handleTopPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDraggingTop(false);
  };

  // Pointer drag event handlers for bottom end
  const handleBottomPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isActivated) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDraggingBottom(true);
  };

  const handleBottomPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingBottom || isActivated) return;
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const centerY = rect.height / 2;
    // Calculate progress (from 0 at bottom to 100 at center)
    const progress = Math.min(100, Math.max(0, ((rect.height - y) / centerY) * 100));
    setBottomProgress(progress);
  };

  const handleBottomPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.releasePointerCapture(e.pointerId);
    setIsDraggingBottom(false);
  };

  // Tap/click fallback to bend the stick step-by-step
  const handleStickClick = () => {
    if (isActivated) return;
    setTopProgress((prev) => Math.min(100, prev + 34));
    setBottomProgress((prev) => Math.min(100, prev + 34));
  };

  return (
    <div className="bg-[#faf9f5] text-[#1a1c1a] antialiased min-h-screen flex flex-col font-body-md relative overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quicksand-text {
          font-family: 'Quicksand', sans-serif;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .tap-interaction:active {
          transform: scale(0.98);
        }
        .science-texture {
          background-image: radial-gradient(#334d33 0.5px, transparent 0.5px);
          background-size: 24px 24px;
          opacity: 0.05;
        }
        .glow-effect {
          box-shadow: 0 0 30px rgba(176, 207, 172, 0.2);
          transition: all 0.5s ease-out;
        }
        .glow-active {
          box-shadow: 0 0 80px rgba(194, 225, 190, 0.9);
          filter: brightness(1.2);
        }
        .glowstick-container {
          perspective: 1000px;
        }
        .glowstick-wrapper {
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          bottom: -15px;
          left: 30px;
          border-width: 15px 15px 0 0;
          border-style: solid;
          border-color: #ffffff transparent transparent transparent;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        .animate-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-6px) rotate(-1deg); }
          75% { transform: translateX(6px) rotate(1deg); }
        }
        .shake-anim {
          animation: shake 0.15s ease-in-out 3;
        }
      `}} />

      {/* Top Navigation Bar */}
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
        <main className="flex-grow flex flex-col relative items-center px-margin-mobile md:px-margin-desktop min-h-[calc(100vh-64px)] justify-center">
          {/* Atmospheric Texture Overlay */}
          <div className="absolute inset-0 science-texture pointer-events-none"></div>
          <div className="max-w-2xl w-full relative z-10" style={{ marginTop: '-5vh' }}>
            {/* Centered Lesson Card */}
            <div
              className="bg-surface-container-low p-8 md:p-12 rounded-[32px] border border-outline-variant/30 shadow-xl flex flex-col items-center text-center gap-stack-md transition-all duration-[800ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? 'translateY(0px)' : 'translateY(20px)',
              }}
            >
              <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary leading-tight quicksand-text">
                Lumi y la quimioluminiscencia
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed max-w-lg">
                ¡Brilla en la oscuridad! Descubre cómo algunas reacciones químicas pueden crear luz propia sin generar calor a través de la quimioluminiscencia. Prepárate para un experimento luminoso inolvidable.
              </p>
              <div className="mt-stack-md">
                <button
                  onClick={() => setScreen('lab')}
                  className="bg-[#4a6549] text-white font-label-lg text-label-lg px-12 py-5 rounded-full shadow-lg hover:bg-primary transition-all tap-interaction flex items-center gap-3"
                >
                  Comenzar Lección
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* Screen 2: Interactive Lab */
        <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop py-stack-lg max-w-7xl mx-auto pb-32">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-stack-lg text-center quicksand-text">
            Quimioluminiscencia: Luces en la Oscuridad
          </h1>

          {/* Narrative Section */}
          <div className="flex flex-col md:flex-row items-end gap-6 mb-stack-lg animate-float">
            <div className="relative w-32 h-32 shrink-0">
              <img
                alt="Lumi character"
                className="w-full h-full object-contain drop-shadow-xl rounded-2xl"
                src="/images/semana4/lumi_character.png"
              />
            </div>
            <div className="speech-bubble relative bg-white rounded-[32px] p-6 shadow-lg border border-surface-container-high max-w-md">
              <p className="font-headline-md text-[24px] text-primary leading-tight font-bold quicksand-text">
                ¡Yo soy la magia de brillar sin necesitar luz!
              </p>
            </div>
          </div>

          {/* Interactive Interaction Card */}
          <section className={`bg-surface rounded-[24px] shadow-sm border border-surface-container overflow-hidden relative min-h-[500px] flex flex-col items-center justify-center p-stack-lg transition-all ${shouldShake ? 'shake-anim' : ''}`}>
            {/* Interaction Prompt */}
            <div className="mb-stack-lg text-center relative z-10">
              <h2 className="font-headline-md text-headline-md text-on-surface mb-2 quicksand-text">
                Quimioluminiscencia
              </h2>
              <p className="font-body-lg text-on-surface-variant flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-primary">touch_app</span>
                Arrastra los extremos al centro o toca la barra para doblarla
              </p>
            </div>

            {/* Central Glow Stick Area */}
            <div className="glowstick-container relative z-10 flex flex-col items-center justify-center min-h-[340px]">
              <div
                ref={containerRef}
                onClick={handleStickClick}
                className="w-40 h-[280px] flex items-center justify-center relative select-none touch-none"
              >
                {/* Glowstick Wrapper (64px wide, 256px tall) */}
                <div
                  className={`glowstick-wrapper w-16 h-64 relative ${
                    isActivated ? 'scale-105' : 'hover:scale-105 active:scale-95'
                  }`}
                  style={{
                    transform: isScaling ? 'scale(1.15)' : undefined,
                  }}
                >
                  {/* Top Half of Glowstick */}
                  <div
                    style={{
                      transform: `rotate(${isActivated ? 0 : -15 * (topProgress / 100)}deg)`,
                      transformOrigin: 'bottom center',
                      transition: isDraggingTop ? 'none' : 'transform 0.3s ease-out',
                    }}
                    className="w-16 h-32 absolute top-0 left-0 z-10"
                  >
                    <div className={`w-full h-full bg-surface-container-highest border-4 border-b-0 border-white/50 rounded-t-full relative overflow-hidden flex flex-col justify-end items-center ${
                      isActivated ? 'glow-active' : 'glow-effect'
                    }`}>
                      {/* Inner Liquid */}
                      <div
                        className={`w-full h-full transition-all duration-1000 ${
                          isActivated ? 'opacity-100 animate-pulse' : 'opacity-20'
                        } bg-gradient-to-b from-primary-fixed to-primary`}
                        style={isActivated ? { background: 'radial-gradient(circle, #c2e1be 0%, #334d33 100%)' } : undefined}
                      />
                    </div>

                    {/* Top Drag Handle */}
                    {!isActivated && (
                      <div
                        onPointerDown={handleTopPointerDown}
                        onPointerMove={handleTopPointerMove}
                        onPointerUp={handleTopPointerUp}
                        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform z-30 touch-none select-none"
                      >
                        <span className="material-symbols-outlined text-2xl select-none pointer-events-none">
                          keyboard_double_arrow_down
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Joint Mask to cover the bending gap */}
                  <div className="absolute top-[120px] left-1/2 -translate-x-1/2 w-[56px] h-4 bg-[#e3e2e6] border-x-4 border-white/50 z-0" />

                  {/* Bottom Half of Glowstick */}
                  <div
                    style={{
                      transform: `rotate(${isActivated ? 0 : 15 * (bottomProgress / 100)}deg)`,
                      transformOrigin: 'top center',
                      transition: isDraggingBottom ? 'none' : 'transform 0.3s ease-out',
                    }}
                    className="w-16 h-32 absolute top-32 left-0 z-10"
                  >
                    <div className={`w-full h-full bg-surface-container-highest border-4 border-t-0 border-white/50 rounded-b-full relative overflow-hidden flex flex-col justify-start items-center ${
                      isActivated ? 'glow-active' : 'glow-effect'
                    }`}>
                      {/* Inner Liquid */}
                      <div
                        className={`w-full h-full transition-all duration-1000 ${
                          isActivated ? 'opacity-100 animate-pulse' : 'opacity-20'
                        } bg-gradient-to-b from-primary-fixed to-primary`}
                        style={isActivated ? { background: 'radial-gradient(circle, #c2e1be 0%, #334d33 100%)' } : undefined}
                      />
                    </div>

                    {/* Bottom Drag Handle */}
                    {!isActivated && (
                      <div
                        onPointerDown={handleBottomPointerDown}
                        onPointerMove={handleBottomPointerMove}
                        onPointerUp={handleBottomPointerUp}
                        className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing hover:scale-110 active:scale-95 transition-transform z-30 touch-none select-none"
                      >
                        <span className="material-symbols-outlined text-2xl select-none pointer-events-none">
                          keyboard_double_arrow_up
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Center Magic Symbols / Icon */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    <span
                      className={`material-symbols-outlined text-white text-4xl opacity-50 ${
                        isActivated ? 'animate-pulse opacity-85 text-[#ccebc7]' : ''
                      }`}
                    >
                      {isActivated ? 'auto_awesome' : 'vibration'}
                    </span>
                  </div>

                  {/* Particle Sprinkles */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-1000 pointer-events-none z-20 ${
                      isActivated ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-white rounded-full animate-pulse delay-150"></div>
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
                  </div>
                </div>
              </div>

              {/* Success Message */}
              <div
                className={`mt-8 transition-all duration-700 text-center ${
                  isActivated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <p className="font-label-lg text-primary bg-primary-fixed px-6 py-2 rounded-full shadow-sm quicksand-text">
                  ¡CRAAACK! Has liberado la energía química.
                </p>
              </div>
            </div>
          </section>

          {/* Informative Details (Post-Interaction) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter mt-stack-lg">
            <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-primary">
              <h3 className="font-label-lg text-primary mb-2 quicksand-text">¿Cómo funciona?</h3>
              <p className="font-body-md text-on-surface-variant">
                Al doblar la barra, rompemos una ampolla de vidrio en su interior, permitiendo que dos líquidos se mezclen y produzcan luz.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl border-l-4 border-secondary">
              <h3 className="font-label-lg text-secondary mb-2 quicksand-text">Dato Curioso</h3>
              <p className="font-body-md text-on-surface-variant">
                Este proceso se llama quimioluminiscencia. ¡Las luciérnagas hacen algo muy similar con su propio cuerpo!
              </p>
            </div>
          </div>

          {/* Bottom Navigation Footer */}
          <footer className="fixed bottom-0 left-0 w-full z-50 bg-surface-container dark:bg-surface-container-high shadow-[0_-4px_15px_rgba(74,101,73,0.08)] rounded-t-xl py-4 px-margin-mobile md:px-margin-desktop flex justify-between items-center">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center gap-2 text-primary border-2 border-primary px-6 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-label-lg text-label-lg quicksand-text">Anterior</span>
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full hover:brightness-110 active:scale-95 transition-all duration-200"
            >
              <span className="font-label-lg text-label-lg quicksand-text">Siguiente</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </footer>
        </main>
      )}
    </div>
  );
}
