import { useState, useEffect, useRef, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetScrollOn } from '../components/WeekScrollReset';
import '../styles/bosque-vivo.css';
import { playLevelUp, playMiss, playPop, playSuccess } from '../services/sounds';

const IMG_HERO = '/images/semana6/similitudes/hero.webp';

interface QuizOption {
  label: string;
  icon: string;
  correct: boolean;
}

interface QuizQuestion {
  image: string;
  verb: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    image: '/images/semana6/similitudes/q1-alimentan.webp',
    verb: 'Se alimentan',
    options: [
      { label: 'Plantas', icon: 'eco', correct: false },
      { label: 'Animales', icon: 'pets', correct: false },
      { label: 'Ambos', icon: 'category', correct: true },
    ],
  },
  {
    image: '/images/semana6/similitudes/q2-crecen.png',
    verb: 'Crecen',
    options: [
      { label: 'Plantas', icon: 'eco', correct: false },
      { label: 'Animales', icon: 'pets', correct: false },
      { label: 'Ambos', icon: 'category', correct: true },
    ],
  },
  {
    image: '/images/semana6/similitudes/q3-mueven.webp',
    verb: 'Se mueven',
    options: [
      { label: 'Plantas', icon: 'eco', correct: false },
      { label: 'Animales', icon: 'pets', correct: true },
      { label: 'Ambos', icon: 'category', correct: false },
    ],
  },
  {
    image: '/images/semana6/similitudes/q4-fotosintesis.webp',
    verb: 'Hacen fotosíntesis',
    options: [
      { label: 'Plantas', icon: 'eco', correct: true },
      { label: 'Animales', icon: 'pets', correct: false },
      { label: 'Ambos', icon: 'category', correct: false },
    ],
  },
  {
    image: '/images/semana6/similitudes/q5-respiran.webp',
    verb: 'Respiran',
    options: [
      { label: 'Plantas', icon: 'eco', correct: false },
      { label: 'Animales', icon: 'pets', correct: false },
      { label: 'Ambos', icon: 'category', correct: true },
    ],
  },
];

type Screen = 'start' | 'question' | 'results';
type OptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function resize() {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    }
    window.addEventListener('resize', resize);
    resize();

    const colors = ['#2f9e6b', '#1a7a96', '#d4f542', '#ff7a59', '#0f2f28'];
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      speedY: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * 4,
      rotation: Math.random() * 360,
      rotSpeed: Math.random() * 10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    let raf: number;
    function animate() {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.rotSpeed;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      raf = requestAnimationFrame(animate);
    }
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10 h-full w-full"
    />
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

export default function SimilitudesGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('start');
  const [qIdx, setQIdx] = useState(0);
  useResetScrollOn(`${screen}-${qIdx}`);
  const [optStates, setOptStates] = useState<OptionState[]>(['idle', 'idle', 'idle']);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [advancing, setAdvancing] = useState(false);

  const currentQ = QUESTIONS[qIdx];
  const hasSelection =
    optStates.some((s) => s === 'selected' || s === 'correct' || s === 'incorrect');
  const canCheck = !checked && optStates.some((s) => s === 'selected');

  function handleOptionClick(i: number) {
    if (advancing) return;
    if (checked && optStates[i] === 'correct') return;
    playPop();
    setChecked(false);
    setOptStates(optStates.map((_, idx) => (idx === i ? 'selected' : 'idle')));
  }

  function handleCheck() {
    if (!canCheck || advancing) return;
    const idx = optStates.findIndex((s) => s === 'selected');
    if (idx === -1) return;
    setChecked(true);
    if (currentQ.options[idx].correct) {
      if (qIdx + 1 >= QUESTIONS.length) playLevelUp();
      else playSuccess();
      setOptStates(optStates.map((s, i) => (i === idx ? 'correct' : s)) as OptionState[]);
      setScore((prev) => prev + 1);
      setAdvancing(true);
      setTimeout(() => {
        if (qIdx + 1 < QUESTIONS.length) {
          setQIdx((prev) => prev + 1);
          setOptStates(['idle', 'idle', 'idle']);
          setChecked(false);
          setAdvancing(false);
        } else {
          setScreen('results');
        }
      }, 1500);
    } else {
      playMiss();
      setOptStates(optStates.map((s, i) => (i === idx ? 'incorrect' : s)) as OptionState[]);
    }
  }

  function handleNext() {
    if (advancing) return;
    if (qIdx + 1 < QUESTIONS.length) {
      setQIdx((prev) => prev + 1);
      setOptStates(['idle', 'idle', 'idle']);
      setChecked(false);
    } else {
      setScreen('results');
    }
  }

  function resetQuiz() {
    setQIdx(0);
    setOptStates(['idle', 'idle', 'idle']);
    setChecked(false);
    setScore(0);
    setAdvancing(false);
    setScreen('start');
  }

  function optionClass(state: OptionState) {
    if (state === 'correct') return 'bv-opt is-correct';
    if (state === 'incorrect') return 'bv-opt is-wrong';
    if (state === 'selected') return 'bv-opt is-selected';
    return 'bv-opt';
  }

  function optionIcon(state: OptionState, original: string) {
    if (state === 'correct') return 'check_circle';
    if (state === 'incorrect') return 'cancel';
    return original;
  }

  const stars = score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
  const progressPct = Math.round(((qIdx + 1) / QUESTIONS.length) * 100);

  if (screen === 'start') {
    return (
      <BvShell>
        <header className="sticky top-0 z-40 flex items-center justify-between gap-2 px-4 py-3 md:px-8"
          style={{ background: 'rgba(15,47,40,0.92)', color: '#eef8f4' }}>
          <button
            type="button"
            onClick={() => navigate('/semana/6')}
            aria-label="Volver"
            className="bv-icon-btn"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="bv-baloo flex-1 truncate text-center text-lg font-extrabold md:text-xl">
            ¿Qué tenemos en común?
          </h1>
          <div className="w-11" />
        </header>

        <main className="flex flex-1 flex-col items-center px-5 py-8 text-center">
          <div className="bv-float relative mb-6 w-full max-w-[240px]">
            <img src={IMG_HERO} alt="Tortuga y ganso científicos" className="h-auto w-full drop-shadow-lg" />
          </div>
          <span className="bv-chip mb-3" style={{ background: 'rgba(26,122,150,0.18)', color: '#1a7a96' }}>
            Observación en el bosque
          </span>
          <h2 className="bv-title mb-2 text-3xl md:text-4xl">¿Qué tenemos en común?</h2>
          <p className="bv-subtitle mb-8 max-w-md">
            ¡Adivina qué une a las plantas y los animales!
          </p>
          <button type="button" onClick={() => setScreen('question')} className="bv-btn bv-btn-river w-full max-w-xs">
            <span className="material-symbols-outlined">rocket_launch</span>
            ¡Empezar Aventura!
          </button>
        </main>
      </BvShell>
    );
  }

  if (screen === 'results') {
    return (
      <BvShell>
        <ConfettiCanvas />
        <main className="relative z-20 m-auto flex w-full max-w-lg flex-col items-center px-5 py-10">
          <h2 className="bv-title mb-2 text-center text-3xl">¡Excelente trabajo, explorador!</h2>
          <p className="bv-subtitle mb-6 text-center">Has completado la misión de similitudes</p>

          <div className="bv-card mb-8 w-full p-6 text-center">
            <p className="bv-chip mx-auto mb-3" style={{ background: 'rgba(212,245,66,0.4)', color: '#0f2f28' }}>
              Puntuación final
            </p>
            <div className="bv-baloo text-6xl font-extrabold text-[var(--bv-river)]">
              {score}
              <span className="text-2xl text-[var(--bv-muted)]">/{QUESTIONS.length}</span>
            </div>
            <div className="mt-4 flex justify-center gap-3">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined text-4xl"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    color: i < stars ? '#d4f542' : 'rgba(15,47,40,0.2)',
                    filter: i < stars ? 'drop-shadow(0 0 6px rgba(212,245,66,0.8))' : undefined,
                  }}
                >
                  star
                </span>
              ))}
            </div>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => navigate('/semana/6')} className="bv-btn bv-btn-leaf flex-1">
              <span className="material-symbols-outlined">sports_esports</span>
              Siguiente juego
            </button>
            <button type="button" onClick={resetQuiz} className="bv-btn bv-btn-ghost flex-1">
              <span className="material-symbols-outlined">replay</span>
              Intentar de nuevo
            </button>
          </div>
        </main>
      </BvShell>
    );
  }

  return (
    <BvShell>
      <header
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3 md:px-8"
        style={{ background: 'rgba(255,255,255,0.88)', borderBottom: '3px solid rgba(15,47,40,0.1)' }}
      >
        <button
          type="button"
          onClick={() => navigate('/semana/6')}
          aria-label="Cerrar"
          className="bv-icon-btn"
          style={{ background: '#ff7a59', color: '#fff' }}
        >
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="bv-progress flex-1">
          <span style={{ width: `${progressPct}%` }} />
        </div>
        <span className="bv-baloo shrink-0 font-bold text-[var(--bv-river)]">
          {qIdx + 1}/{QUESTIONS.length}
        </span>
      </header>

      <main className="flex flex-1 flex-col items-center gap-4 px-5 py-5">
        <span className="bv-chip" style={{ background: 'rgba(26,122,150,0.15)', color: '#1a7a96' }}>
          ¿Quién lo hace?
        </span>

        <div className="bv-panel flex h-40 w-40 items-center justify-center p-3 sm:h-56 sm:w-56 md:h-72 md:w-72">
          <img src={currentQ.image} alt={currentQ.verb} className="h-full w-full object-contain" />
        </div>

        <h1 className="bv-title text-center text-2xl md:text-3xl">{currentQ.verb}</h1>

        <div className="flex w-full max-w-lg flex-col gap-3">
          {currentQ.options.map((opt, i) => {
            const state = optStates[i];
            return (
              <button
                key={opt.label}
                type="button"
                onClick={() => handleOptionClick(i)}
                disabled={advancing || (checked && state === 'correct')}
                className={`${optionClass(state)} flex items-center gap-3`}
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
                  style={{
                    background: state === 'idle' ? 'rgba(26,122,150,0.12)' : 'rgba(255,255,255,0.25)',
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {optionIcon(state, opt.icon)}
                  </span>
                </span>
                <span className="flex-1 text-left text-lg">{opt.label}</span>
              </button>
            );
          })}
        </div>
      </main>

      <div className="mx-auto w-full max-w-lg shrink-0 px-5 pb-6 pt-2">
        {!checked ? (
          <button
            type="button"
            onClick={handleCheck}
            disabled={!canCheck}
            className={`bv-btn w-full ${canCheck ? 'bv-btn-leaf' : 'bv-btn-ghost'}`}
            style={canCheck ? undefined : { opacity: 0.6, cursor: 'not-allowed', boxShadow: 'none' }}
          >
            Comprobar
          </button>
        ) : optStates.some((s) => s === 'incorrect') && !advancing ? (
          <button
            type="button"
            onClick={() => {
              setChecked(false);
              setOptStates(['idle', 'idle', 'idle']);
            }}
            className="bv-btn bv-btn-ghost w-full"
          >
            Intentar de nuevo
          </button>
        ) : (
          hasSelection && (
            <button
              type="button"
              onClick={handleNext}
              disabled={advancing}
              className="bv-btn bv-btn-river w-full"
            >
              Siguiente →
            </button>
          )
        )}
      </div>
    </BvShell>
  );
}
