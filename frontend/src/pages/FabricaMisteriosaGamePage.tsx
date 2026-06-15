import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameObject {
  emoji: string;
  type: string;
}

const objects: GameObject[] = [
  { emoji: '🥤', type: 'Plástico' },
  { emoji: '🔑', type: 'Metal' },
  { emoji: '🪑', type: 'Madera' },
  { emoji: '🥛', type: 'Vidrio' },
  { emoji: '☕', type: 'Cerámica' },
];

const binTypes = ['Plástico', 'Metal', 'Madera', 'Vidrio', 'Cerámica'];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createSparkles(x: number, y: number, color: string = '#ffd700', container: HTMLElement) {
  for (let i = 0; i < 12; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'absolute w-3 h-3 rounded-full pointer-events-none z-50';
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;
    sparkle.style.backgroundColor = color;
    sparkle.style.boxShadow = `0 0 10px ${color}`;

    const tx = (Math.random() - 0.5) * 150;
    const ty = (Math.random() - 0.5) * 150;

    sparkle.style.transform = `translate(${tx}px, ${ty}px)`;
    sparkle.style.animation = 'sparklePop 0.6s ease-out forwards';

    container.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }
}

export default function FabricaMisteriosaGamePage() {
  const navigate = useNavigate();
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const machineRef = useRef<HTMLDivElement>(null);

  const [gameSequence, setGameSequence] = useState<GameObject[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<'IDLE' | 'LAUNCHING' | 'REVEALING' | 'SELECTING' | 'ENDED'>('IDLE');
  const [sphereRevealed, setSphereRevealed] = useState(false);
  const [showBins, setShowBins] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);
  const [machineVibrating, setMachineVibrating] = useState(false);
  const [objectAnimating, setObjectAnimating] = useState(false);
  const [errorShake, setErrorShake] = useState(false);
  const [collectedResults, setCollectedResults] = useState<string[]>([]);
  const [launchAnimation, setLaunchAnimation] = useState(false);
  const [pulsing, setPulsing] = useState(false);

  const currentObject = gameSequence[currentRound];

  const initGame = useCallback(() => {
    const shuffled = shuffleArray([...objects]);
    setGameSequence(shuffled);
    setCurrentRound(0);
    setGameState('IDLE');
    setSphereRevealed(false);
    setShowBins(false);
    setGameEnded(false);
    setMachineVibrating(false);
    setObjectAnimating(false);
    setErrorShake(false);
    setCollectedResults([]);
    setLaunchAnimation(false);
    setPulsing(false);
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  const handleLaunch = useCallback(() => {
    if (gameState !== 'IDLE' || !currentObject) return;
    setGameState('LAUNCHING');
    setMachineVibrating(true);
    setTimeout(() => setMachineVibrating(false), 300);

    setTimeout(() => {
      setLaunchAnimation(true);
      setObjectAnimating(true);
      setTimeout(() => {
        setLaunchAnimation(false);
        setObjectAnimating(false);
        setGameState('REVEALING');
      }, 4000);
    }, 150);
  }, [gameState, currentObject]);

  const handleSphereClick = useCallback(() => {
    if (gameState !== 'REVEALING') return;
    setSphereRevealed(true);

    const container = containerRef.current;
    if (container) {
      const rect = container.getBoundingClientRect();
      const gameRect = gameContainerRef.current?.getBoundingClientRect();
      if (gameRect) {
        createSparkles(
          rect.left - gameRect.left + rect.width / 2,
          rect.top - gameRect.top + rect.height / 2,
          '#ffd700',
          gameContainerRef.current
        );
      }
    }

    setTimeout(() => {
      setGameState('SELECTING');
      setPulsing(true);
      setShowBins(true);
    }, 300);
  }, [gameState]);

  const handleBinClick = useCallback(
    (binType: string, binElement: HTMLElement) => {
      if (gameState !== 'SELECTING' || !currentObject) return;

      const expectedType = currentObject.type;
      const container = containerRef.current;
      const gameContainer = gameContainerRef.current;

      if (expectedType === binType) {
        // Success
        const binRect = binElement.getBoundingClientRect();
        const gameRect = gameContainer?.getBoundingClientRect();
        if (gameRect && container) {
          createSparkles(
            binRect.left - gameRect.left + binRect.width / 2,
            binRect.top - gameRect.top + binRect.height / 2,
            '#b2d8d0',
            gameContainer
          );
        }

        setPulsing(false);
        setCollectedResults((prev) => [...prev, currentObject.emoji]);

        setTimeout(() => {
          const nextRound = currentRound + 1;
          if (nextRound >= gameSequence.length) {
            setGameState('ENDED');
            setGameEnded(true);
            setShowBins(false);
          } else {
            setCurrentRound(nextRound);
            setGameState('IDLE');
            setSphereRevealed(false);
            setShowBins(false);
            setPulsing(false);
          }
        }, 600);
      } else {
        // Fail
        const binRect = binElement.getBoundingClientRect();
        const cross = document.createElement('div');
        cross.textContent = '❌';
        cross.style.position = 'absolute';
        cross.style.left = `${binRect.left + binRect.width / 2}px`;
        cross.style.top = `${binRect.top + binRect.height / 2}px`;
        cross.style.fontSize = '40px';
        cross.style.opacity = '0.7';
        cross.style.transform = 'translate(-50%, -50%)';
        cross.style.pointerEvents = 'none';
        cross.style.zIndex = '100';
        cross.style.transition = 'all 0.5s ease';
        document.body.appendChild(cross);

        requestAnimationFrame(() => {
          cross.style.transform = 'translate(-50%, -100px)';
          cross.style.opacity = '0';
        });
        setTimeout(() => cross.remove(), 500);

        setPulsing(false);
        setErrorShake(true);
        setTimeout(() => {
          setErrorShake(false);
          setPulsing(true);
        }, 400);
      }
    },
    [gameState, currentObject, currentRound, gameSequence.length]
  );

  const handleReplay = () => {
    initGame();
    setTimeout(() => {
      if (gameState === 'IDLE') {
        handleLaunch();
      }
    }, 300);
  };

  const handleExit = () => {
    navigate('/semana/2');
  };

  return (
    <div className="bg-surface text-on-surface flex items-center justify-center min-h-screen overflow-hidden p-4">
      <div
        ref={gameContainerRef}
        className="relative overflow-hidden rounded-3xl shadow-2xl flex flex-col items-center"
        style={{
          width: '100%',
          maxWidth: '1400px',
          aspectRatio: '1401/789',
          backgroundImage: `url('https://lh3.googleusercontent.com/aida/AP1WRLvCT8Z5HVmHdsNLIliqO5-fQP-adKDvkBgwDELTaJQX9E17eNJysfcSckz5NTwQhsFJiNdccuTbC7Xv3q4gyZZvVjYHxmBZZP9sEjH4mEdQCHklzDQvqi3ZQLAx5iCopp2-YIDkD8iS9hEipwaHmFdEaHRPaRltMlriRHqnNNIHG_t-NJgOapcVi5fYjDNTB-HAjdjWNctX16VH8t0p7kWkZThrQZeeyejARujAvLBfodG82VHUITWi1kI')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundColor: '#dcd0ff',
        }}
      >
        {/* Mint green floor overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent 65%, #b2d8d0 65%)' }}
        />

        {/* Decorative Pipes */}
        <div className="absolute top-[150px] -left-[50px] w-[400px] h-[30px] bg-[#ffcfd2] rounded-[15px] border-4 border-[#eab3b7] z-[1]">
          <div className="absolute right-0 top-0 w-[50px] h-[80px] bg-[#ffcfd2] border-4 border-[#eab3b7] border-t-0 rounded-b-[15px]" />
        </div>
        <div className="absolute top-[250px] -right-[50px] w-[300px] h-[30px] bg-[#cfebff] rounded-[15px] border-4 border-[#9fcff2] z-[1]">
          <div className="absolute left-0 bottom-0 w-[50px] h-[100px] bg-[#cfebff] border-4 border-[#9fcff2] border-b-0 rounded-t-[15px]" />
        </div>

        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center px-8 py-3 z-10 bg-[rgba(253,249,240,0.9)] shadow-sm border-b border-[#ebe8df]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[32px]">recycling</span>
            <span className="font-headline-md text-headline-md text-[#54624d]">Máquina de Reciclaje</span>
          </div>
          <div className="text-tertiary font-body-lg">
            Objeto {currentRound + 1} de {gameSequence.length}
          </div>
          <div className="flex gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-highest transition-colors">
              <span className="material-symbols-outlined text-on-surface-variant">stars</span>
            </button>
          </div>
        </header>

        {/* Machine Container */}
        <div className="absolute bottom-0 w-full h-full flex justify-center items-end pointer-events-none z-[5]">
          <div
            ref={machineRef}
            className={`relative w-[400px] h-[400px] bg-[#f7f7f2] rounded-t-[200px] flex flex-col items-center justify-center pointer-events-auto border-6 border-[#dddad1] shadow-[inset_0_10px_20px_rgba(0,0,0,0.02),0_-10px_30px_rgba(84,98,77,0.05)] ${
              machineVibrating ? 'machine-vibrating' : ''
            }`}
            style={{ marginBottom: '0' }}
          >
            {/* Machine Chimney */}
            <div className="absolute -top-[80px] left-1/2 -translate-x-1/2 w-[80px] h-[100px] bg-[#c5c8be] border-6 border-[#aeb2a5] rounded-t-[10px] z-[-1]" />

            {/* Decorative Gears */}
            <div className="absolute w-[60px] h-[60px] bg-[#dbc1b6] rounded-full border-6 border-dashed border-[#c5c8be] animate-spin left-[-30px] top-[150px]" />
            <div className="absolute w-[60px] h-[60px] bg-[#d2e5f6] rounded-full border-6 border-dashed border-[#c5c8be] right-[-30px] top-[200px]" style={{ animation: 'spin-reverse 12s linear infinite' }} />

            {/* Machine Screen */}
            <div className="w-[220px] h-[120px] bg-[#8b9a82] rounded-[60px] mb-10 shadow-[inset_0_8px_16px_rgba(0,0,0,0.15)] flex items-center justify-center relative overflow-hidden border-4 border-[#757870]">
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent" />
              <span className="material-symbols-outlined text-[64px] text-[#f7f3ea] opacity-50">factory</span>
            </div>

            {/* Launch Button */}
            <button
              onClick={handleLaunch}
              disabled={gameState !== 'IDLE'}
              className={`w-[140px] h-[140px] bg-error rounded-full border-6 border-[#93000a] shadow-[0_10px_0_#93000a,0_15px_20px_rgba(0,0,0,0.2)] relative flex items-center justify-center z-10 transition-all active:translate-y-[10px] active:shadow-[0_0_0_#93000a,0_5px_10px_rgba(0,0,0,0.2)] disabled:bg-[#e5e2d9] disabled:border-[#c5c8be] disabled:shadow-[0_10px_0_#c5c8be] disabled:cursor-not-allowed disabled:text-[#757870] ${
                gameState === 'LAUNCHING' ? 'translate-y-[10px] shadow-[0_0_0_#93000a,0_5px_10px_rgba(0,0,0,0.2)]' : ''
              }`}
            >
              <span className="text-white font-bold text-[28px] font-[Plus_Jakarta_Sans]">START</span>
            </button>
          </div>
        </div>

        {/* Active Object Container */}
        <div
          ref={containerRef}
          onClick={handleSphereClick}
          className={`absolute z-20 flex items-center justify-center cursor-pointer ${
            (launchAnimation || objectAnimating) ? 'launch-anim' : ''
          } ${pulsing ? 'pulsing' : ''} ${errorShake ? 'error-shake' : ''}`}
          style={{
            top: '394px',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '120px',
            height: '120px',
            display: gameState === 'IDLE' || gameState === 'ENDED' ? 'none' : 'flex',
            opacity: gameState === 'LAUNCHING' ? 1 : undefined,
            transition: gameState === 'SELECTING' ? '0.5s cubic-bezier(0.25, 1, 0.5, 1)' : undefined,
          }}
        >
          <div className={`absolute text-[80px] z-[1] select-none pointer-events-none transition-opacity duration-300 ${sphereRevealed ? 'opacity-100' : 'opacity-0'}`}>
            {currentObject?.emoji}
          </div>
          <div
            className="absolute inset-0 rounded-full z-[2] transition-all duration-300"
            style={{
              background: 'radial-gradient(circle at 30% 30%, #d1d5db, #9ca3af 60%, #6b7280)',
              boxShadow: 'inset -5px -5px 15px rgba(0,0,0,0.1), 0 10px 20px rgba(0,0,0,0.1)',
              opacity: sphereRevealed ? 0 : 1,
              transform: sphereRevealed ? 'scale(1.5)' : 'scale(1)',
            }}
          />
        </div>

        {/* Bins Container — oculto hasta que se revele el objeto */}
        <div
          className={`absolute left-0 w-full px-12 flex justify-around items-end z-10 transition-all duration-500 ${
            showBins ? 'bottom-[30px]' : '-bottom-[200px]'
          }`}
          style={{
            transitionTimingFunction: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {binTypes.map((type) => {
            const colors: Record<string, { bg: string; border: string }> = {
              Plástico: { bg: '#fef08a', border: '#eab308' },
              Metal: { bg: '#cbd5e1', border: '#94a3b8' },
              Madera: { bg: '#e7cba9', border: '#d4a373' },
              Vidrio: { bg: '#a7f3d0', border: '#34d399' },
              Cerámica: { bg: '#fecaca', border: '#f87171' },
            };
            const color = colors[type];
            return (
              <div
                key={type}
                onClick={(e) => handleBinClick(type, e.currentTarget as HTMLElement)}
                className="relative w-[140px] h-[160px] rounded-[4px_4px_24px_24px] flex flex-col items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.1)] transition-all duration-200 hover:-translate-y-[5px] hover:shadow-[0_12px_24px_rgba(0,0,0,0.15)] active:translate-y-0 cursor-pointer border-4 border-[#e5e2d9]"
                style={{
                  backgroundColor: color?.bg,
                  borderColor: color?.border,
                }}
                data-type={type}
              >
                {/* Trash Can Lid */}
                <div
                  className="absolute -top-[14px] -left-[10px] -right-[10px] h-[24px] rounded-[8px] border-4 border-[#e5e2d9]"
                  style={{ background: color?.bg, borderColor: color?.border }}
                />
                {/* Bin Grooves */}
                <div className="absolute top-[30px] bottom-[20px] left-[20px] right-[20px] border-l-4 border-r-4 border-black/10 rounded-[2px] pointer-events-none" />
                {/* Label */}
                <div className="absolute -bottom-[24px] bg-white px-4 py-2 rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.05)] border-2 border-[#ebe8df] font-bold font-label-caps text-on-surface pointer-events-none z-[2]">
                  {type.toUpperCase()}
                </div>
              </div>
            );
          })}
        </div>

        {/* End Screen */}
        <div
          className={`absolute inset-0 z-[100] flex flex-col items-center justify-center transition-opacity duration-500 ${
            gameEnded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
          style={{ backgroundColor: 'rgba(253, 249, 240, 0.95)' }}
        >
          <div className="bg-white p-12 rounded-[32px] shadow-[0_20px_40px_rgba(84,98,77,0.1)] text-center max-w-[800px] w-[90%] border-2 border-[#f1eee5]">
            <span className="material-symbols-outlined text-primary text-[80px] mb-4">verified</span>
            <h2 className="font-display-lg text-primary mb-2">¡Excelente Trabajo!</h2>
            <p className="font-body-lg text-on-surface-variant mb-6">Has clasificado correctamente todos los materiales.</p>
            <div className="flex justify-center gap-6 my-8">
              {collectedResults.map((emoji, index) => (
                <div
                  key={index}
                  className="w-20 h-20 bg-[#f7f3ea] rounded-2xl flex items-center justify-center text-[40px] relative"
                >
                  {emoji}
                  <span className="absolute -bottom-[10px] -right-[10px] bg-white rounded-full text-[#54624d] text-[24px] material-symbols-outlined">check_circle</span>
                </div>
              ))}
            </div>
            <div className="flex gap-6 justify-center mt-10">
              <button
                onClick={handleReplay}
                className="bg-primary text-white px-8 py-4 rounded-2xl font-bold text-lg border-b-[6px] border-[#3d4b37] active:translate-y-[4px] active:border-b-[2px] active:mb-1 transition-all"
              >
                JUGAR DE NUEVO
              </button>
              <button
                onClick={handleExit}
                className="bg-[#e5e2d9] text-[#444841] px-8 py-4 rounded-2xl font-bold text-lg border-b-[6px] border-[#c5c8be] active:translate-y-[4px] active:border-b-[2px] active:mb-1 transition-all"
              >
                SALIR
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
