import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveScore, markSemanaCompleted } from '../services/api';

type ObjectId = 'regadera' | 'caja' | 'molino' | 'tarros' | 'ropa' | 'caja_calabazas';

interface Option {
  text: string;
  correct: boolean;
}

interface GameObject {
  id: ObjectId;
  title: string;
  shortName: string;
  icon: string;
  bgClass: string;
  iconColor: string;
  q1: { title: string; options: Option[] };
  q2: { options: Option[] };
  justification: string;
}

const OBJECTS: GameObject[] = [
  {
    id: 'regadera',
    title: 'Regadera de Metal',
    shortName: 'Regadera',
    icon: 'water_drop',
    bgClass: 'bg-surface-variant',
    iconColor: 'text-on-surface-variant',
    q1: {
      title: '¿De qué material es?',
      options: [
        { text: 'Metal', correct: true },
        { text: 'Madera', correct: false },
        { text: 'Tela', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Dura mucho tiempo', correct: true },
        { text: 'Es muy blando', correct: false },
        { text: 'Cambia de color al sol', correct: false },
      ],
    },
    justification:
      'El metal es ideal para las regaderas porque es muy resistente y dura mucho tiempo, soportando el uso diario sin romperse.',
  },
  {
    id: 'caja',
    title: 'Caja de Madera',
    shortName: 'Caja de Madera',
    icon: 'inventory_2',
    bgClass: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed',
    q1: {
      title: '¿De qué material es?',
      options: [
        { text: 'Madera', correct: true },
        { text: 'Plástico', correct: false },
        { text: 'Metal', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Es resistente y ligera', correct: true },
        { text: 'Es transparente', correct: false },
        { text: 'Se oxida rápido', correct: false },
      ],
    },
    justification:
      'La madera se elige para las cajas de cosecha porque es un material resistente y ligera a la vez, perfecta para transportar hortalizas.',
  },
  {
    id: 'tarros',
    title: 'Botella de Vidrio',
    shortName: 'Botella de Vidrio',
    icon: 'liquor',
    bgClass: 'bg-secondary-fixed',
    iconColor: 'text-on-secondary-fixed',
    q1: {
      title: '¿De qué material es?',
      options: [
        { text: 'Vidrio', correct: true },
        { text: 'Cerámica', correct: false },
        { text: 'Papel', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Para ver lo que hay dentro', correct: true },
        { text: 'Para que no se rompa al caer', correct: false },
        { text: 'Porque es elástico', correct: false },
      ],
    },
    justification:
      'El vidrio se usa para recipientes porque su transparencia nos permite ver lo que hay dentro fácilmente.',
  },
  {
    id: 'ropa',
    title: 'Ropa del Granjero',
    shortName: 'Ropa',
    icon: 'checkroom',
    bgClass: 'bg-primary-container',
    iconColor: 'text-on-primary-container',
    q1: {
      title: '¿De qué material es?',
      options: [
        { text: 'Tela', correct: true },
        { text: 'Metal', correct: false },
        { text: 'Vidrio', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Por su suavidad y flexibilidad', correct: true },
        { text: 'Porque es transparente', correct: false },
        { text: 'Porque es muy pesado', correct: false },
      ],
    },
    justification:
      'La ropa se hace de tela porque necesitamos que sea suave y flexible para podernos mover con comodidad mientras trabajamos.',
  },
  {
    id: 'molino',
    title: 'Estructura del Molino',
    shortName: 'Molino',
    icon: 'wind_power',
    bgClass: 'bg-surface-variant',
    iconColor: 'text-on-surface-variant',
    q1: {
      title: '¿De qué material está hecho principalmente?',
      options: [
        { text: 'Metal/Madera', correct: true },
        { text: 'Papel', correct: false },
        { text: 'Plástico fino', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Por su gran resistencia', correct: true },
        { text: 'Para que sea invisible', correct: false },
        { text: 'Para que se rompa con el viento', correct: false },
      ],
    },
    justification:
      'Los molinos usan metal y madera porque son materiales con gran resistencia que soportan la fuerza del viento durante años.',
  },
  {
    id: 'caja_calabazas',
    title: 'Caja de Calabazas',
    shortName: 'Caja de Calabazas',
    icon: 'bakery_dining',
    bgClass: 'bg-tertiary-fixed',
    iconColor: 'text-on-tertiary-fixed',
    q1: {
      title: '¿De qué material es esta caja?',
      options: [
        { text: 'Madera', correct: true },
        { text: 'Vidrio', correct: false },
        { text: 'Tela', correct: false },
      ],
    },
    q2: {
      options: [
        { text: 'Es firme y acogedora', correct: true },
        { text: 'Se derrite con el sol', correct: false },
        { text: 'Es líquida', correct: false },
      ],
    },
    justification:
      'Las cajas de madera son firmes y acogedoras, protegiendo las frutas y verduras del suelo mientras se mantienen frescas.',
  },
];

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#4a6549', '#8ba888', '#3e6378', '#f3e0c2', '#ba1a1a'];
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    const size = Math.random() * 10 + 8 + 'px';
    particle.style.width = size;
    particle.style.height = size;
    if (Math.random() > 0.5) particle.style.borderRadius = '50%';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = Math.random() * 3 + 2 + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(particle);
  }
  setTimeout(() => container.remove(), 5000);
}

export default function HechoDeGamePage() {
  const navigate = useNavigate();
  const params = useParams();
  const semanaId = params.semanaId || '3';

  const [currentObject, setCurrentObject] = useState<GameObject | null>(null);
  const [q1Answered, setQ1Answered] = useState(false);
  const [q1Selected, setQ1Selected] = useState<number | null>(null);
  const [q2Selected, setQ2Selected] = useState<number | null>(null);
  const [completed, setCompleted] = useState<Set<ObjectId>>(new Set());
  const [showFeedback, setShowFeedback] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const totalObjects = OBJECTS.length;
  const progressPercent = (completed.size / totalObjects) * 100;
  const percentage = Math.round((completed.size / totalObjects) * 100);

  const openObject = (obj: GameObject) => {
    if (completed.has(obj.id) || gameFinished) return;
    setCurrentObject(obj);
    setQ1Answered(false);
    setQ1Selected(null);
    setQ2Selected(null);
    setShowFeedback(false);
  };

  const closeModal = () => {
    setCurrentObject(null);
    setQ1Answered(false);
    setQ1Selected(null);
    setQ2Selected(null);
    setShowFeedback(false);
  };

  const handleAnswer = (optionIndex: number, isCorrect: boolean, questionNumber: 1 | 2) => {
    if (showFeedback || !currentObject) return;
    if (questionNumber === 1) {
      setQ1Selected(optionIndex);
      if (isCorrect) {
        setQ1Answered(true);
      } else {
        setShakeKey((k) => k + 1);
        setTimeout(() => {
          setShowFeedback(true);
          setWasCorrect(false);
        }, 400);
      }
    } else if (questionNumber === 2 && q1Answered) {
      setQ2Selected(optionIndex);
      if (isCorrect) {
        setShowFeedback(true);
        setWasCorrect(true);
        const next = new Set(completed);
        next.add(currentObject.id);
        setCompleted(next);
      } else {
        setShakeKey((k) => k + 1);
        setTimeout(() => {
          setShowFeedback(true);
          setWasCorrect(false);
        }, 400);
      }
    }
  };

  const handleContinue = () => {
    if (wasCorrect) {
      closeModal();
    } else {
      setShowFeedback(false);
      setQ1Selected(null);
      setQ2Selected(null);
    }
  };

  useEffect(() => {
    if (completed.size === totalObjects && !gameFinished) {
      setGameFinished(true);
      triggerConfetti();
    }
  }, [completed, totalObjects, gameFinished]);

  useEffect(() => {
    if (!gameFinished) return;
    const userRaw = localStorage.getItem('plataforma_user');
    if (!userRaw) return;
    try {
      const user = JSON.parse(userRaw);
      saveScore({ userId: user.id, semanaId, score: percentage, type: 'activity' }).catch(() => {});
      markSemanaCompleted(user.id, semanaId, percentage).catch(() => {});
    } catch {
      // ignore
    }
  }, [gameFinished, percentage, semanaId]);

  return (
    <div className="bg-background text-on-surface font-body-md min-h-screen flex flex-col selection:bg-secondary-container selection:text-on-secondary-container">
      {/* TopAppBar */}
      <header className="bg-surface-container-low shadow-sm z-30 relative rounded-b-xl">
        <div className="flex justify-between items-center w-full px-5 md:px-8 py-3 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/semana/${semanaId}`)}
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center text-on-surface-variant hover:bg-primary-container/20 transition-all rounded-full"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="w-10 h-10 md:w-12 md:h-12 bg-primary-container rounded-full flex items-center justify-center text-on-primary-container">
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1", fontSize: '24px' }}
              >
                science
              </span>
            </div>
            <div>
              <h1 className="font-headline-md text-headline-md font-bold text-primary">
                ¿De qué están hechos?
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-24 md:w-32 h-2 md:h-3 bg-surface-variant rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-500 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="font-label-md text-label-md text-on-surface-variant">
                  {completed.size}/{totalObjects} Objetos
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Game Scene — object grid */}
      <main className="flex-grow relative overflow-hidden flex items-start md:items-center justify-center bg-gradient-to-b from-surface-container-highest to-surface-container py-8 md:py-12">
        <div className="w-full max-w-6xl px-5 md:px-8">
          {/* Hero text */}
          <div className="text-center mb-8">
            <h2 className="font-headline-md md:font-headline-lg text-headline-md md:text-headline-lg text-on-surface mb-2">
              Explora cada objeto
            </h2>
            <p className="font-body-md md:font-body-lg text-body-md md:text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Toca un objeto para descubrir de qué está hecho y por qué.
            </p>
          </div>

          {/* Object Grid — 2 cols on mobile, 3 cols on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {OBJECTS.map((obj) => {
              const isDone = completed.has(obj.id);
              return (
                <button
                  key={obj.id}
                  onClick={() => openObject(obj)}
                  disabled={isDone}
                  className={`relative bg-surface rounded-3xl p-4 md:p-6 flex flex-col items-center gap-3 md:gap-4 border-4 transition-all ${
                    isDone
                      ? 'border-primary opacity-60 cursor-not-allowed'
                      : 'border-surface-container hover:border-primary hover:-translate-y-1 cursor-pointer'
                  }`}
                  style={{
                    boxShadow: '0 8px 30px rgba(74, 101, 73, 0.08)',
                  }}
                >
                  <div
                    className={`w-20 h-20 md:w-28 md:h-28 rounded-2xl ${obj.bgClass} flex items-center justify-center`}
                  >
                    <span
                      className={`material-symbols-outlined text-5xl md:text-7xl ${obj.iconColor}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {obj.icon}
                    </span>
                  </div>
                  <h3 className="font-label-md md:font-label-lg text-label-md md:text-label-lg text-center text-on-surface font-semibold">
                    {obj.shortName}
                  </h3>
                  {isDone && (
                    <div className="absolute top-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-primary rounded-full flex items-center justify-center text-white">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: '20px' }}
                      >
                        check
                      </span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-30 flex justify-around items-center px-4 py-3 bg-surface shadow-lg rounded-t-xl">
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-xl px-4 py-2 translate-y-1 transition-transform">
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            language
          </span>
          <span className="font-label-lg text-label-lg mt-1">Mundo</span>
        </div>
        <button className="flex flex-col items-center justify-center text-outline px-4 py-2 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">science</span>
          <span className="font-label-lg text-label-lg mt-1 hidden sm:block">Laboratorio</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline px-4 py-2 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu_book</span>
          <span className="font-label-lg text-label-lg mt-1 hidden sm:block">Diario</span>
        </button>
        <button className="flex flex-col items-center justify-center text-outline px-4 py-2 hover:text-primary transition-colors">
          <span className="material-symbols-outlined">stars</span>
          <span className="font-label-lg text-label-lg mt-1 hidden sm:block">Logros</span>
        </button>
      </nav>

      {/* Quiz Modal */}
      {currentObject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-5 md:px-0">
          <div
            className="absolute inset-0 bg-inverse-surface/60 backdrop-blur-md"
            onClick={closeModal}
          ></div>
          <div
            key={shakeKey}
            className="relative bg-surface rounded-[2rem] shadow-2xl p-6 md:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-pop-in border-4 border-surface-container-low"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-2xl ${currentObject.bgClass} flex items-center justify-center shadow-inner`}
                >
                  <span
                    className={`material-symbols-outlined text-3xl md:text-4xl ${currentObject.iconColor}`}
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {currentObject.icon}
                  </span>
                </div>
                <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg font-bold text-on-surface">
                  {currentObject.title}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="w-10 h-10 md:w-12 md:h-12 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Quiz Questions (hidden when feedback showing) */}
            {!showFeedback && (
              <div className="space-y-6">
                {/* Q1 */}
                <div className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl border-2 border-surface-container shadow-sm">
                  <h3 className="font-headline-md text-headline-md text-primary mb-3">
                    1. {currentObject.q1.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    {currentObject.q1.options.map((opt, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(i, opt.correct, 1)}
                        disabled={q1Answered}
                        className={`btn-squishy w-full p-4 rounded-xl border-2 font-label-md text-label-md transition-colors text-center ${
                          q1Selected === i
                            ? opt.correct
                              ? 'bg-primary-container border-primary text-on-primary-container'
                              : 'bg-error-container border-error text-on-error-container'
                            : 'border-outline-variant text-on-surface bg-surface hover:bg-surface-container-high'
                        } ${q1Answered && q1Selected !== i ? 'opacity-50' : ''}`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Q2 — sealed envelope until Q1 answered correctly */}
                {q1Answered ? (
                  <div className="bg-surface-container-lowest p-4 md:p-6 rounded-2xl border-2 border-surface-container shadow-sm animate-pop-in">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className="material-symbols-outlined text-secondary"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        help
                      </span>
                      <h3 className="font-headline-md text-headline-md text-secondary">
                        ¿Por qué se usa este material?
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {currentObject.q2.options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i, opt.correct, 2)}
                          className={`btn-squishy w-full p-4 rounded-xl border-2 font-label-md text-label-md transition-colors text-center ${
                            q2Selected === i
                              ? opt.correct
                                ? 'bg-primary-container border-primary text-on-primary-container'
                                : 'bg-error-container border-error text-on-error-container'
                              : 'border-outline-variant text-on-surface bg-surface hover:bg-surface-container-high'
                          }`}
                        >
                          {opt.text}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-container p-4 md:p-6 rounded-2xl border-2 border-dashed border-outline-variant flex flex-col items-center justify-center gap-2 min-h-[140px]">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span
                        className="material-symbols-outlined text-on-surface-variant"
                        style={{ fontSize: '32px' }}
                      >
                        lock
                      </span>
                    </div>
                    <p className="font-label-md text-label-md text-on-surface-variant text-center">
                      Pregunta 2
                    </p>
                    <p className="font-body-md text-body-md text-on-surface-variant text-center text-sm">
                      Responde la primera pregunta para descubrirla.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Feedback */}
            {showFeedback && (
              <div className="flex flex-col items-center justify-center py-6 text-center animate-pop-in">
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-4xl md:text-5xl mb-4 animate-float ${
                    wasCorrect
                      ? 'bg-primary-container text-on-primary-container'
                      : 'bg-tertiary-container text-on-tertiary-container'
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-4xl md:text-5xl"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    {wasCorrect ? 'stars' : 'lightbulb'}
                  </span>
                </div>
                <h3
                  className={`font-headline-lg-mobile text-headline-lg-mobile font-bold mb-3 ${
                    wasCorrect ? 'text-primary' : 'text-tertiary'
                  }`}
                >
                  {wasCorrect ? '¡Excelente!' : '¡Casi lo tienes!'}
                </h3>
                <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto bg-surface-container p-4 rounded-xl border-2 border-surface-container-high">
                  {wasCorrect
                    ? currentObject.justification
                    : `¡Inténtalo de nuevo! Recuerda: ${currentObject.justification}`}
                </p>
                <button
                  onClick={handleContinue}
                  className="mt-6 btn-squishy bg-primary text-on-primary font-label-lg text-label-lg px-8 py-4 rounded-2xl flex items-center gap-2 hover:brightness-110"
                >
                  {wasCorrect ? (
                    <>
                      Continuar Explorando
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  ) : (
                    'Reintentar'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Game Finished Overlay */}
      {gameFinished && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4">
          <div className="bg-surface rounded-3xl p-8 md:p-12 max-w-md w-full flex flex-col items-center gap-6 clay-shadow text-center">
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center">
              <span
                className="material-symbols-outlined text-white"
                style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
              >
                emoji_events
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg text-primary">¡Lo lograste!</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Has explorado todos los objetos de la escena.
            </p>
            <div className="bg-surface-container-highest rounded-2xl px-6 py-4">
              <p className="font-label-md text-label-md text-on-surface-variant">Objetos explorados</p>
              <p className="font-headline-lg text-headline-lg text-primary">
                {completed.size} / {totalObjects} · {percentage}%
              </p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="clay-button bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 w-full"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
