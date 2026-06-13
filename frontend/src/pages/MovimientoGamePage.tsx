import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Images ──────────────────────────────────────────────────────────────────
const IMG_HERO       = '/images/semana6/moverse/hero.png';
const IMG_FEELINGS   = '/images/semana6/moverse/feelings.png';
const IMG_FINAL      = '/images/semana6/moverse/final.png';

const ACTIVITIES = [
  { title: '¡Salta 10 veces!',              image: '/images/semana6/moverse/act1-salta.png',       duration: 10 },
  { title: '¡Corre en tu lugar 15 segundos!', image: '/images/semana6/moverse/act2-corre.png',     duration: 15 },
  { title: '¡5 sentadillas!',               image: '/images/semana6/moverse/act3-sentadillas.png', duration: 30 },
];

const FEELINGS = [
  { icon: 'wb_sunny',    bg: 'bg-tertiary-fixed',    iconColor: 'text-[#6a5d45]', question: '¿Sientes calor?' },
  { icon: 'favorite',    bg: 'bg-error-container',   iconColor: 'text-[#ba1a1a]', question: '¿Late más rápido tu corazón?' },
  { icon: 'water_drop',  bg: 'bg-secondary-container', iconColor: 'text-[#3e6378]', question: '¿Tienes sed?' },
];

// ── SVG Timer ────────────────────────────────────────────────────────────────
const CIRCUMFERENCE = 2 * Math.PI * 45; // ≈ 282.7

function CircleTimer({ timeLeft, duration }: { timeLeft: number; duration: number }) {
  const offset = CIRCUMFERENCE * (1 - timeLeft / duration);
  return (
    <div className="relative w-32 h-32 flex items-center justify-center bg-surface-container rounded-full shadow-[inset_0_2px_8px_rgba(0,0,0,0.05)] border-2 border-surface-dim">
      <svg className="w-full h-full absolute inset-0" viewBox="0 0 100 100">
        <circle
          className="text-surface-variant opacity-30"
          cx="50" cy="50" r="45" fill="none"
          stroke="currentColor" strokeWidth="8"
        />
        <circle
          cx="50" cy="50" r="45" fill="none"
          stroke="#4a6549" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="font-headline-md text-headline-md text-primary leading-none">{timeLeft}</span>
        <span className="font-label-md text-label-md text-on-surface-variant text-[12px]">segundos</span>
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
type Screen = 'start' | 'activity' | 'feelings' | 'results';

export default function MovimientoGamePage() {
  const navigate = useNavigate();

  const [screen, setScreen]       = useState<Screen>('start');
  const [actIdx, setActIdx]       = useState(0);
  const [timeLeft, setTimeLeft]   = useState(ACTIVITIES[0].duration);
  const [timerRunning, setTimerRunning] = useState(false);

  // feelings: null = unanswered, true = sí, false = no
  const [feelingAnswers, setFeelingAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const currentAct = ACTIVITIES[actIdx];
  const allAnswered = feelingAnswers.every((a) => a !== null);

  // ── Timer logic ──────────────────────────────────────────────────────────
  const startTimer = useCallback(() => {
    setTimeLeft(currentAct.duration);
    setTimerRunning(true);
  }, [currentAct.duration]);

  useEffect(() => {
    if (screen === 'activity') startTimer();
  }, [screen, actIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) { setTimerRunning(false); return; }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  // ── Navigation ───────────────────────────────────────────────────────────
  function handleReady() {
    setTimerRunning(false);
    if (actIdx + 1 < ACTIVITIES.length) {
      const next = actIdx + 1;
      setActIdx(next);
      setTimeLeft(ACTIVITIES[next].duration);
      setScreen('activity'); // trigger useEffect via dependency change
    } else {
      setScreen('feelings');
    }
  }

  function handleFeelingAnswer(i: number, val: boolean) {
    setFeelingAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function handleFeelingsContinue() {
    setScreen('results');
  }

  function handleRestart() {
    setActIdx(0);
    setTimeLeft(ACTIVITIES[0].duration);
    setFeelingAnswers([null, null, null]);
    setTimerRunning(false);
    setScreen('start');
  }

  // ══════════════════════════════════════════════════════════════════════════
  // START SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === 'start') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center font-body-md overflow-hidden antialiased">
        <main className="w-full max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center flex-grow gap-xl py-xl">
          <header className="text-center">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary tracking-tight">
              ¡A moverse!
            </h1>
          </header>

          {/* Circular image with decorative blobs */}
          <div className="relative flex items-center justify-center w-full max-w-sm">
            <div className="absolute inset-0 bg-primary-fixed opacity-40 rounded-full scale-110 blur-xl" />
            <div className="absolute inset-0 bg-secondary-container rounded-full scale-90 mix-blend-multiply opacity-50" />
            <div className="relative z-10 w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-4 border-surface shadow-lg bg-surface-container flex items-center justify-center">
              <img src={IMG_HERO} alt="Personaje en movimiento" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute -top-4 -right-4 w-6 h-6 bg-tertiary-fixed rounded-full opacity-60 animate-bounce" style={{ animationDuration: '3s' }} />
            <div className="absolute -bottom-2 -left-6 w-4 h-4 bg-primary-container rounded-full opacity-80 animate-pulse" style={{ animationDuration: '4s' }} />
          </div>

          <div className="w-full max-w-xs flex flex-col items-center pt-md">
            <button
              onClick={() => setScreen('activity')}
              className="w-full bg-primary text-on-primary font-headline-md text-headline-md py-md px-lg rounded-xl flex items-center justify-center gap-sm active:translate-y-1 transition-transform"
              style={{ boxShadow: '0 4px 0 0 #334d33', borderBottom: '4px solid #334d33' }}
            >
              <span>¡Empezar Aventura!</span>
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            </button>
            <p className="mt-sm text-center font-label-md text-label-md text-on-surface-variant max-w-xs">
              Prepárate para explorar.
            </p>
          </div>
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ACTIVITY SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === 'activity') {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col items-center">
        <header className="bg-background w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">¡A moverse!</h1>
          </div>
          <button
            onClick={() => navigate('/semana/6')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <main className="flex-grow w-full max-w-4xl mx-auto px-margin-mobile md:px-gutter pt-xl pb-32 flex flex-col items-center justify-center text-center">
          {/* Progress dots */}
          <div className="flex gap-2 mb-lg">
            {ACTIVITIES.map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${i === actIdx ? 'w-6 h-3 bg-primary' : i < actIdx ? 'w-3 h-3 bg-primary-container' : 'w-3 h-3 bg-outline-variant'}`}
              />
            ))}
          </div>

          <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary mb-lg">
            {currentAct.title}
          </h2>

          {/* Character illustration */}
          <div className="relative w-64 h-64 md:w-80 md:h-80 mb-lg">
            <div className="absolute inset-0 bg-primary-fixed-dim opacity-30 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] animate-spin" style={{ animationDuration: '10s' }} />
            <img
              src={currentAct.image}
              alt={currentAct.title}
              className="relative z-10 w-full h-full object-contain drop-shadow-md"
            />
          </div>

          {/* Circular timer */}
          <div className="mb-xl">
            <CircleTimer timeLeft={timeLeft} duration={currentAct.duration} />
          </div>

          <button
            onClick={handleReady}
            className="bg-primary text-on-primary font-headline-md text-headline-md py-4 px-12 rounded-full flex items-center gap-3 shadow-lg active:translate-y-0.5 transition-transform"
            style={{ boxShadow: '0 4px 0 0 #334d33', borderBottom: '4px solid #334d33' }}
          >
            <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            ¡LISTO!
          </button>
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // FEELINGS SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  if (screen === 'feelings') {
    return (
      <div className="bg-background text-on-background min-h-screen flex flex-col font-body-lg">
        <header className="bg-background w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 sticky top-0 z-40">
          <span className="font-headline-md text-headline-md font-bold text-primary">¡A moverse!</span>
          <button
            onClick={() => navigate('/semana/6')}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </header>

        <main className="flex-grow flex flex-col items-center px-margin-mobile md:px-margin-desktop py-lg pb-32 md:pb-lg w-full max-w-5xl mx-auto">
          <div className="w-full max-w-md mb-8 flex justify-center">
            <img src={IMG_FEELINGS} alt="Sol, corazón y gota de agua" className="w-full h-auto object-contain max-h-[200px]" />
          </div>

          <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary text-center mb-12">
            ¿Cómo se siente tu cuerpo?
          </h1>

          <div className="w-full max-w-2xl flex flex-col gap-6">
            {FEELINGS.map((f, i) => (
              <div
                key={f.question}
                className="bg-surface-container-lowest border-2 border-surface-variant rounded-[2rem] p-6 shadow-[0_8px_24px_rgba(74,101,73,0.05)] flex flex-col sm:flex-row items-center gap-6 sm:gap-8"
              >
                <div className={`${f.bg} w-24 h-24 rounded-full flex items-center justify-center shrink-0`}>
                  <span className={`material-symbols-outlined text-6xl ${f.iconColor}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    {f.icon}
                  </span>
                </div>
                <div className="flex-grow text-center sm:text-left w-full">
                  <h2 className="font-headline-md text-headline-md text-on-surface mb-6">{f.question}</h2>
                  <div className="flex gap-4 w-full">
                    <button
                      onClick={() => handleFeelingAnswer(i, true)}
                      className={`flex-1 py-4 font-label-lg text-label-lg rounded-2xl border-b-[6px] flex items-center justify-center gap-2 transition-all active:translate-y-1 ${
                        feelingAnswers[i] === true
                          ? 'bg-primary text-on-primary border-[#334d33]'
                          : 'bg-primary text-on-primary border-on-primary-fixed-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
                      ¡Sí!
                    </button>
                    <button
                      onClick={() => handleFeelingAnswer(i, false)}
                      className={`flex-1 py-4 font-label-lg text-label-lg rounded-2xl border-b-[6px] flex items-center justify-center gap-2 transition-all active:translate-y-1 ${
                        feelingAnswers[i] === false
                          ? 'bg-outline text-surface border-[#5a6b5a]'
                          : 'bg-surface-variant text-on-surface-variant border-outline-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
                      No
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {allAnswered && (
            <button
              onClick={handleFeelingsContinue}
              className="mt-10 bg-primary text-on-primary font-label-lg text-label-lg py-md px-xl rounded-2xl border-b-4 border-[#334d33] active:translate-y-1 transition-transform"
            >
              Continuar →
            </button>
          )}
        </main>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // RESULTS SCREEN
  // ══════════════════════════════════════════════════════════════════════════
  return (
    <div className="bg-background min-h-screen flex flex-col font-body-md text-on-surface antialiased overflow-x-hidden">
      <header className="hidden md:flex justify-between items-center w-full px-margin-desktop py-4 bg-background z-40 sticky top-0">
        <div className="font-headline-md text-headline-md font-bold text-primary flex items-center gap-sm">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>directions_run</span>
          ¡A moverse!
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center p-margin-mobile md:p-margin-desktop relative z-10 w-full max-w-7xl mx-auto pb-32 md:pb-margin-desktop">
        <div className="w-full max-w-3xl">
          {/* Card */}
          <div className="bg-surface-container-lowest rounded-3xl border-[3px] border-surface-container-highest overflow-hidden flex flex-col md:flex-row relative group shadow-[0_8px_32px_-4px_rgba(74,101,73,0.15)]">
            <div className="absolute top-0 right-10 w-24 h-4 bg-tertiary-container rounded-b-xl opacity-50" />

            {/* Image side */}
            <div className="w-full md:w-1/2 p-lg flex items-center justify-center bg-error-container/30 relative overflow-hidden min-h-[300px]">
              <img
                src={IMG_FINAL}
                alt="¡Misión cumplida!"
                className="relative z-10 w-full max-w-[280px] h-auto object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Content side */}
            <div className="w-full md:w-1/2 p-lg flex flex-col justify-center gap-lg bg-surface-container-lowest">
              <div className="space-y-sm">
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-primary leading-tight">¡Misión Cumplida!</h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  ¡Felicidades! Has completado todos los ejercicios de hoy. Tu cuerpo y tu corazón están listos para seguir explorando.
                </p>
              </div>

              <div className="mt-4 flex flex-col gap-3">
                <button
                  onClick={() => navigate('/semana/6')}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-sm px-8 py-4 bg-primary text-on-primary rounded-2xl font-label-lg text-label-lg border-b-4 border-[#334d33] hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-all duration-200"
                >
                  Siguiente juego
                </button>
                <button
                  onClick={handleRestart}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-sm px-8 py-4 bg-surface-container text-primary rounded-2xl font-label-lg text-label-lg border-b-4 border-surface-container-highest hover:-translate-y-1 active:translate-y-0 active:border-b-0 transition-all duration-200"
                >
                  Intentar de nuevo
                </button>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center items-center gap-xs mt-lg">
            <div className="w-2 h-2 rounded-full bg-outline-variant" />
            <div className="w-2 h-2 rounded-full bg-outline-variant" />
            <div className="w-4 h-2 rounded-full bg-primary transition-all duration-300" />
            <div className="w-2 h-2 rounded-full bg-outline-variant" />
          </div>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 bg-surface-container-lowest shadow-[0_-4px_12px_rgba(74,101,73,0.08)] rounded-t-2xl border-t border-surface-container-highest">
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">exercise</span>
          <span className="font-label-md text-label-md mt-1">¡Jugar!</span>
        </button>
        <button className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-3xl px-6 py-2">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
          <span className="font-label-md text-label-md mt-1 font-bold">Mi Cuerpo</span>
        </button>
        <button onClick={() => navigate('/home')} className="flex flex-col items-center justify-center text-on-surface-variant px-6 py-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">map</span>
          <span className="font-label-md text-label-md mt-1">Mapa</span>
        </button>
      </nav>
    </div>
  );
}
