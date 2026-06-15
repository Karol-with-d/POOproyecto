import { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';

// ── Images ─────────────────────────────────────────────────────────────────
const IMG_BRAIN    = '/images/semana5/quiz/intro-brain.png';
const IMG_Q1       = '/images/semana5/quiz/q1-superpowers.png';
const IMG_Q2       = '/images/semana5/quiz/q2-seed.png';
const IMG_Q3       = '/images/semana5/quiz/q3-detective.png';
const IMG_BADGE    = '/images/semana5/quiz/badge-medal.png';

// ── Quiz data ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    img: IMG_Q1,
    imgAlt: 'Las 4 Superpoderes: rana, planta, guepardo y manzana feliz',
    text: '¿Cuál de estos NO es un superpoder de los seres vivos?',
    options: ['A) Crecer', 'B) Brillar', 'C) Moverse', 'D) Alimentarse'],
    correctIdx: 1,
    summaryText: 'Superpoderes: Brillar NO es vital',
  },
  {
    img: IMG_Q2,
    imgAlt: 'Una semilla germinando y convirtiéndose en planta',
    text: '¿Cómo se llama el proceso en que una semilla despierta y se convierte en planta?',
    options: ['A) Fotosíntesis', 'B) Germinación', 'C) Evaporación', 'D) Polinización'],
    correctIdx: 1,
    summaryText: 'Siembra: La germinación despierta semillas',
  },
  {
    img: IMG_Q3,
    imgAlt: 'Niño detective con lupa apuntando a un perro, piedra, bicicleta y planta',
    text: '¿Cuáles de estos son seres vivos?',
    options: ['A) Piedra y bicicleta', 'B) Perro y planta', 'C) Bicicleta y planta', 'D) Piedra y perro'],
    correctIdx: 1,
    summaryText: 'Detective: Perro y planta están vivos',
  },
];


type OptionState = 'idle' | 'correct' | 'wrong' | 'highlight';

// ── Confetti ───────────────────────────────────────────────────────────────
function useConfetti() {
  const fire = useCallback(() => {
    const colors = ['#4a7c59', '#705c30', '#c8e8d0', '#f8e0a8', '#ffdad8'];
    for (let i = 0; i < 40; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed; width:10px; height:10px; top:-20px; opacity:0; z-index:9999;
        left:${Math.random() * 100}vw;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        transform:rotate(${Math.random() * 360}deg);
        animation:confetti5Fall 3s ease-out ${Math.random() * 2}s forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 3200);
    }
  }, []);
  return fire;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Semana5QuizPage() {
  const navigate = useNavigate();
  const fireConfetti = useConfetti();

  const [screenIdx, setScreenIdx] = useState(0); // 0=intro,1=q1,2=q2,3=q3,4=results
  const [score, setScore]         = useState(0);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (screenIdx === 4 && !hasSaved.current) {
      hasSaved.current = true;
      const stored = localStorage.getItem('plataforma_user');
      if (stored) {
        const user = JSON.parse(stored) as { id: string };
        const percentage = Math.round((score / 30) * 100);
        saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 5, score: percentage }).catch(err => {
          console.error('Error guardando quiz Semana 5:', err);
        });
      }
    } else if (screenIdx !== 4) {
      hasSaved.current = false;
    }
  }, [screenIdx, score]);

  const [userChoices, setUserChoices] = useState<Record<number, boolean>>({});
  // per-question option states: idle | correct | wrong | highlight
  const [optStates, setOptStates] = useState<OptionState[][]>([
    ['idle','idle','idle','idle'],
    ['idle','idle','idle','idle'],
    ['idle','idle','idle','idle'],
  ]);
  const [locked, setLocked] = useState([false, false, false]);
  const transitioning = useRef(false);

  const goTo = (next: number) => {
    if (transitioning.current) return;
    transitioning.current = true;
    setScreenIdx(next);
    setTimeout(() => { transitioning.current = false; }, 450);
  };


  const handleAnswer = (qNum: number, optIdx: number) => {
    if (locked[qNum]) return;
    const q = QUESTIONS[qNum];
    const correct = optIdx === q.correctIdx;

    const newStates = optStates.map((row, ri) => ri === qNum
      ? row.map((_, oi) => {
          if (oi === optIdx) return correct ? 'correct' : 'wrong';
          if (!correct && oi === q.correctIdx) return 'highlight';
          return 'idle';
        })
      : row
    ) as OptionState[][];

    setOptStates(newStates);
    setLocked(locked.map((v, i) => i === qNum ? true : v));
    setUserChoices(prev => ({ ...prev, [qNum]: correct }));
    if (correct) { setScore(s => s + 10); fireConfetti(); }

    setTimeout(() => goTo(screenIdx + 1), 1200);
  };

  const restart = () => {
    setScreenIdx(0);
    setScore(0);
    setUserChoices({});
    setOptStates([
      ['idle','idle','idle','idle'],
      ['idle','idle','idle','idle'],
      ['idle','idle','idle','idle'],
    ]);
    setLocked([false, false, false]);
  };


  const getSlideClass = (idx: number) => {
    if (idx === screenIdx) return 'translate-x-0 opacity-100 pointer-events-auto z-10';
    if (idx < screenIdx) return '-translate-x-full opacity-0 pointer-events-none';
    return 'translate-x-full opacity-0 pointer-events-none';
  };

  const getOptClass = (state: OptionState) => {
    const base = 'w-full text-left p-5 rounded-2xl border-2 text-lg font-bold min-h-[72px] transition-all duration-200 active:scale-[0.96]';
    switch (state) {
      case 'correct':   return `${base} bg-primary-container text-on-primary-container border-primary`;
      case 'wrong':     return `${base} bg-error-container text-on-error-container border-error quiz5-shake`;
      case 'highlight': return `${base} bg-surface-container border-primary ring-2 ring-primary/20`;
      default:          return `${base} bg-surface-container hover:bg-surface-container-high border-transparent`;
    }
  };

  const showProgress = screenIdx >= 1 && screenIdx <= 3;

  // Results data
  const badgeFilter = score === 30 ? 'none' : score >= 20 ? 'grayscale(0.5) contrast(1.2)' : 'sepia(0.8) hue-rotate(90deg) saturate(1.5)';
  const resultTitle = score === 30 ? '¡Increíble trabajo!' : score >= 20 ? '¡Muy bien hecho!' : '¡Buen intento!';
  const resultSub   = score === 30 ? '¡Eres todo un Experto Naturalista!' : score >= 20 ? '¡Eres un gran Explorador Naturalista!' : 'Eres un Aprendiz Naturalista. ¡Sigue aprendiendo!';

  return (
    <div className="bg-surface text-on-surface font-body min-h-screen overflow-hidden antialiased" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <style>{`
        @keyframes confetti5Fall {
          0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
          100% { transform: translateY(800px) rotate(720deg); opacity: 0; }
        }
        @keyframes quiz5Shake {
          10%,90% { transform: translate3d(-1px,0,0); }
          20%,80% { transform: translate3d(2px,0,0); }
          30%,50%,70% { transform: translate3d(-4px,0,0); }
          40%,60% { transform: translate3d(4px,0,0); }
        }
        .quiz5-shake { animation: quiz5Shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0,'wght' 400,'GRAD' 0,'opsz' 24; }
        .filled-icon { font-variation-settings: 'FILL' 1; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-surface-container-low fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-6 py-4 shadow-sm h-16">
        <button onClick={() => navigate('/semana/5')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline text-2xl font-bold text-primary" style={{ fontFamily: 'Literata, serif' }}>
          ¿Estás vivo o no?
        </h1>
        {showProgress ? (
          <div className="flex items-center gap-1.5 bg-tertiary-container/20 px-3 py-1.5 rounded-full border border-tertiary/20">
            <span className="material-symbols-outlined text-tertiary text-base filled-icon">stars</span>
            <span className="font-bold text-sm text-on-surface">{score} pts</span>
          </div>
        ) : (
          <div className="w-16" />
        )}
      </header>

      {/* ── Progress steps ───────────────────────────────────────────────── */}
      <div
        className={`fixed top-16 left-0 w-full bg-surface-container/50 backdrop-blur-md py-4 z-50 flex justify-center items-center gap-4 transition-all duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        <div className="flex items-center gap-3">
          {[1, 2, 3].map((step) => {
            const done = screenIdx > step;
            const active = screenIdx === step;
            return (
              <div key={step} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold transition-colors text-sm
                    ${done   ? 'bg-primary border-primary text-white'
                    : active ? 'border-primary text-primary'
                    :          'border-outline-variant text-outline-variant'}`}
                >
                  {done
                    ? <span className="material-symbols-outlined text-sm">check</span>
                    : step}
                </div>
                {step < 3 && <div className="w-8 h-0.5 bg-outline-variant" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Slide container ──────────────────────────────────────────────── */}
      <main className="relative h-screen pt-16 w-full overflow-hidden">

        {/* STATE 0 — INTRO */}
        <section className={`absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface overflow-y-auto transition-all duration-400 ${getSlideClass(0)}`}>
          <div className="max-w-lg w-full text-center space-y-8 mt-8 pb-24">
            <div className="relative w-56 h-56 mx-auto animate-bounce">
              <img src={IMG_BRAIN} alt="Cerebro con birrete" className="w-full h-full object-contain" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-extrabold text-primary tracking-tight" style={{ fontFamily: 'Literata, serif' }}>
                ¡Hora del Quiz!
              </h2>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Demuestra todo lo que aprendiste sobre los seres vivos
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4 py-2">
              {[
                { icon: 'stars', bg: 'bg-tertiary-container/30', color: 'text-tertiary', label: 'Superpoderes' },
                { icon: 'eco',   bg: 'bg-primary-container/30',  color: 'text-primary',  label: 'Siembra' },
                { icon: 'search',bg: 'bg-secondary-container/30',color: 'text-secondary', label: 'Detective' },
              ].map(({ icon, bg, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color}`}>
                    <span className="material-symbols-outlined filled-icon">{icon}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => goTo(1)}
              className="w-full max-w-xs bg-primary text-white font-bold text-xl py-5 rounded-xl shadow-lg active:scale-95 transition-transform duration-200"
            >
              ¡Empezar Quiz!
            </button>
          </div>
        </section>

        {/* STATES 1-3 — QUESTIONS */}
        {QUESTIONS.map((q, qi) => (
          <section
            key={qi}
            className={`absolute inset-0 flex flex-col p-6 pt-32 bg-surface overflow-y-auto transition-all duration-400 ${getSlideClass(qi + 1)}`}
          >
            <div className="max-w-2xl mx-auto w-full space-y-6 pb-24">
              <div className="bg-surface-container-low rounded-3xl p-4" style={{ boxShadow: '0 4px 20px rgba(46,50,48,0.06)' }}>
                <img src={q.img} alt={q.imgAlt} className="w-full h-48 md:h-64 object-contain rounded-2xl" />
              </div>
              <h3 className="text-2xl font-bold text-center text-on-surface" style={{ fontFamily: 'Literata, serif' }}>
                {q.text}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => !locked[qi] && handleAnswer(qi, oi)}
                    disabled={locked[qi]}
                    className={getOptClass(optStates[qi][oi])}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* STATE 4 — RESULTS */}
        <section className={`absolute inset-0 flex flex-col items-center justify-start p-8 pt-20 bg-surface-bright overflow-y-auto transition-all duration-400 ${getSlideClass(4)}`}>
          <div className="max-w-lg w-full text-center space-y-6 pb-24 mt-4">
            <div className="relative w-64 h-64 mx-auto">
              <img src={IMG_BADGE} alt="Medalla" className="w-full h-full object-contain" style={{ filter: badgeFilter }} />
            </div>
            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold text-primary" style={{ fontFamily: 'Literata, serif' }}>{resultTitle}</h2>
              <div className="text-5xl font-black text-tertiary">{score} / 30 puntos</div>
              <p className="text-on-surface-variant text-lg font-medium">{resultSub}</p>
            </div>
            <div className="bg-surface-container rounded-2xl p-6 text-left space-y-4" style={{ boxShadow: '0 4px 20px rgba(46,50,48,0.06)' }}>
              <h4 className="font-bold text-sm uppercase tracking-widest text-outline">Resumen del Quiz</h4>
              <ul className="space-y-3">
                {QUESTIONS.map((q, qi) => {
                  const correct = userChoices[qi];
                  return (
                    <li key={qi} className="flex items-center gap-3 font-medium">
                      <span className={`material-symbols-outlined filled-icon ${correct ? 'text-primary' : 'text-error'}`}>
                        {correct ? 'check_circle' : 'cancel'}
                      </span>
                      <span className={correct ? 'text-on-surface' : 'text-on-surface-variant'}>{q.summaryText}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="w-full bg-primary text-white font-bold text-xl py-4 rounded-xl shadow-lg active:scale-95 transition-transform"
              >
                ¡Repetir Quiz!
              </button>
              <button
                onClick={() => navigate('/semana/5')}
                className="w-full bg-surface-container-highest text-on-surface-variant font-bold text-lg py-4 rounded-xl border border-outline-variant/30"
              >
                Volver al inicio
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
