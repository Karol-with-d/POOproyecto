import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface Level {
  id: number;
  name: string;
  emoji: string;
  sound: string;
  options: string[];
}

const baseLevels: Level[] = [
  { id: 1, name: 'Carro', emoji: '🚗', sound: '¡Brum, brum! ¡Pi-píii!', options: ['Carro', 'Avión', 'Tren', 'Bicicleta'] },
  { id: 2, name: 'Pato', emoji: '🦆', sound: '¡Cua, cua, cua!', options: ['Pollito', 'Pato', 'Pajarito', 'Rana'] },
  { id: 3, name: 'Gato', emoji: '🐱', sound: '¡Miau, miau! ¡Prrr!', options: ['Perro', 'León', 'Gato', 'Conejo'] },
  { id: 4, name: 'Reloj', emoji: '⏰', sound: '¡Tic-tac, tic-tac!', options: ['Reloj', 'Brújula', 'Teléfono', 'Calculadora'] },
  { id: 5, name: 'Manzana', emoji: '🍎', sound: '¡Chomp, crunch! (Sonido de mordisco)', options: ['Pera', 'Naranja', 'Plátano', 'Manzana'] },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createSparkles(container: HTMLElement) {
  const colors = ['#f8ddd2', '#d8e7cc', '#d2e5f6', '#f5dacf'];
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle absolute';
    sparkle.innerHTML = '<span class="material-symbols-outlined">auto_awesome</span>';
    (sparkle.querySelector('span') as HTMLElement).style.color = colors[Math.floor(Math.random() * colors.length)];
    (sparkle.querySelector('span') as HTMLElement).style.fontSize = `${20 + Math.random() * 20}px`;

    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;

    sparkle.style.left = `calc(50% - 12px + ${tx}px)`;
    sparkle.style.top = `calc(50% - 12px + ${ty}px)`;
    sparkle.style.animationDelay = `${Math.random() * 0.2}s`;

    container.appendChild(sparkle);
  }
}

export default function CajaMisteriosaGamePage() {
  const navigate = useNavigate();
  const [levels, setLevels] = useState<Level[]>([]);
  const [levelIndex, setLevelIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [currentPoints, setCurrentPoints] = useState(10);
  const [silhouetteVisible, setSilhouetteVisible] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [wrongAnswers, setWrongAnswers] = useState<string[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [wrongClicked, setWrongClicked] = useState<string | null>(null);
  const silhouetteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxContainerRef = useRef<HTMLDivElement>(null);

  const startGame = useCallback(() => {
    const shuffled = shuffleArray(baseLevels);
    setLevels(shuffled);
    setLevelIndex(0);
    setScore(0);
    setGameOver(false);
    setSilhouetteVisible(false);
    setWrongAnswers([]);
    setRevealed(false);
    setWrongClicked(null);
    setCurrentPoints(10);

    if (shuffled.length > 0) {
      const opts = shuffleArray([...shuffled[0].options]);
      setShuffledOptions(opts);
    }

    if (silhouetteTimeoutRef.current) {
      clearTimeout(silhouetteTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    if (levels.length > 0 && levelIndex < levels.length) {
      const opts = shuffleArray([...levels[levelIndex].options]);
      setShuffledOptions(opts);
      setCurrentPoints(10);
      setSilhouetteVisible(false);
      setWrongAnswers([]);
      setRevealed(false);
      setWrongClicked(null);
    }
  }, [levelIndex, levels]);

  const handleSilhouette = useCallback(() => {
    if (!silhouetteVisible && !revealed) {
      setSilhouetteVisible(true);
      setCurrentPoints(5);
      silhouetteTimeoutRef.current = setTimeout(() => {
        if (!revealed) {
          setSilhouetteVisible(false);
        }
      }, 8000);
    }
  }, [silhouetteVisible, revealed]);

  const handleAnswer = useCallback(
    (selected: string) => {
      if (revealed || !levels[levelIndex]) return;

      const level = levels[levelIndex];
      if (selected === level.name) {
        setScore((prev) => prev + Math.max(0, currentPoints));
        setRevealed(true);
        setSilhouetteVisible(false);

        if (boxContainerRef.current) {
          setTimeout(() => {
            createSparkles(boxContainerRef.current!);
          }, 50);
        }

        setTimeout(() => {
          setLevelIndex((prev) => {
            const next = prev + 1;
            if (next >= levels.length) {
              setGameOver(true);
            }
            return next;
          });
        }, 2000);
      } else {
        if (!wrongAnswers.includes(selected)) {
          setWrongAnswers((prev) => [...prev, selected]);
          setCurrentPoints((prev) => Math.max(0, prev - 0.5));
          setWrongClicked(selected);
          setTimeout(() => {
            setWrongClicked(null);
          }, 800);
        }
      }
    },
    [revealed, levels, levelIndex, currentPoints, wrongAnswers]
  );

  const handleExit = () => {
    navigate('/semana/2');
  };

  const level = levels[levelIndex];

  if (gameOver) {
    return (
      <div className="bg-surface-container-highest flex items-center justify-center min-h-screen overflow-hidden p-4">
        <div className="bg-surface text-on-background relative flex flex-col font-body-md overflow-hidden rounded-xl shadow-2xl w-full max-w-[1400px] min-h-[789px]">
          <div className="flex-grow flex flex-col w-full h-full relative">
            <header className="w-full px-gutter py-sm bg-surface-container shadow-sm flex justify-center items-center z-10 absolute top-0 left-0 right-0">
              <span className="font-headline-md text-headline-md text-secondary">Resultados Finales</span>
            </header>
            <main className="flex-grow flex flex-col items-center justify-center p-gutter relative w-full h-full pt-20">
              <div className="bg-surface-container-low border-4 border-secondary-fixed rounded-2xl shadow-xl p-lg lg:p-xl w-full max-w-3xl flex flex-col items-center text-center">
                <span className="material-symbols-outlined text-[80px] text-secondary mb-md">workspace_premium</span>
                <h1 className="font-display-lg text-secondary mb-sm">¡Felicidades!</h1>
                <p className="font-headline-md text-on-surface-variant mb-lg">
                  ¡Lograste {score} de 50 puntos!
                </p>

                <div className="w-full bg-surface-container-highest rounded-xl p-md mt-sm">
                  <h3 className="font-body-lg text-secondary mb-md">Tu Colección de Pegatinas</h3>
                  <div className="flex justify-center items-center gap-md flex-wrap">
                    {levels.map((l) => (
                      <div
                        key={l.id}
                        className="text-6xl bg-surface p-sm rounded-lg shadow-sm animate-pop-in drop-shadow-md"
                      >
                        {l.emoji}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-md mt-xl flex-wrap justify-center">
                  <button
                    onClick={startGame}
                    className="game-btn bg-secondary text-on-secondary rounded-full px-xl py-sm font-headline-md shadow-md hover:bg-secondary-container hover:text-on-secondary-container interact-glow"
                  >
                    Jugar de nuevo
                  </button>
                  <button
                    onClick={handleExit}
                    className="game-btn bg-surface-variant text-on-surface-variant border border-outline rounded-full px-xl py-sm font-headline-md shadow-md hover:bg-surface-container-highest interact-glow"
                  >
                    Salir
                  </button>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="bg-surface-container-highest flex items-center justify-center min-h-screen">
        <div className="text-2xl font-bold text-secondary">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="bg-surface-container-highest flex items-center justify-center min-h-screen overflow-hidden p-4">
      <div className="bg-surface text-on-background relative flex flex-col font-body-md overflow-hidden rounded-xl shadow-2xl w-full max-w-[1400px] min-h-[789px]">
        <div className="flex-grow flex flex-col w-full h-full relative">
          {/* Header */}
          <header className="w-full px-gutter py-sm bg-surface-container shadow-sm flex justify-between items-center z-10 absolute top-0 left-0 right-0 h-[72px]">
            <div className="flex items-center gap-xs">
              <span className="material-symbols-outlined text-secondary">stars</span>
              <span className="font-headline-md text-headline-md text-secondary">Puntuación: {score}</span>
            </div>
            <div className="bg-surface-container-highest px-md py-xs rounded-full shadow-sm text-secondary font-bold">
              Objeto {levelIndex + 1} de {levels.length}
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow flex flex-col items-center justify-center p-gutter relative max-w-4xl mx-auto w-full pt-[72px] pb-[200px]">
            <section className="bg-surface-container-low rounded-xl shadow-lg p-lg w-full flex flex-col items-center gap-lg relative">
              {/* Hint: Sound Bubble */}
              <div className="h-16 w-full flex items-center justify-center absolute top-4 left-0">
                <div className="bg-inverse-surface text-inverse-on-surface px-md py-xs rounded-full font-headline-md shadow-sm">
                  &quot;{level.sound}&quot;
                </div>
              </div>

              {/* Mystery Box Container */}
              <div
                ref={boxContainerRef}
                id="mystery-box-container"
                className="relative w-64 h-64 lg:w-80 lg:h-80 flex items-center justify-center mt-xl"
              >
                {revealed ? (
                  <div className="text-[120px] lg:text-[160px] animate-pop-in drop-shadow-xl z-20">
                    {level.emoji}
                  </div>
                ) : (
                  <>
                    {silhouetteVisible && (
                      <div className="absolute inset-0 z-0 flex items-center justify-center opacity-80">
                        <div className="text-[120px] lg:text-[160px] silhouette">{level.emoji}</div>
                      </div>
                    )}
                    <div
                      className={`relative z-10 animate-float ${
                        silhouetteVisible ? 'opacity-0' : 'opacity-100'
                      } transition-opacity duration-300`}
                    >
                      <img
                        alt="Caja Misteriosa"
                        className="w-64 h-64 lg:w-80 lg:h-80 object-contain drop-shadow-xl"
                        src="https://lh3.googleusercontent.com/aida/AP1WRLsjIrruft2ddAn7Qh9aGGIKv60ICrZvIG3KC1pLWksK88Gc9pGaR1IvHkJ3SsGesDG1E0kXBpJbKQpfF5djW3iuLkiUP8giskr0PNYLkQ_lmjCOtAk8-gBixtze5aJrwV5Eik243pdfWze424RlCB63T7riyvWif5NuV9ZgzMmHA3ru2YAJ-DawONkAwVt2YhQ8HIxo_b_gSRlvk0Bb-aAcMGIx5nnf7sMSkEh6TQ2-c6-xlO9j5R3bXA"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Hint Buttons */}
              <div className="flex flex-wrap justify-center gap-sm mt-md w-full">
                <button
                  onClick={handleSilhouette}
                  disabled={currentPoints <= 5 || revealed}
                  className={`game-btn bg-tertiary-container text-on-tertiary-container rounded-lg px-md py-sm font-label-caps border-tertiary shadow-sm hover:bg-tertiary-fixed interact-glow flex items-center gap-xs ${
                    currentPoints <= 5 || revealed ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">wb_iridescent</span>
                  Pista: Silueta (-5 pts)
                </button>
              </div>
            </section>
          </main>

          {/* Bottom Navigation / Answer Area */}
          <div className="absolute bottom-0 left-0 w-full bg-surface-container-high rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-md pt-md px-gutter border-t-0 z-50 h-[200px] flex flex-col justify-center">
            <h3 className="text-center font-headline-md text-on-surface-variant mb-sm">
              ¿Qué hay en la caja?
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-md max-w-4xl mx-auto w-full">
              {shuffledOptions.map((opt) => {
                const isWrong = wrongAnswers.includes(opt);
                const isCorrectAndRevealed = revealed && opt === level.name;
                const isAnimatingWrong = wrongClicked === opt;
                const isRevealed = revealed;

                let btnClasses = 'bg-surface text-on-surface border-outline-variant hover:bg-secondary-fixed hover:text-on-secondary-fixed interact-glow';
                let icon = 'help_outline';
                let iconClass = 'text-outline';

                if (isWrong) {
                  btnClasses = 'bg-surface-variant text-outline opacity-50 cursor-not-allowed border-outline';
                  icon = 'cancel';
                  iconClass = '';
                } else if (isCorrectAndRevealed) {
                  btnClasses = 'bg-secondary text-on-secondary border-secondary';
                  icon = 'check_circle';
                  iconClass = 'text-on-secondary';
                } else if (isRevealed) {
                  btnClasses = 'bg-surface-variant text-outline opacity-50 cursor-not-allowed';
                }

                return (
                  <button
                    key={opt}
                    onClick={() => handleAnswer(opt)}
                    disabled={isWrong || isRevealed}
                    className={`answer-btn game-btn rounded-xl p-sm font-body-lg font-bold shadow-sm flex flex-col items-center justify-center gap-xs transition-colors relative overflow-hidden ${btnClasses}`}
                  >
                    <span className={`material-symbols-outlined ${iconClass}`}>{icon}</span>
                    <span>{opt}</span>
                    {isAnimatingWrong && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="material-symbols-outlined text-error text-[60px] animate-wrong-x">
                          close
                        </span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
