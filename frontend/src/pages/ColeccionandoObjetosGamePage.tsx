import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameItem {
  id: string;
  emoji: string;
  style: React.CSSProperties;
}

const items: GameItem[] = [
  { id: 'backpack', emoji: '🎒', style: { top: '25%', left: '8%', width: '15%', height: '25%' } },
  { id: 'books', emoji: '📚', style: { top: '35%', left: '25%', width: '13%', height: '18%' } },
  { id: 'paper1', emoji: '📄', style: { top: '32%', left: '62%', width: '8%', height: '15%' } },
  { id: 'notebook', emoji: '📓', style: { top: '25%', left: '74%', width: '10%', height: '20%' } },
  { id: 'paper2', emoji: '📄', style: { top: '38%', left: '85%', width: '8%', height: '16%' } },
];

const confettiEmojis = ['⭐', '🎊', '🎉', '✨'];

function createConfetti(container: HTMLElement) {
  for (let i = 0; i < 50; i++) {
    const particle = document.createElement('div');
    particle.innerText = confettiEmojis[Math.floor(Math.random() * confettiEmojis.length)];
    particle.className = 'particle text-3xl z-40';
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = '-50px';
    particle.style.animationDuration = `${Math.random() * 2 + 2}s`;
    particle.style.animationDelay = `${Math.random() * 1}s`;
    container.appendChild(particle);
  }
}

export default function ColeccionandoObjetosGamePage() {
  const navigate = useNavigate();
  const [foundCount, setFoundCount] = useState(0);
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [showSpeech, setShowSpeech] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [speechText, setSpeechText] = useState('¡Hola! Toca las siluetas oscuras para coleccionar los objetos perdidos.');
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number; emoji: string }[]>([]);
  const sparkleIdRef = useRef(0);

  const handleItemClick = useCallback((item: GameItem) => {
    if (collectedItems.has(item.id)) return;

    const container = gameContainerRef.current;
    if (!container) return;

    // Create sparkles
    const rect = container.getBoundingClientRect();
    const itemX = rect.left + (parseFloat(item.style.left as string) / 100) * rect.width + ((parseFloat(item.style.width as string) / 100) * rect.width) / 2;
    const itemY = rect.top + (parseFloat(item.style.top as string) / 100) * rect.height + ((parseFloat(item.style.height as string) / 100) * rect.height) / 2;

    const newSparkles = [];
    const emojis = ['⭐', '✨', '🌟'];
    for (let i = 0; i < 5; i++) {
      newSparkles.push({
        id: sparkleIdRef.current++,
        x: itemX + (Math.random() * 40 - 20),
        y: itemY + (Math.random() * 40 - 20),
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      });
    }
    setSparkles((prev) => [...prev, ...newSparkles]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => !newSparkles.find((ns) => ns.id === s.id)));
    }, 1000);

    // Update collected items
    setCollectedItems((prev) => new Set(prev).add(item.id));

    const newCount = foundCount + 1;
    setFoundCount(newCount);

    // Hide speech on first interaction
    if (newCount === 1) {
      setShowSpeech(false);
    }

    // Check win condition
    if (newCount === items.length) {
      setTimeout(() => {
        setGameWon(true);
        setSpeechText('¡Felicidades, encontraste todo!');
        setShowSpeech(true);
        if (container) {
          createConfetti(container);
        }
      }, 800);
    }
  }, [collectedItems, foundCount]);

  const handleRestart = () => {
    setFoundCount(0);
    setCollectedItems(new Set());
    setShowSpeech(true);
    setGameWon(false);
    setSpeechText('¡Hola! Toca las siluetas oscuras para coleccionar los objetos perdidos.');
    // Clear confetti particles
    const container = gameContainerRef.current;
    if (container) {
      const particles = container.querySelectorAll('.particle');
      particles.forEach((p) => p.remove());
    }
  };

  const handleExit = () => {
    navigate('/semana/2');
  };

  return (
    <div className="font-sans antialiased min-h-screen flex flex-col items-center justify-center bg-[#fdf2f8] p-4 lg:p-8">
      {/* Game Container */}
      <div
        ref={gameContainerRef}
        className={`relative w-full max-w-[1400px] aspect-[1376/768] bg-cover bg-center overflow-hidden rounded-3xl shadow-2xl border-8 border-purple-300 mx-auto ${
          gameWon ? 'animate-bounce-happy' : ''
        }`}
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA003da2WW-A8i8I_KkVAxIN5pjOUYgP-pU6XFwNUMAaQN7DxzQgQV_RM-c9Zv5vtTKc9fhT7i_iOYe_l-TSqFdvOXq6Q8gZlqWykd_zeimsfbo5RUFmln5iZAihXHiWP3aoNOMVhbRnQpEUXKFLjSRVJJ9V-7Q5V1bMTlUgSFbJ-9ozXnVrjvaiKLC4nUPOiqcizx3BZSpiTtjE3N64-pwCQ3pET3Ipm1oebI4G7xMeiFQ00wGnEVwl6aFzr0KW0NyFfTuaXdmrbo')`,
        }}
      >
        {/* UI Overlay */}
        <header className="absolute top-0 left-0 w-full p-4 flex flex-col items-center pointer-events-none z-50">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-wide"
            style={{ WebkitTextStroke: '2px rgb(91, 33, 182)' }}
          >
            Coleccionando objetos
          </h1>
          <div className="mt-2 bg-white/90 border-4 border-purple-400 rounded-full px-6 lg:px-8 py-2 lg:py-3 shadow-lg">
            <p className="text-xl md:text-3xl lg:text-4xl font-bold text-purple-700">
              {foundCount} de {items.length} objetos encontrados
            </p>
          </div>
        </header>

        {/* Guide Character Speech Bubble */}
        <div
          className={`absolute top-[25%] left-[30%] md:left-[35%] w-[30%] max-w-[300px] bg-white border-4 border-purple-300 rounded-3xl p-4 shadow-xl z-40 transition-opacity duration-500 ${
            showSpeech ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
          style={{ animation: showSpeech ? 'float 3s ease-in-out infinite' : 'none' }}
        >
          <p className="text-lg md:text-xl lg:text-2xl font-bold text-gray-700 text-center">
            {speechText}
          </p>
          {/* Bubble tail */}
          <div className="absolute -bottom-4 right-[20%] w-6 h-6 bg-white border-b-4 border-r-4 border-purple-300 transform rotate-45"></div>
        </div>

        {/* Win Message Overlay */}
        <div
          className={`absolute inset-0 z-50 flex flex-col items-center justify-center transition-opacity duration-500 ${
            gameWon ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div
            className={`bg-gradient-to-r from-purple-400 to-pink-400 p-8 lg:p-12 rounded-3xl shadow-2xl border-4 border-white text-center transform transition-transform duration-500 ${
              gameWon ? 'scale-100' : 'scale-90'
            }`}
          >
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 lg:mb-6 drop-shadow-md">
              ¡Felicidades!
            </h2>
            <div className="flex flex-col gap-3 lg:gap-4">
              <button
                onClick={handleRestart}
                className="bg-white text-purple-600 font-bold text-2xl lg:text-3xl py-3 lg:py-4 px-8 lg:px-10 rounded-full hover:bg-gray-100 hover:scale-105 transition-all shadow-lg pointer-events-auto"
              >
                Volver a jugar
              </button>
              <button
                onClick={handleExit}
                className="bg-purple-600 text-white font-bold text-2xl lg:text-3xl py-3 lg:py-4 px-8 lg:px-10 rounded-full hover:bg-purple-700 hover:scale-105 transition-all shadow-lg pointer-events-auto"
              >
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Objects */}
        {items.map((item) => (
          <div
            key={item.id}
            className={`interact-zone absolute flex justify-center items-center transition-transform duration-200 rounded-[20%] ${
              collectedItems.has(item.id) ? 'collected cursor-default' : 'cursor-pointer hover:scale-105'
            }`}
            style={item.style}
            onClick={() => handleItemClick(item)}
          >
            <span
              className={`emoji-reveal text-[clamp(3rem,6vw,6rem)] transition-all duration-300 ${
                collectedItems.has(item.id) ? 'animate-pop' : ''
              }`}
            >
              {item.emoji}
            </span>
          </div>
        ))}

        {/* Sparkles */}
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute text-2xl lg:text-3xl pointer-events-none animate-pop"
            style={{
              left: `${sparkle.x}px`,
              top: `${sparkle.y}px`,
              transition: 'opacity 0.5s ease 0.5s',
            }}
          >
            {sparkle.emoji}
          </div>
        ))}
      </div>
    </div>
  );
}
