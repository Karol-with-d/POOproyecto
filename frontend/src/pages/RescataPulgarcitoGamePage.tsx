import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const CONFETTI_COLORS = ['#4a6549', '#3e6378', '#6a5d45', '#ba1a1a', '#8ba888', '#bfe5fe'];

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  for (let i = 0; i < 100; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-particle';
    const size = Math.random() * 10 + 8;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${Math.random() * 2 + 2}s`;
    el.style.animationDelay = `${Math.random() * 2}s`;
    el.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
    el.style.opacity = `${Math.random() * 0.5 + 0.5}`;
    container.appendChild(el);
  }
  setTimeout(() => container.remove(), 5000);
}

// ── Level 1 ──────────────────────────────────────────────────────────────────

const L1_PLANKS = [
  { id: 'short', name: 'Tabla Corta', size: 5, label: '5 cm' },
  { id: 'medium', name: 'Tabla Mediana', size: 10, label: '10 cm' },
  { id: 'long', name: 'Tabla Larga', size: 15, label: '15 cm' },
];
const L1_CORRECT = 10;

type PulgarcitoState = 'idle' | 'walk-bridge' | 'walk-across' | 'fall' | 'celebrate';
type L1PlankState = 'idle' | 'tilt' | 'fall';
type SlotAnimState = 'empty' | 'filled-left' | 'filled-right' | 'shaking' | 'dropping';

function getPulgarcitoClass(state: PulgarcitoState) {
  const base =
    'w-24 h-24 object-cover rounded-full border-4 border-surface-container-lowest z-40 relative transition-all duration-[1500ms] ease-in-out';
  switch (state) {
    case 'idle':       return `${base} animate-bounce-greet`;
    case 'walk-bridge':return `${base} walk-to-bridge`;
    case 'walk-across':return `${base} walk-across`;
    case 'fall':       return `${base} fall-down`;
    case 'celebrate':  return `${base} celebrate-jump`;
    default:           return base;
  }
}

// ── Level 2 ──────────────────────────────────────────────────────────────────

const L2_PLANKS = [
  { id: 'xsmall', name: 'Tabla Pequeña', size: 5,  label: '5 cm'  },
  { id: 'small',  name: 'Tabla Corta',   size: 8,  label: '8 cm'  },
  { id: 'medium', name: 'Tabla Mediana', size: 12, label: '12 cm' },
  { id: 'large',  name: 'Tabla Larga',   size: 15, label: '15 cm' },
];
const L2_TARGET = 20;

interface L2Selection { size: number; id: string }

// ── Main component ────────────────────────────────────────────────────────────

export default function RescataPulgarcitoGamePage() {
  const navigate = useNavigate();

  // Shared
  const [currentLevel, setCurrentLevel] = useState<1 | 2>(1);
  const [pulgarcitoState, setPulgarcitoState] = useState<PulgarcitoState>('idle');
  const [isChecking, setIsChecking] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Level 1 state
  const [l1Selected, setL1Selected] = useState<number | null>(null);
  const [l1PlankWidth, setL1PlankWidth] = useState('0%');
  const [l1ShowPlank, setL1ShowPlank] = useState(false);
  const [l1PlankState, setL1PlankState] = useState<L1PlankState>('idle');
  const [l1Completed, setL1Completed] = useState(false);

  // Level 2 state
  const [l2Selected, setL2Selected] = useState<L2Selection[]>([]);
  const [slot0Anim, setSlot0Anim] = useState<SlotAnimState>('empty');
  const [slot1Anim, setSlot1Anim] = useState<SlotAnimState>('empty');

  // ── Level 1 handlers ────────────────────────────────────────────────────

  const handleL1SelectPlank = (size: number) => {
    if (isChecking) return;
    setL1Selected(size);
    setL1ShowPlank(true);
    if (size === 5)  setL1PlankWidth('50%');
    if (size === 10) setL1PlankWidth('100%');
    if (size === 15) setL1PlankWidth('160%');
  };

  const handleL1Check = useCallback(() => {
    if (isChecking) return;
    setIsChecking(true);
    setPulgarcitoState('idle');
    setL1PlankState('idle');
    setFeedback(null);

    setTimeout(() => {
      if (!l1Selected) {
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPulgarcitoState('fall');
          setFeedback({ text: '¡No elegiste ninguna tabla! Pulgarcito se cayó.', type: 'error' });
          setTimeout(() => resetL1(), 2000);
        }, 1500);
      } else if (l1Selected === L1_CORRECT) {
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPulgarcitoState('walk-across');
          setTimeout(() => {
            triggerConfetti();
            setFeedback({ text: '¡Perfecto! Pulgarcito cruzó el puente. ¡Siguiente nivel!', type: 'success' });
            setL1Completed(true);
            setIsChecking(false);
          }, 1500);
        }, 1500);
      } else if (l1Selected === 5) {
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setL1PlankState('fall');
          setPulgarcitoState('fall');
          setFeedback({ text: '¡La tabla era muy corta! Pulgarcito se cayó.', type: 'error' });
          setTimeout(() => resetL1(), 2000);
        }, 1500);
      } else {
        setL1PlankState('tilt');
        setTimeout(() => {
          setPulgarcitoState('walk-bridge');
          setTimeout(() => {
            setL1PlankState('fall');
            setPulgarcitoState('fall');
            setFeedback({ text: '¡La tabla era muy larga! Se cayó el puente.', type: 'error' });
            setTimeout(() => resetL1(), 2000);
          }, 1500);
        }, 800);
      }
    }, 100);
  }, [l1Selected, isChecking]);

  const resetL1 = useCallback(() => {
    setL1Selected(null);
    setL1PlankWidth('0%');
    setL1ShowPlank(false);
    setL1PlankState('idle');
    setPulgarcitoState('idle');
    setIsChecking(false);
    setFeedback(null);
  }, []);

  const handleGoToLevel2 = useCallback(() => {
    setCurrentLevel(2);
    setL1Completed(false);
    setFeedback(null);
    setPulgarcitoState('idle');
    setIsChecking(false);
  }, []);

  // ── Level 2 handlers ────────────────────────────────────────────────────

  const handleL2SelectPlank = (plank: L2Selection) => {
    if (isChecking) return;
    const idx = l2Selected.findIndex(s => s.id === plank.id);
    if (idx >= 0) {
      // Deselect
      const next = l2Selected.filter((_, i) => i !== idx);
      setL2Selected(next);
      if (idx === 0) setSlot0Anim(next.length > 0 ? 'filled-left' : 'empty');
      if (idx === 1) setSlot1Anim('empty');
    } else {
      if (l2Selected.length >= 2) {
        setFeedback({ text: 'Solo puedes elegir 2 tablas.', type: 'error' });
        setTimeout(() => setFeedback(null), 1800);
        return;
      }
      const next = [...l2Selected, plank];
      setL2Selected(next);
      if (next.length === 1) setSlot0Anim('filled-left');
      if (next.length === 2) setSlot1Anim('filled-right');
    }
  };

  const handleL2Check = useCallback(() => {
    if (isChecking || l2Selected.length < 2) {
      if (l2Selected.length < 2)
        setFeedback({ text: '¡Necesitas elegir 2 tablas!', type: 'error' });
      setTimeout(() => setFeedback(null), 1800);
      return;
    }
    setIsChecking(true);
    setFeedback(null);

    const sum = l2Selected.reduce((a, s) => a + s.size, 0);

    if (sum === L2_TARGET) {
      setFeedback({ text: `¡Exacto! ${l2Selected[0].size} + ${l2Selected[1].size} = 20 cm`, type: 'success' });
      setPulgarcitoState('walk-bridge');
      setTimeout(() => {
        setPulgarcitoState('walk-across');
        setTimeout(() => {
          setPulgarcitoState('celebrate');
          triggerConfetti();
          setTimeout(() => {
            setGameCompleted(true);
            setIsChecking(false);
          }, 2000);
        }, 1600);
      }, 1300);
    } else {
      // Shake then drop
      setSlot0Anim('shaking');
      setSlot1Anim('shaking');
      setTimeout(() => {
        setSlot0Anim('dropping');
        setSlot1Anim('dropping');
        setPulgarcitoState('walk-bridge');
        setTimeout(() => {
          setPulgarcitoState('fall');
          const hint =
            sum < L2_TARGET
              ? `¡Faltan ${L2_TARGET - sum} cm! Prueba otra combinación.`
              : `¡Te pasaste ${sum - L2_TARGET} cm! Prueba otra combinación.`;
          setFeedback({ text: hint, type: 'error' });
          setTimeout(() => resetL2(), 2200);
        }, 900);
      }, 600);
    }
  }, [l2Selected, isChecking]);

  const resetL2 = useCallback(() => {
    setL2Selected([]);
    setSlot0Anim('empty');
    setSlot1Anim('empty');
    setPulgarcitoState('idle');
    setIsChecking(false);
    setFeedback(null);
  }, []);

  const handleRestartGame = useCallback(() => {
    setCurrentLevel(1);
    setGameCompleted(false);
    resetL1();
    resetL2();
  }, [resetL1, resetL2]);

  const handleBack = () => navigate('/semana/1/rescata-pulgarcito');
  const handleHome = () => navigate('/home');

  // ── Derived ─────────────────────────────────────────────────────────────

  const progressPct = currentLevel === 1 ? 33 : gameCompleted ? 100 : 66;
  const progressLabel = currentLevel === 1 ? '1 / 2' : gameCompleted ? '2 / 2' : '2 / 2';

  const l2Sum = l2Selected.reduce((a, s) => a + s.size, 0);

  const getSlotClass = (anim: SlotAnimState) => {
    const base =
      'flex-1 h-10 rounded-lg border-2 border-on-surface-variant relative flex items-center justify-center transition-all duration-300';
    switch (anim) {
      case 'empty':        return `${base} border-dashed opacity-40 bg-transparent`;
      case 'filled-left':  return `${base} bg-tertiary plank-slot-filled-left`;
      case 'filled-right': return `${base} bg-tertiary plank-slot-filled-right`;
      case 'shaking':      return `${base} bg-tertiary plank-slot-shaking`;
      case 'dropping':     return `${base} bg-tertiary plank-slot-dropping`;
      default:             return base;
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col font-body-md text-body-md relative overflow-x-hidden bg-surface">
      {/* TopAppBar */}
      <header className="bg-surface-container-low w-full top-0 z-40 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-base">
        <button
          onClick={handleBack}
          aria-label="Back"
          className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full"
        >
          <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary text-center flex-1">
          Week 1: Tiny Travelers
        </h1>
        <button
          onClick={handleHome}
          aria-label="Home"
          className="text-primary hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full"
        >
          <span className="material-symbols-outlined fill" style={{ fontSize: '28px' }}>home</span>
        </button>
      </header>

      <main className="flex-1 w-full max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-lg pb-32 md:pb-lg flex flex-col gap-lg">

        {/* Title */}
        <section className="text-center max-w-3xl mx-auto space-y-sm">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            {currentLevel === 1 ? 'Rescata a Pulgarcito' : '¡El Río se Hizo más Ancho!'}
          </h2>
          <p className="text-on-surface-variant font-body-lg text-body-lg">
            {currentLevel === 1
              ? 'El puente está roto. Elige la tabla correcta para ayudarle a cruzar.'
              : 'Ahora necesitas DOS tablas que juntas midan exactamente 20 cm.'}
          </p>
        </section>

        {/* Progress */}
        <section className="max-w-2xl mx-auto w-full">
          <div className="flex justify-between items-center mb-xs">
            <span className="font-label-lg text-label-lg text-primary">Progreso del Viaje</span>
            <span className="font-label-md text-label-md text-primary font-bold">{progressLabel}</span>
          </div>
          <div className="h-6 w-full bg-surface-container-highest rounded-full overflow-hidden border-2 border-on-surface-variant">
            <div
              className="h-full bg-primary transition-all duration-700 ease-out rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </section>

        {/* Game layout */}
        <section className="flex flex-col lg:flex-row gap-gutter min-h-[500px]">

          {/* ── Scene ────────────────────────────────────────────────── */}
          <div className="flex-[2] relative bg-surface-container-low rounded-3xl border-2 border-on-surface-variant overflow-hidden shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)] flex items-center justify-center min-h-[400px]">
            {/* Background */}
            <div className="absolute inset-0 z-0">
              <img
                alt="Bosque encantado"
                className="w-full h-full object-cover opacity-60 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIHFf2RojoYUF4yDtohS_ChRwmo-vknyrBLXbWhU16lOoP2HSfioYCsXVWNjbcBPDvcd6HY1LjVHSh-D3uLIabv5sLpH7dbilVU1gg46SyZU7r6T9vlP3sTbfYLoqjaIO1PyY9kde10nQwWx6sN2p_GQsyEAImMSkmrXYL1dqyBtzHOReKH85U67POa8eLzvIeZxKMmcCtShP1DgZ9TkSFm5Ju0ZA0T6GjZx6KHAE0PZ6SDTZaBpVXRX5Pb1eOW5Hdl2Jn8LvuSE5b"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-low via-transparent to-transparent z-10" />
            </div>

            <div className="relative z-20 w-full h-full flex items-center justify-center">
              <div className="absolute w-[120%] h-32 bg-secondary-container/50 bottom-20 -rotate-12 rounded-full blur-sm" />

              {/* Left cliff + Pulgarcito */}
              <div className="absolute left-10 bottom-32 flex flex-col items-center">
                <div className="w-32 h-40 bg-tertiary-container rounded-t-3xl border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative z-10 flex items-end justify-center pb-2">
                  <img
                    alt="Pulgarcito"
                    className={getPulgarcitoClass(pulgarcitoState)}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDliDzPfDDOQK5wNDh9WW48CLvIGb1FN6cO0JrEPNcK-TjigQRUT550itxooJ5Y-3f72w-pRl2hkPvJeUlQC1ED4cQzz0rLX4PmgWmegZHMCwa4kbSkxF6Bkt56tRPvzkA-oduceGFsQHnJLJpmAbelFSREpiKTMt8-zCIfeF9p3IhnkzvaegavKxESZM91RqbtwKsWxN4ix9G9gs3CHWobQ9viTm74iMDR4shYYJV8IuEK5TJ7cr-uG9Ihg4RLZE87z-I_PTpkvohc"
                  />
                </div>
                <div className="w-12 h-64 bg-tertiary rounded-b-xl border-2 border-on-surface-variant mt-[-10px] z-0" />
              </div>

              {/* Right cliff */}
              <div className="absolute right-10 flex flex-col items-center opacity-60 bottom-32">
                <div className="w-32 h-24 bg-tertiary-container rounded-t-3xl border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative z-10 flex items-center justify-center">
                  <div className="w-24 h-6 bg-on-tertiary/20 rounded-full border-2 border-dashed border-on-tertiary/40" />
                </div>
                <div className="w-12 h-64 bg-tertiary rounded-b-xl border-2 border-on-surface-variant mt-[-10px] z-0" />
              </div>

              {/* Bridge area */}
              <div className="absolute w-1/2 left-1/4 z-30 bottom-[320px]">
                {currentLevel === 1 ? (
                  /* Level 1: single plank */
                  <div
                    className={`w-full h-12 rounded-lg flex items-center justify-center relative transition-all duration-500 ${
                      l1PlankState === 'tilt' ? 'plank-tilt' : l1PlankState === 'fall' ? 'plank-fall' : ''
                    }`}
                  >
                    <div
                      className={`h-full bg-tertiary rounded-lg border-2 border-on-surface-variant shadow-[inset_0_-4px_0_0_rgba(0,0,0,0.15)] relative transition-all duration-500 ${
                        l1ShowPlank ? 'block' : 'hidden'
                      }`}
                      style={{ width: l1PlankWidth }}
                    >
                      <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full top-3" />
                      <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full bottom-3" />
                    </div>
                  </div>
                ) : (
                  /* Level 2: two plank slots */
                  <div className="flex gap-1 h-12">
                    <div className={getSlotClass(slot0Anim)}>
                      {l2Selected[0] && (
                        <>
                          <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full top-2" />
                          <span className="text-xs font-bold text-on-tertiary z-10">{l2Selected[0].size} cm</span>
                          <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full bottom-2" />
                        </>
                      )}
                    </div>
                    <div className={getSlotClass(slot1Anim)}>
                      {l2Selected[1] && (
                        <>
                          <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full top-2" />
                          <span className="text-xs font-bold text-on-tertiary z-10">{l2Selected[1].size} cm</span>
                          <div className="absolute inset-x-2 h-0.5 bg-on-tertiary/20 rounded-full bottom-2" />
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Inventory panel ───────────────────────────────────────── */}
          <div className="flex-1 bg-surface-bright rounded-3xl border-2 border-on-surface-variant shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)] p-md flex flex-col gap-md">

            {/* Panel header */}
            <div className="flex items-center gap-sm border-b-2 border-surface-container-highest pb-sm">
              <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary-container">inventory_2</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface">
                {currentLevel === 1 ? 'Tablas Disponibles' : 'Almacén de Tablas'}
              </h3>
            </div>

            {/* Hint */}
            <p className="font-body-md text-body-md text-on-surface-variant">
              {currentLevel === 1 ? (
                <>Selecciona una tabla que mida exactamente <strong className="text-primary font-bold">10 cm</strong>.</>
              ) : (
                <>Selecciona <strong className="text-primary font-bold">2 tablas</strong> que sumen exactamente <strong className="text-primary font-bold">20 cm</strong>.</>
              )}
            </p>

            {/* Level 2: sum indicator */}
            {currentLevel === 2 && (
              <div className="flex items-center justify-between bg-surface-container rounded-xl p-sm border-2 border-surface-container-highest">
                <span className="font-label-md text-label-md text-on-surface-variant">Suma actual:</span>
                <span
                  className={`font-headline-md text-headline-md font-bold transition-colors ${
                    l2Sum === L2_TARGET ? 'text-primary' : l2Sum > L2_TARGET ? 'text-error' : 'text-on-surface'
                  }`}
                >
                  {l2Sum} cm
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant">Meta: 20 cm</span>
              </div>
            )}

            {/* Feedback */}
            {feedback && (
              <div
                className={`p-3 rounded-xl text-center font-label-md transition-all ${
                  feedback.type === 'success'
                    ? 'bg-primary-fixed text-on-primary-fixed'
                    : 'bg-error-container text-on-error-container'
                }`}
              >
                {feedback.text}
              </div>
            )}

            {/* Plank list */}
            <div className="flex flex-col gap-sm mt-xs">
              {currentLevel === 1
                ? L1_PLANKS.map(plank => (
                    <button
                      key={plank.id}
                      onClick={() => handleL1SelectPlank(plank.size)}
                      disabled={isChecking}
                      className={`w-full bg-tertiary-fixed rounded-xl p-sm border-2 border-on-surface-variant flex items-center justify-between hover:bg-tertiary-fixed-dim transition-all ${
                        l1Selected === plank.size ? 'bg-primary-fixed border-primary' : ''
                      } ${plank.size === L1_CORRECT ? 'animate-float-pulgarcito' : ''}`}
                    >
                      <div className="flex items-center gap-sm">
                        <span className="material-symbols-outlined text-on-tertiary-fixed">view_day</span>
                        <span className="font-label-lg text-label-lg text-on-tertiary-fixed">{plank.name}</span>
                      </div>
                      <div
                        className={`bg-surface-container-lowest px-3 py-1 rounded-full text-sm font-label-md border ${
                          plank.size === L1_CORRECT
                            ? 'text-primary font-bold border-primary'
                            : 'text-on-surface border-outline-variant'
                        }`}
                      >
                        {plank.label}
                      </div>
                    </button>
                  ))
                : L2_PLANKS.map(plank => {
                    const isSelected = l2Selected.some(s => s.id === plank.id);
                    const isCorrectSize = plank.size === 8 || plank.size === 12;
                    return (
                      <button
                        key={plank.id}
                        onClick={() => handleL2SelectPlank({ size: plank.size, id: plank.id })}
                        disabled={isChecking}
                        className={`w-full bg-tertiary-fixed rounded-xl p-sm border-2 border-on-surface-variant flex items-center justify-between hover:bg-tertiary-fixed-dim transition-all ${
                          isSelected ? 'bg-primary-fixed border-primary' : ''
                        } ${isCorrectSize && !isSelected ? 'animate-float-pulgarcito' : ''}`}
                      >
                        <div className="flex items-center gap-sm">
                          <span className="material-symbols-outlined text-on-tertiary-fixed">view_day</span>
                          <span className="font-label-lg text-label-lg text-on-tertiary-fixed">{plank.name}</span>
                        </div>
                        <div
                          className={`bg-surface-container-lowest px-3 py-1 rounded-full text-sm font-label-md border ${
                            isCorrectSize
                              ? 'text-primary font-bold border-primary'
                              : 'text-on-surface border-outline-variant'
                          }`}
                        >
                          {plank.label}
                        </div>
                      </button>
                    );
                  })}
            </div>

            {/* Action buttons */}
            <div className="mt-auto pt-md flex flex-col gap-sm">
              {gameCompleted ? (
                <>
                  <div className="text-center font-headline-md text-headline-md text-primary font-bold mb-sm">
                    🎉 ¡Pulgarcito está a salvo!
                  </div>
                  <button
                    onClick={handleRestartGame}
                    className="w-full bg-surface-container-highest text-on-surface font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:opacity-90 transition-all"
                  >
                    <span className="material-symbols-outlined">replay</span>
                    Jugar de nuevo
                  </button>
                  <button
                    onClick={handleBack}
                    className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all"
                  >
                    <span className="material-symbols-outlined">home</span>
                    Volver al inicio
                  </button>
                </>
              ) : currentLevel === 1 && l1Completed ? (
                <button
                  onClick={handleGoToLevel2}
                  className="w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all animate-pulse"
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  Nivel 2: ¡El río más ancho!
                </button>
              ) : currentLevel === 1 ? (
                <button
                  onClick={handleL1Check}
                  disabled={isChecking}
                  className={`w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all ${
                    l1Selected && !isChecking ? 'animate-pulse' : ''
                  }`}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Comprobar Puente
                </button>
              ) : (
                <button
                  onClick={handleL2Check}
                  disabled={isChecking}
                  className={`w-full bg-primary text-on-primary font-label-lg text-label-lg py-4 rounded-xl border-2 border-on-surface-variant flex items-center justify-center gap-sm hover:bg-surface-tint transition-all ${
                    l2Selected.length === 2 && !isChecking ? 'animate-pulse' : ''
                  }`}
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Construir Puente
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar */}
      <nav className="md:hidden bg-surface-container w-full z-50 fixed bottom-0 left-0 flex justify-around items-center px-4 pb-4 pt-2 shadow-[0_-4px_20px_rgba(74,101,73,0.1)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2">
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-2 scale-90">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: '"FILL" 1' }}>experiment</span>
          <span className="font-label-md text-label-md">Lab</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2">
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="font-label-md text-label-md">Science Buddies</span>
        </button>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2">
          <span className="material-symbols-outlined mb-1">stars</span>
          <span className="font-label-md text-label-md">Progress</span>
        </button>
      </nav>
    </div>
  );
}
