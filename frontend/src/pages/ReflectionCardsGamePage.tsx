import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveScore, markSemanaCompleted } from '../services/api';

type CardAction = 'bota' | 'recicla' | 'reutiliza';
type ContainerClass =
  | 'bg-secondary-container'
  | 'bg-primary-container'
  | 'bg-tertiary-container'
  | 'bg-surface-variant'
  | 'bg-error-container';
type TextClass =
  | 'text-on-secondary-container'
  | 'text-on-primary-container'
  | 'text-on-tertiary-container'
  | 'text-on-surface-variant'
  | 'text-on-error-container';

interface CardData {
  id: string;
  name: string;
  icon: string;
  colorClass: ContainerClass;
  textClass: TextClass;
  correct: CardAction;
}

const CARDS: CardData[] = [
  { id: 'can', name: 'Lata de Soda', icon: 'local_drink', colorClass: 'bg-secondary-container', textClass: 'text-on-secondary-container', correct: 'recicla' },
  { id: 'jar', name: 'Frasco de Vidrio', icon: 'potted_plant', colorClass: 'bg-primary-container', textClass: 'text-on-primary-container', correct: 'recicla' },
  { id: 'bottle', name: 'Botella de Plástico', icon: 'water_bottle', colorClass: 'bg-tertiary-container', textClass: 'text-on-tertiary-container', correct: 'recicla' },
  { id: 'box', name: 'Caja de Cartón', icon: 'inventory_2', colorClass: 'bg-surface-variant', textClass: 'text-on-surface-variant', correct: 'recicla' },
  { id: 'peel', name: 'Cáscara de Plátano', icon: 'nutrition', colorClass: 'bg-error-container', textClass: 'text-on-error-container', correct: 'bota' },
  { id: 'apple', name: 'Corazón de Manzana', icon: 'eco', colorClass: 'bg-error-container', textClass: 'text-on-error-container', correct: 'bota' },
  { id: 'newspaper', name: 'Periódico', icon: 'newspaper', colorClass: 'bg-surface-variant', textClass: 'text-on-surface-variant', correct: 'recicla' },
  { id: 'shoe', name: 'Zapato Viejo', icon: 'directions_run', colorClass: 'bg-tertiary-container', textClass: 'text-on-tertiary-container', correct: 'bota' },
  { id: 'eggs', name: 'Cáscaras de Huevo', icon: 'egg_alt', colorClass: 'bg-error-container', textClass: 'text-on-error-container', correct: 'bota' },
  { id: 'bag', name: 'Bolsa de Plástico', icon: 'shopping_bag', colorClass: 'bg-secondary-container', textClass: 'text-on-secondary-container', correct: 'recicla' },
  { id: 'milk', name: 'Cartón de Leche', icon: 'takeout_dining', colorClass: 'bg-surface-variant', textClass: 'text-on-surface-variant', correct: 'recicla' },
  { id: 'toy', name: 'Juguete Roto', icon: 'toys', colorClass: 'bg-tertiary-container', textClass: 'text-on-tertiary-container', correct: 'bota' },
  { id: 'metalcan', name: 'Lata de Metal', icon: 'kitchen', colorClass: 'bg-secondary-container', textClass: 'text-on-secondary-container', correct: 'recicla' },
  { id: 'leaves', name: 'Hojas Secas', icon: 'forest', colorClass: 'bg-error-container', textClass: 'text-on-error-container', correct: 'bota' },
  { id: 'glassbottle', name: 'Botella de Vidrio', icon: 'liquor', colorClass: 'bg-primary-container', textClass: 'text-on-primary-container', correct: 'recicla' },
  { id: 'tire', name: 'Neumático Viejo', icon: 'tire_repair', colorClass: 'bg-surface-variant', textClass: 'text-on-surface-variant', correct: 'reutiliza' },
  { id: 'emptyjar', name: 'Frasco Vacío', icon: 'inventory', colorClass: 'bg-primary-container', textClass: 'text-on-primary-container', correct: 'reutiliza' },
  { id: 'cerealbox', name: 'Caja de Cereal', icon: 'dashboard', colorClass: 'bg-tertiary-container', textClass: 'text-on-tertiary-container', correct: 'reutiliza' },
  { id: 'glassvase', name: 'Jarrón de Vidrio', icon: 'local_florist', colorClass: 'bg-secondary-container', textClass: 'text-on-secondary-container', correct: 'reutiliza' },
  { id: 'fabric', name: 'Retazos de Tela', icon: 'dry_cleaning', colorClass: 'bg-error-container', textClass: 'text-on-error-container', correct: 'reutiliza' },
];

const ACTION_LABELS: Record<CardAction, { label: string; icon: string; container: ContainerClass; text: TextClass }> = {
  bota: { label: 'Se Bota', icon: 'delete', container: 'bg-error-container', text: 'text-on-error-container' },
  recicla: { label: 'Se Recicla', icon: 'recycling', container: 'bg-primary-container', text: 'text-on-primary-container' },
  reutiliza: { label: 'Se Reutiliza', icon: 'auto_fix', container: 'bg-secondary-container', text: 'text-on-secondary-container' },
};

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

export default function ReflectionCardsGamePage() {
  const navigate = useNavigate();
  const params = useParams();
  const semanaId = params.semanaId || '';

  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<null | 'correct' | 'wrong'>(null);
  const [shakeKey, setShakeKey] = useState(0);
  const [gameFinished, setGameFinished] = useState(false);

  const activeCard = activeCardId ? CARDS.find((c) => c.id === activeCardId) ?? null : null;

  const openCard = (cardId: string) => {
    if (completed.has(cardId) || gameFinished) return;
    setActiveCardId(cardId);
    setFeedback(null);
  };

  const closeModal = () => {
    setActiveCardId(null);
    setFeedback(null);
  };

  const handleAnswer = (action: CardAction) => {
    if (!activeCard) return;
    if (action === activeCard.correct) {
      setFeedback('correct');
    } else {
      setFeedback('wrong');
      setShakeKey((k) => k + 1);
      setTimeout(() => {
        setFeedback(null);
      }, 1500);
    }
  };

  const handleContinue = () => {
    if (!activeCard) return;
    const next = new Set(completed);
    next.add(activeCard.id);
    setCompleted(next);
    setScore((s) => s + 1);
    setActiveCardId(null);
    setFeedback(null);
  };

  useEffect(() => {
    if (completed.size === CARDS.length && !gameFinished) {
      setGameFinished(true);
      triggerConfetti();
    }
  }, [completed, gameFinished]);

  useEffect(() => {
    if (!gameFinished) return;
    const userRaw = localStorage.getItem('plataforma_user');
    if (!userRaw || !semanaId) return;
    try {
      const user = JSON.parse(userRaw);
      const percentage = Math.round((score / CARDS.length) * 100);
      saveScore({ userId: user.id, semanaId, score: percentage, type: 'activity' }).catch(() => {});
      markSemanaCompleted(user.id, semanaId, percentage).catch(() => {});
    } catch {
      // ignore localStorage parse errors
    }
  }, [gameFinished, score, semanaId]);

  const totalCards = CARDS.length;
  const percentage = Math.round((score / totalCards) * 100);

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen flex flex-col relative overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img
          alt="Cozy classroom background"
          className="w-full h-full object-cover opacity-60"
          src="https://lh3.googleusercontent.com/aida/AP1WRLv0zYOyKb31v5OzaCP3YydatiExNVGhrCKdCpbHSMnXnACA36CvIKzZ0IJvZVx0e6WR6fWkRvfr4XlHNPmPLONOrYxn3YwYNcvioV1q8WZy8NZlE2tUtwDn0DQJVtnqI5qyHGnVzYJ7amuA468ftj9d-cYcjF2N0eaDARAEBUYUvvX1H7zf9h-g3gX9PPjirBAAudYlZnGea3CWKPf5hkvMIAxZNPTBxOeUcMY6XriQxg_Hqge86K45Gwg"
        />
        <div className="absolute inset-0 bg-overlay"></div>
      </div>

      {/* TopAppBar */}
      <header className="bg-surface text-primary font-label-lg flex justify-between items-center px-5 md:px-20 h-16 max-w-7xl mx-auto w-full z-10 relative">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/semana/${semanaId}`)}
            className="material-symbols-outlined hover:text-secondary transition-colors text-[28px] text-primary"
          >
            arrow_back
          </button>
          <div className="font-headline-md text-headline-md text-primary font-bold">UNIVO</div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 text-on-surface font-headline-md text-[22px] hidden sm:block">
          Tarjetas de Reflexión
        </div>
        <div className="flex items-center gap-4 text-primary font-label-lg">
          <span
            className="material-symbols-outlined hover:text-secondary transition-colors cursor-pointer active:scale-95 duration-200"
            style={{ fontSize: '28px' }}
          >
            account_circle
          </span>
        </div>
      </header>

      {/* Score banner */}
      <div className="z-10 relative max-w-7xl mx-auto w-full px-5 md:px-20 mt-4">
        <div className="bg-surface-container-highest rounded-full px-5 py-2 inline-flex items-center gap-3 text-on-surface">
          <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
          <span className="font-label-md text-label-md">
            Progreso: {score} / {totalCards}
          </span>
        </div>
      </div>

      {/* Main Game Board */}
      <main className="flex-1 flex flex-col items-center justify-start p-5 md:p-8 z-10 relative w-full max-w-5xl mx-auto pb-12 pt-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 md:gap-8 w-full">
          {CARDS.map((card) => {
            const isDone = completed.has(card.id);
            return (
              <div
                key={card.id}
                onClick={() => openCard(card.id)}
                className={`cursor-pointer bg-surface-container-lowest rounded-3xl p-4 w-full h-40 md:h-52 flex flex-col items-center justify-center shadow-lg border-2 border-surface-container-highest relative transition-transform duration-300 hover:-translate-y-2 ${
                  isDone ? 'card-done' : ''
                }`}
              >
                <div className={`w-16 h-16 md:w-24 md:h-24 rounded-2xl ${card.colorClass} flex items-center justify-center mb-3`}>
                  <span
                    className={`material-symbols-outlined text-4xl md:text-5xl ${card.textClass}`}
                  >
                    {card.icon}
                  </span>
                </div>
                <h3 className="font-label-md text-label-md text-center text-on-surface leading-tight">
                  {card.name}
                </h3>
                {isDone && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>

      {/* Modal Overlay */}
      {activeCard && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4"
          onClick={closeModal}
        >
          <div
            key={shakeKey}
            onClick={(e) => e.stopPropagation()}
            className={`bg-surface rounded-3xl w-full max-w-xl flex flex-col items-center relative clay-shadow overflow-hidden transform transition-transform duration-300 p-6 md:p-8 ${
              feedback === 'wrong' ? 'animate-shake' : 'scale-100'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors z-30"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Feedback Overlay */}
            <div
              className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-300 backdrop-blur-md rounded-3xl ${
                feedback ? 'opacity-100 bg-surface/90' : 'opacity-0 pointer-events-none'
              }`}
            >
              <div
                className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 ease-out ${
                  feedback ? 'scale-100' : 'scale-50'
                } ${feedback === 'correct' ? 'bg-primary' : 'bg-error'}`}
              >
                <span
                  className="material-symbols-outlined text-[64px] text-white"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  {feedback === 'correct' ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <p
                className={`mt-4 font-headline-md text-headline-md text-center px-4 transition-opacity duration-300 ${
                  feedback ? 'opacity-100' : 'opacity-0'
                } ${feedback === 'correct' ? 'text-primary' : 'text-error'}`}
              >
                {feedback === 'correct' ? '¡Felicidades!' : 'Incorrecto, intenta de nuevo'}
              </p>
              {feedback === 'correct' && (
                <button
                  onClick={handleContinue}
                  className="mt-8 clay-button bg-primary text-on-primary px-8 py-3 rounded-full font-label-lg shadow-md"
                >
                  Continuar
                </button>
              )}
            </div>

            {/* Modal Body */}
            <div className="flex-1 flex flex-col items-center justify-center w-full mt-4">
              <div
                className={`w-64 h-64 rounded-3xl flex items-center justify-center shadow-inner relative mb-6 ${activeCard.colorClass}`}
              >
                <span
                  className={`material-symbols-outlined ${activeCard.textClass}`}
                  style={{ fontSize: '120px' }}
                >
                  {activeCard.icon}
                </span>
              </div>
              <h2 className="font-headline-md text-headline-md text-on-surface text-center mb-8">
                {activeCard.name}
              </h2>
            </div>

            {/* Interactive Controls */}
            <div className="flex flex-row gap-3 w-full justify-center">
              {(Object.keys(ACTION_LABELS) as CardAction[]).map((action) => {
                const meta = ACTION_LABELS[action];
                return (
                  <button
                    key={action}
                    onClick={() => handleAnswer(action)}
                    className="clay-button flex-1 flex flex-col items-center justify-center gap-1 bg-surface-container-lowest text-on-surface p-3 rounded-2xl border-2 border-outline-variant border-b-[6px] hover:bg-surface-container focus:outline-none h-[100px]"
                  >
                    <div
                      className={`w-10 h-10 rounded-full ${meta.container} ${meta.text} flex items-center justify-center`}
                    >
                      <span
                        className="material-symbols-outlined text-[24px]"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        {meta.icon}
                      </span>
                    </div>
                    <span className="font-label-md text-label-md">{meta.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Game Finished Overlay */}
      {gameFinished && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-on-surface/60 backdrop-blur-sm p-4">
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
              Completaste las {totalCards} tarjetas de reflexión.
            </p>
            <div className="bg-surface-container-highest rounded-2xl px-6 py-4">
              <p className="font-label-md text-label-md text-on-surface-variant">Puntaje</p>
              <p className="font-headline-lg text-headline-lg text-primary">
                {score} / {totalCards} · {percentage}%
              </p>
            </div>
            <button
              onClick={() => navigate(`/semana/${semanaId}`)}
              className="clay-button bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 w-full"
            >
              Volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
