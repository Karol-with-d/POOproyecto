import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetScrollOn } from '../components/WeekScrollReset';
import '../styles/bosque-vivo.css';

const IMG_HERO = '/images/semana6/moverse/hero.webp';
const IMG_FEELINGS = '/images/semana6/moverse/feelings.webp';
const IMG_FINAL = '/images/semana6/moverse/final.webp';

const ACTIVITIES = [
  { title: '¡Salta 10 veces!', image: '/images/semana6/moverse/act1-salta.webp', duration: 10 },
  { title: '¡Corre en tu lugar 15 segundos!', image: '/images/semana6/moverse/act2-corre.webp', duration: 15 },
  { title: '¡15 sentadillas!', image: '/images/semana6/moverse/act3-sentadillas.webp', duration: 30 },
];

const FEELINGS = [
  { icon: 'wb_sunny', color: '#ff7a59', bg: 'rgba(255,122,89,0.2)', question: '¿Sientes calor?' },
  { icon: 'favorite', color: '#e85a3a', bg: 'rgba(232,90,58,0.18)', question: '¿Late más rápido tu corazón?' },
  { icon: 'water_drop', color: '#1a7a96', bg: 'rgba(26,122,150,0.18)', question: '¿Tienes sed?' },
];

const CIRCUMFERENCE = 2 * Math.PI * 45;

function CircleTimer({ timeLeft, duration }: { timeLeft: number; duration: number }) {
  const offset = CIRCUMFERENCE * (1 - timeLeft / duration);
  return (
    <div
      className="relative flex h-36 w-36 items-center justify-center rounded-full"
      style={{
        background: 'rgba(255,255,255,0.9)',
        border: '3px solid rgba(15,47,40,0.12)',
        boxShadow: 'inset 0 2px 10px rgba(15,47,40,0.06)',
      }}
    >
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(15,47,40,0.12)" strokeWidth="8" />
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#ff7a59"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.9s linear' }}
        />
      </svg>
      <div className="relative z-10 flex flex-col items-center">
        <span className="bv-baloo text-4xl font-extrabold text-[var(--bv-coral)] leading-none">{timeLeft}</span>
        <span className="text-xs font-bold text-[var(--bv-muted)]">segundos</span>
      </div>
    </div>
  );
}

function BvShell({ children }: { children: ReactNode }) {
  return (
    <div className="bv-root bv-page relative min-h-screen flex flex-col overflow-x-hidden">
      <div className="bv-atmosphere" aria-hidden="true">
        <div className="bv-fireflies">
          <span /><span /><span /><span />
        </div>
      </div>
      <div className="relative z-[1] flex min-h-screen flex-col">{children}</div>
    </div>
  );
}

function TopBar({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <header
      className="sticky top-0 z-40 flex items-center justify-between gap-3 px-4 py-3 md:px-8"
      style={{ background: 'rgba(15,47,40,0.92)', color: '#eef8f4' }}
    >
      <button type="button" onClick={onBack} aria-label="Volver" className="bv-icon-btn">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <h1 className="bv-baloo flex-1 truncate text-center text-lg font-extrabold md:text-xl">{title}</h1>
      <div className="w-11" />
    </header>
  );
}

type Screen = 'start' | 'activity' | 'feelings' | 'results';

export default function MovimientoGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('start');
  const [actIdx, setActIdx] = useState(0);
  useResetScrollOn(`${screen}-${actIdx}`);
  const [timeLeft, setTimeLeft] = useState(ACTIVITIES[0].duration);
  const [timerRunning, setTimerRunning] = useState(false);
  const [feelingAnswers, setFeelingAnswers] = useState<(boolean | null)[]>([null, null, null]);

  const currentAct = ACTIVITIES[actIdx];
  const allAnswered = feelingAnswers.every((a) => a !== null);

  const startTimer = useCallback(() => {
    setTimeLeft(currentAct.duration);
    setTimerRunning(true);
  }, [currentAct.duration]);

  useEffect(() => {
    if (screen === 'activity') startTimer();
  }, [screen, actIdx]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!timerRunning) return;
    if (timeLeft <= 0) {
      setTimerRunning(false);
      return;
    }
    const id = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timerRunning, timeLeft]);

  function handleReady() {
    setTimerRunning(false);
    if (actIdx + 1 < ACTIVITIES.length) {
      const next = actIdx + 1;
      setActIdx(next);
      setTimeLeft(ACTIVITIES[next].duration);
      setScreen('activity');
    } else {
      setScreen('feelings');
    }
  }

  function handleFeelingAnswer(i: number, val: boolean) {
    setFeelingAnswers((prev) => prev.map((a, idx) => (idx === i ? val : a)));
  }

  function handleRestart() {
    setActIdx(0);
    setTimeLeft(ACTIVITIES[0].duration);
    setFeelingAnswers([null, null, null]);
    setTimerRunning(false);
    setScreen('start');
  }

  if (screen === 'start') {
    return (
      <BvShell>
        <TopBar title="¡A moverse!" onBack={() => navigate('/semana/6')} />
        <main className="flex flex-1 flex-col items-center justify-center gap-6 px-5 py-8 text-center">
          <span className="bv-chip" style={{ background: 'rgba(255,122,89,0.2)', color: '#e85a3a' }}>
            Energía del bosque
          </span>
          <h2 className="bv-title text-4xl">¡A moverse!</h2>
          <div className="bv-float relative">
            <div
              className="h-48 w-48 overflow-hidden rounded-full border-4 md:h-60 md:w-60"
              style={{ borderColor: '#ff7a59', boxShadow: '0 12px 0 rgba(232,90,58,0.35)' }}
            >
              <img src={IMG_HERO} alt="Personaje en movimiento" className="h-full w-full object-cover" />
            </div>
          </div>
          <button type="button" onClick={() => setScreen('activity')} className="bv-btn bv-btn-coral w-full max-w-xs">
            ¡Empezar Aventura!
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
          </button>
          <p className="bv-subtitle text-sm">Prepárate para explorar con todo el cuerpo.</p>
        </main>
      </BvShell>
    );
  }

  if (screen === 'activity') {
    return (
      <BvShell>
        <TopBar title="¡A moverse!" onBack={() => navigate('/semana/6')} />
        <main className="flex flex-1 flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-5 flex gap-2">
            {ACTIVITIES.map((_, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === actIdx ? 28 : 12,
                  height: 12,
                  background:
                    i === actIdx ? '#ff7a59' : i < actIdx ? '#2f9e6b' : 'rgba(15,47,40,0.15)',
                }}
              />
            ))}
          </div>

          <h2 className="bv-title mb-6 text-2xl md:text-3xl">{currentAct.title}</h2>

          <div className="relative mb-4 h-40 w-40 sm:mb-6 sm:h-56 sm:w-56 md:h-72 md:w-72">
            <div
              className="absolute inset-0 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-40 animate-spin"
              style={{ background: 'rgba(255,122,89,0.35)', animationDuration: '10s' }}
            />
            <img
              src={currentAct.image}
              alt={currentAct.title}
              className="relative z-10 h-full w-full object-contain drop-shadow-md"
            />
          </div>

          <div className="mb-8">
            <CircleTimer timeLeft={timeLeft} duration={currentAct.duration} />
          </div>

          <button type="button" onClick={handleReady} className="bv-btn bv-btn-leaf px-12">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            ¡LISTO!
          </button>
        </main>
      </BvShell>
    );
  }

  if (screen === 'feelings') {
    return (
      <BvShell>
        <TopBar title="¡A moverse!" onBack={() => navigate('/semana/6')} />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center px-5 py-6 pb-16">
          <img src={IMG_FEELINGS} alt="Sol, corazón y gota" className="mb-4 h-auto max-h-40 w-full max-w-xs object-contain" />
          <h2 className="bv-title mb-6 text-center text-2xl md:text-3xl">¿Cómo se siente tu cuerpo?</h2>

          <div className="flex w-full flex-col gap-4">
            {FEELINGS.map((f, i) => (
              <div key={f.question} className="bv-card flex flex-col items-center gap-4 p-5 sm:flex-row">
                <div
                  className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full"
                  style={{ background: f.bg }}
                >
                  <span
                    className="material-symbols-outlined text-5xl"
                    style={{ color: f.color, fontVariationSettings: "'FILL' 1" }}
                  >
                    {f.icon}
                  </span>
                </div>
                <div className="w-full flex-1 text-center sm:text-left">
                  <h3 className="bv-baloo mb-3 text-xl font-bold">{f.question}</h3>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => handleFeelingAnswer(i, true)}
                      className={`bv-btn flex-1 ${feelingAnswers[i] === true ? 'bv-btn-coral' : 'bv-btn-ghost'}`}
                    >
                      ¡Sí!
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeelingAnswer(i, false)}
                      className={`bv-btn flex-1 ${feelingAnswers[i] === false ? 'bv-btn-river' : 'bv-btn-ghost'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {allAnswered && (
            <button type="button" onClick={() => setScreen('results')} className="bv-btn bv-btn-firefly mt-8">
              Continuar →
            </button>
          )}
        </main>
      </BvShell>
    );
  }

  return (
    <BvShell>
      <TopBar title="¡A moverse!" onBack={() => navigate('/semana/6')} />
      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center justify-center px-5 py-8">
        <div className="bv-card flex w-full flex-col overflow-hidden md:flex-row">
          <div
            className="flex min-h-[240px] items-center justify-center p-6 md:w-1/2"
            style={{ background: 'rgba(255,122,89,0.18)' }}
          >
            <img src={IMG_FINAL} alt="¡Misión cumplida!" className="max-w-[260px] object-contain" />
          </div>
          <div className="flex flex-col justify-center gap-4 p-6 md:w-1/2">
            <h2 className="bv-title text-3xl">¡Misión Cumplida!</h2>
            <p className="bv-subtitle">
              Completaste los ejercicios. Tu cuerpo y tu corazón están listos para seguir explorando.
            </p>
            <button type="button" onClick={() => navigate('/semana/6')} className="bv-btn bv-btn-coral">
              Siguiente juego
            </button>
            <button type="button" onClick={handleRestart} className="bv-btn bv-btn-ghost">
              Intentar de nuevo
            </button>
          </div>
        </div>
      </main>
    </BvShell>
  );
}
