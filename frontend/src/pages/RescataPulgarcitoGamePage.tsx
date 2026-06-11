import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const colors = ['#4a6549', '#3e6378', '#6a5d45', '#ba1a1a', '#8ba888', '#bfe5fe'];

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-particle';
    const size = Math.random() * 10 + 8;
    const isCircle = Math.random() > 0.5;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${Math.random() * 100}vw`;
    confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    confetti.style.borderRadius = isCircle ? '50%' : '2px';
    confetti.style.opacity = `${Math.random() * 0.5 + 0.5}`;
    container.appendChild(confetti);
  }
  setTimeout(() => container.remove(), 5000);
}

interface PlankOption {
  id: string;
  name: string;
  size: number;
  label: string;
}

const planks: PlankOption[] = [
  { id: 'plank-short', name: 'Tabla Corta', size: 5, label: '5 cm' },
  { id: 'plank-medium', name: 'Tabla Mediana', size: 10, label: '10 cm' },
  { id: 'plank-long', name: 'Tabla Larga', size: 15, label: '15 cm' },
];

export default function RescataPulgarcitoGamePage() {
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [plankWidth, setPlankWidth] = useState('0%');
  const [pulgarcitoState, setPulgarcitoState] = useState<'idle' | 'walk-bridge' | 'walk-across' | 'fall'>('idle');
  const [plankState, setPlankState] = useState<'idle' | 'tilt' | 'fall'>('idle');
  const [isChecking, setIsChecking] = useState(false);
  const [showPlank, setShowPlank] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const pulgarcitoRef = useRef<HTMLImageElement>(null);

  const handleSelectPlank = (size: number) => {
    if (isChecking) return;
    setSelectedSize(size);
    setShowPlank(true);
    if (size === 5) setPlankWidth('50%');
    else if (size === 10) setPlankWidth('100%');
    else if (size === 15) setPlankWidth('160%');
  };

  const handleCheck = useCallback(() => {
    if (isChecking) return;
    setIsChecking(true);
    setPulgarcitoState('idle');
    setPlankState('idle');
    setFeedback(null);

    // Small delay to reset classes before applying new ones
    setTimeout(() => {
      if (!selectedSize) {
        // No plank selected
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPulgarcitoState('fall');
          setFeedback('¡No elegiste ninguna tabla! Pulgarcito se cayó.');
          setTimeout(() => resetGame(), 2000);
        }, 1500);
      } else if (selectedSize === 10) {
        // Correct plank
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPulgarcitoState('walk-across');
          setTimeout(() => {
            triggerConfetti();
            setFeedback('¡Felicidades! Pulgarcito cruzó el puente.');
            setLevelCompleted(true);
          }, 1500);
        }, 1500);
      } else if (selectedSize === 5) {
        // Short plank - falls immediately
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPlankState('fall');
          setPulgarcitoState('fall');
          setFeedback('¡La tabla era muy corta! Pulgarcito se cayó.');
          setTimeout(() => resetGame(), 2000);
        }, 1500);
      } else if (selectedSize === 15) {
        // Long plank - tilts first
        setPlankState('tilt');
        setTimeout(() => {
          setPulgarcitoState('walk-bridge');
          setTimeout(() => {
            setPlankState('fall');
            setPulgarcitoState('fall');
            setFeedback('¡La tabla era muy larga! Se cayó el puente.');
            setTimeout(() => resetGame(), 2000);
          }, 1500);
        }, 800);
      }
    }, 100);
  }, [selectedSize, isChecking]);

  const resetGame = useCallback(() => {
    setSelectedSize(null);
    setPlankWidth('0%');
    setPulgarcitoState('idle');
    setPlankState('idle');
    setIsChecking(false);
    setShowPlank(false);
    setFeedback(null);
  }, []);

  const handleNextLevel = useCallback(() => {
    // For now, show game completed screen since we only have 1 level
    setGameCompleted(true);
  }, []);

  const handleRestartGame = useCallback(() => {
    setLevelCompleted(false);
    setGameCompleted(false);
    resetGame();
  }, [resetGame]);

  const handleBack = () => navigate('/semana/1/rescata-pulgarcito');
  const handleHome = () => navigate('/home');

  const getPulgarcitoClass = () => {
    const base = 'w-24 h-24 object-cover rounded-full border-4 border-surface-container-lowest z-40 relative transition-all duration-[1500ms] ease-in-out';
    switch (pulgarcitoState) {
      case 'idle':
        return `${base} animate-bounce-greet`;
      case 'walk-bridge':
        return `${base} walk-to-bridge`;
      case 'walk-across':
        return `${base} walk-across`;
      case 'fall':
        return `${base} fall-down`;
      default:
        return base;
    }
  };

  const getPlankContainerClass = () => {
    const base = 'w-full h-12 rounded-lg flex items-center justify-center relative transition-all duration-500';
    switch (plankState) {
      case 'tilt':
        return `${base} plank-tilt`;
      case 'fall':
        return `${base} plank-fall`;
      default:
        return base;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md relative overflow-x-hidden bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface w-full top-0 z-40 bg-surface-container-low flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base border-b-0 shadow-none">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full"
        >
          <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>
            arrow_back
          </span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary text-center flex-1">
          Week 1: Tiny Travelers
        </h1>
        <button
          onClick={handleHome}
          aria-label="Home"
          className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full"
        >
          <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>
            home
          </span>
        </button>
      </header>

      {/* Main Canvas Content */}
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-32 md:pb-lg flex flex-col gap-lg">
        {/* Header Section */}
        <section className="text-center max-w-3xl mx-auto space-y-sm">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Rescata a Pulgarcito
          </h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            El puente está roto. Usa las piezas correctas para ayudarle a cruzar el arroyo.
          </p>
        </section>

        {/* Progress Bar */}
        <section className="max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-center mb-xs">
            <span className="font-label-lg text-label-lg text-primary">Progreso del Puente</span>
            <span className="font-label-md text-label-md text-primary font-bold">1 / 3</span>
          </div>
          <div className="h-6 w-full bg-surface-container-highest rounded-full overflow-hidden border-2 border-on-surface-variant">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: '33%' }}
            ></div>
          </div>
        </section>

        {/* Game Area Layout */}
        <section className="flex flex-col lg:flex-row gap-gutter min-h-[500px]">
          {/* Left: Immersive Game Scene */}
          <div className="flex-[2] relative bg-surface-container-low rounded-3xl border-2 border-on-surface-variant overflow-hidden shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)] flex items-center justify-center min-h-[400px]">
            {/* Background Environment */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Bosque encantado con neblina suave"
                className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHFf2RojoYUF4yDtohS_ChRwmo-vknyrBLXbWhU16lOoP2HSfioYCsXVWNjbcBPDvcd6HY1LjVHSh-D3uLIabv5sLpH7dbilVU1gg46SyZU7r6T9vlP3sTbfYLoqjaIO1PyY9kde10nQwWx6sN2p_GQsyEAImMSkmrXYL1dqyBtzHOReKH85U67POa8eLzvIeZxKMmcCtShP1DgZ9TkSFm5Ju0ZA0T6GjZx6KHAE0PZ6SDTZaBpVXRX5Pb1eOW5Hdl2Jn8LvuSE5b"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent z-10"></div>
            </div>

            {/* Game Elements Layer */}
            <div className="relative z-20 w-full h-full flex items-center justify-center">
              <div className="absolute w-[120%] h-32 bg-secondary-container/50 bottom-20 -rotate-12 rounded-full blur-sm"></div>

              {/* Left Cliff & Pulgarcito */}
              <div className="absolute left-10 bottom-32 flex flex-col items-center">
                <div className="w-32 h-40 bg-tertiary-container rounded-t-3xl border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative z-10 flex items-end justify-center pb-2">
                  <img
                    ref={pulgarcitoRef}
                    alt="Pulgarcito personaje"
                    className={getPulgarcitoClass()}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDliDzPfDDOQK5wNDh9WW48CLvIGb1FN6cO0JrEPNcK-TjigQRUT550itxooJ5Y-3f72w-pRl2hkPvJeUlQC1ED4cQzz0rLX4PmgWmegZHMCwa4kbSkxF6Bkt56tRPvzkA-oduceGFsQHnJLJpmAbelFSREpiKTMt8-zCIfeF9p3IhnkzvaegavKxESZM91RqbtwKsWxN4ix9G9gs3CHWobQ9viTm74iMDR4shYYJV8IuEK5TJ7cr-uG9Ihg4RLZE87z-I_PTpkvohc"
                  />
                </div>
                <div className="w-12 h-64 bg-tertiary rounded-b-xl border-2 border-on-surface-variant mt-[-10px] z-0"></div>
              </div>

              {/* Right Cliff */}
              <div className="absolute right-10 flex flex-col items-center opacity-60 bottom-32">
                <div className="w-32 h-24 bg-tertiary-container rounded-t-3xl border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative z-10 flex items-center justify-center">
                  <div className="w-24 h-6 bg-on-tertiary/20 rounded-full border-2 border-dashed border-on-tertiary/40"></div>
                </div>
                <div className="w-12 h-64 bg-tertiary rounded-b-xl border-2 border-on-surface-variant mt-[-10px] z-0"></div>
              </div>

              {/* The Broken Bridge Span */}
              <div className="absolute w-1/2 left-1/4 flex flex-col justify-center gap-4 z-30 h-24 bottom-[320px]">
                <div className={getPlankContainerClass()}>
                  <div
                    className={`w-full h-full bg-tertiary rounded-lg border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative transition-all duration-500 ${
                      showPlank ? 'block' : 'hidden'
                    }`}
                    style={{ width: plankWidth }}
                  >
                    <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full top-3"></div>
                    <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full bottom-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Inventory Panel */}
          <div className="flex-1 bg-surface-bright rounded-3xl border-2 border-on-surface-variant shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)] p-md flex flex-col gap-md">
            <div className="flex items-center gap-sm border-b-2 border-surface-container-highest pb-sm">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">inventory_2</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Tablas Disponibles</h3>
            </div>

            <p className="font-body-md text-body-md text-on-surface-variant">
              Selecciona una tabla que mida exactamente <strong className="text-primary font-bold">10 cm</strong>.
            </p>

            {/* Feedback message */}
            {feedback && (
              <div className={`p-3 rounded-xl text-center font-label-md ${
                levelCompleted
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'bg-error-container text-on-error-container'
              }`}>
                {feedback}
              </div>
            )}

            <div className="flex flex-col gap-sm mt-xs">
              {planks.map((plank) => (
                <button
                  key={plank.id}
                  onClick={() => handleSelectPlank(plank.size)}
                  disabled={isChecking}
                  className={`w-full bg-tertiary-fixed rounded-xl p-sm border-2 border-on-surface-variant flex items-center justify-between group hover:bg-tertiary-fixed-dim transition-all ${
                    selectedSize === plank.size
                      ? 'bg-primary-fixed border-primary'
                      : ''
                  } ${plank.size === 10 ? 'animate-float-pulgarcito' : ''}`}
                >
                  <div className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-tertiary-fixed">
                      view_day
                    </span>
                    <span className="font-label-lg text-label-lg text-on-tertiary-fixed">
                      {plank.name}
                    </span>
                  </div>
                  <div
                    className={`bg-surface-container-lowest px-3 py-1 rounded-full text-sm font-label-md border border-outline-variant ${
                      plank.size === 10
                        ? 'text-primary font-bold border-primary'
                        : 'text-on-surface'
                    }`}
                  >
                    {plank.label}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-auto pt-md">
              {!levelCompleted ? (
                <button
                  onClick={handleCheck}
                  disabled={isChecking}
                  className={`w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all ${
                    selectedSize ? 'animate-pulse' : ''
                  }`}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Comprobar Puente
                </button>
              ) : !gameCompleted ? (
                <button
                  onClick={handleNextLevel}
                  className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  Finalizar
                </button>
              ) : (
                <div className="flex flex-col gap-sm">
                  <button
                    onClick={handleRestartGame}
                    className="w-full bg-surface-container-highest text-on-surface-variant font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined">replay</span>
                    Reintentar
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all"
                  >
                    <span className="material-symbols-outlined">home</span>
                    Volver al inicio
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="md:hidden bg-surface-container w-full z-50 fixed bottom-0 left-0 flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_20px_rgba(74,101,73,0.1)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/50 transition-all duration-200">
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-2 scale-90 transition-all duration-200 ease-out">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: '"FILL" 1' }}>
            experiment
          </span>
          <span className="font-label-md text-label-md">Lab</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/50 transition-all duration-200">
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="font-label-md text-label-md">Science Buddies</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-primary-container/50 transition-all duration-200">
          <span className="material-symbols-outlined mb-1">stars</span>
          <span className="font-label-md text-label-md">Progress</span>
        </button>
      </nav>
    </div>
  );
}
