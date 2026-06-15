import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Images ─────────────────────────────────────────────────────────────────
const IMG_HERO  = '/images/semana3/quiz/intro-hero.png';
const IMG_BADGE = '/images/semana3/quiz/badge-medal.png';
const IMG_Q1    = '/images/semana3/quiz/q1-materiales.png';
const IMG_Q2    = '/images/semana3/quiz/q2-reparar.png';
const IMG_Q3    = '/images/semana3/quiz/q3-reflexion.png';

// ── Quiz data ──────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    topic: '¿De qué están hechos?',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Objetos del jardín y el mercado hechos de diferentes materiales',
    text: '¿De qué material está hecha una silla de madera?',
    options: [
      'A) Plástico',
      'B) Metal',
      'C) Madera',
      'D) Vidrio',
    ],
    correctIdx: 2,
    summaryText: 'Materiales: La silla de madera está hecha de madera',
  },
  {
    topic: '¡A reparar!',
    topicIcon: 'build',
    img: IMG_Q2,
    imgAlt: 'Niño reparando objetos en un taller de inventos',
    text: '¿Por qué es importante reparar los objetos en vez de tirarlos?',
    options: [
      'A) Para que se vean más bonitos',
      'B) Para cuidar el planeta y reducir basura',
      'C) Porque es más fácil que comprar uno nuevo',
      'D) Solo para ahorrar dinero',
    ],
    correctIdx: 1,
    summaryText: 'Reparar: Ayuda a cuidar el planeta y reduce basura',
  },
  {
    topic: 'Reflexión y Reciclaje',
    topicIcon: 'recycling',
    img: IMG_Q3,
    imgAlt: 'Contenedores de reciclaje con papel, vidrio y plástico',
    text: '¿Cuáles de estos objetos podemos reciclar?',
    options: [
      'A) Solo la ropa vieja',
      'B) Solo la comida',
      'C) Ningún objeto se puede reciclar',
      'D) Papel, vidrio y plástico',
    ],
    correctIdx: 3,
    summaryText: 'Reciclaje: Papel, vidrio y plástico se pueden reciclar',
  },
];

type Screen = 0 | 1 | 2 | 3 | 4;
type OptionState = 'idle' | 'correct' | 'wrong' | 'highlight';

// ── Confetti ───────────────────────────────────────────────────────────────
function useConfetti() {
  return useCallback(() => {
    const colors = ['#4a6549', '#ccebc7', '#bfe5fe', '#f3e0c2', '#8ba888', '#ffffff'];
    for (let i = 0; i < 45; i++) {
      const el = document.createElement('div');
      el.style.cssText = `
        position:fixed;width:10px;height:10px;top:-20px;opacity:0;z-index:9999;border-radius:2px;
        left:${Math.random() * 100}vw;
        background:${colors[Math.floor(Math.random() * colors.length)]};
        transform:rotate(${Math.random() * 360}deg);
        animation:s3ConfettiFall 3s ease-out ${Math.random() * 1.5}s forwards;
      `;
      document.body.appendChild(el);
      setTimeout(() => el.remove(), 4500);
    }
  }, []);
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Semana3QuizPage() {
  const navigate = useNavigate();
  const fireConfetti = useConfetti();

  const [screen, setScreen] = useState<Screen>(0);
  const [prev, setPrev]     = useState(-1);
  const [score, setScore]   = useState(0);
  const [choices, setChoices] = useState<Record<number, boolean>>({});
  const [optStates, setOptStates] = useState<OptionState[][]>([
    ['idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle'],
    ['idle', 'idle', 'idle', 'idle'],
  ]);
  const [locked, setLocked] = useState([false, false, false]);

  const goTo = (next: number) => { setPrev(screen); setScreen(next as Screen); };

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
    setScreen(0); setPrev(-1); setScore(0); setChoices({});
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
    if (state === 'correct')   return `${base} bg-[#ccebc7] text-[#1b3d1b] border-[#4a6549]`;
    if (state === 'wrong')     return `${base} bg-[#fde8e8] text-[#6b1c1c] border-[#b83230] s3-shake`;
    if (state === 'highlight') return `${base} bg-[#f0ece4] border-[#4a6549] ring-2 ring-[#4a6549]/20`;
    return `${base} bg-[#f0ece4] hover:bg-[#eae6de] border-transparent`;
  };

  const showProgress = screen >= 1 && screen <= 3;
  const badgeFilter  = score === 30 ? 'none' : score >= 20 ? 'grayscale(0.5) contrast(1.2)' : 'sepia(0.8) hue-rotate(60deg) saturate(1.5)';
  const resultTitle  = score === 30 ? '¡Eres un Experto Reciclador!' : score >= 20 ? '¡Muy bien hecho!' : '¡Sigue practicando!';
  const resultSub    = score === 30 ? '¡Sabes todo sobre los materiales y el reciclaje!' : score >= 20 ? '¡Casi lo dominas! Un poco más de repaso.' : 'Repasa las actividades y vuelve a intentarlo.';

  return (
    <div className="text-[#1b1b1e] min-h-screen overflow-hidden antialiased" style={{ fontFamily: "'Nunito Sans', sans-serif", backgroundColor: '#f8f5f0' }}>
      <style>{`
        @keyframes s3ConfettiFall {
          0%   { transform:translateY(0) rotate(0deg);   opacity:1; }
          100% { transform:translateY(800px) rotate(720deg); opacity:0; }
        }
        @keyframes s3Shake {
          10%,90% { transform:translate3d(-1px,0,0); }
          20%,80% { transform:translate3d(2px,0,0); }
          30%,50%,70% { transform:translate3d(-4px,0,0); }
          40%,60%  { transform:translate3d(4px,0,0); }
        }
        .s3-shake { animation:s3Shake 0.5s cubic-bezier(.36,.07,.19,.97) both; }
        .s3-slide { transition:transform 0.4s cubic-bezier(0.4,0,0.2,1), opacity 0.4s; }
        .filled-icon { font-variation-settings:'FILL' 1; }
      `}</style>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <header className="fixed top-0 left-0 w-full z-[100] flex justify-between items-center px-5 py-4 shadow-sm h-16" style={{ backgroundColor: '#fbf8fc' }}>
        <button onClick={() => navigate('/semana/3')} className="text-[#4a6549] hover:bg-[#e3e2e6] p-2 rounded-full transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-bold text-xl text-[#4a6549]" style={{ fontFamily: 'Literata, serif' }}>
          Quiz · Semana 3
        </h1>
        {showProgress ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border" style={{ backgroundColor: '#f3e0c2', borderColor: '#c2965a40' }}>
            <span className="material-symbols-outlined text-[#705c30] text-base filled-icon">stars</span>
            <span className="font-bold text-sm text-[#4a6549]">{score} pts</span>
          </div>
        ) : <div className="w-16" />}
      </header>

      {/* ── Progress steps ───────────────────────────────────────────────── */}
      <div className={`s3-slide fixed top-16 left-0 w-full py-3 z-50 flex justify-center items-center gap-3 transition-all duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(251,248,252,0.8)', backdropFilter: 'blur(8px)' }}>
        {QUESTIONS.map((q, i) => {
          const step = i + 1;
          const done   = screen > step;
          const active = screen === step;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm transition-all
                ${done   ? 'bg-[#4a6549] border-[#4a6549] text-white'
                : active ? 'border-[#4a6549] text-[#4a6549] bg-[#ccebc7]/40'
                :          'border-[#c3c8bf] text-[#74796e]'}`}>
                {done
                  ? <span className="material-symbols-outlined text-sm">check</span>
                  : <span className="material-symbols-outlined text-base filled-icon">{q.topicIcon}</span>}
              </div>
              {i < 2 && <div className="w-8 h-0.5 bg-[#c3c8bf]" />}
            </div>
          );
        })}
      </div>

      {/* ── Slide container ──────────────────────────────────────────────── */}
      <main className="relative h-screen pt-16 w-full overflow-hidden">

        {/* STATE 0 — INTRO */}
        <section className={`s3-slide absolute inset-0 flex flex-col items-center justify-center p-8 overflow-y-auto ${getSlide(0)}`} style={{ backgroundColor: '#f8f5f0' }}>
          <div className="max-w-lg w-full text-center space-y-7 mt-4 pb-24">
            <div className="w-52 h-52 mx-auto animate-bounce">
              <img src={IMG_HERO} alt="Mascota del quiz" className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-bold px-4 py-1.5 rounded-full text-sm border" style={{ backgroundColor: '#ccebc7', color: '#4a6549', borderColor: '#4a654940' }}>
                <span className="material-symbols-outlined text-base filled-icon">recycling</span>
                Evaluación Semana 3
              </div>
              <h2 className="text-4xl font-extrabold text-[#4a6549] tracking-tight" style={{ fontFamily: 'Literata, serif' }}>
                ¡Quiz Semanal!
              </h2>
              <p className="text-[#434841] text-lg font-medium leading-relaxed max-w-sm mx-auto">
                Demuestra todo lo que aprendiste sobre los materiales y el reciclaje
              </p>
            </div>

            {/* Topic badges */}
            <div className="grid grid-cols-3 gap-4 py-2">
              {[
                { icon: 'category',  bg: '#ccebc7', color: '#4a6549', label: '¿De qué están?' },
                { icon: 'build',     bg: '#bfe5fe', color: '#1a5276', label: '¡A reparar!' },
                { icon: 'recycling', bg: '#f3e0c2', color: '#7d5a2e', label: 'Reflexión' },
              ].map(({ icon, bg, color, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg, color }}>
                    <span className="material-symbols-outlined filled-icon">{icon}</span>
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wide text-[#434841]">{label}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex justify-center gap-8">
              {[
                { icon: 'help',         label: '3 preguntas', color: '#4a6549' },
                { icon: 'stars',        label: '30 puntos',   color: '#705c30' },
                { icon: 'emoji_events', label: 'Insignia',    color: '#1a5276' },
              ].map(({ icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined filled-icon" style={{ color }}>{icon}</span>
                  <span className="text-xs font-bold text-[#434841]">{label}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => goTo(1)}
              className="w-full max-w-xs text-white font-bold text-xl py-5 rounded-2xl shadow-lg active:scale-95 transition-transform border-b-4"
              style={{ backgroundColor: '#4a6549', borderColor: '#2d3e2d' }}
            >
              ¡Empezar Quiz! ♻️
            </button>
            <button onClick={() => navigate('/semana/3')} className="text-[#434841] text-sm underline underline-offset-2">
              Volver a las actividades
            </button>
          </div>
        </section>

        {/* STATES 1-3 — QUESTIONS */}
        {QUESTIONS.map((q, qi) => (
          <section
            key={qi}
            className={`s3-slide absolute inset-0 flex flex-col p-5 pt-32 overflow-y-auto ${getSlide(qi + 1)}`}
            style={{ backgroundColor: '#f8f5f0' }}
          >
            <div className="max-w-2xl mx-auto w-full space-y-5 pb-24">
              {/* Topic chip */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 font-bold text-sm px-3 py-1 rounded-full border"
                  style={{ backgroundColor: '#ccebc7', color: '#4a6549', borderColor: '#4a654940' }}>
                  <span className="material-symbols-outlined text-base filled-icon">{q.topicIcon}</span>
                  {q.topic}
                </span>
                <span className="text-[#434841] text-sm font-medium">Pregunta {qi + 1} de 3</span>
              </div>

              {/* Image */}
              <div className="rounded-3xl p-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(74,101,73,0.08)' }}>
                <img src={q.img} alt={q.imgAlt} className="w-full h-44 md:h-60 object-cover rounded-2xl" />
              </div>

              {/* Question */}
              <h3 className="text-2xl font-bold text-center text-[#1b1b1e] leading-snug" style={{ fontFamily: 'Literata, serif' }}>
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
        <section className={`s3-slide absolute inset-0 flex flex-col items-center p-6 pt-20 overflow-y-auto ${getSlide(4)}`} style={{ backgroundColor: '#f8f5f0' }}>
          <div className="max-w-lg w-full text-center space-y-6 pb-24 mt-2">
            {/* Badge */}
            <div className="w-56 h-56 mx-auto">
              <img src={IMG_BADGE} alt="Medalla" className="w-full h-full object-contain drop-shadow-xl" style={{ filter: badgeFilter }} />
            </div>

            {/* Score */}
            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold text-[#4a6549]" style={{ fontFamily: 'Literata, serif' }}>{resultTitle}</h2>
              <div className="text-5xl font-black text-[#705c30]">
                {score} <span className="text-2xl text-[#434841] font-bold">/ 30 pts</span>
              </div>
              <p className="text-[#434841] text-base font-medium">{resultSub}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 text-4xl">
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  filter: i * 10 < score ? 'none' : 'grayscale(1) opacity(0.3)',
                  transform: i * 10 < score ? 'scale(1.1)' : 'scale(1)',
                  display: 'inline-block',
                  transition: 'all 0.3s',
                }}>⭐</span>
              ))}
            </div>

            {/* Summary */}
            <div className="rounded-2xl p-5 text-left space-y-4" style={{ backgroundColor: '#ffffff', boxShadow: '0 4px 20px rgba(74,101,73,0.08)' }}>
              <h4 className="font-bold text-xs uppercase tracking-widest text-[#74796e]">Resumen del Quiz</h4>
              <ul className="space-y-3">
                {QUESTIONS.map((q, qi) => {
                  const correct = choices[qi];
                  return (
                    <li key={qi} className="flex items-start gap-3">
                      <span className="material-symbols-outlined filled-icon flex-shrink-0 mt-0.5"
                        style={{ color: correct ? '#4a6549' : '#b83230' }}>
                        {correct ? 'check_circle' : 'cancel'}
                      </span>
                      <div>
                        <span className="text-xs font-bold uppercase text-[#74796e] tracking-wide">{q.topic}</span>
                        <p className={`text-sm font-medium ${correct ? 'text-[#1b1b1e]' : 'text-[#434841]'}`}>{q.summaryText}</p>
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
                className="w-full text-white font-bold text-lg py-4 rounded-2xl shadow-lg active:scale-95 transition-transform border-b-4"
                style={{ backgroundColor: '#4a6549', borderColor: '#2d3e2d' }}
              >
                🔄 Repetir Quiz
              </button>
              <button
                onClick={() => navigate('/semana/3')}
                className="w-full font-bold text-base py-4 rounded-2xl border"
                style={{ backgroundColor: '#e9e7eb', color: '#434841', borderColor: '#c3c8bf50' }}
              >
                🏠 Volver a Semana 3
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
