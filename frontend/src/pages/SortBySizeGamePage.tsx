import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

/* =============================
   LEVEL 1: MERCADO DE FRUTAS
   ============================= */
interface BasketItem {
  id: string;
  value: number;
  alt: string;
  src: string;
}

const baskets: BasketItem[] = [
  { id: 'basket-1', value: 1, alt: '1 apple', src: 'https://lh3.googleusercontent.com/aida/AP1WRLvarL0fac4s2ezWACNMBQi9qcF_eqAQkSexgcq4rCJY_sWfrtVQRf7lTkvQMjWnsSVBuNlYyueubWuKC0XttqQQ9H7VO9dWMvLic9oHatHLX8VME60mme3DvD4hD8kwEPXuCWDExwBrm8hATg1PlumaAH9tRe-urWf_5aXgxkim0tkWeKwebO1XOX3akbvsL9IO1u8i5j_Rdf4li4auGhCdsXqfNTsJbTf-9FZX_nX3q5q-XXxQ8r4Opvs' },
  { id: 'basket-2', value: 2, alt: '2 bananas', src: 'https://lh3.googleusercontent.com/aida/AP1WRLsh3ibcttpbVTAqAK9AUTAyIbz0f8CWwLNdLfB9xTnT-eOMOUhyQoF8mWnAjRvK8Bk8nxO8fiw2PnwCA6ME7fJvrdMcXAKgFk6EeD1OLFFy1ftla4WtUdQM1zG_fH7HCQEfdZ8OHcICrptUE1QuU43V49MFZeSmDg-gC-e77Tp7l5BzQJ6SIXwbdWYlx84GRUK0J5MFqR22PZ83NZSh2TScdXh7LHCcvQlyfJDmTM6NtVwjsgOWuFEPHFEe' },
  { id: 'basket-3', value: 3, alt: '3 grapes', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAiiNcYxd1nggNGmOxgZ2tswSaf9Mgjq1eM71hNNdF-2mSbzBCEpZCckcsQAwJOBG4y1zuXlcl0al8MA4IYvJ82ADtw8c3pVEme4ONLsWIhHwBi8HQKwuihajldyCHjwHUCeEa_cmFh5l-IWv1y1E0MPubh7eFE08UT9N88p0prXLH9RkOAzaofKeUmYRMIeu-aJAqpr8s5e3UzJ_N5NLduR8mX1UI0hpOxqblGi9dknu2f6Gk6cQpxrlFhoR15aN9svDpjEOJe-m8v' },
  { id: 'basket-4', value: 4, alt: '4 oranges', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjwCOKKdLGFfZcjdTLloyWeH6JbHvpNPOUe8HmAGmEdOuWmwpCVtrvyBJueWl36R0-zMqlzUWn4d4yTndwgkruX1H43zO56Ic8U9N42H5ytKn65PeyT7JBWL7c5oqCvACp16Lnc02e4nuarC8t1YyntW1RF9N1xuy7iFhO6_1pYM8fU1AEJKSUX72CijEA2PktgmQOfFbKKoOJMPFaKpoBfCmfmgJfRa-W4CPQrrrCBY6SQ6B2W_Ky_tj0mcazKnELVjL-SHQnq2mM' },
  { id: 'basket-5', value: 5, alt: '5 mixed fruits', src: 'https://lh3.googleusercontent.com/aida/AP1WRLvcTdbARakl3uSnn4wmmCfvnjKMnMB_gjRNsAvXhiYrvYUmwhAHU_sDwjhWe3krFZlQPjazoiPJ-LlV6ayvYuNR6e77F05fibeGwF-MbPy9h8IyethmZVDwEzKKkw3goCfVRs4ozPzK5DYOzcFHFzmQjBXLxafwa8oR_Kre_Pcha9KAbHUsZLgEGx0PwzF1EKIKmBH4LOkB9Qibz4LGf9pJxyT32RC3bmE4axISCQzKojNEBI7kpc4A48Nj' },
];

const dropZonesLevel1 = [
  { id: 'zone-1', expected: 1, label: '1', showLabel: 'MENOS FRUTAS' },
  { id: 'zone-2', expected: 2, label: '2' },
  { id: 'zone-3', expected: 3, label: '3' },
  { id: 'zone-4', expected: 4, label: '4' },
  { id: 'zone-5', expected: 5, label: '5', showLabel: 'MAS FRUTAS' },
];

/* =============================
   LEVEL 2: TALLER DE MAGIA
   ============================= */
interface FlaskItem {
  id: string;
  value: number;
  svg: React.ReactNode;
}

const flasks: FlaskItem[] = [
  {
    id: 'flask-1',
    value: 1,
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
        <circle cx="50" cy="62" fill="#f3e0c2" r="20" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M42,47 L58,47 L55,32 L45,32 Z" fill="#f3e0c2" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M30,62 A20,20 0 0,0 70,62 A20,20 0 0,1 30,62 Z" fill="#6a5d45" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <rect fill="#af9e83" height="8" rx="2" width="16" x="42" y="24" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="42" cy="67" fill="#ffffff" opacity="0.6" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'flask-2',
    value: 2,
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
        <path d="M50,25 L75,85 Q80,95 65,95 L35,95 Q20,95 25,85 Z" fill="#ffdad6" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M38,55 L62,55 L75,85 Q80,95 65,95 L35,95 Q20,95 25,85 Z" fill="#ba1a1a" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <rect fill="#af9e83" height="8" rx="2" width="16" x="42" y="17" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="40" cy="75" fill="#ffffff" opacity="0.6" r="3" />
        <circle cx="60" cy="85" fill="#ffffff" opacity="0.6" r="2" />
      </svg>
    ),
  },
  {
    id: 'flask-3',
    value: 3,
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
        <rect fill="#e9e7eb" height="45" rx="10" width="40" x="30" y="40" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M38,28 L62,28 L58,40 L42,40 Z" fill="#e9e7eb" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M30,60 L70,60 L70,72 Q70,85 55,85 L45,85 Q30,85 30,72 Z" fill="#af9e83" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <rect fill="#6a5d45" height="8" rx="2" width="24" x="38" y="20" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="40" cy="75" fill="#ffffff" opacity="0.6" r="3" />
      </svg>
    ),
  },
  {
    id: 'flask-4',
    value: 4,
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
        <path d="M35,15 L65,15 L60,30 L68,85 Q68,95 55,95 L45,95 Q32,95 32,85 L40,30 Z" fill="#bfe5fe" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M34,52 L66,52 L68,85 Q68,95 55,95 L45,95 Q32,95 32,85 Z" fill="#3e6378" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <rect fill="#af9e83" height="8" rx="2" width="16" x="42" y="7" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="42" cy="72" fill="#ffffff" opacity="0.6" r="3" />
        <circle cx="58" cy="85" fill="#ffffff" opacity="0.6" r="2.5" />
      </svg>
    ),
  },
  {
    id: 'flask-5',
    value: 5,
    svg: (
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md group-hover:scale-105 transition-transform">
        <rect fill="#ccebc7" height="70" rx="8" width="55" x="22" y="22" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M22,62 L77,62 L77,85 Q77,92 68,92 L32,92 Q22,92 22,85 Z" fill="#4a6549" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M22,22 L77,22 L77,30 L22,30 Z" fill="#ffffff" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <path d="M22,22 L15,15 L30,22 Z" fill="#ffffff" stroke="#1b1b1e" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="38" cy="75" fill="#ffffff" opacity="0.6" r="3.5" />
        <circle cx="58" cy="85" fill="#ffffff" opacity="0.6" r="3" />
        <circle cx="65" cy="70" fill="#ffffff" opacity="0.6" r="2.5" />
      </svg>
    ),
  },
];

const dropZonesLevel2 = [
  { id: 'zone-1', expected: 1, sizeClass: 'w-[2.5rem] h-[2.5rem]', iconSize: 'text-xl' },
  { id: 'zone-2', expected: 2, sizeClass: 'w-[4rem] h-[4rem]', iconSize: 'text-2xl' },
  { id: 'zone-3', expected: 3, sizeClass: 'w-[5.5rem] h-[5.5rem]', iconSize: 'text-3xl' },
  { id: 'zone-4', expected: 4, sizeClass: 'w-[7rem] h-[7rem]', iconSize: 'text-4xl' },
  { id: 'zone-5', expected: 5, sizeClass: 'w-[8.5rem] h-[8.5rem]', iconSize: 'text-5xl' },
];

const confettiColors = ['#fbf8fc', '#8ba888', '#3e6378', '#d6c4a7', '#ba1a1a'];

function fireConfetti() {
  const container = document.getElementById('confetti-container');
  if (!container) return;
  container.classList.remove('hidden');
  for (let i = 0; i < 100; i++) {
    const confetti = document.createElement('div');
    confetti.classList.add('confetti-piece');
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.backgroundColor = confettiColors[Math.floor(Math.random() * confettiColors.length)];
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
    confetti.style.animationDelay = `${Math.random() * 2}s`;
    container.appendChild(confetti);
  }
  setTimeout(() => {
    container.innerHTML = '';
    container.classList.add('hidden');
  }, 6000);
}

export default function SortBySizeGamePage() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(1);

  /* Level 1 state */
  const [basketItems, setBasketItems] = useState<BasketItem[]>([...baskets].sort(() => Math.random() - 0.5));
  const [placedItems, setPlacedItems] = useState<Record<string, BasketItem | null>>({
    'zone-1': null, 'zone-2': null, 'zone-3': null, 'zone-4': null, 'zone-5': null,
  });
  const [draggedItem, setDraggedItem] = useState<BasketItem | null>(null);

  /* Level 2 state */
  const [flaskItems, setFlaskItems] = useState<FlaskItem[]>([...flasks].sort(() => Math.random() - 0.5));
  const [placedFlasks, setPlacedFlasks] = useState<Record<string, FlaskItem | null>>({
    'zone-1': null, 'zone-2': null, 'zone-3': null, 'zone-4': null, 'zone-5': null,
  });
  const [draggedFlask, setDraggedFlask] = useState<FlaskItem | null>(null);

  /* Shared state */
  const [dragOverZone, setDragOverZone] = useState<string | null>(null);
  const [zoneStatus, setZoneStatus] = useState<Record<string, 'correct' | 'error' | 'neutral'>>({
    'zone-1': 'neutral', 'zone-2': 'neutral', 'zone-3': 'neutral', 'zone-4': 'neutral', 'zone-5': 'neutral',
  });
  const [shakingZones, setShakingZones] = useState<Set<string>>(new Set());
  const [gameCompleted, setGameCompleted] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  /* =============================
     LEVEL 1 HANDLERS
     ============================= */
  const handleDragStartL1 = (item: BasketItem) => {
    setDraggedItem(item);
  };

  const handleDropL1 = (ev: React.DragEvent, zoneId: string) => {
    ev.preventDefault();
    setDragOverZone(null);
    if (!draggedItem || placedItems[zoneId]) return;
    setPlacedItems((prev) => ({ ...prev, [zoneId]: draggedItem }));
    setBasketItems((prev) => prev.filter((b) => b.id !== draggedItem.id));
    setDraggedItem(null);
  };

  /* =============================
     LEVEL 2 HANDLERS
     ============================= */
  const handleDragStartL2 = (item: FlaskItem) => {
    setDraggedFlask(item);
  };

  const handleDropL2 = (ev: React.DragEvent, zoneId: string) => {
    ev.preventDefault();
    setDragOverZone(null);
    if (!draggedFlask || placedFlasks[zoneId]) return;
    setPlacedFlasks((prev) => ({ ...prev, [zoneId]: draggedFlask }));
    setFlaskItems((prev) => prev.filter((b) => b.id !== draggedFlask.id));
    setDraggedFlask(null);
  };

  /* =============================
     SHARED HANDLERS
     ============================= */
  const handleDragOver = (ev: React.DragEvent, zoneId: string) => {
    ev.preventDefault();
    const occupied = currentLevel === 1 ? placedItems[zoneId] : placedFlasks[zoneId];
    if (!occupied) {
      setDragOverZone(zoneId);
    }
  };

  const handleDragLeave = () => {
    setDragOverZone(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDraggedFlask(null);
    setDragOverZone(null);
  };

  const handleReset = useCallback(() => {
    setBasketItems([...baskets].sort(() => Math.random() - 0.5));
    setPlacedItems({
      'zone-1': null, 'zone-2': null, 'zone-3': null, 'zone-4': null, 'zone-5': null,
    });
    setFlaskItems([...flasks].sort(() => Math.random() - 0.5));
    setPlacedFlasks({
      'zone-1': null, 'zone-2': null, 'zone-3': null, 'zone-4': null, 'zone-5': null,
    });
    setZoneStatus({
      'zone-1': 'neutral', 'zone-2': 'neutral', 'zone-3': 'neutral', 'zone-4': 'neutral', 'zone-5': 'neutral',
    });
    setShakingZones(new Set());
    setGameCompleted(false);
    setFeedback(null);
    const container = document.getElementById('confetti-container');
    if (container) {
      container.innerHTML = '';
      container.classList.add('hidden');
    }
  }, []);

  const handleCheck = useCallback(() => {
    let correctCount = 0;
    let filledCount = 0;
    const newStatus: Record<string, 'correct' | 'error' | 'neutral'> = {};
    const newShaking = new Set<string>();

    const zones = currentLevel === 1 ? dropZonesLevel1 : dropZonesLevel2;
    const placed = currentLevel === 1 ? placedItems : placedFlasks;

    zones.forEach((zone) => {
      const item = placed[zone.id];
      if (item) {
        filledCount++;
        if (item.value === zone.expected) {
          newStatus[zone.id] = 'correct';
          correctCount++;
        } else {
          newStatus[zone.id] = 'error';
          newShaking.add(zone.id);
        }
      } else {
        newStatus[zone.id] = 'neutral';
      }
    });

    setZoneStatus(newStatus);
    setShakingZones(newShaking);

    if (correctCount === 5) {
      if (currentLevel === 1) {
        setFeedback('¡Perfecto! Has completado el nivel 1.');
        fireConfetti();
      } else {
        setFeedback('¡Felicidades! Has completado el Taller de Magia.');
        setGameCompleted(true);
        fireConfetti();
      }
    } else if (filledCount < 5) {
      setFeedback('¡Faltan piezas por ordenar!');
    } else {
      setFeedback('Algunas piezas están en el lugar incorrecto. ¡Intenta de nuevo!');
    }

    setTimeout(() => setShakingZones(new Set()), 400);
  }, [currentLevel, placedItems, placedFlasks]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel === 1) {
      setCurrentLevel(2);
      setZoneStatus({
        'zone-1': 'neutral', 'zone-2': 'neutral', 'zone-3': 'neutral', 'zone-4': 'neutral', 'zone-5': 'neutral',
      });
      setFeedback(null);
      setShakingZones(new Set());
    } else {
      setGameCompleted(true);
    }
  }, [currentLevel]);

  const handleRestartGame = useCallback(() => {
    setCurrentLevel(1);
    handleReset();
  }, [handleReset]);

  const handleBack = () => navigate('/semana/1/sort-by-size');
  const handleNextGame = () => navigate('/semana/1');

  /* =============================
     RENDER HELPERS
     ============================= */
  const getZoneStatus = (zoneId: string) => {
    const status = zoneStatus[zoneId];
    const isShaking = shakingZones.has(zoneId);
    const isDragOver = dragOverZone === zoneId;

    let className = 'dropzone rounded-2xl border-4 border-dashed border-outline-variant bg-surface/50 flex items-center justify-center relative overflow-hidden transition-all duration-300';
    if (isDragOver) className += ' dragover';
    if (status === 'correct') className += ' glow-correct';
    if (status === 'error') className += ' glow-incorrect';
    if (isShaking) className += ' animate-shake';
    return className;
  };

  return (
    <div className="bg-background text-on-background h-screen flex flex-col font-body-md overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="flex justify-between items-center px-gutter w-full h-16 bg-surface shadow-sm z-40 bg-surface-container-low shrink-0">
        <div className="flex items-center gap-sm">
          <span className="material-symbols-outlined text-primary text-3xl">
            {currentLevel === 1 ? 'storefront' : 'science'}
          </span>
          <h1 className="text-headline-md font-headline-md text-primary font-extrabold tracking-tight">
            {currentLevel === 1 ? 'Mercado de Frutas' : 'Taller de Magia'}
          </h1>
        </div>
        <div className="flex items-center gap-md hidden md:flex">
          <button
            onClick={handleBack}
            className="text-on-surface-variant hover:bg-primary-container/20 transition-colors p-2 rounded-full flex items-center justify-center"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow relative flex flex-col md:px-margin-desktop px-margin-mobile py-6 overflow-hidden">
        {/* Background Layer */}
        <div
          className="absolute inset-0 z-0 pointer-events-none opacity-80"
          style={{
            backgroundImage: currentLevel === 1
              ? 'url(https://lh3.googleusercontent.com/aida/AP1WRLs5JaFmh3VVfeYZiSDkNBiEyrVIHGL67GVxoaPKEgZnAQY8gYtFxr1rG_OwsFlWK9Dtkb_oUUJvxT7tKSxXcr3amftz2Yt-2bVnN9rRJKBz2mvmAZwwNIrToSiCKo6-fLdZMuqWmweJAhWi99i7mtAkUAdGFALUvhnM7k09_1_c_TU21EJWb15h3AAHqkghwwgKYfUY9K40tr2oM5neD83ezJ1sNvixPBMxZyV5w1pdeLsBEaIw28aNyV3q)'
              : 'url(https://lh3.googleusercontent.com/aida/AP1WRLuSV6dy8ImhanoR-KWHTTbwqmzJ2Wtt7L4H7X30mvZ7Wh4jW12-waEZ9re_6ZxG9ElBw0uvwL5OJKvRJjqlyD4ngrA-D9ZDNqqwyV0NDHDaVif6anxVhIvqi_uJkXv77R5mu-4Kc6sOmmUhmlMkSwauaDoBPyxqUYlu-jcC2BbUIwHPpr4kR26WWI2IR25lPCPdfz3PQtzFdgdUUZO59yriUKSfOmpyG7mTF4z-xRYjXtvST9tYRb4qswKe)',
            backgroundSize: 'cover',
            backgroundPosition: 'center center',
            backgroundRepeat: 'no-repeat',
          }}
        ></div>

        {/* Game Container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full w-full max-w-5xl mx-auto flex-grow gap-6 md:mt-0">
          {/* Instructions Card */}
          <div className="bg-surface/95 backdrop-blur-sm rounded-xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-2 border-surface-variant max-w-2xl text-center">
            <h2 className="font-headline-lg text-2xl md:text-3xl text-secondary mb-2">
              {currentLevel === 1 ? '¡Ordena las Canastas!' : 'Nivel 2: Ordenamiento Mágico'}
            </h2>
            <p className="font-body-lg text-base md:text-body-lg text-on-surface">
              {currentLevel === 1
                ? 'Arrastra las canastas de frutas a los espacios vacíos en el mostrador. Ordénalas de 1 a 5 frutas.'
                : 'Ordena los frascos de menor a mayor en sus contenedores.'}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            {[1, 2].map((lvl) => (
              <div
                key={lvl}
                className={`w-3 h-3 rounded-full ${
                  lvl === currentLevel ? 'bg-primary' : lvl < currentLevel ? 'bg-primary-container' : 'bg-surface-variant'
                }`}
              />
            ))}
            <span className="font-label-md text-label-md text-on-surface-variant ml-2">
              Nivel {currentLevel}/2
            </span>
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-3 rounded-xl text-center font-label-md ${
                gameCompleted || (currentLevel === 1 && feedback.includes('Perfecto'))
                  ? 'bg-primary-fixed text-on-primary-fixed'
                  : 'bg-error-container text-on-error-container'
              }`}
            >
              {feedback}
            </div>
          )}

          {/* =============================
              LEVEL 1: FRUIT BASKETS
              ============================= */}
          {currentLevel === 1 && (
            <>
              {/* Baskets Area */}
              <div className="w-full bg-surface-container-lowest/80 backdrop-blur-md rounded-xl p-4 shadow-inner border-2 border-surface-variant">
                <div className="flex flex-wrap justify-center gap-4">
                  {basketItems.map((item) => (
                    <div
                      key={item.id}
                      className="drop-shadow-md w-24 h-24 md:w-32 md:h-32 flex items-center justify-center cursor-grab hover:scale-105 transition-transform"
                      draggable
                      onDragStart={() => handleDragStartL1(item)}
                      onDragEnd={handleDragEnd}
                    >
                      <img
                        alt={item.alt}
                        className="w-full h-full object-contain pointer-events-none"
                        src={item.src}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Drop Zones */}
              <div className="w-full bg-tertiary-fixed-dim/90 backdrop-blur-sm rounded-xl p-4 shadow-lg border-2 border-tertiary">
                <div className="flex flex-wrap justify-around gap-4">
                  {dropZonesLevel1.map((zone) => {
                    const item = placedItems[zone.id];
                    return (
                      <div key={zone.id} className="relative flex flex-col items-center gap-2">
                        <div
                          className={`${getZoneStatus(zone.id)} w-24 h-24 md:w-32 md:h-32`}
                          data-expected={zone.expected}
                          onDragOver={(e) => handleDragOver(e, zone.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDropL1(e, zone.id)}
                        >
                          {!item && (
                            <span className="text-tertiary/30 text-4xl font-bold">{zone.label}</span>
                          )}
                          {item && (
                            <div className="drop-shadow-md w-24 h-24 md:w-32 md:h-32 flex items-center justify-center">
                              <img
                                alt={item.alt}
                                className="w-full h-full object-contain pointer-events-none"
                                src={item.src}
                              />
                            </div>
                          )}
                        </div>
                        {zone.showLabel && (
                          <span className="bg-surface/80 px-2 py-1 rounded-full text-sm md:text-label-md text-secondary font-bold shadow-sm">
                            {zone.showLabel}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* =============================
              LEVEL 2: MAGIC FLASKS
              ============================= */}
          {currentLevel === 2 && (
            <>
              {/* Drop Zones (Pedestals) */}
              <div className="flex justify-center items-end gap-4 md:gap-8 w-full max-w-5xl px-8 z-10 mt-auto mb-12">
                {dropZonesLevel2.map((zone) => {
                  const item = placedFlasks[zone.id];
                  return (
                    <div key={zone.id} className="flex flex-col items-center justify-end">
                      <div
                        className={`${getZoneStatus(zone.id)} ${zone.sizeClass} p-2 backdrop-blur-md`}
                        data-expected={zone.expected}
                        onDragOver={(e) => handleDragOver(e, zone.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDropL2(e, zone.id)}
                      >
                        {!item && (
                          <span className={`material-symbols-outlined text-outline-variant/50 ${zone.iconSize} absolute pointer-events-none`}>
                            add
                          </span>
                        )}
                        {item && (
                          <div className="w-full h-full flex items-center justify-center">
                            {item.svg}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Inventory Area */}
              <div className="w-full max-w-4xl bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl border-4 border-surface-variant shadow-xl p-md mt-auto mb-4 z-20">
                <h3 className="font-label-lg text-label-lg text-on-surface-variant mb-sm text-center">
                  Inventario
                </h3>
                <div className="flex justify-center items-end gap-2 md:gap-6 min-h-[10rem]">
                  {flaskItems.map((item) => (
                    <div
                      key={item.id}
                      className="drag-item flex flex-col items-center justify-end group cursor-grab"
                      style={{ width: `${item.value * 1.4 + 0.6}rem` }}
                      draggable
                      onDragStart={() => handleDragStartL2(item)}
                      onDragEnd={handleDragEnd}
                    >
                      {item.svg}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Confetti Container */}
        <div
          id="confetti-container"
          className="absolute inset-0 pointer-events-none z-50 overflow-hidden hidden"
        ></div>
      </main>

      {/* BottomNavBar */}
      <nav className="w-full z-50 bg-surface-container-high shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] py-4 shrink-0">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-center px-margin-mobile">
          {!gameCompleted ? (
            <>
              <button
                onClick={handleReset}
                className="bg-surface-container-lowest text-primary font-headline-md text-headline-md rounded-full px-16 py-6 shadow-md border-2 border-primary-fixed-dim hover:bg-surface-container-low transition-all flex items-center gap-sm group"
              >
                <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">
                  refresh
                </span>
                Reiniciar
              </button>
              {currentLevel === 1 && feedback && feedback.includes('Perfecto') ? (
                <button
                  onClick={handleNextLevel}
                  className="bg-primary text-on-primary font-headline-md text-headline-md rounded-full px-16 py-6 shadow-md border-2 border-primary-fixed-dim hover:bg-surface-tint hover:shadow-lg transition-all flex items-center gap-sm group"
                >
                  <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">
                    arrow_forward
                  </span>
                  Siguiente Nivel
                </button>
              ) : (
                <button
                  onClick={handleCheck}
                  className="bg-primary text-on-primary font-headline-md text-headline-md rounded-full px-16 py-6 shadow-md border-2 border-primary-fixed-dim hover:bg-surface-tint hover:shadow-lg transition-all flex items-center gap-sm group"
                >
                  <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">
                    check_circle
                  </span>
                  Comprobar
                </button>
              )}
            </>
          ) : (
            <>
              <button
                onClick={handleRestartGame}
                className="bg-surface-container-lowest text-primary font-headline-md text-headline-md rounded-full px-16 py-6 shadow-md border-2 border-primary-fixed-dim hover:bg-surface-container-low transition-all flex items-center gap-sm group"
              >
                <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">
                  replay
                </span>
                Reintentar
              </button>
              <button
                onClick={handleNextGame}
                className="bg-primary text-on-primary font-headline-md text-headline-md rounded-full px-16 py-6 shadow-md border-2 border-primary-fixed-dim hover:bg-surface-tint hover:shadow-lg transition-all flex items-center gap-sm group"
              >
                <span className="material-symbols-outlined text-4xl group-hover:rotate-12 transition-transform">
                  arrow_forward
                </span>
                Siguiente Juego
              </button>
            </>
          )}
        </div>
      </nav>
    </div>
  );
}
