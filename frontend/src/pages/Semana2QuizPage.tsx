import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Quiz data ──────────────────────────────────────────────────────────────
interface Option { emoji: string; label: string }
interface Question { text: string; hint: string; options: Option[]; correctIndex: number }

const QUESTIONS: Question[] = [
  {
    text: '¿Qué hacemos en el juego "Coleccionando objetos"?',
    hint: '¡Piensa en lo que hiciste en el aula! 🏫',
    options: [
      { emoji: '🔍', label: 'Buscar y recoger objetos escondidos' },
      { emoji: '🍳', label: 'Preparar recetas de cocina' },
      { emoji: '🎨', label: 'Dibujar animales del bosque' },
    ],
    correctIndex: 0,
  },
  {
    text: '¿Qué usamos para adivinar qué hay dentro de "La caja misteriosa"?',
    hint: '¡Usamos algo que todos tenemos! 🤔',
    options: [
      { emoji: '🗺️', label: 'Un mapa del tesoro' },
      { emoji: '👃', label: 'Nuestros sentidos y pistas' },
      { emoji: '🦸', label: 'Superpoderes mágicos' },
    ],
    correctIndex: 1,
  },
  {
    text: 'En "La fábrica misteriosa", ¿qué aprendemos a hacer con los objetos?',
    hint: '¡Ordenar las cosas en grupos! 📦',
    options: [
      { emoji: '💥', label: 'Romperlos en pedazos' },
      { emoji: '🖌️', label: 'Pintarlos de colores' },
      { emoji: '📋', label: 'Clasificarlos por sus características' },
    ],
    correctIndex: 2,
  },
];

type Screen = 'intro' | 'question' | 'results';

// ── Confetti ───────────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const pieces = Array.from({ length: 80 }, () => ({
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
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />;
}

// ── Stars display ──────────────────────────────────────────────────────────
function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="text-5xl transition-all duration-500"
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

// ── Main component ──────────────────────────────────────────────────────────
export default function Semana2QuizPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('intro');
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);

  const q = QUESTIONS[qIdx];
  const isCorrect = checked && selected === q.correctIndex;

  const handleCheck = () => {
    if (selected === null) return;
    if (selected === q.correctIndex) setScore((s) => s + 1);
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

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#F9F9FA', fontFamily: 'Nunito, sans-serif' }}>
        <header className="w-full h-14 flex items-center justify-between px-6 sticky top-0 z-10" style={{ backgroundColor: '#A7D4AE' }}>
          <button onClick={() => navigate('/semana/2')} className="hover:opacity-70 transition-opacity p-2">
            <svg className="h-6 w-6" fill="none" stroke="#1A1A1A" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Quiz Semana 2</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 w-full max-w-lg">
          {/* Hero emoji */}
          <div className="text-[80px] mb-2 animate-bounce">🎯</div>

          {/* Title card */}
          <div
            className="w-full rounded-3xl p-6 mb-6 text-center"
            style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          >
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: '#1A1A1A' }}>
              ¡Quiz Final de la Semana 2!
            </h2>
            <p className="text-base font-medium" style={{ color: '#4A4A4A' }}>
              ¿Recuerdas todo lo que aprendiste? ¡Vamos a descubrirlo!
            </p>
          </div>

          {/* Activity chips */}
          <div className="flex flex-col gap-3 w-full mb-6">
            {[
              { emoji: '🔍', label: 'Coleccionando objetos' },
              { emoji: '📦', label: 'La caja misteriosa' },
              { emoji: '🏭', label: 'La fábrica misteriosa' },
            ].map((a) => (
              <div
                key={a.label}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ backgroundColor: 'white', border: '2px solid #E1D5BD' }}
              >
                <span className="text-2xl">{a.emoji}</span>
                <span className="font-bold text-base" style={{ color: '#1A1A1A' }}>{a.label}</span>
                <span className="ml-auto text-sm font-semibold px-3 py-1 rounded-full" style={{ backgroundColor: '#A7D4AE', color: '#1A1A1A' }}>
                  1 pregunta
                </span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-4 mb-8">
            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD' }}>
              <span className="text-2xl">❓</span>
              <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>3 preguntas</span>
            </div>
            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD' }}>
              <span className="text-2xl">⭐</span>
              <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Gana estrellas</span>
            </div>
            <div className="flex flex-col items-center px-5 py-3 rounded-2xl" style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD' }}>
              <span className="text-2xl">🏆</span>
              <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Tu insignia</span>
            </div>
          </div>

          <button
            onClick={() => setScreen('question')}
            className="w-full py-5 rounded-full text-xl font-extrabold text-white transition-all active:scale-95 shadow-lg"
            style={{ backgroundColor: '#4D6B53', border: '4px solid #3a5240' }}
          >
            ¡Empezar! 🚀
          </button>

          <button onClick={() => navigate('/semana/2')} className="mt-4 text-sm font-semibold underline" style={{ color: '#4A4A4A' }}>
            Volver a las actividades
          </button>
        </main>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results') {
    const resultMap = [
      { title: '¡Inténtalo de nuevo!', msg: '¡No te rindas! Repasa las actividades y vuelve.', emoji: '😅' },
      { title: '¡Buen intento!', msg: '¡Vas muy bien! Practica un poco más y lo lograrás.', emoji: '😊' },
      { title: '¡Casi perfecto!', msg: '¡Estuviste muy cerca! Eres muy inteligente.', emoji: '🌟' },
      { title: '¡PERFECTO! ¡Genial!', msg: '¡Respondiste todo correctamente! Eres un súper científico.', emoji: '🏆' },
    ];
    const res = resultMap[score];

    return (
      <div className="min-h-screen flex flex-col items-center relative overflow-hidden" style={{ backgroundColor: '#F9F9FA', fontFamily: 'Nunito, sans-serif' }}>
        <ConfettiCanvas />

        <header className="w-full h-14 flex items-center justify-between px-6 sticky top-0 z-10" style={{ backgroundColor: '#A7D4AE' }}>
          <button onClick={() => navigate('/semana/2')} className="hover:opacity-70 transition-opacity p-2">
            <svg className="h-6 w-6" fill="none" stroke="#1A1A1A" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>¡Resultados!</h1>
          <div className="w-10" />
        </header>

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 w-full max-w-lg z-10">
          <div className="text-[80px] mb-2">{res.emoji}</div>
          <Stars count={score} />

          <div
            className="w-full rounded-3xl p-6 my-6 text-center"
            style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          >
            <h2 className="text-3xl font-extrabold mb-2" style={{ color: '#4D6B53' }}>{res.title}</h2>
            <p className="text-base font-medium mb-4" style={{ color: '#4A4A4A' }}>{res.msg}</p>
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black" style={{ color: '#4D6B53' }}>{score}</span>
                <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>de 3 correctas</span>
              </div>
              <div className="w-px" style={{ backgroundColor: '#E1D5BD' }} />
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black" style={{ color: '#4D6B53' }}>{score * 10}</span>
                <span className="text-sm font-semibold" style={{ color: '#4A4A4A' }}>de 30 puntos</span>
              </div>
            </div>
          </div>

          {/* Per-question summary */}
          <div className="flex flex-col gap-2 w-full mb-6">
            {QUESTIONS.map((question, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-2xl px-4 py-3"
                style={{ backgroundColor: 'white', border: '2px solid #E1D5BD' }}
              >
                <span className="text-xl">{question.options[question.correctIndex].emoji}</span>
                <span className="flex-1 text-sm font-semibold" style={{ color: '#4A4A4A' }}>
                  Pregunta {i + 1}
                </span>
                <span className="font-bold text-sm px-3 py-1 rounded-full" style={{ backgroundColor: '#A7D4AE', color: '#1A1A1A' }}>
                  +10 pts
                </span>
              </div>
            ))}
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
        </main>
      </div>
    );
  }

  // ── QUESTION ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col items-center" style={{ backgroundColor: '#F9F9FA', fontFamily: 'Nunito, sans-serif' }}>
      <header className="w-full h-14 flex items-center justify-between px-6 sticky top-0 z-10" style={{ backgroundColor: '#A7D4AE' }}>
        <button onClick={() => navigate('/semana/2')} className="hover:opacity-70 transition-opacity p-2">
          <svg className="h-6 w-6" fill="none" stroke="#1A1A1A" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Pregunta {qIdx + 1} de {QUESTIONS.length}</h1>
        <div className="flex items-center gap-1 font-bold text-sm" style={{ color: '#4D6B53' }}>
          <span>⭐</span> {score}
        </div>
      </header>

      {/* Progress bar */}
      <div className="w-full h-3" style={{ backgroundColor: '#E1D5BD' }}>
        <div
          className="h-full transition-all duration-500 rounded-r-full"
          style={{ width: `${((qIdx + 1) / QUESTIONS.length) * 100}%`, backgroundColor: '#4D6B53' }}
        />
      </div>

      <main className="flex-1 flex flex-col items-center px-6 py-8 w-full max-w-lg">
        {/* Question card */}
        <div
          className="w-full rounded-3xl p-6 mb-6 text-center"
          style={{ backgroundColor: '#F2E8D5', border: '3px solid #E1D5BD', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
        >
          <div className="text-5xl mb-3">
            {qIdx === 0 ? '🔍' : qIdx === 1 ? '📦' : '🏭'}
          </div>
          <p className="text-xl font-extrabold leading-snug" style={{ color: '#1A1A1A' }}>
            {q.text}
          </p>
          {!checked && (
            <p className="mt-2 text-sm font-semibold italic" style={{ color: '#4A4A4A' }}>
              {q.hint}
            </p>
          )}
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 w-full mb-6">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => !checked && setSelected(idx)}
              disabled={checked}
              className="w-full flex items-center gap-4 rounded-2xl px-5 py-4 text-left transition-all duration-200 active:scale-[0.98]"
              style={getOptionStyle(idx)}
            >
              <span className="text-4xl flex-shrink-0">{opt.emoji}</span>
              <span className="text-base font-bold flex-1" style={{ color: '#1A1A1A' }}>{opt.label}</span>
              {checked && idx === q.correctIndex && <span className="text-2xl flex-shrink-0">✅</span>}
              {checked && idx === selected && selected !== q.correctIndex && <span className="text-2xl flex-shrink-0">❌</span>}
            </button>
          ))}
        </div>

        {/* Feedback banner */}
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
              <p className="font-extrabold text-base" style={{ color: isCorrect ? '#4D6B53' : '#dc3545' }}>
                {isCorrect ? '¡Correcto! ¡Muy bien!' : '¡Casi! La respuesta correcta es:'}
              </p>
              {!isCorrect && (
                <p className="text-sm font-bold" style={{ color: '#1A1A1A' }}>
                  {q.options[q.correctIndex].emoji} {q.options[q.correctIndex].label}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action button */}
        {!checked ? (
          <button
            onClick={handleCheck}
            disabled={selected === null}
            className="w-full py-4 rounded-full text-lg font-extrabold text-white transition-all active:scale-95"
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
            className="w-full py-4 rounded-full text-lg font-extrabold text-white transition-all active:scale-95 animate-pulse"
            style={{ backgroundColor: '#4D6B53', border: '4px solid #3a5240' }}
          >
            {qIdx < QUESTIONS.length - 1 ? '➡️ Siguiente pregunta' : '🏆 Ver resultados'}
          </button>
        )}
      </main>
    </div>
  );
}
