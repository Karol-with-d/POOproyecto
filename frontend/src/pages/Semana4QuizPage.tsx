import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Semana4QuizPage — Desafío Final de la Semana 4: Propiedades Químicas.
 *
 * Presenta un quiz interactivo de 10 preguntas verdadero/falso (las 5 originales + 5 nuevas),
 * con retroalimentación inmediata, barra de progreso y tarjeta de resultados finales.
 */
export default function Semana4QuizPage() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const questions = [
    {
      text: 'La oxidación es un cambio químico que puede cambiar el color de las frutas.',
      ans: true,
      icon: 'apple',
      msg: '¡Correcto! El oxígeno reacciona con las enzimas de la fruta.',
    },
    {
      text: 'La fermentación es el proceso químico que hace que la masa del pan crezca.',
      ans: true,
      icon: 'bakery_dining',
      msg: '¡Exacto! Las levaduras liberan CO₂ que hace que la masa se infle.',
    },
    {
      text: 'Los ácidos son suaves y resbaladizos al tacto como el jabón.',
      ans: false,
      icon: 'soap',
      msg: '¡Falso! Esas son las Bases. Los ácidos suelen ser agrios y punzantes.',
    },
    {
      text: 'La combustión es una reacción química que libera energía en forma de luz y calor.',
      ans: true,
      icon: 'local_fire_department',
      msg: '¡Así es! Es una reacción rápida con el oxígeno.',
    },
    {
      text: 'La quimioluminiscencia permite a seres vivos como las luciérnagas producir su propia luz.',
      ans: true,
      icon: 'auto_awesome',
      msg: '¡Increíble! Como las luciérnagas o algunas medusas.',
    },
    {
      text: 'Los metales como el hierro se pueden oxidar si se mojan y se dejan al aire libre.',
      ans: true,
      icon: 'construction',
      msg: '¡Correcto! El metal reacciona con el oxígeno y el agua, formando óxido rojizo.',
    },
    {
      text: 'El vinagre y el jugo de limón son ejemplos de sustancias básicas.',
      ans: false,
      icon: 'nutrition',
      msg: '¡Falso! El vinagre y el limón son ácidos, por eso tienen ese sabor tan agrio.',
    },
    {
      text: 'Al quemar un papel en la combustión, podemos volver a convertir las cenizas resultantes en papel.',
      ans: false,
      icon: 'delete_forever',
      msg: '¡Muy bien! La combustión es un cambio irreversible: las cenizas no pueden volver a ser papel.',
    },
    {
      text: 'Las barras luminosas necesitan pilas o electricidad para poder brillar en la oscuridad.',
      ans: false,
      icon: 'bolt',
      msg: '¡Correcto! Brilla solo gracias a una reacción química, sin usar electricidad ni generar calor.',
    },
    {
      text: 'La levadura es un ser vivo microscópico que ayuda a fermentar los alimentos.',
      ans: true,
      icon: 'biotech',
      msg: '¡Excelente! La levadura es un hongo unicelular vivo que ayuda a fermentar los alimentos.',
    },
  ];

  const totalQuestions = questions.length;
  const currentQ = questions[currentIdx];

  const handleAnswer = (choice: boolean) => {
    if (showFeedback) return;
    setSelectedAnswer(choice);
    setShowFeedback(true);
    if (choice === currentQ.ans) {
      setScore((prev) => prev + 1);
    }
  };

  const nextQuestion = () => {
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const handleFinish = () => {
    navigate('/semana/4');
  };

  return (
    <div className="bg-[#faf9f5] text-[#1a1c1a] min-h-screen flex flex-col items-center font-body-md relative overflow-x-hidden selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quicksand-text {
          font-family: 'Quicksand', sans-serif;
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .lab-bg-icon {
          opacity: 0.04;
          pointer-events: none;
          position: absolute;
          z-index: 0;
          color: #4a6549;
        }
        .quiz-card {
          transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .button-press:active {
          transform: scale(0.95);
        }
        .liquid-progress {
          position: relative;
          overflow: hidden;
        }
        .liquid-progress::after {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: wave 2s infinite;
        }
        @keyframes wave {
          100% { left: 100%; }
        }
        .floating {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      {/* Background Decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <span className="material-symbols-outlined lab-bg-icon text-[120px] top-20 left-10 rotate-12">science</span>
        <span className="material-symbols-outlined lab-bg-icon text-[150px] bottom-40 right-10 -rotate-12">eco</span>
        <span className="material-symbols-outlined lab-bg-icon text-[80px] top-1/2 left-[15%]">experiment</span>
        <span className="material-symbols-outlined lab-bg-icon text-[100px] top-1/3 right-[20%] rotate-45">biotech</span>
        <span className="material-symbols-outlined lab-bg-icon text-[90px] bottom-20 left-1/4">opacity</span>
      </div>

      {/* TopAppBar */}
      <header className="sticky top-0 w-full z-50 flex justify-between items-center px-margin-mobile md:px-margin-desktop py-4 bg-[#faf9f5] shadow-[0_4px_15px_rgba(74,101,73,0.08)]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/semana/4')}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-[0.98] text-primary"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-primary quicksand-text">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow w-full max-w-[800px] px-margin-mobile md:px-0 pt-12 pb-40 relative z-10">
        {!quizFinished ? (
          <>
            {/* Progress Indicator */}
            <div className="mb-stack-lg space-y-2">
              <div className="flex justify-between items-end">
                <span className="font-label-lg text-primary uppercase tracking-wider quicksand-text">Desafío Final</span>
                <span className="font-headline-md text-primary quicksand-text">
                  Pregunta {currentIdx + 1} de {totalQuestions}
                </span>
              </div>
              <div className="h-4 w-full bg-surface-container rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full bg-primary liquid-progress transition-all duration-500 rounded-full"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Quiz Container */}
            <div className="relative min-h-[400px]">
              {/* Active Question Card */}
              <div className="quiz-card bg-white rounded-[24px] p-8 md:p-12 shadow-[0_15px_30px_rgba(74,101,73,0.12)] border-2 border-surface-container-high flex flex-col items-center text-center space-y-6">
                <div className="w-24 h-24 bg-primary-container/10 rounded-full flex items-center justify-center floating">
                  <span className="material-symbols-outlined text-primary text-[48px]">{currentQ.icon}</span>
                </div>
                <h2 className="font-headline-md text-on-surface px-4 min-h-[72px] flex items-center justify-center quicksand-text">
                  {currentQ.text}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-6">
                  <button
                    onClick={() => handleAnswer(true)}
                    className="group relative overflow-hidden bg-primary text-white rounded-[24px] py-6 px-8 flex flex-col items-center gap-2 shadow-[0_8px_0_#2a3f29] active:shadow-none active:translate-y-2 transition-all duration-100 button-press"
                  >
                    <span
                      className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      check_circle
                    </span>
                    <span className="font-headline-md quicksand-text">Verdadero</span>
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className="group relative overflow-hidden bg-surface-container-high text-on-surface-variant rounded-[24px] py-6 px-8 flex flex-col items-center gap-2 border-2 border-outline-variant shadow-[0_8px_0_#c3c8be] active:shadow-none active:translate-y-2 transition-all duration-100 button-press"
                  >
                    <span className="material-symbols-outlined text-[32px] group-hover:scale-110 transition-transform">
                      cancel
                    </span>
                    <span className="font-headline-md quicksand-text">Falso</span>
                  </button>
                </div>
              </div>

              {/* Feedback Overlay */}
              {showFeedback && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center rounded-[24px]">
                  <div
                    className={`w-32 h-32 rounded-full mb-6 flex items-center justify-center text-[64px] ${
                      selectedAnswer === currentQ.ans
                        ? 'bg-primary/20 text-primary'
                        : 'bg-error/20 text-error'
                    }`}
                  >
                    <span
                      className="material-symbols-outlined text-[64px]"
                      style={{ fontVariationSettings: selectedAnswer === currentQ.ans ? '"FILL" 1' : undefined }}
                    >
                      {selectedAnswer === currentQ.ans ? 'verified' : 'sentiment_dissatisfied'}
                    </span>
                  </div>
                  <h3
                    className={`font-headline-lg mb-2 quicksand-text ${
                      selectedAnswer === currentQ.ans ? 'text-primary' : 'text-error'
                    }`}
                  >
                    {selectedAnswer === currentQ.ans ? '¡Excelente!' : '¡Casi!'}
                  </h3>
                  <p className="font-body-lg text-on-surface-variant max-w-md mb-8">
                    {selectedAnswer === currentQ.ans
                      ? currentQ.msg
                      : `No te preocupes, ¡aprender es parte del proceso! ${currentQ.msg}`}
                  </p>
                  <button
                    className="bg-primary text-white font-label-lg px-8 py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all quicksand-text"
                    onClick={nextQuestion}
                  >
                    Continuar
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* Results Card */
          <div className="quiz-card bg-white rounded-[24px] p-8 md:p-12 shadow-[0_15px_30px_rgba(74,101,73,0.12)] border-2 border-surface-container-high flex flex-col items-center text-center space-y-6">
            <div className="w-24 h-24 bg-primary-container/10 rounded-full flex items-center justify-center floating">
              <span className="material-symbols-outlined text-primary text-[48px]">workspace_premium</span>
            </div>
            <div className="space-y-2">
              <h2 className="font-headline-lg text-primary quicksand-text">¡Felicidades, joven científico!</h2>
              <p className="font-body-lg text-on-surface-variant">
                Has completado el desafío de Propiedades Químicas.
              </p>
            </div>
            <div className="bg-surface-container rounded-xl p-6 w-full max-w-xs">
              <span className="font-label-lg uppercase tracking-widest text-on-surface-variant quicksand-text">
                Tu calificación
              </span>
              <div className="text-[48px] font-bold text-primary quicksand-text">
                {score}/{totalQuestions}
              </div>
            </div>
            <p className="font-body-md text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
              Tu resultado se ha guardado con éxito
            </p>
            <button
              onClick={handleFinish}
              className="w-full bg-primary text-white font-label-lg py-4 rounded-full shadow-[0_8px_0_#2a3f29] active:shadow-none active:translate-y-2 transition-all duration-100 button-press quicksand-text"
            >
              Finalizar Laboratorio
            </button>
          </div>
        )}
      </main>

      {/* BottomNavBar */}
      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-between items-center px-margin-mobile py-4 md:px-margin-desktop bg-[#efeeea] dark:bg-surface-container-high shadow-[0_-4px_15px_rgba(74,101,73,0.08)] rounded-t-xl">
        <button
          onClick={() => navigate('/semana/4')}
          className="flex flex-row items-center justify-center text-on-surface-variant dark:text-outline-variant px-6 py-2 hover:bg-surface-variant dark:hover:bg-tertiary-container rounded-full transition-all active:scale-[0.95]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-label-lg text-label-lg quicksand-text">Volver</span>
        </button>
        {/* Siguiente fallback button (only visible when not finished and feedback is shown) */}
        {showFeedback && (
          <button
            onClick={nextQuestion}
            className="flex flex-row items-center justify-center bg-primary text-white rounded-full px-6 py-2 hover:opacity-90 transition-all active:scale-[0.95] shadow-md"
          >
            <span className="font-label-lg text-label-lg quicksand-text">Siguiente</span>
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        )}
      </nav>
    </div>
  );
}
