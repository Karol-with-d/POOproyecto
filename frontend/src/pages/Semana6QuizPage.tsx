import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';

// ── Images ─────────────────────────────────────────────────────────────────
const IMG_HERO   = '/images/semana6/quiz/intro-hero.png';
const IMG_BADGE  = '/images/semana6/quiz/badge-medal.png';
const IMG_Q1     = '/images/semana6/quiz/q1-similitudes.png';
const IMG_Q2     = '/images/semana6/quiz/q2-movimiento.png';
const IMG_Q3     = '/images/semana6/quiz/q3-habitats.png';

// ── Quiz data ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    topic: 'Similitudes',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Plantas y animales juntos mostrando similitudes',
    text: '¿Qué tienen en común las plantas y los animales?',
    options: [
      'A) Solo los animales respiran',
      'B) Ambos crecen y se alimentan',
      'C) Solo las plantas necesitan agua',
      'D) Los animales hacen fotosíntesis',
    ],
    correctIdx: 1,
    summaryText: 'Similitudes: Ambos crecen y se alimentan',
  },
  {
    topic: 'Movimiento',
    topicIcon: 'directions_run',
    img: IMG_Q2,
    imgAlt: 'Niño haciendo ejercicio y saltando',
    text: '¿Qué le pasa a nuestro corazón cuando hacemos ejercicio?',
    options: [
      'A) Late más lento',
      'B) Se detiene completamente',
      'C) Late más rápido',
      'D) No cambia nada',
    ],
    correctIdx: 2,
    summaryText: 'Movimiento: El corazón late más rápido',
  },
  {
    topic: 'Hábitats',
    topicIcon: 'travel_explore',
    img: IMG_Q3,
    imgAlt: 'Animales en diferentes hábitats: océano, bosque, desierto y campo',
    text: '¿En qué hábitat vive un pez?',
    options: [
      'A) Desierto',
      'B) Bosque',
      'C) Campo',
      'D) Océano',
    ],
    correctIdx: 3,
    summaryText: 'Hábitats: El pez vive en el océano',
  },
];

type Screen = 0 | 1 | 2 | 3 | 4; // 0=intro, 1-3=questions, 4=results
type OptionState = 'idle' | 'correct' | 'wrong' | 'highlight';

// ── Confetti ───────────────────────────────────────────────────────────────
function useConfetti() {
  return useCallback(() => {
    const colors = ['#4a7c59', '#705c30', '#c8e8d0', '#f8e0a8', '#ffdad8', '#A7D4AE'];
    for (let i = 0; i < 45; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed;width:10px;height:10px;top:-20px;opacity:0;z-index:9999;border-radius:2px;
        left:${Math.random() * 100}vw;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        transform:rotate(${Math.random() * 360}deg);
        animation:s6ConfettiFall 3s ease-out ${Math.random() * 1.5}s forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }, []);
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Semana6QuizPage() {
  const navigate = useNavigate();
  const fireConfetti = useConfetti();

  const [screen, setScreen] = useState<Screen>(0);
  const [score, setScore] = useState(0);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (screen === 4 && !hasSaved.current) {
      hasSaved.current = true;
      const stored = localStorage.getItem('plataforma_user');
      if (stored) {
        const user = JSON.parse(stored) as { id: string };
        const percentage = Math.round((score / 30) * 100);
        saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 6, score: percentage }).catch(err => {
          console.error('Error guardando quiz Semana 6:', err);
        });
      }
    } else if (screen !== 4) {
      hasSaved.current = false;
    }
  }, [screen, score]);

  const [choices, setChoices] = useState<Record<number, boolean>>({});
  const [optStates, setOptStates] = useState<OptionState[][]>([
    ['idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle'],
  ]);
  const [locked, setLocked] = useState([false, false, false]);

  const goTo = (next: number) => {
    setScreen(next as Screen);
  };

  const handleAnswer = (qi: number, oi: number) => {
    if (locked[qi]) return;
    const correct = oi === QUESTIONS[qi].correctIdx;

    setOptStates(prev => prev.map((row, ri) =>
      ri !== qi ? row : row.map((_, idx) => {
        if (idx === oi) return correct ? 'correct' : 'wrong';
        if (!correct && idx === QUESTIONS[qi].correctIdx) return 'highlight';
        return 'idle';
      }) as OptionState[]
    ));
    setLocked(l => l.map((v, i) => i === qi ? true : v));
    setChoices(c => ({ ...c, [qi]: correct }));
    if (correct) { setScore(s => s + 10); fireConfetti(); }
    setTimeout(() => goTo(screen + 1), 1200);
  };

  const restart = () => {
    setScreen(0); setScore(0); setChoices({});
    setOptStates([['idle','idle','idle','idle'],['idle','idle','idle','idle'],['idle','idle','idle','idle']]);
    setLocked([false, false, false]);
  };

  const getSlide = (idx: number) =>
    idx === screen
      ? 'translate-x-0 opacity-100 pointer-events-auto z-10'
      : idx < screen
        ? '-translate-x-full opacity-0 pointer-events-none'
        : 'translate-x-full opacity-0 pointer-events-none';

  const getOptClass = (state: OptionState) => {
    const base = 'w-full text-left p-5 rounded-2xl border-2 text-lg font-bold min-h-[72px] transition-all duration-200 active:scale-[0.96] cursor-pointer';
    if (state === 'correct')   return `${base} bg-primary-container text-on-primary-container border-primary`;
    if (state === 'wrong')     return `${base} bg-error-container text-on-error-container border-error s6-shake`;
    if (state === 'highlight') return `${base} bg-surface-container border-primary ring-2 ring-primary/20`;
    return `${base} bg-surface-container hover:bg-surface-container-high border-transparent`;
  };

  const showProgress = screen >= 1 && screen <= 3;
  const badgeFilter = score === 30 ? 'none' : score >= 20 ? 'grayscale(0.5) contrast(1.2)' : 'sepia(0.8) hue-rotate(90deg) saturate(1.5)';
  const resultTitle = score === 30 ? '¡Eres un Explorador Experto!' : score >= 20 ? '¡Muy bien hecho!' : '¡Sigue explorando!';
  const resultSub   = score === 30 ? '¡Conoces perfectamente los seres vivos y sus hábitats!' : score >= 20 ? '¡Casi lo tienes! Un poco más de práctica.' : 'Repasa las actividades y vuelve a intentarlo.';

  return (
    <div className="bg-surface text-on-surface min-h-screen overflow-hidden antialiased" style={{ fontFamily: "'Nunito Sans', sans-serif" }}>
      <style>{`
        @keyframes s6ConfettiFall {
          0%   { transform:translateY(0) rotate(0deg);   opacity:1; }
          100% { transform:translateY(800px) rotate(720deg); opacity:0; }
        }
        @keyframes s6Shake {
          10%,90% { transform:translate3d(-1px,0,0); }
          20%,80% { transform:translate3d(2px,0,0); }
          30%,50%,70% { transform:translate3d(-4px,0,0); }
          40%,60%  { transform:translate3d(4px,0,0); }
        }
        .s6-shake { animation: s6Shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .s6-slide { transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s; }
        .filled-icon { font-variation-settings:'FILL' 1; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="bg-surface-container-low fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-5 py-4 shadow-sm h-16">
        <button onClick={() => navigate('/semana/6')} className="text-on-surface-variant hover:text-primary transition-colors p-1">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-xl text-primary" style={{ fontFamily: 'Literata, serif' }}>
          Quiz · Semana 6
        </h1>
        {showProgress ? (
          <div className="flex items-center gap-1.5 bg-tertiary-container/20 px-3 py-1.5 rounded-full border border-tertiary/20">
            <span className="material-symbols-outlined text-tertiary text-base filled-icon">stars</span>
            <span className="font-bold text-sm">{score} pts</span>
          </div>
        ) : <div className="w-16" />}
      </header>

      {/* ── Progress steps ───────────────────────────────────────────────── */}
      <div className={`fixed top-16 left-0 w-full bg-surface-container/60 backdrop-blur-md py-3 z-50 flex justify-center items-center gap-3 transition-all duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {QUESTIONS.map((q, i) => {
          const step = i + 1;
          const done = screen > step;
          const active = screen === step;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all
                ${done ? 'bg-primary border-primary text-white' : active ? 'border-primary text-primary bg-primary/10' : 'border-outline-variant text-outline-variant'}`}>
                {done
                  ? <span className="material-symbols-outlined text-sm">check</span>
                  : <span className="material-symbols-outlined text-base filled-icon">{q.topicIcon}</span>}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-outline-variant" />}
            </div>
          );
        })}
      </div>

      {/* ── Slide container ──────────────────────────────────────────────── */}
      <main className="relative h-screen pt-16 w-full overflow-hidden">

        {/* STATE 0 — INTRO */}
        <section className={`s6-slide absolute inset-0 flex flex-col items-center justify-center p-8 bg-surface overflow-y-auto ${getSlide(0)}`}>
          <div className="max-w-lg w-full text-center space-y-7 mt-4 pb-24">
            <div className="w-52 h-52 mx-auto animate-bounce">
              <img src={IMG_HERO} alt="Mascota del quiz" className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm border border-primary/20">
                <span className="material-symbols-outlined text-base filled-icon">fact_check</span>
                Evaluación Semana 6
              </div>
              <h2 className="text-4xl font-extrabold text-primary tracking-tight" style={{ fontFamily: 'Literata, serif' }}>
                ¡Quiz Semanal!
              </h2>
              <p className="text-on-surface-variant text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Pon a prueba todo lo que aprendiste esta semana sobre los seres vivos
              </p>
            </div>

            {/* Topic badges */}
            <div className="grid grid-cols-3 gap-4 py-2">
              {[
                { icon: 'category',       bg: 'bg-primary-container/30',  color: 'text-primary',  label: 'Similitudes' },
                { icon: 'directions_run', bg: 'bg-secondary-container/30',color: 'text-secondary', label: 'Movimiento' },
                { icon: 'travel_explore', bg: 'bg-tertiary-container/30', color: 'text-tertiary',  label: 'Hábitats' },
              ].map(({ icon, bg, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center ${color}`}>
                    <span className="material-symbols-outlined filled-icon">{icon}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-6">
              {[
                { icon: 'help', label: '3 preguntas', color: 'text-primary' },
                { icon: 'stars', label: '30 puntos', color: 'text-tertiary' },
                { icon: 'emoji_events', label: 'Insignia', color: 'text-secondary' },
              ].map(({ icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className={`material-symbols-outlined filled-icon ${color}`}>{icon}</span>
                  <span className="text-xs font-bold text-on-surface-variant">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => goTo(1)}
              className="w-full max-w-xs bg-primary text-white font-bold text-xl py-5 rounded-2xl shadow-lg active:scale-95 transition-transform border-b-4 border-primary/60"
            >
              ¡Empezar Quiz! 🚀
            </button>
            <button onClick={() => navigate('/semana/6')} className="text-on-surface-variant text-sm underline underline-offset-2">
              Volver a las actividades
            </button>
          </div>
        </section>

        {/* STATES 1-3 — QUESTIONS */}
        {QUESTIONS.map((q, qi) => (
          <section
            key={qi}
            className={`s6-slide absolute inset-0 flex flex-col p-5 pt-32 bg-surface overflow-y-auto ${getSlide(qi + 1)}`}
          >
            <div className="max-w-2xl mx-auto w-full space-y-5 pb-24">
              {/* Topic chip */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full border border-primary/20">
                  <span className="material-symbols-outlined text-base filled-icon">{q.topicIcon}</span>
                  {q.topic}
                </span>
                <span className="text-on-surface-variant text-sm font-medium">Pregunta {qi + 1} de 3</span>
              </div>

              {/* Image */}
              <div className="bg-surface-container-low rounded-3xl p-4" style={{ boxShadow: '0 4px 20px rgba(46,50,48,0.06)' }}>
                <img src={q.img} alt={q.imgAlt} className="w-full h-44 md:h-60 object-contain rounded-2xl" />
              </div>

              {/* Question */}
              <h3 className="text-2xl font-bold text-center text-on-surface leading-snug" style={{ fontFamily: 'Literata, serif' }}>
                {q.text}
              </h3>

              {/* Options */}
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
        <section className={`s6-slide absolute inset-0 flex flex-col items-center p-6 pt-20 bg-surface overflow-y-auto ${getSlide(4)}`}>
          <div className="max-w-lg w-full text-center space-y-6 pb-24 mt-2">
            {/* Badge */}
            <div className="relative w-56 h-56 mx-auto">
              <img src={IMG_BADGE} alt="Medalla" className="w-full h-full object-contain drop-shadow-xl" style={{ filter: badgeFilter }} />
            </div>

            {/* Score */}
            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold text-primary" style={{ fontFamily: 'Literata, serif' }}>{resultTitle}</h2>
              <div className="text-5xl font-black text-tertiary">{score} <span className="text-2xl text-on-surface-variant font-bold">/ 30 pts</span></div>
              <p className="text-on-surface-variant text-base font-medium">{resultSub}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 text-4xl">
              {[0, 1, 2].map(i => (
                <span key={i} style={{ filter: i * 10 < score ? 'none' : 'grayscale(1) opacity(0.3)', transform: i * 10 < score ? 'scale(1.1)' : 'scale(1)', display: 'inline-block', transition: 'all 0.3s' }}>⭐</span>
              ))}
            </div>

            {/* Summary */}
            <div className="bg-surface-container rounded-2xl p-5 text-left space-y-3" style={{ boxShadow: '0 4px 20px rgba(46,50,48,0.06)' }}>
              <h4 className="font-bold text-xs uppercase tracking-widest text-outline">Resumen del Quiz</h4>
              <ul className="space-y-3">
                {QUESTIONS.map((q, qi) => {
                  const correct = choices[qi];
                  return (
                    <li key={qi} className="flex items-start gap-3">
                      <span className={`material-symbols-outlined filled-icon flex-shrink-0 mt-0.5 ${correct ? 'text-primary' : 'text-error'}`}>
                        {correct ? 'check_circle' : 'cancel'}
                      </span>
                      <div>
                        <span className="text-xs font-bold uppercase text-on-surface-variant tracking-wide">{q.topic}</span>
                        <p className={`text-sm font-medium ${correct ? 'text-on-surface' : 'text-on-surface-variant'}`}>{q.summaryText}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={restart}
                className="w-full bg-primary text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-transform border-b-4 border-primary/60"
              >
                🔄 Repetir Quiz
              </button>
              <button
                onClick={() => navigate('/semana/6')}
                className="w-full bg-surface-container-highest text-on-surface-variant font-bold text-base py-4 rounded-2xl border border-outline-variant/30"
              >
                🏠 Volver a Semana 6
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
