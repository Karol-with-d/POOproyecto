import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetScrollOn } from '../components/WeekScrollReset';
import { saveQuizScoreForSemanaNumber } from '../services/api';
import { playMiss, playSuccess } from '../services/sounds';
import { showKidMessage } from '../components/KidFrame';
import '../styles/bosque-vivo.css';

const IMG_HERO = '/images/semana6/quiz/intro-hero.png';
const IMG_BADGE = '/images/semana6/quiz/badge-medal.png';
const IMG_Q1 = '/images/semana6/quiz/q1-similitudes.png';
const IMG_Q2 = '/images/semana6/quiz/q2-movimiento.png';
const IMG_Q3 = '/images/semana6/quiz/q3-habitats.png';

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
  {
    topic: 'Similitudes',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Plantas y animales juntos mostrando similitudes',
    text: '¿Quiénes crecen?',
    options: ['A) Solo las plantas', 'B) Solo los animales', 'C) Las plantas y los animales', 'D) Ninguno de los dos'],
    correctIdx: 2,
    summaryText: 'Similitudes: Plantas y animales crecen',
  },
  {
    topic: 'Similitudes',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Plantas y animales juntos mostrando similitudes',
    text: '¿Quiénes se mueven de un lugar a otro?',
    options: ['A) Las plantas', 'B) Los animales', 'C) Las piedras', 'D) Las nubes'],
    correctIdx: 1,
    summaryText: 'Similitudes: Los animales se mueven',
  },
  {
    topic: 'Similitudes',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Plantas y animales juntos mostrando similitudes',
    text: '¿Quiénes hacen fotosíntesis?',
    options: ['A) Los animales', 'B) Las plantas', 'C) Los peces y los camellos', 'D) Nadie'],
    correctIdx: 1,
    summaryText: 'Similitudes: Las plantas hacen fotosíntesis',
  },
  {
    topic: 'Similitudes',
    topicIcon: 'category',
    img: IMG_Q1,
    imgAlt: 'Plantas y animales juntos mostrando similitudes',
    text: '¿Quiénes respiran?',
    options: ['A) Solo las plantas', 'B) Solo los animales', 'C) Las plantas y los animales', 'D) Solo las piedras'],
    correctIdx: 2,
    summaryText: 'Similitudes: Plantas y animales respiran',
  },
  {
    topic: 'Movimiento',
    topicIcon: 'directions_run',
    img: IMG_Q2,
    imgAlt: 'Niño haciendo ejercicio y saltando',
    text: 'Después de saltar y correr, es normal sentir…',
    options: ['A) Que el corazón se detiene', 'B) Calor y sed', 'C) Que dejas de respirar', 'D) Que el corazón late más lento'],
    correctIdx: 1,
    summaryText: 'Movimiento: El ejercicio da calor y sed',
  },
  {
    topic: 'Hábitats',
    topicIcon: 'travel_explore',
    img: IMG_Q3,
    imgAlt: 'Animales en diferentes hábitats: océano, bosque, desierto y campo',
    text: '¿Dónde vive un camello?',
    options: ['A) Océano', 'B) Bosque', 'C) Desierto', 'D) Campo'],
    correctIdx: 2,
    summaryText: 'Hábitats: El camello vive en el desierto',
  },
  {
    topic: 'Hábitats',
    topicIcon: 'travel_explore',
    img: IMG_Q3,
    imgAlt: 'Animales en diferentes hábitats: océano, bosque, desierto y campo',
    text: '¿Dónde vive una vaca?',
    options: ['A) Océano', 'B) Campo', 'C) Desierto', 'D) Dentro de una nube'],
    correctIdx: 1,
    summaryText: 'Hábitats: La vaca vive en el campo',
  },
];

const POINTS_PER_QUESTION = 10;
const MAX_SCORE = QUESTIONS.length * POINTS_PER_QUESTION;
const RESULTS_SCREEN = QUESTIONS.length + 1;

type OptionState = 'idle' | 'correct' | 'wrong' | 'highlight';

function useConfetti() {
  return useCallback(() => {
    const colors = ['#2f9e6b', '#1a7a96', '#d4f542', '#ff7a59', '#0f2f28', '#7ec8dc'];
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

export default function Semana6QuizPage() {
  const navigate = useNavigate();
  const fireConfetti = useConfetti();

  const [screen, setScreen] = useState(0);
  useResetScrollOn(screen);
  const [score, setScore] = useState(0);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (screen === RESULTS_SCREEN && !hasSaved.current) {
      hasSaved.current = true;
      const stored = localStorage.getItem('plataforma_user');
      if (stored) {
        const user = JSON.parse(stored) as { id: string };
        const percentage = Math.round((score / MAX_SCORE) * 100);
        saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 6, score: percentage }).catch((err) => {
          console.error('Error guardando quiz Semana 6:', err);
          showKidMessage('No se pudo guardar tu nota. Intenta otra vez.', 'soon');
        });
      }
    } else if (screen !== RESULTS_SCREEN) {
      hasSaved.current = false;
    }
  }, [screen, score]);

  const [choices, setChoices] = useState<Record<number, boolean>>({});
  const [optStates, setOptStates] = useState<OptionState[][]>(() => QUESTIONS.map(() => ['idle', 'idle', 'idle', 'idle']));
  const [locked, setLocked] = useState<boolean[]>(() => QUESTIONS.map(() => false));

  const goTo = (next: number) => setScreen(next);

  const handleAnswer = (qi: number, oi: number) => {
    if (locked[qi]) return;
    const correct = oi === QUESTIONS[qi].correctIdx;

    setOptStates((prev) =>
      prev.map((row, ri) =>
        ri !== qi
          ? row
          : (row.map((_, idx) => {
              if (idx === oi) return correct ? 'correct' : 'wrong';
              if (!correct && idx === QUESTIONS[qi].correctIdx) return 'highlight';
              return 'idle';
            }) as OptionState[]),
      ),
    );
    setLocked((l) => l.map((v, i) => (i === qi ? true : v)));
    setChoices((c) => ({ ...c, [qi]: correct }));
    if (correct) {
      setScore((s) => s + POINTS_PER_QUESTION);
      fireConfetti();
      playSuccess();
    } else {
      playMiss();
    }
    setTimeout(() => goTo(screen + 1), 1200);
  };

  const restart = () => {
    setScreen(0);
    setScore(0);
    setChoices({});
    setOptStates(QUESTIONS.map(() => ['idle', 'idle', 'idle', 'idle']));
    setLocked(QUESTIONS.map(() => false));
  };

  const getSlide = (idx: number) =>
    idx === screen
      ? 'translate-x-0 opacity-100 pointer-events-auto z-10'
      : idx < screen
        ? '-translate-x-full opacity-0 pointer-events-none'
        : 'translate-x-full opacity-0 pointer-events-none';

  const getOptClass = (state: OptionState) => {
    if (state === 'correct') return 'bv-opt is-correct';
    if (state === 'wrong') return 'bv-opt is-wrong s6-shake';
    if (state === 'highlight') return 'bv-opt is-selected';
    return 'bv-opt';
  };

  const showProgress = screen >= 1 && screen <= QUESTIONS.length;
  const badgeFilter =
    score === MAX_SCORE ? 'none' : score >= 70 ? 'grayscale(0.5) contrast(1.2)' : 'sepia(0.8) hue-rotate(90deg) saturate(1.5)';
  const resultTitle =
    score === MAX_SCORE ? '¡Eres un Explorador Experto!' : score >= 70 ? '¡Muy bien hecho!' : '¡Sigue explorando!';
  const resultSub =
    score === MAX_SCORE
      ? '¡Conoces perfectamente los seres vivos y sus hábitats!'
      : score >= 70
        ? '¡Casi lo tienes! Un poco más de práctica.'
        : 'Repasa las actividades y vuelve a intentarlo.';

  return (
    <div className="bv-root relative min-h-screen overflow-hidden">
      <div className="bv-atmosphere" aria-hidden="true">
        <div className="bv-fireflies">
          <span /><span /><span /><span />
        </div>
      </div>

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

      <header
        className="fixed left-0 top-0 z-[100] flex h-16 w-full items-center justify-between px-5"
        style={{ background: 'rgba(15,47,40,0.94)', color: '#eef8f4' }}
      >
        <button
          type="button"
          onClick={() => navigate('/semana/6')}
          aria-label="Volver"
          className="bv-icon-btn"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="bv-baloo text-xl font-extrabold">Quiz · Semana 6</h1>
        {showProgress ? (
          <div
            className="bv-chip"
            style={{ background: 'rgba(212,245,66,0.95)', color: '#0f2f28' }}
          >
            <span className="material-symbols-outlined text-base filled-icon">stars</span>
            {score} pts
          </div>
        ) : (
          <div className="w-16" />
        )}
      </header>

      <div
        className={`fixed top-16 left-0 z-50 flex w-full items-center justify-center gap-3 py-3 transition-all duration-300 ${
          showProgress ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{ background: 'rgba(238,248,244,0.85)', backdropFilter: 'blur(8px)' }}
      >
        <div className="flex w-full max-w-xs flex-col items-center gap-2 px-4">
          <span className="bv-baloo text-sm font-bold text-[var(--bv-river)]">
            Pregunta {screen} de {QUESTIONS.length}
          </span>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(15,47,40,0.12)' }}>
            <div
              className="h-full transition-all"
              style={{ width: `${(screen / QUESTIONS.length) * 100}%`, background: '#1a7a96' }}
            />
          </div>
        </div>
      </div>

      <main className="relative z-[1] h-screen w-full overflow-hidden pt-16">
        {/* INTRO */}
        <div
          className={`s6-slide absolute inset-0 flex flex-col items-center overflow-y-auto px-5 pb-8 pt-20 ${getSlide(0)}`}
        >
          <div className="mt-2 w-full max-w-lg space-y-4 pb-8 text-center md:space-y-6">
            <div className="bv-float mx-auto h-40 w-40 sm:h-48 sm:w-48">
              <img src={IMG_HERO} alt="Mascota del quiz" className="h-full w-full object-contain drop-shadow-lg" />
            </div>

            <span className="bv-chip" style={{ background: 'rgba(255,122,89,0.2)', color: '#e85a3a' }}>
              <span className="material-symbols-outlined text-base filled-icon">fact_check</span>
              Evaluación
            </span>
            <h2 className="bv-title text-4xl">¡Quiz Semanal!</h2>
            <p className="bv-subtitle mx-auto max-w-sm">
              Pon a prueba todo lo que aprendiste esta semana sobre los seres vivos
            </p>

            <div className="grid grid-cols-3 gap-3 py-2">
              {[
                { icon: 'category', color: '#1a7a96', bg: 'rgba(26,122,150,0.15)', label: 'Similitudes' },
                { icon: 'directions_run', color: '#ff7a59', bg: 'rgba(255,122,89,0.18)', label: 'Movimiento' },
                { icon: 'travel_explore', color: '#2f9e6b', bg: 'rgba(47,158,107,0.18)', label: 'Hábitats' },
              ].map(({ icon, color, bg, label }) => (
                <div key={label} className="flex flex-col items-center gap-2">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: bg, color }}>
                    <span className="material-symbols-outlined filled-icon">{icon}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--bv-muted)]">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-6">
              {[
                { icon: 'help', label: `${QUESTIONS.length} preguntas`, color: '#1a7a96' },
                { icon: 'stars', label: `${MAX_SCORE} puntos`, color: '#ff7a59' },
                { icon: 'emoji_events', label: 'Insignia', color: '#2f9e6b' },
              ].map(({ icon, label, color }) => (
                <div key={label} className="flex flex-col items-center gap-1">
                  <span className="material-symbols-outlined filled-icon" style={{ color }}>{icon}</span>
                  <span className="text-xs font-bold text-[var(--bv-muted)]">{label}</span>
                </div>
              ))}
            </div>

            <button type="button" onClick={() => goTo(1)} className="bv-btn bv-btn-coral mx-auto w-full max-w-xs text-xl">
              ¡Empezar Quiz!
            </button>
            <button
              type="button"
              onClick={() => navigate('/semana/6')}
              className="text-sm font-semibold text-[var(--bv-muted)] underline underline-offset-2"
            >
              Volver a las actividades
            </button>
          </div>
        </div>

        {/* QUESTIONS */}
        {QUESTIONS.map((q, qi) => (
          <div
            key={qi}
            className={`s6-slide absolute inset-0 flex flex-col overflow-y-auto px-4 pb-8 pt-28 ${getSlide(qi + 1)}`}
          >
            <div className="mx-auto w-full max-w-2xl space-y-5 pb-24">
              <div className="flex items-center gap-2">
                <span className="bv-chip" style={{ background: 'rgba(26,122,150,0.15)', color: '#1a7a96' }}>
                  <span className="material-symbols-outlined text-base filled-icon">{q.topicIcon}</span>
                  {q.topic}
                </span>
                <span className="text-sm font-semibold text-[var(--bv-muted)]">Pregunta {qi + 1} de {QUESTIONS.length}</span>
              </div>

              <div className="bv-panel p-4">
                <img src={q.img} alt={q.imgAlt} className="h-28 w-full rounded-2xl object-contain sm:h-40 md:h-60" />
              </div>

              <h3 className="bv-title text-center text-2xl leading-snug">{q.text}</h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    type="button"
                    onClick={() => !locked[qi] && handleAnswer(qi, oi)}
                    disabled={locked[qi]}
                    className={`${getOptClass(optStates[qi][oi])} min-h-[64px] text-base`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}

        {/* RESULTS */}
        <div
          className={`s6-slide absolute inset-0 flex flex-col items-center overflow-y-auto px-5 pb-10 pt-20 ${getSlide(RESULTS_SCREEN)}`}
        >
          <div className="mt-2 w-full max-w-lg space-y-6 pb-24 text-center">
            <div className="relative mx-auto h-52 w-52">
              <img
                src={IMG_BADGE}
                alt="Medalla"
                className="h-full w-full object-contain drop-shadow-xl"
                style={{ filter: badgeFilter }}
              />
            </div>

            <div className="space-y-1">
              <h2 className="bv-title text-3xl md:text-4xl">{resultTitle}</h2>
              <div className="bv-baloo text-5xl font-black text-[var(--bv-coral)]">
                {score}{' '}
                <span className="text-2xl font-bold text-[var(--bv-muted)]">/ {MAX_SCORE} pts</span>
              </div>
              <p className="bv-subtitle">{resultSub}</p>
            </div>

            <div className="flex justify-center gap-2 text-4xl">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="material-symbols-outlined"
                  style={{
                    fontVariationSettings: "'FILL' 1",
                    fontSize: '2.5rem',
                    color: score / MAX_SCORE > i / 3 ? '#d4f542' : 'rgba(15,47,40,0.2)',
                    filter: score / MAX_SCORE > i / 3 ? 'drop-shadow(0 0 6px rgba(212,245,66,0.7))' : undefined,
                  }}
                >
                  star
                </span>
              ))}
            </div>

            <div className="bv-panel space-y-3 p-5 text-left">
              <h4 className="bv-baloo text-xs font-bold uppercase tracking-widest text-[var(--bv-muted)]">
                Resumen del Quiz
              </h4>
              <ul className="space-y-3">
                {QUESTIONS.map((q, qi) => {
                  const correct = choices[qi];
                  return (
                    <li key={qi} className="flex items-start gap-3">
                      <span
                        className="material-symbols-outlined filled-icon mt-0.5 shrink-0"
                        style={{ color: correct ? '#2f9e6b' : '#ff7a59' }}
                      >
                        {correct ? 'check_circle' : 'cancel'}
                      </span>
                      <div>
                        <span className="text-xs font-bold uppercase tracking-wide text-[var(--bv-muted)]">
                          {q.topic}
                        </span>
                        <p className="text-sm font-semibold">{q.summaryText}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex flex-col gap-3">
              <button type="button" onClick={restart} className="bv-btn bv-btn-coral w-full">
                Repetir Quiz
              </button>
              <button type="button" onClick={() => navigate('/semana/6')} className="bv-btn bv-btn-ghost w-full">
                Volver a Semana 6
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
