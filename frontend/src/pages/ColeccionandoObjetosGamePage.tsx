import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameItem {
  id: string;
  emoji: string;
  label: string;

  // Posición para computadora
  desktopStyle: React.CSSProperties;

  // Posición para tablet
  tabletStyle: React.CSSProperties;

  // Posición para celular
  mobileStyle: React.CSSProperties;
}

interface Round {
  id: string;
  name: string;
  question: string;
  celebration: string;
}

interface Sparkle {
  id: number;
  x: number;
  y: number;
  emoji: string;
}

interface WrongIndicator {
  id: number;
  x: number;
  y: number;
}


// OBJETOS DEL JUEGO
// ─────────────────────────────────────────────────────────────────────────────
 
// Cada objeto tiene una posición diferente dependiendo
 // del tamaño de pantalla:
 //
 // - desktopStyle → computadora
 // - tabletStyle  → tablet
 // - mobileStyle  → celular

const items: GameItem[] = [
  {
    id: 'mochila',
    emoji: '🎒',
    label: 'Mochila',

    desktopStyle: {
      top: '25%',
      left: '8%',
      width: '15%',
      height: '25%',
    },

    tabletStyle: {
      top: '27%',
      left: '5%',
      width: '19%',
      height: '24%',
    },

    mobileStyle: {
      top: '29%',
      left: '5%',
      width: '27%',
      height: '18%',
    },
  },

  {
    id: 'libros',
    emoji: '📚',
    label: 'Libros',

    desktopStyle: {
      top: '35%',
      left: '25%',
      width: '13%',
      height: '18%',
    },

    tabletStyle: {
      top: '37%',
      left: '26%',
      width: '17%',
      height: '18%',
    },

    mobileStyle: {
      top: '30%',
      left: '38%',
      width: '25%',
      height: '18%',
    },
  },

  {
    id: 'papel',
    emoji: '📄',
    label: 'Hoja de papel',

    desktopStyle: {
      top: '32%',
      left: '61%',
      width: '10%',
      height: '16%',
    },

    tabletStyle: {
      top: '34%',
      left: '62%',
      width: '14%',
      height: '17%',
    },

    mobileStyle: {
      top: '48%',
      left: '8%',
      width: '25%',
      height: '17%',
    },
  },

  {
    id: 'cuaderno',
    emoji: '📓',
    label: 'Cuaderno',

    desktopStyle: {
      top: '25%',
      left: '74%',
      width: '10%',
      height: '20%',
    },

    tabletStyle: {
      top: '27%',
      left: '77%',
      width: '14%',
      height: '20%',
    },

    mobileStyle: {
      top: '49%',
      left: '38%',
      width: '25%',
      height: '18%',
    },
  },

  {
    id: 'lapiz',
    emoji: '✏️',
    label: 'Lápiz',

    desktopStyle: {
      top: '58%',
      left: '80%',
      width: '12%',
      height: '18%',
    },

    tabletStyle: {
      top: '58%',
      left: '78%',
      width: '16%',
      height: '18%',
    },

    mobileStyle: {
      top: '69%',
      left: '65%',
      width: '27%',
      height: '18%',
    },
  },
];

// ORDEN DE LAS RONDAS
// ─────────────────────────────────────────────────────────────────────────────

// IMPORTANTE:
// Siempre será: 1. Mochila 2. Libros 3. Papel 4. Cuaderno 5. Lápiz

const BASE_ROUNDS: Round[] = [
  {
    id: 'mochila',
    name: 'la mochila',
    question: '¿Dónde está la mochila?',
    celebration: '¡Muy bien! ¡Encontraste la mochila! 🎒',
  },

  {
    id: 'libros',
    name: 'los libros',
    question: '¿Dónde están los libros?',
    celebration: '¡Excelente! ¡Son los libros! 📚',
  },

  {
    id: 'papel',
    name: 'la hoja de papel',
    question: '¿Dónde está la hoja de papel?',
    celebration: '¡Genial! ¡Encontraste el papel! 📄',
  },

  {
    id: 'cuaderno',
    name: 'el cuaderno',
    question: '¿Dónde está el cuaderno?',
    celebration: '¡Súper! ¡Ese es el cuaderno! 📓',
  },

  {
    id: 'lapiz',
    name: 'el lápiz',
    question: '¿Dónde está el lápiz?',
    celebration: '¡Fantástico! ¡Encontraste el lápiz! ✏️',
  },
];

const confettiEmojis = ['⭐', '🎊', '🎉', '✨'];

export default function ColeccionandoObjetos() {
  const navigate = useNavigate();

  // ESTADOS
  // ─────────────────────────────────────────────────────────────────────────────

  // Las rondas mantienen SIEMPRE el orden de BASE_ROUNDS
  const [rounds, setRounds] = useState<Round[]>(BASE_ROUNDS);

  // Ronda actual
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);

  // Objetos encontrados
  const [foundObjects, setFoundObjects] = useState<Set<string>>(
    new Set()
  );

  // Evita que se pueda hacer clic mientras aparece
  // la celebración de una respuesta correcta
  const [isProcessing, setIsProcessing] = useState(false);

  // Indica si terminó todo el juego
  const [gameWon, setGameWon] = useState(false);

  // Mostrar/ocultar globo
  const [showSpeech, setShowSpeech] = useState(true);

  // Texto del globo
  const [speechText, setSpeechText] = useState(
    `¡Hola! ${BASE_ROUNDS[0].question}`
  );

  // Tipo de mensaje
  const [speechType, setSpeechType] = useState<
    'normal' | 'success' | 'error' | 'win'
  >('normal');

  // Destellos
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);

  // Indicadores
  const [wrongIndicators, setWrongIndicators] = useState<
    WrongIndicator[]
  >([]);

  // Objeto que está haciendo la animación de error
  const [shakingItem, setShakingItem] = useState<string | null>(
    null
  );

   // REFERENCIAS
   // ─────────────────────────────────────────────────────────────────────────────

  const gameContainerRef = useRef<HTMLDivElement>(null);

  const sparkleIdRef = useRef(0);

  const wrongIdRef = useRef(0);

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

   // RONDA ACTUAL
   // ─────────────────────────────────────────────────────────────────────────────

  const currentRound = rounds[currentRoundIndex];

  // LIMPIAR TIMEOUTS
 // ─────────────────────────────────────────────────────────────────────────────

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => {
      clearTimeout(timeout);
    });

    timeoutRefs.current = [];
  };

   // CREAR DESTELLOS
   // ─────────────────────────────────────────────────────────────────────────────

  const createSparkles = useCallback(
    (x: number, y: number) => {
      const newSparkles: Sparkle[] = [];

      for (let i = 0; i < 8; i++) {
        newSparkles.push({
          id: sparkleIdRef.current++,

          x: x + (Math.random() * 10 - 5),

          y: y + (Math.random() * 10 - 5),

          emoji: '✨',
        });
      }

      setSparkles((previous) => [
        ...previous, ...newSparkles,
      ]);

      const timeout = setTimeout(() => {
        setSparkles((previous) =>
          previous.filter(
            (sparkle) =>
              !newSparkles.some(
                (newSparkle) =>
                  newSparkle.id === sparkle.id
              )
          )
        );
      }, 900);

      timeoutRefs.current.push(timeout);
    },
    []
 );

// FEEDBACK DE RESPUESTA INCORRECTA
// ─────────────────────────────────────────────────────────────────────────────

  const showWrongFeedback = useCallback(
    (x: number, y: number, itemId: string) => {
      const newId = wrongIdRef.current++;

      setWrongIndicators((previous) => [
        ...previous,
        {
          id: newId,
          x,
          y,
        },
      ]);

      setShakingItem(itemId);

      setSpeechText('¡Ups! Inténtalo otra vez.');

      setSpeechType('error');

      setShowSpeech(true);

      const timeout = setTimeout(() => {
        setWrongIndicators((previous) =>
          previous.filter(
            (indicator) => indicator.id !== newId
          )
        );

        setShakingItem(null);

        // MUY IMPORTANTE:Después del error volvemos a mostrar la pregunta de la ronda ACTUAL.
        
        setSpeechText(currentRound.question);

        setSpeechType('normal');
      }, 3200);

      timeoutRefs.current.push(timeout);
    },
    [currentRound]
  );

   // CLICK EN UN OBJETO
   // ─────────────────────────────────────────────────────────────────────────────

  const handleItemClick = (
    item: GameItem,
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    if (isProcessing || gameWon) {
      return;
    }

    const rect =
      event.currentTarget.getBoundingClientRect();

    const gameRect =
      gameContainerRef.current?.getBoundingClientRect();

    if (!gameRect) {
      return;
    }

    // Calculamos la posición del objeto dentro del escenario.

    const x =
      ((rect.left + rect.width / 2 - gameRect.left) /
        gameRect.width) *
      100;

    const y =
      ((rect.top + rect.height / 2 - gameRect.top) /
        gameRect.height) *
      100;

  
   //  OBJETO INCORRECTO
   // ─────────────────────────────────────────────────────────────────────────────
  

    if (item.id !== currentRound.id) {
      showWrongFeedback(x, y, item.id);

      return;
    }

  // OBJETO CORRECTO
  // ─────────────────────────────────────────────────────────────────────────────

    setIsProcessing(true);

    createSparkles(x, y);

    setFoundObjects((previous) => {
      const updated = new Set(previous);

      updated.add(item.id);

      return updated;
    });

    //Mostrar felicitación

    setSpeechText(currentRound.celebration);

    setSpeechType('success');

    setShowSpeech(true);

    // Comprobamos si es la última ronda

    const isLastRound =
      currentRoundIndex === rounds.length - 1;

    const timeout = setTimeout(() => {
      if (isLastRound) {
  
  // JUEGO TERMINADO
  // ─────────────────────────────────────────────────────────────────────────────

        setGameWon(true);

        setSpeechText(
          '¡Completaste todas las rondas! 🎉'
        );

        setSpeechType('win');

        setShowSpeech(true);
      } else {
   
  // SIGUIENTE RONDA
  // ─────────────────────────────────────────────────────────────────────────────

        const nextRoundIndex =
          currentRoundIndex + 1;

        setCurrentRoundIndex(nextRoundIndex);

        // Como las rondas NO se mezclan, aquí siempre coincide la pregunta con el siguiente objeto.

        setSpeechText(
          rounds[nextRoundIndex].question
        );

        setSpeechType('normal');

        setShowSpeech(true);
      }

      setIsProcessing(false);
    }, 3500);

    timeoutRefs.current.push(timeout);
  };

   // REINICIAR JUEGO
   // ─────────────────────────────────────────────────────────────────────────────

  const handleRestart = () => {
    clearAllTimeouts();

     // Volvemos al orden original. 1. Mochila 2. Libros 3. Papel 4.Cuaderno 5.Lápiz

    setRounds(BASE_ROUNDS);

    setCurrentRoundIndex(0);

    setFoundObjects(new Set());

    setIsProcessing(false);

    setGameWon(false);

    setShowSpeech(true);

  // La primera pregunta siempre será la de la mochila.

    setSpeechText(
      `¡Hola! ${BASE_ROUNDS[0].question}`
    );

    setSpeechType('normal');

    setSparkles([]);

    setWrongIndicators([]);

    setShakingItem(null);

  // Eliminar confeti anterior

    const particles =
      gameContainerRef.current?.querySelectorAll(
        '.particle'
      );

    particles?.forEach((particle) =>
      particle.remove()
    );
  };

   // SALIR
   // ─────────────────────────────────────────────────────────────────────────────

  const handleExit = () => {
    navigate('/semana/2');
  };

   // CREAR CONFETI
   // ─────────────────────────────────────────────────────────────────────────────

  const createConfetti = useCallback(() => {
    const container =
      gameContainerRef.current;

    if (!container) {
      return;
    }

    for (let i = 0; i < 50; i++) {
      const particle =
        document.createElement('div');

      particle.className = 'particle';

      particle.textContent =
        confettiEmojis[
          Math.floor(
            Math.random() *
              confettiEmojis.length
          )
        ];

      particle.style.position = 'absolute';

      particle.style.left =
        `${Math.random() * 100}%`;

      particle.style.top = '-5%';

      particle.style.fontSize =
        `${1.2 + Math.random() * 1.5}rem`;

      particle.style.animation =
        `fall ${
          2 + Math.random() * 3
        }s linear forwards`;

      particle.style.animationDelay =
        `${Math.random() * 1.5}s`;

      particle.style.zIndex = '60';

      container.appendChild(particle);
    }
  }, []);

   // CUANDO TERMINA EL JUEGO
   // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (gameWon) {
      createConfetti();
    }
  }, [gameWon, createConfetti]);

  // LIMPIEZA
  // ─────────────────────────────────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // RENDER
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div
      className="
        min-h-screen
        w-full

        bg-pink-100

        p-2
        sm:p-4
        md:p-6

        flex
        items-center
        justify-center
      "
    >
      <div
        ref={gameContainerRef}
        className={`
          relative

          w-full
          max-w-[1376px]

          /* =========================
             COMPUTADORA
             ========================= */

          aspect-[1376/768]

          /* =========================
             CELULAR
             ========================= */

          max-md:aspect-auto
          max-md:h-[78vh]
          max-md:min-h-[560px]
          max-md:max-h-[760px]

          /* =========================
             TABLET
             ========================= */

          md:max-lg:aspect-auto
          md:max-lg:h-[75vh]
          md:max-lg:min-h-[600px]

          /* =========================
             FONDO
             ========================= */

          bg-cover
          bg-center

          overflow-hidden

          rounded-2xl
          md:rounded-3xl

          shadow-2xl

          border-4
          md:border-8

          border-purple-300

          mx-auto

          ${gameWon
            ? 'animate-bounce-happy'
            : ''
          }
        `}
        style={{
          backgroundImage:
            "url('/images/hosted/d99f9a9740ec.webp')",
        }}
      >

        {/* =================================================
            TÍTULO
        ================================================= */}

        <div
          className="
            absolute

            top-[3%]
            left-0

            w-full

            text-center

            z-40

            pointer-events-none

            px-2
          "
        >
          <h1
            className="
              font-bold

              text-white

              text-xl
              sm:text-2xl
              md:text-4xl
              lg:text-5xl

              drop-shadow-[3px_3px_0px_#7c3aed]
            "
          >
            Coleccionando objetos
          </h1>
        </div>

        {/* =================================================
            CONTADOR DE RONDA
        ================================================= */}

        <div
          className="
            absolute

            top-[4%]
            right-[3%]

            z-50

            bg-white/90

            rounded-full

            px-3
            py-1

            md:px-5
            md:py-2

            shadow-lg
          "
        >
          <span
            className="
              font-bold

              text-purple-700

              text-xs
              sm:text-sm
              md:text-lg
            "
          >
            Ronda {currentRoundIndex + 1} de{' '}
            {rounds.length}
          </span>
        </div>

        {/* =================================================
            GLOBO DE DIÁLOGO
        ================================================= */}

        {showSpeech && (
          <div
            className={`
              absolute

              z-45

              left-1/2
              -translate-x-1/2

              /* =========================
                 COMPUTADORA
                 ========================= */

              top-[20%]

              w-[30%]

              max-w-[320px]

              /* =========================
                 TABLET
                 ========================= */

              md:max-lg:top-[18%]

              md:max-lg:w-[38%]

              /* =========================
                 CELULAR
                 ========================= */

              max-md:top-[14%]

              max-md:w-[72%]

              max-md:max-w-[360px]

              /* =========================
                 ESPACIADO
                 ========================= */

              px-4
              py-3

              md:px-5
              md:py-4

              rounded-2xl
              md:rounded-3xl

              border-4

              shadow-xl

              text-center

              ${
                speechType === 'error'
                  ? 'bg-red-100 border-red-400 text-red-700'
                  : speechType === 'success'
                  ? 'bg-green-100 border-green-400 text-green-700'
                  : speechType === 'win'
                  ? 'bg-purple-100 border-purple-400 text-purple-700'
                  : 'bg-white border-purple-300 text-purple-800'
              }
            `}
          >
            <p
              className="
                font-bold

                text-xs
                sm:text-sm
                md:text-base
                lg:text-lg

                leading-snug
              "
            >
              {speechText}
            </p>
          </div>
        )}

        {/* =================================================
            OBJETOS
        ================================================= */}

        {items.map((item) => {
          const isCollected =
            foundObjects.has(item.id);

          const responsiveClasses = `
            absolute

            z-35

            flex
            items-center
            justify-center

            rounded-[24%]

            cursor-pointer

            transition-all
            duration-300

            hover:scale-110
            focus:scale-110

            focus:outline-none
          `;

          return (
            <button
              key={item.id}
              type="button"
              aria-label={item.label}
              disabled={
                isCollected ||
                isProcessing
              }
              onClick={(event) =>
                handleItemClick(
                  item,
                  event
                )
              }
              className={`
                ${responsiveClasses}

                ${
                  shakingItem === item.id
                    ? 'animate-shake'
                    : ''
                }

                ${
                  isCollected
                    ? 'opacity-100 scale-110'
                    : ''
                }
              `}
              style={{
              // Posición de computadora
                ...item.desktopStyle,

              // Variables para tablet
              
                '--tablet-top':
                  item.tabletStyle.top,

                '--tablet-left':
                  item.tabletStyle.left,

                '--tablet-width':
                  item.tabletStyle.width,

                '--tablet-height':
                  item.tabletStyle.height,

                // Variables para celular

                '--mobile-top':
                  item.mobileStyle.top,

                '--mobile-left':
                  item.mobileStyle.left,

                '--mobile-width':
                  item.mobileStyle.width,

                '--mobile-height':
                  item.mobileStyle.height,
              } as React.CSSProperties}
            >
              <span
                className={`
                  text-[clamp(2rem,5vw,5rem)]

                  select-none

                  transition-all
                  duration-500

                  ${
                    isCollected
                      ? 'drop-shadow-[0_0_12px_rgba(255,255,255,0.9)]'
                      : 'brightness-0 drop-shadow-[0_0_8px_rgba(124,58,237,0.7)]'
                  }
                `}
              >
                {item.emoji}
              </span>
            </button>
          );
        })}

        {/* =================================================
            DESTELLOS
        ================================================= */}

        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="
              absolute

              z-50

              pointer-events-none

              text-xl
              md:text-3xl

              animate-sparkle
            "
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,

              transform:
                'translate(-50%, -50%)',
            }}
          >
            {sparkle.emoji}
          </div>
        ))}

        {/* =================================================
            INDICADOR DE ERROR
        ================================================= */}

        {wrongIndicators.map(
          (indicator) => (
            <div
              key={indicator.id}
              className="
                absolute

                z-50

                pointer-events-none

                text-3xl
                md:text-5xl

                font-bold

                animate-float-up
              "
              style={{
                left: `${indicator.x}%`,
                top: `${indicator.y}%`,

                transform:
                  'translate(-50%, -50%)',
              }}
            >
              ❌
            </div>
          )
        )}

        {/* =================================================
            MODAL FINAL
        ================================================= */}

        {gameWon && (
          <div
            className="
              absolute

              inset-0

              z-[70]

              flex
              items-center
              justify-center

              bg-purple-900/40

              backdrop-blur-sm

              p-4
            "
          >
            <div
              className="
                w-full

                max-w-[520px]

                rounded-3xl

                bg-gradient-to-br
                from-purple-500
                to-pink-500

                p-5
                sm:p-7
                md:p-10

                text-center

                shadow-2xl

                border-4
                border-white
              "
            >
              <div
                className="
                  text-5xl
                  md:text-7xl

                  mb-3
                "
              >
                🎉
              </div>

              <h2
                className="
                  text-white

                  font-bold

                  text-2xl
                  sm:text-3xl
                  md:text-4xl

                  mb-4
                "
              >
                ¡Muy bien!
              </h2>

              <p
                className="
                  text-white

                  font-semibold

                  text-sm
                  sm:text-base
                  md:text-lg

                  mb-7
                "
              >
                ¡Completaste todas las rondas
                y encontraste todos los
                objetos!
              </p>

              <div
                className="
                  flex

                  flex-col
                  sm:flex-row

                  gap-3

                  justify-center
                "
              >
                <button
                  type="button"
                  onClick={handleRestart}
                  className="
                    rounded-full

                    bg-white

                    text-purple-700

                    font-bold

                    px-6
                    py-3

                    hover:scale-105

                    transition-transform
                  "
                >
                  Volver a jugar
                </button>

                <button
                  type="button"
                  onClick={handleExit}
                  className="
                    rounded-full

                    bg-purple-900

                    text-white

                    font-bold

                    px-6
                    py-3

                    hover:scale-105

                    transition-transform
                  "
                >
                  Salir
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* =====================================================
          ANIMACIONES
      ===================================================== */}

      <style>{`
        @keyframes sparkle {
          0% {
            transform:
              translate(-50%, -50%)
              scale(0);

            opacity: 0;
          }

          50% {
            transform:
              translate(-50%, -50%)
              scale(1.4);

            opacity: 1;
          }

          100% {
            transform:
              translate(-50%, -50%)
              scale(0);

            opacity: 0;
          }
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }

          20% {
            transform: translateX(-8px);
          }

          40% {
            transform: translateX(8px);
          }

          60% {
            transform: translateX(-6px);
          }

          80% {
            transform: translateX(6px);
          }
        }

        @keyframes floatUp {
          0% {
            opacity: 1;

            transform:
              translate(-50%, -50%)
              translateY(0);
          }

          100% {
            opacity: 0;

            transform:
              translate(-50%, -50%)
              translateY(-60px);
          }
        }

        @keyframes fall {
          from {
            transform:
              translateY(-20px)
              rotate(0deg);
          }

          to {
            transform:
              translateY(900px)
              rotate(360deg);
          }
        }

        @keyframes bounceHappy {
          0%, 100% {
            transform: scale(1);
          }

          50% {
            transform: scale(1.015);
          }
        }

        .animate-sparkle {
          animation:
            sparkle
            0.9s
            ease-out
            forwards;
        }

        .animate-shake {
          animation:
            shake
            0.45s
            ease-in-out;
        }

        .animate-float-up {
          animation:
            floatUp
            1.2s
            ease-out
            forwards;
        }

        .animate-bounce-happy {
          animation:
            bounceHappy
            0.8s
            ease-in-out
            2;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration:
              0.01ms !important;

            animation-iteration-count:
              1 !important;

            transition-duration:
              0.01ms !important;
          }
        }
      `}</style>

      {/* =====================================================
          RESPONSIVE DE OBJETOS
      ===================================================== */}

      <style>{`
        /*
         * ===================================================
         * TABLET
         * 768px - 1023px
         * ===================================================
         */

        @media (min-width: 768px) and (max-width: 1023px) {
          button[aria-label="Mochila"] {
            top: var(--tablet-top) !important;
            left: var(--tablet-left) !important;
            width: var(--tablet-width) !important;
            height: var(--tablet-height) !important;
          }

          button[aria-label="Libros"] {
            top: var(--tablet-top) !important;
            left: var(--tablet-left) !important;
            width: var(--tablet-width) !important;
            height: var(--tablet-height) !important;
          }

          button[aria-label="Hoja de papel"] {
            top: var(--tablet-top) !important;
            left: var(--tablet-left) !important;
            width: var(--tablet-width) !important;
            height: var(--tablet-height) !important;
          }

          button[aria-label="Cuaderno"] {
            top: var(--tablet-top) !important;
            left: var(--tablet-left) !important;
            width: var(--tablet-width) !important;
            height: var(--tablet-height) !important;
          }

          button[aria-label="Lápiz"] {
            top: var(--tablet-top) !important;
            left: var(--tablet-left) !important;
            width: var(--tablet-width) !important;
            height: var(--tablet-height) !important;
          }
        }

        /*
         * ===================================================
         * CELULAR
         * Menos de 768px
         * ===================================================
         */

        @media (max-width: 767px) {
          button[aria-label="Mochila"] {
            top: var(--mobile-top) !important;
            left: var(--mobile-left) !important;
            width: var(--mobile-width) !important;
            height: var(--mobile-height) !important;
          }

          button[aria-label="Libros"] {
            top: var(--mobile-top) !important;
            left: var(--mobile-left) !important;
            width: var(--mobile-width) !important;
            height: var(--mobile-height) !important;
          }

          button[aria-label="Hoja de papel"] {
            top: var(--mobile-top) !important;
            left: var(--mobile-left) !important;
            width: var(--mobile-width) !important;
            height: var(--mobile-height) !important;
          }

          button[aria-label="Cuaderno"] {
            top: var(--mobile-top) !important;
            left: var(--mobile-left) !important;
            width: var(--mobile-width) !important;
            height: var(--mobile-height) !important;
          }

          button[aria-label="Lápiz"] {
            top: var(--mobile-top) !important;
            left: var(--mobile-left) !important;
            width: var(--mobile-width) !important;
            height: var(--mobile-height) !important;
          }
        }
      `}</style>
    </div>
  );
}




