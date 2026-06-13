import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const IMG_HERO = '/images/semana6/similitudes/hero.png';

interface QuizOption {
  label: string;
  icon: string;
  iconBgClass: string;
  iconColorClass: string;
  correct: boolean;
}

interface QuizQuestion {
  image: string;
  verb: string;
  options: QuizOption[];
}

const QUESTIONS: QuizQuestion[] = [
  {
    image: '/images/semana6/similitudes/q1-alimentan.png',
    verb: 'Se alimentan',
    options: [
      { label: 'Plantas',  icon: 'eco',      iconBgClass: 'bg-[#8ba888]/20', iconColorClass: 'text-[#4a6549]', correct: false },
      { label: 'Animales', icon: 'pets',      iconBgClass: 'bg-[#bfe5fe]/30', iconColorClass: 'text-[#3e6378]', correct: false },
      { label: 'Ambos',    icon: 'category',  iconBgClass: 'bg-[#af9e83]/30', iconColorClass: 'text-[#6a5d45]', correct: true  },
    ],
  },
  {
    image: '/images/semana6/similitudes/q2-crecen.png',
    verb: 'Crecen',
    options: [
      { label: 'Plantas',  icon: 'eco',      iconBgClass: 'bg-[#8ba888]/20', iconColorClass: 'text-[#4a6549]', correct: false },
      { label: 'Animales', icon: 'pets',      iconBgClass: 'bg-[#bfe5fe]/30', iconColorClass: 'text-[#3e6378]', correct: false },
      { label: 'Ambos',    icon: 'category',  iconBgClass: 'bg-[#af9e83]/30', iconColorClass: 'text-[#6a5d45]', correct: true  },
    ],
  },
  {
    image: '/images/semana6/similitudes/q3-mueven.png',
    verb: 'Se mueven',
    options: [
      { label: 'Plantas',  icon: 'eco',      iconBgClass: 'bg-[#8ba888]/20', iconColorClass: 'text-[#4a6549]', correct: false },
      { label: 'Animales', icon: 'pets',      iconBgClass: 'bg-[#bfe5fe]/30', iconColorClass: 'text-[#3e6378]', correct: true  },
      { label: 'Ambos',    icon: 'category',  iconBgClass: 'bg-[#af9e83]/30', iconColorClass: 'text-[#6a5d45]', correct: false },
    ],
  },
  {
    image: '/images/semana6/similitudes/q4-fotosintesis.png',
    verb: 'Hacen fotosíntesis',
    options: [
      { label: 'Plantas',  icon: 'eco',      iconBgClass: 'bg-[#8ba888]/20', iconColorClass: 'text-[#4a6549]', correct: true  },
      { label: 'Animales', icon: 'pets',      iconBgClass: 'bg-[#bfe5fe]/30', iconColorClass: 'text-[#3e6378]', correct: false },
      { label: 'Ambos',    icon: 'category',  iconBgClass: 'bg-[#af9e83]/30', iconColorClass: 'text-[#6a5d45]', correct: false },
    ],
  },
  {
    image: '/images/semana6/similitudes/q5-respiran.png',
    verb: 'Respiran',
    options: [
      { label: 'Plantas',  icon: 'eco',      iconBgClass: 'bg-[#8ba888]/20', iconColorClass: 'text-[#4a6549]', correct: false },
      { label: 'Animales', icon: 'pets',      iconBgClass: 'bg-[#bfe5fe]/30', iconColorClass: 'text-[#3e6378]', correct: false },
      { label: 'Ambos',    icon: 'category',  iconBgClass: 'bg-[#af9e83]/30', iconColorClass: 'text-[#6a5d45]', correct: true  },
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

    const colors = ['#4a6549', '#3e6378', '#6a5d45', '#ccebc7', '#bfe5fe'];
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
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
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
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 w-full h-full z-10"
    />
  );
}

export default function SimilitudesGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('start');
  const [qIdx, setQIdx] = useState(0);
  const [optStates, setOptStates] = useState<OptionState[]>(['idle', 'idle', 'idle']);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [advancing, setAdvancing] = useState(false);

  const currentQ = QUESTIONS[qIdx];
  const selectedIdx = optStates.findIndex((s) => s === 'selected');
  const hasSelection = selectedIdx !== -1 || optStates.some((s) => s === 'correct' || s === 'incorrect');
  const canCheck = !checked && optStates.some((s) => s === 'selected');

  function handleOptionClick(i: number) {
    if (advancing) return;
    if (checked && optStates[i] === 'correct') return;
    setChecked(false);
    setOptStates(optStates.map((_, idx) => (idx === i ? 'selected' : 'idle')));
  }

  function handleCheck() {
    if (!canCheck || advancing) return;
    const idx = optStates.findIndex((s) => s === 'selected');
    if (idx === -1) return;
    setChecked(true);
    if (currentQ.options[idx].correct) {
      const newStates = optStates.map((s, i) => (i === idx ? 'correct' : s)) as OptionState[];
      setOptStates(newStates);
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
      const newStates = optStates.map((s, i) => (i === idx ? 'incorrect' : s)) as OptionState[];
      setOptStates(newStates);
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

  function getOptionClass(state: OptionState) {
    if (state === 'correct')   return 'bg-[#22c55e] border-[#22c55e] shadow-[0_4px_0_0_#16a34a]';
    if (state === 'incorrect') return 'bg-[#ef4444] border-[#ef4444] shadow-[0_4px_0_0_#dc2626]';
    if (state === 'selected')  return 'bg-[#4a6549] border-[#4a6549] shadow-[0_4px_0_0_#c3c8bf]';
    return 'bg-surface border-surface-container-highest shadow-[0_4px_0_0_#c3c8bf] hover:bg-surface-container-low';
  }

  function getOptionIcon(state: OptionState, originalIcon: string) {
    if (state === 'correct')   return 'check_circle';
    if (state === 'incorrect') return 'cancel';
    return originalIcon;
  }

  function getOptionTextClass(state: OptionState) {
    return state === 'idle' ? 'text-on-surface' : 'text-white';
  }

  const stars = score >= 5 ? 3 : score >= 3 ? 2 : score >= 1 ? 1 : 0;
  const progressPct = Math.round(((qIdx + 1) / QUESTIONS.length) * 100);

  // ── START SCREEN ───────────────────────────────────────────────────────────
  if (screen === 'start') {
    return (
      <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
        <header className="w-full top-0 bg-surface z-50 sticky">
          <nav className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base max-w-full">
            <button
              onClick={() => navigate('/semana/6')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-label-md text-label-md"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              <span>Salir</span>
            </button>
            <div className="font-headline-md text-headline-md text-primary">
              ¿Qué tenemos en común?
            </div>
            <div className="w-24" />
          </nav>
        </header>

        <main className="flex-1 flex flex-col items-center text-center px-margin-mobile md:px-margin-desktop pt-lg pb-xl">
          <div className="relative w-full max-w-md mb-lg">
            <div className="absolute inset-0 bg-primary-fixed opacity-20 rounded-full blur-3xl -z-10" />
            <img
              src={IMG_HERO}
              alt="Tortuga y ganso científicos"
              className="w-full h-auto similitudes-float"
            />
          </div>

          <div className="max-w-2xl">
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-sm leading-tight">
              ¿Qué tenemos en común?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-lg">
              ¡Adivina qué une a las plantas y los animales!
            </p>
            <button
              onClick={() => setScreen('question')}
              className="bg-primary-container text-on-primary-container px-xl py-md rounded-xl font-label-lg text-label-lg flex items-center justify-center gap-sm mx-auto hover:scale-105 transition-transform active:translate-y-1"
              style={{ boxShadow: '0 4px 0 0 #334d33' }}
            >
              <span className="material-symbols-outlined">rocket_launch</span>
              ¡Empezar Aventura!
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── RESULTS SCREEN ──────────────────────────────────────────────────────────
  if (screen === 'results') {
    return (
      <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col items-center justify-center p-margin-mobile md:p-margin-desktop relative overflow-hidden">
        <ConfettiCanvas />

        <div className="z-20 w-full max-w-4xl flex flex-col items-center">
          <div className="text-center mb-md px-sm">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-base">
              ¡Excelente trabajo, Científico!
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              ¡Has completado el quiz con éxito!
            </p>
          </div>

          <div className="w-full max-w-lg grid grid-cols-1 gap-gutter mb-lg">
            <div className="bg-surface-container-lowest border-2 border-outline-variant p-lg rounded-xl shadow-sm text-center relative overflow-hidden">
              <p className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest mb-base">
                Puntuación Final
              </p>
              <div className="text-6xl md:text-8xl font-headline-lg text-primary mb-md">
                {score}<span className="text-3xl text-outline">/{QUESTIONS.length}</span>
              </div>
              <div className="flex justify-center gap-md">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={`material-symbols-outlined similitudes-star-pop ${i === 1 ? 'text-6xl' : 'text-5xl'} ${i < stars ? 'text-[#6a5d45]' : 'text-outline-variant'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-md w-full max-w-lg">
            <button
              onClick={() => navigate('/semana/6')}
              className="flex-1 bg-primary text-on-primary font-label-lg text-label-lg py-md px-lg rounded-xl flex items-center justify-center gap-sm hover:bg-primary/90 transition-colors active:translate-y-0.5"
              style={{ boxShadow: '0 4px 0 0 #334d33', borderBottom: '4px solid #334d33' }}
            >
              <span className="material-symbols-outlined">sports_esports</span>
              Siguiente juego
            </button>
            <button
              onClick={resetQuiz}
              className="flex-1 bg-surface-container-high text-on-surface-variant font-label-lg text-label-lg py-md px-lg rounded-xl flex items-center justify-center gap-sm hover:bg-surface-variant transition-colors active:translate-y-0.5"
              style={{ borderBottom: '4px solid #c3c8bf' }}
            >
              <span className="material-symbols-outlined">replay</span>
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── QUESTION SCREEN ─────────────────────────────────────────────────────────
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden">
      <header className="w-full flex justify-between items-center px-margin-mobile md:px-margin-desktop h-20 bg-surface shadow-sm z-10 fixed top-0">
        <button
          onClick={() => navigate('/semana/6')}
          className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container-low hover:bg-surface-variant transition-colors text-on-surface"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <div className="flex-1 max-w-xl mx-8 flex items-center gap-4">
          <div className="h-4 flex-1 bg-surface-container-high rounded-full overflow-hidden border-2 border-surface-container-highest">
            <div
              className="h-full bg-primary rounded-full transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <span className="font-headline-md text-headline-md text-primary font-bold min-w-[3rem] text-right">
            {qIdx + 1}/{QUESTIONS.length}
          </span>
        </div>

        <div className="w-12 h-12" />
      </header>

      <main className="flex-1 mt-20 px-margin-mobile md:px-margin-desktop py-lg flex flex-col items-center justify-center gap-lg">
        <div className="w-full max-w-2xl flex flex-col items-center text-center gap-md">
          <h2 className="font-headline-md text-headline-md text-secondary mb-2">¿Quién lo hace?</h2>

          <div className="w-64 h-64 md:w-80 md:h-80 relative bg-surface-container-low rounded-[2rem] border-4 border-surface-container-high flex items-center justify-center p-sm shadow-[0_8px_30px_rgba(74,101,73,0.15)] overflow-hidden">
            <img
              src={currentQ.image}
              alt={currentQ.verb}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <h1 className="font-headline-lg-mobile text-headline-lg-mobile md:font-headline-lg md:text-headline-lg text-on-surface">
            {currentQ.verb}
          </h1>
        </div>

        <div className="w-full max-w-lg flex flex-col gap-sm mt-md">
          {currentQ.options.map((opt, i) => {
            const state = optStates[i];
            return (
              <button
                key={opt.label}
                onClick={() => handleOptionClick(i)}
                disabled={advancing || (checked && state === 'correct')}
                className={`w-full p-md border-2 rounded-xl flex items-center gap-md transition-all duration-100 active:translate-y-1 ${getOptionClass(state)}`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform ${state === 'idle' ? opt.iconBgClass : 'bg-white/20'} group-hover:scale-110`}>
                  <span
                    className={`material-symbols-outlined text-[32px] ${state === 'idle' ? opt.iconColorClass : 'text-white'}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {getOptionIcon(state, opt.icon)}
                  </span>
                </div>
                <span className={`font-headline-md text-headline-md flex-1 text-left ${getOptionTextClass(state)}`}>
                  {opt.label}
                </span>
              </button>
            );
          })}
        </div>
      </main>

      <div className="w-full max-w-lg mx-auto px-margin-mobile md:px-margin-desktop pb-lg">
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={!canCheck}
            className={`w-full py-md font-headline-md rounded-xl transition-colors ${
              canCheck
                ? 'bg-primary text-on-primary shadow-[0_4px_0_0_#334d33] active:translate-y-1 active:shadow-none'
                : 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
            }`}
          >
            Comprobar
          </button>
        ) : (
          optStates.some((s) => s === 'incorrect') && !advancing ? (
            <button
              onClick={() => { setChecked(false); setOptStates(['idle', 'idle', 'idle']); }}
              className="w-full py-md bg-surface-container-high text-on-surface-variant font-headline-md rounded-xl hover:bg-surface-variant transition-colors"
            >
              Intentar de nuevo
            </button>
          ) : (
            hasSelection && (
              <button
                onClick={handleNext}
                disabled={advancing}
                className="w-full py-md bg-primary text-on-primary font-headline-md rounded-xl shadow-[0_4px_0_0_#334d33] active:translate-y-1 active:shadow-none transition-all"
              >
                Siguiente →
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}
