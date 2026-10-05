import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';
import { playMiss, playSuccess } from '../services/sounds';
import { showKidMessage } from '../components/KidFrame';

// ── Quiz data ──────────────────────────────────────────────────────────────
interface Option { emoji: string; label: string }
interface Question { text: string; hint: string; options: Option[]; correctIndex: number }

const QUESTIONS: Question[] = [
  {
    text: '¿Qué significa hacer un examen "organoléptico" de un alimento?',
    hint: '¡Marta nos enseñó a usar nuestros superpoderes! 🦸‍♂️',
    options: [
      { emoji: '🔍', label: 'Usar nuestros 5 sentidos para explorarlo' },
      { emoji: '🍳', label: 'Cocinarlo en un horno caliente' },
      { emoji: '🎨', label: 'Pintarlo con acuarelas de colores' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Con cuál sentido podemos sentir si la cáscara de una manzana es lisa o rugosa?',
    hint: '¡Piensa en lo que usas para tocar las cosas! 🍎',
    options: [
      { emoji: '✋', label: 'El Tacto (nuestras manos)' },
      { emoji: '👂', label: 'El Oído (nuestros oídos)' },
      { emoji: '👃', label: 'El Olfato (nuestra nariz)' },
    ],
    correctIndex: 0,
  },
  {
    text: 'Cuando mordemos una fruta fresca y escuchamos un sonido "¡CRUNCH!", ¿qué sentido estamos activando?',
    hint: '¡Presta atención a lo que escuchas! 🎶',
    options: [
      { emoji: '👂', label: 'El Oído' },
      { emoji: '👁️', label: 'La Vista' },
      { emoji: '👃', label: 'El Olfato' },
    ],
    correctIndex: 0,
  },
  {
    text: 'En el juego "Coleccionando objetos", ¿qué debemos hacer para encontrar los útiles?',
    hint: '¡Piensa en lo que hiciste al coleccionar objetos! 🔍',
    options: [
      { emoji: '🔍', label: 'Buscar las siluetas u objetos escondidos' },
      { emoji: '🏃', label: 'Correr sin mirar los objetos' },
      { emoji: '😴', label: 'Esperar sin buscar nada' },
    ],
    correctIndex: 0,
  },
  {
    text: 'En "La caja misteriosa", ¿para qué nos sirven las pistas de los sentidos?',
    hint: '¡Es como un juego de adivinanzas! 🎁',
    options: [
      { emoji: '🎁', label: 'Para adivinar qué objeto hay dentro de la caja' },
      { emoji: '✂️', label: 'Para romper la caja con tijeras' },
      { emoji: '🧹', label: 'Para limpiar el suelo' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Qué sentido nos ayuda a saber si un jugo sabe dulce o ácido antes de tragarlo?',
    hint: '¡Está en nuestra boca! 🧃',
    options: [
      { emoji: '👅', label: 'El Gusto (nuestra lengua)' },
      { emoji: '✋', label: 'El Tacto (nuestros dedos)' },
      { emoji: '👁️', label: 'La Vista (nuestros ojos)' },
    ],
    correctIndex: 0,
  },
  {
    text: 'En "La fábrica misteriosa", ¿qué aprendemos a hacer con los objetos?',
    hint: '¡Ordenar las cosas según sus características! 📦',
    options: [
      { emoji: '📋', label: 'Clasificarlos por sus características o propiedades' },
      { emoji: '💥', label: 'Romperlos en pedazos pequeños' },
      { emoji: '🎨', label: 'Pintar todos los objetos del mismo color' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Qué sentido nos permite ver que una manzana es de color rojo brillante y redonda?',
    hint: '¡Lo usamos al abrir las ventanas del cuerpo! 👁️',
    options: [
      { emoji: '👁️', label: 'La Vista (nuestros ojos)' },
      { emoji: '👃', label: 'El Olfato (nuestra nariz)' },
      { emoji: '👂', label: 'El Oído (nuestros oídos)' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Por qué los científicos y chefs huelen las frutas y alimentos?',
    hint: '¡El aroma nos da información muy importante! 🍓',
    options: [
      { emoji: '👃', label: 'Porque el olor nos ayuda a reconocer los alimentos' },
      { emoji: '👓', label: 'Para ver si están fríos' },
      { emoji: '🎵', label: 'Para escuchar su música secreta' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Cuántos superpoderes (sentidos) tenemos en nuestro cuerpo para explorar el mundo?',
    hint: '¡Cuenta con los dedos de una mano! 🖐️',
    options: [
      { emoji: '🖐️', label: '5 sentidos superpoderosos' },
      { emoji: '✌️', label: '2 sentidos nada más' },
      { emoji: '🔢', label: '100 sentidos diferentes' },
    ],
    correctIndex: 0,
  },
];

/** Decorative badges so the question card does not reveal the correct option. */
const QUESTION_BADGES = ['🦸‍♂️', '🍎', '🎶', '🏫', '🎁', '🧃', '📦', '🌈', '🍓', '🖐️'];

const THEMES = [
  { emoji: '🦸‍♂️', label: 'Superpoderes de los sentidos' },
  { emoji: '🔍', label: 'Coleccionando objetos' },
  { emoji: '🎁', label: 'La caja misteriosa' },
  { emoji: '📦', label: 'La fábrica misteriosa' },
];

type Screen = 'intro' | 'question' | 'results';

function starsForScore(score: number): number {
  if (score >= 9) return 3;
  if (score >= 6) return 2;
  if (score >= 3) return 1;
  return 0;
}

function resultForScore(score: number) {
  if (score === QUESTIONS.length) {
    return { title: '¡PERFECTO! ¡Genial!', msg: '¡Respondiste todo correctamente! Eres un súper científico.', emoji: '🏆' };
  }
  if (score >= 7) {
    return { title: '¡Casi perfecto!', msg: '¡Estuviste muy cerca! Eres muy inteligente.', emoji: '🌟' };
  }
  if (score >= 4) {
    return { title: '¡Buen intento!', msg: '¡Vas muy bien! Practica un poco más y lo lograrás.', emoji: '😊' };
  }
  return { title: '¡Inténtalo de nuevo!', msg: '¡No te rindas! Repasa las actividades y vuelve.', emoji: '😅' };
}

// ── Confetti ───────────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();

    const pieces = Array.from({ length: 90 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 8 + 4,
      color: ['#A7D4AE', '#F4E08B', '#F0C9A3', '#4D6B53', '#F2E8D5', '#ff9eab'][Math.floor(Math.random() * 6)],
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2,
      va: (Math.random() - 0.5) * 0.1,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.r / 2, -p.r / 2, p.r, p.r * 0.6);
        ctx.restore();
        p.x += p.vx;
        p.y += p.vy;
        p.angle += p.va;
        if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Stars display ──────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-2 sm:gap-3 justify-center" aria-label={`${count} de 3 estrellas`}>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="text-4xl sm:text-5xl md:text-6xl transition-all duration-500"
          style={{
            filter: i < count ? 'none' : 'grayscale(1) opacity(0.3)',
            transform: i < count ? 'scale(1.15)' : 'scale(1)',
          }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

function QuizHeader({
  title,
  onBack,
  trailing,
}: {
  title: string;
  onBack: () => void;
  trailing?: React.ReactNode;
}) {
  return (
    <header
      className="w-full min-h-14 flex items-center justify-between gap-3 px-4 sm:px-6 py-2 sticky top-0 z-20"
      style={{ backgroundColor: '#A7D4AE' }}
    >
      <button onClick={onBack} className="hover:opacity-70 transition-opacity p-2 rounded-full" aria-label="Volver">
        <svg className="h-6 w-6" fill="none" stroke="#1A1A1A" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="text-base sm:text-xl font-bold text-center leading-tight" style={{ color: '#1A1A1A' }}>{title}</h1>
      <div className="min-w-10 flex justify-end">{trailing}</div>
    </header>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function Semana2QuizPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const hasSaved = useRef(false);

  useEffect(() => {
    if (screen === 'results' && !hasSaved.current) {
      hasSaved.current = true;
      const stored = localStorage.getItem('plataforma_user');
      if (stored) {
        const user = JSON.parse(stored) as { id: string };
        const percentage = Math.round((score / QUESTIONS.length) * 100);
        saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 2, score: percentage }).catch(err => {
          console.error('Error guardando quiz Semana 2:', err);
          showKidMessage('No se pudo guardar tu nota. Intenta otra vez.', 'soon');
        });
      }
    } else if (screen !== 'results') {
      hasSaved.current = false;
    }
  }, [screen, score]);

  const q = QUESTIONS[qIdx];
  const isCorrect = checked && selected === q.correctIndex;

  const handleCheck = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) {
      setScore((s) => s + 1);
      playSuccess();
    } else {
      playMiss();
    }
    setChecked(true);
  };

  const handleNext = () => {
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      setScreen('results');
    }
  };

  const handleRestart = () => {
    setScreen('intro');
    setQIdx(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
  };

  const getOptionStyle = (idx: number): React.CSSProperties => {
    if (!checked) {
      if (selected === idx) return { backgroundColor: '#A7D4AE', border: '3px solid #4D6B53', transform: 'scale(1.02)' };
      return { backgroundColor: 'white', border: '2px solid #E1D5BD' };
    }
    if (idx === q.correctIndex) return { backgroundColor: '#d4edda', border: '3px solid #4D6B53' };
    if (idx === selected && selected !== q.correctIndex) return { backgroundColor: '#fde8e8', border: '3px solid #dc3545' };
    return { backgroundColor: 'white', border: '2px solid #E1D5BD', opacity: 0.5 };
  };

  const pageStyle: React.CSSProperties = { backgroundColor: '#FAF6F0', fontFamily: 'Nunito, sans-serif' };

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="min-h-screen flex flex-col" style={pageStyle}>
        <QuizHeader title="Quiz Semana 2" onBack={() => navigate('/semana/2')} />

        <main className="scroll-board flex-1 w-full max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 flex flex-col">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 lg:items-center">
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="text-7xl sm:text-8xl mb-3 animate-bounce">🎯</div>
              <div
                className="w-full rounded-3xl p-6 sm:p-8"
                style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                <h2 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: '#4D6B53' }}>
                  ¿Listo para el quiz?
                </h2>
                <p className="text-base sm:text-lg font-medium" style={{ color: '#4A4A4A' }}>
                  ¿Recuerdas lo que aprendiste sobre los materiales? ¡Vamos a descubrirlo!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {THEMES.map((a) => (
                <div
                  key={a.label}
                  className="flex items-center gap-3 rounded-2xl px-4 py-3 sm:py-4"
                  style={{ backgroundColor: 'white', border: '2px solid #E1D5BD' }}
                >
                  <span className="text-2xl sm:text-3xl">{a.emoji}</span>
                  <span className="font-bold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>{a.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 my-6 md:my-8">
            {[
              { emoji: '❓', label: '10 preguntas' },
              { emoji: '⭐', label: 'Gana estrellas' },
              { emoji: '🏆', label: '100 puntos' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl"
                style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD' }}
              >
                <span className="text-2xl">{stat.emoji}</span>
                <span className="font-bold text-sm sm:text-base" style={{ color: '#1A1A1A' }}>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <button
              onClick={() => setScreen('question')}
              className="w-full max-w-xl py-4 sm:py-5 rounded-full text-xl font-extrabold text-white transition-all active:scale-95 shadow-lg"
              style={{ backgroundColor: '#4D6B53', border: '4px solid #3a5240' }}
            >
              ¡Empezar! 🚀
            </button>
            <button onClick={() => navigate('/semana/2')} className="text-sm font-semibold underline" style={{ color: '#4A4A4A' }}>
              Volver a las actividades
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results') {
    const res = resultForScore(score);
    const stars = starsForScore(score);

    return (
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={pageStyle}>
        <ConfettiCanvas />
        <QuizHeader title="¡Resultados!" onBack={() => navigate('/semana/2')} />

        <main className="scroll-board flex-1 w-full max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 z-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
            <div className="md:col-span-2 flex flex-col items-center">
              <div className="text-7xl sm:text-8xl mb-3">{res.emoji}</div>
              <Stars count={stars} />

              <div
                className="w-full rounded-3xl p-6 my-5 text-center"
                style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
              >
                <h2 className="text-2xl sm:text-3xl font-extrabold mb-2" style={{ color: '#4D6B53' }}>{res.title}</h2>
                <p className="text-base font-medium mb-4" style={{ color: '#4A4A4A' }}>{res.msg}</p>
                <div className="flex justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-black" style={{ color: '#4D6B53' }}>{score}</span>
                    <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>{score} de 10 correctas</span>
                  </div>
                  <div className="w-px" style={{ backgroundColor: '#E1D5BD' }} />
                  <div className="flex flex-col items-center">
                    <span className="text-4xl sm:text-5xl font-black" style={{ color: '#4D6B53' }}>{score * 10}</span>
                    <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>{score * 10} de 100 puntos</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRestart}
                className="w-full py-4 rounded-full text-lg font-extrabold text-white mb-3 transition-all active:scale-95"
                style={{ backgroundColor: '#4D6B53', border: '4px solid #3a5240' }}
              >
                🔄 Intentar de nuevo
              </button>
              <button
                onClick={() => navigate('/semana/2')}
                className="w-full py-4 rounded-full text-lg font-extrabold transition-all active:scale-95"
                style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD', color: '#1A1A1A' }}
              >
                🏠 Volver a Semana 2
              </button>
            </div>

            <div
              className="md:col-span-3 rounded-3xl p-4 sm:p-5"
              style={{ backgroundColor: 'white', border: '2px solid #E1D5BD' }}
            >
              <h3 className="font-extrabold text-lg mb-3 px-1" style={{ color: '#4D6B53' }}>
                Repaso de las 10 preguntas
              </h3>
              <div className="flex flex-col gap-2 max-h-[42vh] md:max-h-[70vh] overflow-y-auto pr-1">
                {QUESTIONS.map((question, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 rounded-2xl px-4 py-3"
                    style={{ backgroundColor: '#FAF6F0', border: '2px solid #E1D5BD' }}
                  >
                    <span className="text-2xl flex-shrink-0">{question.options[question.correctIndex].emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#4D6B53' }}>
                        Pregunta {i + 1}
                      </p>
                      <p className="text-sm font-semibold leading-snug" style={{ color: '#1A1A1A' }}>
                        {question.text}
                      </p>
                      <p className="text-sm font-bold mt-1" style={{ color: '#4A4A4A' }}>
                        {question.options[question.correctIndex].label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col" style={pageStyle}>
      <QuizHeader
        title={`Pregunta ${qIdx + 1} de ${QUESTIONS.length}`}
        onBack={() => navigate('/semana/2')}
        trailing={
          <div className="flex items-center gap-1 font-bold text-sm sm:text-base" style={{ color: '#4D6B53' }}>
            <span>⭐</span> {score}
          </div>
        }
      />

      <div className="w-full h-3" style={{ backgroundColor: '#E1D5BD' }} role="progressbar" aria-valuenow={qIdx + 1} aria-valuemin={1} aria-valuemax={QUESTIONS.length}>
        <div
          className="h-full transition-all duration-500 rounded-r-full"
          style={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%`, backgroundColor: '#4D6B53' }}
        />
      </div>

      <main className="scroll-board flex-1 w-full max-w-4xl md:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-5 md:py-8 flex flex-col">
        <div
          className="w-full rounded-3xl p-5 sm:p-7 mb-5 md:mb-6 text-center"
          style={{ backgroundColor: '#F2E8D5', border: '3px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <div className="text-5xl sm:text-6xl mb-3">{QUESTION_BADGES[qIdx]}</div>
          <p className="text-xl sm:text-2xl md:text-3xl font-extrabold leading-snug" style={{ color: '#1A1A1A' }}>
            {q.text}
          </p>
          {!checked && (
            <p className="mt-3 text-sm sm:text-base font-semibold italic" style={{ color: '#4A4A4A' }}>
              {q.hint}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 w-full mb-5 md:mb-6">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !checked && setSelected(idx)}
              disabled={checked}
              className="w-full flex flex-row md:flex-col items-center gap-3 md:gap-4 rounded-3xl px-4 py-4 md:px-5 md:py-6 text-left md:text-center transition-all duration-200 active:scale-[0.98] min-h-[88px]"
              style={getOptionStyle(idx)}
            >
              <span className="text-4xl md:text-5xl flex-shrink-0">{opt.emoji}</span>
              <span className="text-base md:text-lg font-bold flex-1" style={{ color: '#1A1A1A' }}>{opt.label}</span>
              {checked && idx === q.correctIndex && <span className="text-2xl flex-shrink-0">✅</span>}
              {checked && idx === selected && selected !== q.correctIndex && <span className="text-2xl flex-shrink-0">❌</span>}
            </button>
          ))}
        </div>

        {checked && (
          <div
            className="w-full rounded-2xl px-5 py-4 mb-5 flex items-center gap-3"
            style={{
              backgroundColor: isCorrect ? '#d4edda' : '#fde8e8',
              border: `2px solid ${isCorrect ? '#4D6B53' : '#dc3545'}`,
            }}
          >
            <span className="text-3xl">{isCorrect ? '🎉' : '😅'}</span>
            <div>
              <p className="font-extrabold text-base sm:text-lg" style={{ color: isCorrect ? '#4D6B53' : '#dc3545' }}>
                {isCorrect ? '¡Correcto! ¡Muy bien!' : '¡Casi! La respuesta correcta es:'}
              </p>
              {!isCorrect && (
                <p className="text-sm sm:text-base font-bold" style={{ color: '#1A1A1A' }}>
                  {q.options[q.correctIndex].emoji} {q.options[q.correctIndex].label}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="mt-auto pt-2 flex justify-center">
          {!checked ? (
            <button
              onClick={handleCheck}
              disabled={selected === null}
              className="w-full max-w-xl py-4 rounded-full text-lg font-extrabold text-white transition-all active:scale-95"
              style={{
                backgroundColor: selected === null ? '#a0b8a3' : '#4D6B53',
                border: `4px solid ${selected === null ? '#8da890' : '#3a5240'}`,
                cursor: selected === null ? 'not-allowed' : 'pointer',
              }}
            >
              ✅ Comprobar respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full max-w-xl py-4 rounded-full text-lg font-extrabold text-white transition-all active:scale-95"
              style={{ backgroundColor: '#4D6B53', border: '4px solid #3a5240' }}
            >
              {qIdx < QUESTIONS.length - 1 ? '➡️ Siguiente pregunta' : '🏆 Ver resultados'}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
