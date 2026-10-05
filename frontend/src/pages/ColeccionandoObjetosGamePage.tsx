import { useState, useRef, useCallback, useEffect, type MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import KidBackButton from '../components/KidBackButton';

interface GameItem {
  id: string;
  label: string;
  positionClass: string;
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
  color: string;
}

interface WrongIndicator {
  id: number;
  x: number;
  y: number;
}

type SpeechType = 'normal' | 'success' | 'error' | 'win';

const SPARKLE_COLORS = ['#ffe066', '#ffffff', '#ffb3c7', '#b7f0d8', '#9ec5ff', '#d7b4f3'];

const CONFETTI_COLORS = ['#7eb6ff', '#7dcea0', '#ffe066', '#d7b4f3', '#ffb3c7', '#ffb067'];

const items: GameItem[] = [
  {
    id: 'mochila',
    label: 'Mochila',
    positionClass:
      'top-[30%] left-[2%] h-[20%] w-[28%] md:top-[30%] md:left-[2%] md:h-[30%] md:w-[16%] lg:top-[28%] lg:left-[3%] lg:h-[34%] lg:w-[13%]',
  },
  {
    id: 'libros',
    label: 'Libros',
    positionClass:
      'top-[34%] left-[62%] h-[17%] w-[32%] md:top-[28%] md:left-[76%] md:h-[18%] md:w-[18%] lg:top-[26%] lg:left-[80%] lg:h-[20%] lg:w-[14%]',
  },
  {
    id: 'papel',
    label: 'Hoja de papel',
    positionClass:
      'top-[55%] left-[12%] h-[13%] w-[24%] md:top-[50%] md:left-[22%] md:h-[15%] md:w-[12%] lg:top-[48%] lg:left-[24%] lg:h-[16%] lg:w-[11%]',
  },
  {
    id: 'cuaderno',
    label: 'Cuaderno',
    positionClass:
      'top-[54%] left-[42%] h-[14%] w-[24%] md:top-[46%] md:left-[38%] md:h-[20%] md:w-[14%] lg:top-[44%] lg:left-[40%] lg:h-[22%] lg:w-[12%]',
  },
  {
    id: 'lapiz',
    label: 'Lápiz',
    positionClass:
      'top-[70%] left-[28%] h-[10%] w-[48%] md:top-[60%] md:left-[54%] md:h-[10%] md:w-[24%] lg:top-[60%] lg:left-[54%] lg:h-[11%] lg:w-[22%]',
  },
];

const BASE_ROUNDS: Round[] = [
  {
    id: 'mochila',
    name: 'la mochila',
    question: '¿Dónde está la mochila?',
    celebration: '¡Muy bien! ¡Encontraste la mochila!',
  },
  {
    id: 'libros',
    name: 'los libros',
    question: '¿Dónde están los libros?',
    celebration: '¡Excelente! ¡Son los libros!',
  },
  {
    id: 'papel',
    name: 'la hoja de papel',
    question: '¿Dónde está la hoja de papel?',
    celebration: '¡Genial! ¡Encontraste el papel!',
  },
  {
    id: 'cuaderno',
    name: 'el cuaderno',
    question: '¿Dónde está el cuaderno?',
    celebration: '¡Súper! ¡Ese es el cuaderno!',
  },
  {
    id: 'lapiz',
    name: 'el lápiz',
    question: '¿Dónde está el lápiz?',
    celebration: '¡Fantástico! ¡Encontraste el lápiz!',
  },
];

const speechSkins: Record<SpeechType, { bubble: string; tail: string }> = {
  normal: {
    bubble: 'border-[#f5c542] bg-[#fff8d6] text-[#8a5a00]',
    tail: 'border-[#f5c542] bg-[#fff8d6]',
  },
  error: {
    bubble: 'border-[#f07171] bg-[#ffe4e4] text-[#c23b3b]',
    tail: 'border-[#f07171] bg-[#ffe4e4]',
  },
  success: {
    bubble: 'border-[#3ecf86] bg-[#d9f8e4] text-[#1f8a56]',
    tail: 'border-[#3ecf86] bg-[#d9f8e4]',
  },
  win: {
    bubble: 'border-[#a855f7] bg-[#f0dcff] text-[#6b21a8]',
    tail: 'border-[#a855f7] bg-[#f0dcff]',
  },
};

function BackpackArt() {
  return (
    <svg viewBox="0 0 170 200" className="h-full w-full overflow-visible" aria-hidden="true">
      <path d="M85 2v16" stroke="#a86b2a" strokeWidth="8" strokeLinecap="round" />
      <path d="M62 18h46" stroke="#a86b2a" strokeWidth="8" strokeLinecap="round" />
      <circle cx="85" cy="18" r="7" fill="#ffe066" stroke="#e0a106" strokeWidth="3" />
      <path d="M48 70c-20 6-28 34-16 78 12-8 16-30 16-52 0-10 2-18 0-26z" fill="#3d6fd4" stroke="#2f5fbf" strokeWidth="3" />
      <path d="M122 70c20 6 28 34 16 78-12-8-16-30-16-52 0-10-2-18 0-26z" fill="#3d6fd4" stroke="#2f5fbf" strokeWidth="3" />
      <rect x="40" y="48" width="90" height="132" rx="30" fill="#7eb6ff" stroke="#2f5fbf" strokeWidth="6" />
      <path d="M46 74c8-26 70-26 78 0v18H46V74z" fill="#5b93f5" stroke="#2f5fbf" strokeWidth="5" strokeLinejoin="round" />
      <path d="M66 50c0-16 38-16 38 0" fill="none" stroke="#2f5fbf" strokeWidth="8" strokeLinecap="round" />
      <rect x="32" y="118" width="106" height="42" rx="16" fill="#b7f0d8" stroke="#2f9a72" strokeWidth="5" />
      <circle cx="85" cy="139" r="8" fill="#ffe066" stroke="#e0a106" strokeWidth="3" />
      <ellipse cx="84" cy="70" rx="22" ry="8" fill="#ffffff" opacity="0.35" />
    </svg>
  );
}

function BooksArt() {
  return (
    <svg viewBox="0 0 190 150" className="h-full w-full overflow-visible" aria-hidden="true">
      <g transform="rotate(-8 46 90)">
        <rect x="18" y="36" width="46" height="96" rx="8" fill="#ffb3c7" stroke="#e15b86" strokeWidth="5" />
        <rect x="24" y="36" width="9" height="96" fill="#fff0f5" />
        <path d="M40 52h16M40 66h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
      <rect x="68" y="14" width="52" height="118" rx="8" fill="#7dcea0" stroke="#2f9a6a" strokeWidth="5" />
      <rect x="76" y="14" width="10" height="118" fill="#e8fff3" />
      <rect x="98" y="36" width="14" height="20" rx="4" fill="#ffe066" stroke="#e0a106" strokeWidth="2" />
      <g transform="rotate(7 152 88)">
        <rect x="124" y="32" width="46" height="98" rx="8" fill="#9ec5ff" stroke="#3d6fd4" strokeWidth="5" />
        <rect x="130" y="32" width="9" height="98" fill="#eef5ff" />
        <path d="M146 50h16M146 64h16" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function PaperArt() {
  return (
    <svg viewBox="0 0 140 170" className="h-full w-full overflow-visible" aria-hidden="true">
      <path
        d="M22 16h64l32 32v96a14 14 0 0 1-14 14H22a14 14 0 0 1-14-14V30A14 14 0 0 1 22 16z"
        fill="#fffef6"
        stroke="#e0c48a"
        strokeWidth="6"
        strokeLinejoin="round"
      />
      <path d="M86 16v24a8 8 0 0 0 8 8h24" fill="#ffe8b0" stroke="#e0c48a" strokeWidth="6" strokeLinejoin="round" />
      <path d="M30 70h74M30 90h74M30 110h48" stroke="#7eb6ff" strokeWidth="5" strokeLinecap="round" />
      <circle cx="34" cy="132" r="5" fill="#ffb3c7" />
    </svg>
  );
}

function NotebookArt() {
  const rings = [34, 56, 78, 100, 122, 144];
  return (
    <svg viewBox="0 0 160 180" className="h-full w-full overflow-visible" aria-hidden="true">
      {rings.map((y) => (
        <circle key={y} cx="26" cy={y} r="9" fill="#f4f7fb" stroke="#8aa0b8" strokeWidth="4" />
      ))}
      <rect x="36" y="14" width="108" height="154" rx="16" fill="#d7b4f3" stroke="#8d5fd0" strokeWidth="6" />
      <rect x="52" y="38" width="76" height="34" rx="8" fill="#fff4c2" stroke="#e0a106" strokeWidth="4" />
      <path d="M64 52h52" stroke="#e0a106" strokeWidth="4" strokeLinecap="round" />
      <path d="M54 96h72M54 114h72M54 132h46" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" />
      <ellipse cx="92" cy="46" rx="20" ry="6" fill="#ffffff" opacity="0.4" />
    </svg>
  );
}

function PencilArt() {
  return (
    <svg viewBox="0 0 230 72" className="h-full w-full overflow-visible" aria-hidden="true">
      <rect x="6" y="16" width="36" height="40" rx="10" fill="#ffb3c7" stroke="#e15b86" strokeWidth="4" />
      <rect x="40" y="16" width="18" height="40" fill="#d5dee8" stroke="#8aa0b8" strokeWidth="4" />
      <path d="M40 28h18M40 40h18" stroke="#9aafc2" strokeWidth="3" />
      <rect x="56" y="12" width="122" height="48" rx="10" fill="#ffe066" stroke="#e0a106" strokeWidth="4" />
      <path d="M88 12v48M118 12v48M148 12v48" stroke="#f0c14a" strokeWidth="3" />
      <polygon points="178,12 220,36 178,60" fill="#f0c48a" stroke="#c4894a" strokeWidth="4" strokeLinejoin="round" />
      <polygon points="202,28 220,36 202,44" fill="#3d4454" />
    </svg>
  );
}

function ItemIllustration({ id }: { id: string }) {
  switch (id) {
    case 'mochila':
      return <BackpackArt />;
    case 'libros':
      return <BooksArt />;
    case 'papel':
      return <PaperArt />;
    case 'cuaderno':
      return <NotebookArt />;
    case 'lapiz':
      return <PencilArt />;
    default:
      return null;
  }
}

function SparkleStar({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 24 24" className="h-7 w-7 md:h-9 md:w-9" aria-hidden="true">
      <path
        fill={color}
        stroke="#ffffff"
        strokeWidth="1"
        d="M12 1.2l2.1 6.2 6.6.2-5.2 4.1 1.8 6.4L12 14.6 6.7 18.1l1.8-6.4L3.3 7.6l6.6-.2z"
      />
    </svg>
  );
}

function WrongMark() {
  return (
    <svg viewBox="0 0 64 64" className="h-12 w-12 drop-shadow-md md:h-16 md:w-16" aria-hidden="true">
      <circle cx="32" cy="32" r="26" fill="#ffe4e4" stroke="#ef4444" strokeWidth="5" />
      <path d="M22 22l20 20M42 22L22 42" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

function ClassroomBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-[#b7e6ff] via-[#fff6e2] to-[#ffe6c2]" />

      <svg className="absolute left-[4%] top-[3%] h-[10%] w-[18%] opacity-80" viewBox="0 0 160 70">
        <ellipse cx="48" cy="40" rx="34" ry="18" fill="#ffffff" />
        <ellipse cx="78" cy="34" rx="28" ry="16" fill="#ffffff" />
        <ellipse cx="104" cy="42" rx="26" ry="14" fill="#ffffff" />
      </svg>
      <svg className="absolute right-[6%] top-[2%] h-[8%] w-[14%] opacity-80" viewBox="0 0 140 60">
        <ellipse cx="40" cy="34" rx="28" ry="14" fill="#ffffff" />
        <ellipse cx="72" cy="28" rx="24" ry="14" fill="#ffffff" />
        <ellipse cx="100" cy="36" rx="22" ry="12" fill="#ffffff" />
      </svg>

      <div className="absolute left-[1%] top-[15%] z-[1] h-[15%] w-[18%] md:left-[2%] md:top-[11%] md:h-[24%] md:w-[15%] lg:top-[10%] lg:h-[28%] lg:w-[13%]">
        <svg viewBox="0 0 180 230" className="h-full w-full">
          <rect x="8" y="8" width="164" height="214" rx="18" fill="#f0c48a" stroke="#c4894a" strokeWidth="8" />
          <rect x="22" y="22" width="136" height="186" rx="10" fill="#9ad7ff" />
          <circle cx="78" cy="78" r="22" fill="#ffe066" />
          <ellipse cx="108" cy="60" rx="18" ry="10" fill="#ffffff" />
          <path d="M90 18v194M22 112h136" stroke="#f0c48a" strokeWidth="8" />
        </svg>
      </div>

      <div className="absolute left-[16%] top-[17%] z-[1] h-[24%] w-[66%] md:left-[20%] md:top-[13%] md:h-[30%] md:w-[48%] lg:left-[18%] lg:top-[12%] lg:h-[34%] lg:w-[50%]">
        <svg viewBox="0 0 560 320" className="h-full w-full">
          <rect x="8" y="8" width="544" height="270" rx="22" fill="#e0a85c" />
          <rect x="28" y="26" width="504" height="214" rx="14" fill="#2f6b4f" />
          <path d="M70 150h90M70 176h70" stroke="#d7f5e4" strokeWidth="6" strokeLinecap="round" opacity="0.8" />
          <circle cx="250" cy="150" r="28" fill="none" stroke="#fff4c2" strokeWidth="6" />
          <path d="M250 134v18l12 8" stroke="#fff4c2" strokeWidth="5" strokeLinecap="round" />
          <path d="M340 120l28 40h-56z" fill="none" stroke="#d7f5e4" strokeWidth="6" strokeLinejoin="round" />
          <rect x="392" y="128" width="70" height="46" rx="6" fill="none" stroke="#fff4c2" strokeWidth="6" />
          <rect x="36" y="248" width="488" height="28" rx="8" fill="#c4894a" />
          <rect x="250" y="254" width="36" height="12" rx="4" fill="#fffef6" />
          <rect x="300" y="256" width="22" height="8" rx="3" fill="#ffb3c7" />
        </svg>
      </div>

      <div className="absolute left-[56%] top-[40%] z-[2] h-[12%] w-[12%] md:left-[74%] md:top-[30%] md:h-[14%] md:w-[8%] lg:left-[75%] lg:top-[28%] lg:h-[16%] lg:w-[7%]">
        <svg viewBox="0 0 80 110" className="h-full w-full">
          <ellipse cx="40" cy="100" rx="24" ry="8" fill="#e7b56a" />
          <path d="M40 92c-16 0-22-18-18-32 6 6 12 8 18 8s12-2 18-8c4 14-2 32-18 32z" fill="#f0c48a" stroke="#c4894a" strokeWidth="3" />
          <path d="M40 70c-6-18-2-34 0-46 2 12 6 28 0 46z" fill="#3dbe7a" />
          <ellipse cx="28" cy="48" rx="14" ry="8" fill="#7dcea0" transform="rotate(-30 28 48)" />
          <ellipse cx="54" cy="44" rx="14" ry="8" fill="#4ec98a" transform="rotate(28 54 44)" />
          <ellipse cx="40" cy="36" rx="12" ry="8" fill="#b7f0d8" />
        </svg>
      </div>

      <div className="absolute left-[56%] top-[47%] z-[2] h-[3.5%] w-[40%] md:left-[74%] md:top-[43%] md:h-[3.5%] md:w-[23%] lg:left-[76%] lg:top-[43%] lg:h-[4%] lg:w-[21%]">
        <svg viewBox="0 0 240 36" preserveAspectRatio="none" className="h-full w-full">
          <rect x="0" y="8" width="240" height="18" rx="6" fill="#f0c48a" stroke="#c4894a" strokeWidth="4" />
          <path d="M28 26v8M212 26v8" stroke="#a86b2a" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="absolute bottom-0 left-0 z-0 h-[30%] w-full md:h-[32%] lg:h-[34%]">
        <svg viewBox="0 0 1200 280" preserveAspectRatio="none" className="h-full w-full">
          <rect width="1200" height="280" fill="#e7b56a" />
          {Array.from({ length: 6 }, (_, row) => (
            <g key={row}>
              <rect y={row * 46} width="1200" height="44" fill={row % 2 === 0 ? '#f3c98a' : '#e7b56a'} />
              <line x1="0" y1={row * 46} x2="1200" y2={row * 46} stroke="#c4894a" strokeWidth="3" />
              <line
                x1={180 + (row % 2) * 220}
                y1={row * 46}
                x2={180 + (row % 2) * 220}
                y2={row * 46 + 44}
                stroke="#d4a15c"
                strokeWidth="3"
              />
              <line
                x1={620 + (row % 2) * 160}
                y1={row * 46}
                x2={620 + (row % 2) * 160}
                y2={row * 46 + 44}
                stroke="#d4a15c"
                strokeWidth="3"
              />
            </g>
          ))}
        </svg>
        <div className="absolute inset-x-0 top-0 h-[7%] bg-[#c9843f]" />
      </div>

      <div className="absolute bottom-[4%] left-[12%] z-[1] h-[14%] w-[76%] md:bottom-[6%] md:left-[18%] md:w-[64%] lg:bottom-[7%] lg:left-[20%] lg:w-[60%]">
        <svg viewBox="0 0 520 80" preserveAspectRatio="none" className="h-full w-full">
          <ellipse cx="260" cy="40" rx="250" ry="30" fill="#ffd0de" />
          <ellipse cx="260" cy="40" rx="190" ry="18" fill="#fff0c9" />
          <ellipse cx="260" cy="40" rx="110" ry="10" fill="#ffb3c7" />
        </svg>
      </div>

      <div className="absolute left-[8%] top-[64%] z-[2] h-[22%] w-[84%] md:left-[18%] md:top-[61%] md:h-[26%] md:w-[64%] lg:left-[20%] lg:top-[59%] lg:h-[28%] lg:w-[60%]">
        <div className="absolute inset-x-0 top-0 h-[42%] rounded-[1.4rem] border-[5px] border-[#c4894a] bg-[#f6d7a2] shadow-[0_7px_0_#e0a85c]">
          <div className="absolute left-[42%] top-1/2 h-[48%] w-[16%] -translate-y-1/2 rounded-xl border-[3px] border-[#d4a15c] bg-[#ffe8bf]">
            <span className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-[#e0a106] bg-[#ffe066]" />
          </div>
          <span className="absolute inset-x-[8%] top-[18%] h-[16%] rounded-full bg-white/40" />
        </div>
        <div className="absolute bottom-0 left-[7%] top-[38%] w-[5%] rounded-b-2xl border-x-4 border-b-4 border-[#c4894a] bg-[#e7b56a]" />
        <div className="absolute bottom-0 right-[7%] top-[38%] w-[5%] rounded-b-2xl border-x-4 border-b-4 border-[#c4894a] bg-[#e7b56a]" />
      </div>
    </div>
  );
}

export default function ColeccionandoObjetos() {
  const navigate = useNavigate();

  const [rounds, setRounds] = useState<Round[]>(BASE_ROUNDS);
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [foundObjects, setFoundObjects] = useState<Set<string>>(new Set());
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [showSpeech, setShowSpeech] = useState(true);
  const [speechText, setSpeechText] = useState(`¡Hola! ${BASE_ROUNDS[0].question}`);
  const [speechType, setSpeechType] = useState<SpeechType>('normal');
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const [wrongIndicators, setWrongIndicators] = useState<WrongIndicator[]>([]);
  const [shakingItem, setShakingItem] = useState<string | null>(null);

  const gameContainerRef = useRef<HTMLDivElement>(null);
  const sparkleIdRef = useRef(0);
  const wrongIdRef = useRef(0);
  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const currentRound = rounds[currentRoundIndex];
  const speechSkin = speechSkins[speechType];

  const clearAllTimeouts = () => {
    timeoutRefs.current.forEach((timeout) => {
      clearTimeout(timeout);
    });
    timeoutRefs.current = [];
  };

  const createSparkles = useCallback((x: number, y: number) => {
    const newSparkles: Sparkle[] = [];

    for (let i = 0; i < 8; i++) {
      newSparkles.push({
        id: sparkleIdRef.current++,
        x: x + (Math.random() * 10 - 5),
        y: y + (Math.random() * 10 - 5),
        color: SPARKLE_COLORS[i % SPARKLE_COLORS.length],
      });
    }

    setSparkles((previous) => [...previous, ...newSparkles]);

    const timeout = setTimeout(() => {
      setSparkles((previous) =>
        previous.filter((sparkle) => !newSparkles.some((newSparkle) => newSparkle.id === sparkle.id)),
      );
    }, 900);

    timeoutRefs.current.push(timeout);
  }, []);

  const showWrongFeedback = useCallback(
    (x: number, y: number, itemId: string) => {
      const newId = wrongIdRef.current++;

      setWrongIndicators((previous) => [...previous, { id: newId, x, y }]);
      setShakingItem(itemId);
      setSpeechText('¡Ups! Inténtalo otra vez.');
      setSpeechType('error');
      setShowSpeech(true);

      const timeout = setTimeout(() => {
        setWrongIndicators((previous) => previous.filter((indicator) => indicator.id !== newId));
        setShakingItem(null);
        setSpeechText(currentRound.question);
        setSpeechType('normal');
      }, 3200);

      timeoutRefs.current.push(timeout);
    },
    [currentRound],
  );

  const handleItemClick = (item: GameItem, event: MouseEvent<HTMLButtonElement>) => {
    if (isProcessing || gameWon) {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const gameRect = gameContainerRef.current?.getBoundingClientRect();

    if (!gameRect) {
      return;
    }

    const x = ((rect.left + rect.width / 2 - gameRect.left) / gameRect.width) * 100;
    const y = ((rect.top + rect.height / 2 - gameRect.top) / gameRect.height) * 100;

    if (item.id !== currentRound.id) {
      showWrongFeedback(x, y, item.id);
      return;
    }

    setIsProcessing(true);
    createSparkles(x, y);

    setFoundObjects((previous) => {
      const updated = new Set(previous);
      updated.add(item.id);
      return updated;
    });

    setSpeechText(currentRound.celebration);
    setSpeechType('success');
    setShowSpeech(true);

    const isLastRound = currentRoundIndex === rounds.length - 1;

    const timeout = setTimeout(() => {
      if (isLastRound) {
        setGameWon(true);
        setSpeechText('¡Completaste todas las rondas!');
        setSpeechType('win');
        setShowSpeech(true);
      } else {
        const nextRoundIndex = currentRoundIndex + 1;
        setCurrentRoundIndex(nextRoundIndex);
        setSpeechText(rounds[nextRoundIndex].question);
        setSpeechType('normal');
        setShowSpeech(true);
      }

      setIsProcessing(false);
    }, 3500);

    timeoutRefs.current.push(timeout);
  };

  const handleRestart = () => {
    clearAllTimeouts();
    setRounds(BASE_ROUNDS);
    setCurrentRoundIndex(0);
    setFoundObjects(new Set());
    setIsProcessing(false);
    setGameWon(false);
    setShowSpeech(true);
    setSpeechText(`¡Hola! ${BASE_ROUNDS[0].question}`);
    setSpeechType('normal');
    setSparkles([]);
    setWrongIndicators([]);
    setShakingItem(null);

    const particles = gameContainerRef.current?.querySelectorAll('.particle');
    particles?.forEach((particle) => particle.remove());
  };

  const handleExit = () => {
    navigate('/semana/2');
  };

  const createConfetti = useCallback(() => {
    const container = gameContainerRef.current;
    if (!container) {
      return;
    }

    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.position = 'absolute';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = '-5%';
      particle.style.width = `${8 + Math.random() * 8}px`;
      particle.style.height = `${12 + Math.random() * 10}px`;
      particle.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      particle.style.borderRadius = i % 3 === 0 ? '999px' : '3px';
      particle.style.border = '2px solid rgba(255,255,255,0.75)';
      particle.style.animation = `fall ${2 + Math.random() * 3}s linear forwards`;
      particle.style.animationDelay = `${Math.random() * 1.5}s`;
      particle.style.zIndex = '60';
      container.appendChild(particle);
    }
  }, []);

  useEffect(() => {
    if (gameWon) {
      createConfetti();
    }
  }, [gameWon, createConfetti]);

  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  return (
    <div
      ref={gameContainerRef}
      className={`coleccion-juego relative h-full min-h-screen w-full !overflow-hidden font-headline-md select-none ${
        gameWon ? 'animate-bounce-happy' : ''
      }`}
    >
      <ClassroomBackdrop />

      <div className="absolute left-3 top-3 z-50 sm:left-4 sm:top-4">
        <KidBackButton onClick={handleExit} label="Volver a la Semana 2" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[1%] z-40 flex flex-col items-center gap-1 px-16 sm:top-[1.5%] sm:flex-row sm:justify-center sm:gap-3">
        <h1 className="rounded-full border-4 border-[#c4b5fd] bg-white/95 px-4 py-1 text-center font-extrabold text-[#6d28d9] shadow-[0_4px_0_#c4b5fd] sm:px-6">
          Coleccionando objetos
        </h1>
        <div className="flex items-center gap-2 rounded-full border-4 border-[#ddd6fe] bg-white/95 px-3 py-1 shadow-[0_3px_0_#ddd6fe]">
          <span className="text-xs font-extrabold text-[#6d28d9] sm:text-sm md:text-base">
            Ronda {currentRoundIndex + 1} de {rounds.length}
          </span>
          <span className="flex gap-1">
            {rounds.map((round, index) => (
              <span
                key={round.id}
                className={`h-2.5 w-2.5 rounded-full border-2 md:h-3 md:w-3 ${
                  foundObjects.has(round.id)
                    ? 'border-[#188a52] bg-[#3ecf86]'
                    : index === currentRoundIndex
                      ? 'animate-pulse border-[#e0a106] bg-[#ffe066]'
                      : 'border-[#d8c7f5] bg-white'
                }`}
              />
            ))}
          </span>
        </div>
      </div>

      {showSpeech && (
        <div
          className={`pointer-events-none absolute left-1/2 z-30 w-[min(88%,22rem)] -translate-x-1/2 rounded-3xl border-4 px-4 py-2 text-center shadow-[0_6px_0_rgba(90,60,20,0.12)] top-[15%] sm:top-[13%] sm:w-[min(70%,24rem)] sm:px-5 sm:py-3 md:top-[12%] ${speechSkin.bubble}`}
        >
          <p aria-live="polite" className="text-sm font-extrabold leading-snug sm:text-base md:text-lg">
            {speechText}
          </p>
          <span
            className={`absolute -bottom-[11px] left-1/2 h-5 w-5 -translate-x-1/2 rotate-45 border-b-4 border-r-4 ${speechSkin.tail}`}
          />
        </div>
      )}

      {items.map((item, index) => {
        const isCollected = foundObjects.has(item.id);
        const isShaking = shakingItem === item.id;

        const artClass = isCollected
          ? 'animate-reveal drop-shadow-[0_0_15px_rgba(255,255,255,0.9)]'
          : isShaking
            ? 'brightness-0 opacity-70 drop-shadow-[0_0_12px_rgba(239,68,68,0.85)]'
            : 'animate-bob brightness-0 opacity-70 drop-shadow-lg';

        return (
          <button
            key={item.id}
            type="button"
            aria-label={item.label}
            disabled={isCollected || isProcessing}
            onClick={(event) => handleItemClick(item, event)}
            className={`objeto-btn absolute z-20 border-0 bg-transparent p-0 disabled:opacity-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ffe066] ${item.positionClass} ${
              isShaking ? 'animate-shake' : ''
            } ${!isCollected && !isProcessing ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
          >
            <span
              className={`block h-full w-full ${artClass}`}
              style={!isCollected && !isShaking ? { animationDelay: `${index * 0.18}s` } : undefined}
            >
              <ItemIllustration id={item.id} />
            </span>
          </button>
        );
      })}

      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="pointer-events-none absolute z-50 animate-sparkle"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <SparkleStar color={sparkle.color} />
        </div>
      ))}

      {wrongIndicators.map((indicator) => (
        <div
          key={indicator.id}
          className="pointer-events-none absolute z-50 animate-float-up"
          style={{
            left: `${indicator.x}%`,
            top: `${indicator.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <WrongMark />
        </div>
      ))}

      {gameWon && (
        <div className="absolute inset-0 z-[70] flex items-center justify-center bg-[#4c1d95]/45 p-3 backdrop-blur-sm">
          <div className="flex max-h-[94%] w-full max-w-[520px] flex-col overflow-hidden rounded-3xl border-4 border-white bg-gradient-to-b from-[#fff8e8] to-[#ffe8f4] text-center shadow-2xl">
            <div className="px-4 pb-2 pt-3 sm:px-6 sm:pt-5">
              <div className="mx-auto mb-1 h-10 w-10 sm:h-12 sm:w-12">
                <svg viewBox="0 0 64 64" className="h-full w-full" aria-hidden="true">
                  <path
                    fill="#ffe066"
                    stroke="#e0a106"
                    strokeWidth="3"
                    d="M32 4l6 16h16l-13 10 5 16-14-9-14 9 5-16L10 20h16z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-[#6d28d9] sm:text-3xl">¡Muy bien!</h2>
              <p className="mx-auto mt-1 max-w-sm text-sm font-bold text-[#7c5cbf] sm:text-base">
                ¡Completaste todas las rondas y encontraste todos los objetos!
              </p>
            </div>

            <div className="mx-3 overflow-y-auto rounded-[1.6rem] border-4 border-[#d4a15c] bg-gradient-to-b from-[#fff6e4] to-[#f6d7a2] px-2 py-2 shadow-inner sm:mx-5 sm:px-4 sm:py-3">
              <p className="mb-1 text-xs font-extrabold uppercase tracking-wide text-[#a86b2a] sm:text-sm">
                Tu colección
              </p>
              <div className="grid grid-cols-5 items-end gap-1 sm:gap-2">
                {items.map((item) => (
                  <div key={item.id} className="flex flex-col items-center gap-1">
                    <div className="flex h-11 w-full items-center justify-center sm:h-16">
                      <ItemIllustration id={item.id} />
                    </div>
                    <span className="text-sm font-extrabold leading-tight text-[#7a4b12] sm:text-xs">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mx-1 mt-2 h-2.5 rounded-full bg-[#c4894a] shadow-[inset_0_2px_0_rgba(255,255,255,0.35)]" />
            </div>

            <div className="flex flex-col justify-center gap-2 px-4 py-3 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
              <button
                type="button"
                onClick={handleRestart}
                className="rounded-full border-b-4 border-[#e0a106] bg-[#ffe066] px-6 py-2.5 font-extrabold text-[#7a4e00] transition-transform hover:scale-105 sm:py-3"
              >
                Volver a jugar
              </button>
              <button
                type="button"
                onClick={handleExit}
                className="rounded-full border-b-4 border-[#4c3480] bg-[#7c5cbf] px-6 py-2.5 font-extrabold text-white transition-transform hover:scale-105 sm:py-3"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes sparkle {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
        }

        @keyframes itemShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }

        @keyframes floatUp {
          0% { opacity: 1; transform: translate(-50%, -50%) translateY(0); }
          100% { opacity: 0; transform: translate(-50%, -50%) translateY(-60px); }
        }

        @keyframes fall {
          from { transform: translateY(-20px) rotate(0deg); }
          to { transform: translateY(110vh) rotate(360deg); }
        }

        @keyframes bounceHappy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.015); }
        }

        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-7px); }
        }

        @keyframes revealPop {
          0% { transform: scale(0.72); }
          60% { transform: scale(1.18); }
          100% { transform: scale(1.1); }
        }

        .animate-sparkle {
          animation: sparkle 0.9s ease-out forwards;
        }

        .coleccion-juego .animate-shake {
          outline: none !important;
          box-shadow: none !important;
          background-color: transparent !important;
          animation: itemShake 0.45s ease-in-out;
        }

        .animate-float-up {
          animation: floatUp 1.2s ease-out forwards;
        }

        .animate-bounce-happy {
          animation: bounceHappy 0.8s ease-in-out 2;
        }

        .animate-bob {
          animation: bob 2.8s ease-in-out infinite;
        }

        .animate-reveal {
          animation: revealPop 0.6s ease-out forwards;
        }

        .coleccion-juego button.objeto-btn,
        .coleccion-juego button.objeto-btn:hover,
        .coleccion-juego button.objeto-btn:focus {
          background-color: transparent;
          border-color: transparent;
          color: inherit;
        }

        .coleccion-juego button.objeto-btn:hover span {
          color: inherit;
        }

        @media (prefers-reduced-motion: reduce) {
          .coleccion-juego *,
          .coleccion-juego *::before,
          .coleccion-juego *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}
