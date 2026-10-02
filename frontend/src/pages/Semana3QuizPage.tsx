import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';
import { playMiss, playSuccess } from '../services/sounds';
import { showKidMessage } from '../components/KidFrame';

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
    imgAlt: 'Objetos hechos de diferentes materiales',
    text: '¿Por qué se elige madera para las cajas de cosecha?',
    options: [
      'A) Porque es transparente',
      'B) Porque se oxida rápido',
      'C) Porque es resistente y ligera',
      'D) Porque es líquida',
    ],
    correctIdx: 2,
    summaryText: 'La madera se usa en las cajas porque es resistente y ligera.',
  },
  {
    topic: '¿De qué están hechos?',
    topicIcon: 'water_drop',
    img: IMG_Q1,
    imgAlt: 'Regadera de metal',
    text: '¿De qué material es una regadera?',
    options: ['A) Tela', 'B) Metal', 'C) Papel', 'D) Vidrio'],
    correctIdx: 1,
    summaryText: 'La regadera es de metal porque dura mucho.',
  },
  {
    topic: '¿Para qué sirve?',
    topicIcon: 'visibility',
    img: IMG_Q1,
    imgAlt: 'Botella de vidrio transparente',
    text: '¿Por qué las botellas se hacen de vidrio?',
    options: [
      'A) Para ver lo que hay dentro',
      'B) Porque no se rompen al caer',
      'C) Porque son elásticas',
      'D) Porque son de tela',
    ],
    correctIdx: 0,
    summaryText: 'El vidrio es transparente: se ve lo que hay dentro.',
  },
  {
    topic: '¿Para qué sirve?',
    topicIcon: 'checkroom',
    img: IMG_Q1,
    imgAlt: 'Ropa de tela',
    text: '¿Por qué la ropa se hace de tela?',
    options: [
      'A) Porque es transparente',
      'B) Porque es muy pesada',
      'C) Porque es suave y flexible',
      'D) Porque es de metal',
    ],
    correctIdx: 2,
    summaryText: 'La tela es suave y flexible para poder movernos.',
  },
  {
    topic: '¡A reparar!',
    topicIcon: 'table_restaurant',
    img: IMG_Q2,
    imgAlt: 'Mesa rota de madera',
    text: 'Una mesa rota se repara con…',
    options: ['A) Vidrio', 'B) Metal', 'C) Tela', 'D) Madera'],
    correctIdx: 3,
    summaryText: 'La mesa se repara con madera.',
  },
  {
    topic: '¡A reparar!',
    topicIcon: 'window',
    img: IMG_Q2,
    imgAlt: 'Ventana con un vidrio roto',
    text: 'Una ventana rota necesita…',
    options: ['A) Vidrio', 'B) Madera', 'C) Tela', 'D) Papel'],
    correctIdx: 0,
    summaryText: 'La ventana se repara con vidrio.',
  },
  {
    topic: '¡A reparar!',
    topicIcon: 'build',
    img: IMG_Q2,
    imgAlt: 'Caja de herramientas rota',
    text: '¿Por qué reparamos los objetos en vez de tirarlos?',
    options: [
      'A) Solo para que se vean bonitos',
      'B) Para cuidar el planeta y hacer menos basura',
      'C) Porque nunca se pueden usar otra vez',
      'D) Solo para ahorrar dinero',
    ],
    correctIdx: 1,
    summaryText: 'Reparar cuida el planeta y reduce la basura.',
  },
  {
    topic: 'Se recicla',
    topicIcon: 'recycling',
    img: IMG_Q3,
    imgAlt: 'Papel, vidrio y plástico para reciclar',
    text: '¿Cuál de estos objetos se recicla?',
    options: ['A) Cáscara de plátano', 'B) Lata de metal', 'C) Hojas secas', 'D) Zapato viejo'],
    correctIdx: 1,
    summaryText: 'La lata de metal se recicla. La cáscara, las hojas y el zapato se botan.',
  },
  {
    topic: 'Se bota',
    topicIcon: 'delete',
    img: IMG_Q3,
    imgAlt: 'Restos de comida que se botan',
    text: '¿Qué hacemos con la cáscara de plátano?',
    options: ['A) Se recicla', 'B) Se reutiliza como ventana', 'C) Se bota', 'D) Se convierte en metal'],
    correctIdx: 2,
    summaryText: 'La cáscara de plátano se bota.',
  },
  {
    topic: 'Se reutiliza',
    topicIcon: 'auto_fix',
    img: IMG_Q3,
    imgAlt: 'Frasco vacío que se puede usar otra vez',
    text: 'Un frasco vacío de vidrio se puede…',
    options: ['A) Reutilizar', 'B) Tirar siempre', 'C) Comer', 'D) Convertir en tela'],
    correctIdx: 0,
    summaryText: 'Un frasco vacío se reutiliza.',
  },
];

const MAX_SCORE = QUESTIONS.length * 10;
type OptionState = 'idle' | 'correct' | 'wrong' | 'highlight';

function freshOptionStates(): OptionState[][] {
  return QUESTIONS.map((q) => q.options.map(() => 'idle'));
}

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

  const [screen, setScreen] = useState(0);
  const [score, setScore]   = useState(0);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (screen === QUESTIONS.length + 1 && !hasSaved.current) {
      hasSaved.current = true;
      const stored = localStorage.getItem('plataforma_user');
      if (stored) {
        const user = JSON.parse(stored) as { id: string };
        const percentage = Math.round((score / MAX_SCORE) * 100);
        saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 3, score: percentage }).catch(err => {
          console.error('Error guardando quiz Semana 3:', err);
          showKidMessage('No se pudo guardar tu nota. Intenta otra vez.', 'soon');
        });
      }
    } else if (screen !== QUESTIONS.length + 1) {
      hasSaved.current = false;
    }
  }, [screen, score]);

  const [choices, setChoices] = useState<Record<number, boolean>>({});
  const [optStates, setOptStates] = useState<OptionState[][]>(freshOptionStates);
  const [locked, setLocked] = useState<boolean[]>(() => QUESTIONS.map(() => false));

  const goTo = (next: number) => { setScreen(next); };

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
    if (correct) { setScore(s => s + 10); fireConfetti(); playSuccess(); }
    else playMiss();
    setTimeout(() => goTo(screen + 1), 1200);
  };

  const restart = () => {
    setScreen(0); setScore(0); setChoices({});
    setOptStates(freshOptionStates());
    setLocked(QUESTIONS.map(() => false));
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

  const showProgress = screen >= 1 && screen <= QUESTIONS.length;
  const ratio = score / MAX_SCORE;
  const badgeFilter  = ratio === 1 ? 'none' : ratio >= 0.7 ? 'grayscale(0.5) contrast(1.2)' : 'sepia(0.8) hue-rotate(60deg) saturate(1.5)';
  const resultTitle  = ratio === 1 ? '¡Eres un Experto Reciclador!' : ratio >= 0.7 ? '¡Muy bien hecho!' : '¡Sigue practicando!';
  const resultSub    = ratio === 1 ? '¡Sabes todo sobre los materiales y el reciclaje!' : ratio >= 0.7 ? '¡Casi lo dominas! Un poco más de repaso.' : 'Repasa las actividades y vuelve a intentarlo.';

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
        .game-screen { overflow-x: hidden; }
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
      <div className={`s3-slide fixed top-16 left-0 w-full py-3 z-50 flex justify-center items-center gap-1 px-2 flex-wrap transition-all duration-300 ${showProgress ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ backgroundColor: 'rgba(251,248,252,0.8)', backdropFilter: 'blur(8px)' }}>
        {QUESTIONS.map((_, i) => {
          const step = i + 1;
          const done   = screen > step;
          const active = screen === step;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 font-bold text-xs transition-all
                ${done   ? 'bg-[#4a6549] border-[#4a6549] text-white'
                : active ? 'border-[#4a6549] text-[#4a6549] bg-[#ccebc7]/40'
                :          'border-[#c3c8bf] text-[#74796e]'}`}>
                {done
                  ? <span className="material-symbols-outlined text-sm">check</span>
                  : <span>{step}</span>}
              </div>
              {i < QUESTIONS.length - 1 && <div className="w-2 h-0.5 bg-[#c3c8bf]" />}
            </div>
          );
        })}
      </div>

      {/* ── Slide container ──────────────────────────────────────────────── */}
      <main className="relative h-screen pt-16 w-full overflow-hidden">

        {/* STATE 0 — INTRO */}
        <div className={`s3-slide absolute inset-0 flex flex-col items-center justify-center p-8 overflow-y-auto ${getSlide(0)}`} style={{ backgroundColor: '#f8f5f0' }}>
          <div className="max-w-lg w-full text-center space-y-7 mt-4 pb-24">
            <div className="w-52 h-52 mx-auto animate-bounce">
              <img src={IMG_HERO} alt="Mascota del quiz" className="w-full h-full object-contain drop-shadow-lg" />
            </div>

            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 font-bold px-4 py-1.5 rounded-full text-sm border" style={{ backgroundColor: '#ccebc7', color: '#4a6549', borderColor: '#4a654940' }}>
                <span className="material-symbols-outlined text-base filled-icon">recycling</span>
                Evaluación
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
                { icon: 'help',         label: '10 preguntas', color: '#4a6549' },
                { icon: 'stars',        label: '100 puntos',   color: '#705c30' },
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
        </div>

        {/* STATES 1-3 — QUESTIONS */}
        {QUESTIONS.map((q, qi) => (
          <div
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
                <span className="text-[#434841] text-sm font-medium">Pregunta {qi + 1} de {QUESTIONS.length}</span>
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
          </div>
        ))}

        {/* STATE 4 — RESULTS */}
        <div className={`s3-slide absolute inset-0 flex flex-col items-center p-6 pt-20 overflow-y-auto ${getSlide(QUESTIONS.length + 1)}`} style={{ backgroundColor: '#f8f5f0' }}>
          <div className="max-w-lg w-full text-center space-y-6 pb-24 mt-2">
            {/* Badge */}
            <div className="w-56 h-56 mx-auto">
              <img src={IMG_BADGE} alt="Medalla" className="w-full h-full object-contain drop-shadow-xl" style={{ filter: badgeFilter }} />
            </div>

            {/* Score */}
            <div className="space-y-1">
              <h2 className="text-4xl font-extrabold text-[#4a6549]" style={{ fontFamily: 'Literata, serif' }}>{resultTitle}</h2>
              <div className="text-5xl font-black text-[#705c30]">
                {score} <span className="text-2xl text-[#434841] font-bold">/ {MAX_SCORE} pts</span>
              </div>
              <p className="text-[#434841] text-base font-medium">{resultSub}</p>
            </div>

            {/* Stars */}
            <div className="flex justify-center gap-2 text-4xl">
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  filter: score >= Math.ceil(((i + 1) / 3) * MAX_SCORE) ? 'none' : 'grayscale(1) opacity(0.3)',
                  transform: score >= Math.ceil(((i + 1) / 3) * MAX_SCORE) ? 'scale(1.1)' : 'scale(1)',
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
        </div>

      </main>
    </div>
  );
}
