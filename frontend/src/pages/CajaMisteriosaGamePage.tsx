import { useState, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { playMiss, playSuccess } from '../services/sounds';
import KidBackButton from '../components/KidBackButton';

interface Level {
  id: number;
  name: string;
  sound: string;
  options: string[];
}

const baseLevels: Level[] = [
  { id: 1, name: 'Carro', sound: '¡Brum, brum! ¡Pi-píii!', options: ['Carro', 'Avión', 'Tren', 'Bicicleta'] },
  { id: 2, name: 'Pato', sound: '¡Cua, cua, cua!', options: ['Pollito', 'Pato', 'Pajarito', 'Rana'] },
  { id: 3, name: 'Gato', sound: '¡Miau, miau! ¡Prrr!', options: ['Perro', 'León', 'Gato', 'Conejo'] },
  { id: 4, name: 'Reloj', sound: '¡Tic-tac, tic-tac!', options: ['Reloj', 'Brújula', 'Teléfono', 'Calculadora'] },
  { id: 5, name: 'Manzana', sound: '¡Chomp, crunch! (Sonido de mordisco)', options: ['Pera', 'Naranja', 'Plátano', 'Manzana'] },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatPoints(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function createSparkles(container: HTMLElement) {
  const colors = ['#f4a261', '#2a9d8f', '#e76f51', '#e9c46a', '#7eb6d9'];
  container.querySelectorAll('.sparkle-particle').forEach((node) => node.remove());
  for (let i = 0; i < 8; i++) {
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle-particle absolute pointer-events-none z-30';
    const color = colors[Math.floor(Math.random() * colors.length)];
    const size = 18 + Math.random() * 18;
    sparkle.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="${color}" aria-hidden="true"><path d="M12 2.2l1.7 5.6 5.8.2-4.6 3.6 1.6 5.6L12 14.6 7.5 17.2l1.6-5.6L4.5 8l5.8-.2z"/></svg>`;

    const angle = Math.random() * Math.PI * 2;
    const radius = 80 + Math.random() * 40;
    const tx = Math.cos(angle) * radius;
    const ty = Math.sin(angle) * radius;

    sparkle.style.left = `calc(50% - 12px + ${tx}px)`;
    sparkle.style.top = `calc(50% - 12px + ${ty}px)`;
    sparkle.style.animationDelay = `${Math.random() * 0.2}s`;
    sparkle.addEventListener('animationend', () => sparkle.remove());
    container.appendChild(sparkle);
  }
}

let mysteryAudio: AudioContext | null = null;
let activeSources: Array<OscillatorNode | AudioBufferSourceNode> = [];

function getMysteryAudio(): AudioContext | null {
  const AudioCtx =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!mysteryAudio) mysteryAudio = new AudioCtx();
  return mysteryAudio;
}

function stopMysterySound() {
  activeSources.forEach((node) => {
    try {
      node.stop();
    } catch {
      /* already stopped */
    }
  });
  activeSources = [];
}

function envTone(
  ctx: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType,
  volume: number,
  freqEnd?: number,
) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  if (freqEnd !== undefined) {
    osc.frequency.linearRampToValueAtTime(freqEnd, start + dur);
  }
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(volume, start + Math.min(0.03, dur / 2));
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
  activeSources.push(osc);
}

function noiseBurst(ctx: AudioContext, start: number, dur: number, volume: number, freq: number) {
  const length = Math.max(1, Math.floor(ctx.sampleRate * dur));
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(freq, start);
  filter.Q.value = 0.8;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(volume, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  src.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  src.start(start);
  src.stop(start + dur);
  activeSources.push(src);
}

function scheduleMysterySound(ctx: AudioContext, name: string) {
  const t = ctx.currentTime + 0.02;
  switch (name) {
    case 'Carro':
      envTone(ctx, 140, t, 0.22, 'triangle', 0.09, 78);
      envTone(ctx, 120, t + 0.26, 0.22, 'triangle', 0.08, 68);
      envTone(ctx, 880, t + 0.58, 0.09, 'square', 0.035);
      envTone(ctx, 980, t + 0.76, 0.14, 'square', 0.04);
      break;
    case 'Pato':
      envTone(ctx, 680, t, 0.16, 'triangle', 0.11, 260);
      envTone(ctx, 640, t + 0.28, 0.16, 'triangle', 0.11, 240);
      envTone(ctx, 620, t + 0.56, 0.18, 'triangle', 0.1, 220);
      break;
    case 'Gato':
      envTone(ctx, 380, t, 0.28, 'triangle', 0.08, 820);
      envTone(ctx, 760, t + 0.26, 0.34, 'triangle', 0.07, 320);
      envTone(ctx, 520, t + 0.7, 0.26, 'triangle', 0.07, 700);
      envTone(ctx, 160, t + 1.05, 0.4, 'sine', 0.05, 110);
      break;
    case 'Reloj':
      for (let i = 0; i < 6; i++) {
        envTone(ctx, i % 2 === 0 ? 1320 : 880, t + i * 0.22, 0.045, 'square', 0.04);
      }
      break;
    case 'Manzana':
      noiseBurst(ctx, t, 0.1, 0.18, 1600);
      noiseBurst(ctx, t + 0.18, 0.14, 0.2, 980);
      break;
    default:
      break;
  }
}

function playMysterySound(name: string) {
  const ctx = getMysteryAudio();
  if (!ctx) return;
  const start = () => {
    stopMysterySound();
    scheduleMysterySound(ctx, name);
  };
  if (ctx.state === 'suspended') {
    void ctx.resume().then(start);
    return;
  }
  start();
}

function SpeakerIcon({ active }: { active: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="h-9 w-9 shrink-0 md:h-11 md:w-11" aria-hidden="true">
      <rect x="6" y="18" width="8" height="12" rx="2" fill="currentColor" />
      <path d="M14 18 L26 10 V38 L14 30 Z" fill="currentColor" />
      <path
        d="M32 18c2.4 2.6 2.4 9.4 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={active ? 'animate-pulse' : ''}
      />
      <path
        d="M37 13c4.6 5 4.6 17 0 22"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        className={active ? 'animate-pulse' : ''}
      />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-7 w-7 shrink-0" aria-hidden="true">
      <circle cx="20" cy="20" r="11" fill="#fff8ea" stroke="currentColor" strokeWidth="3.5" />
      <path d="M28 28l9 9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
      <path d="M38 8l1.4 3.6 3.6 1.4-3.6 1.4L38 18l-1.4-3.6-3.6-1.4 3.6-1.4z" fill="#f4b942" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M12 2.4l2.1 6.2h6.5l-5.2 3.9 2 6.3L12 15.2 6.6 18.8l2-6.3L3.4 8.6h6.5z"
      />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M5 12.5l4.2 4.2L19 7.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
      <path d="M7 7l10 10M17 7L7 17" strokeLinecap="round" />
    </svg>
  );
}

function MedalArt() {
  return (
    <svg viewBox="0 0 120 120" className="h-20 w-20 md:h-28 md:w-28" aria-hidden="true">
      <path d="M40 18h16l8 28H48z" fill="#6aa2e8" />
      <path d="M64 18h16l-8 28H56z" fill="#ef6b6b" />
      <circle cx="60" cy="74" r="34" fill="#f6c445" stroke="#c49212" strokeWidth="4" />
      <circle cx="60" cy="74" r="24" fill="#fff6d8" stroke="#e2b23a" strokeWidth="3" />
      <path d="M60 58l3.2 8.2H72l-6.8 5.2 2.6 8.2L60 74.8 52.2 79.6l2.6-8.2L48 66.2h8.8z" fill="#e2b23a" />
    </svg>
  );
}

function CarArt() {
  return (
    <svg viewBox="0 0 200 160" className="h-full w-full" aria-hidden="true">
      <ellipse cx="100" cy="142" rx="68" ry="8" fill="#8fbf86" />
      <path
        d="M34 92h132c6 0 10 5 10 12v6c0 8-6 14-14 14H38c-8 0-14-6-14-14v-6c0-7 4-12 10-12z"
        fill="#ff8f86"
        stroke="#6d3b38"
        strokeWidth="4"
      />
      <path
        d="M70 92l14-32c3-7 9-12 17-12h30c8 0 14 5 18 12l12 32H70z"
        fill="#ffb0a8"
        stroke="#6d3b38"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      <path
        d="M84 90l10-24c2-5 6-8 12-8h16c6 0 10 3 12 8l8 24H84z"
        fill="#d7f4ff"
        stroke="#6d3b38"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M118 58v32" stroke="#6d3b38" strokeWidth="3" />
      <circle cx="66" cy="116" r="16" fill="#3e4856" stroke="#2a313b" strokeWidth="3" />
      <circle cx="66" cy="116" r="6" fill="#f7f4ee" />
      <circle cx="142" cy="116" r="16" fill="#3e4856" stroke="#2a313b" strokeWidth="3" />
      <circle cx="142" cy="116" r="6" fill="#f7f4ee" />
      <circle cx="166" cy="100" r="6" fill="#ffe56a" stroke="#6d3b38" strokeWidth="2" />
      <path d="M148 104c4 5 12 5 16 0" fill="none" stroke="#6d3b38" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function DuckArt() {
  return (
    <svg viewBox="0 0 200 170" className="h-full w-full" aria-hidden="true">
      <ellipse cx="78" cy="150" rx="16" ry="7" fill="#f4a03c" stroke="#c56d16" strokeWidth="3" />
      <ellipse cx="118" cy="150" rx="16" ry="7" fill="#f4a03c" stroke="#c56d16" strokeWidth="3" />
      <ellipse cx="98" cy="108" rx="58" ry="36" fill="#ffe566" stroke="#d2a30e" strokeWidth="4" />
      <ellipse cx="78" cy="112" rx="22" ry="13" fill="#ffd84a" stroke="#d2a30e" strokeWidth="3" transform="rotate(-16 78 112)" />
      <circle cx="148" cy="70" r="30" fill="#ffe566" stroke="#d2a30e" strokeWidth="4" />
      <ellipse cx="128" cy="96" rx="18" ry="14" fill="#ffe566" />
      <ellipse cx="178" cy="78" rx="20" ry="11" fill="#f4a03c" stroke="#c56d16" strokeWidth="3" />
      <path d="M160 78h34" stroke="#c56d16" strokeWidth="2" />
      <circle cx="156" cy="62" r="5.5" fill="#2c3e50" />
      <circle cx="158" cy="60" r="2" fill="#fff" />
      <circle cx="138" cy="76" r="5" fill="#ffc1c8" />
    </svg>
  );
}

function CatArt() {
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      <path d="M150 128c22 6 26-18 14-30" fill="none" stroke="#e08a45" strokeWidth="10" strokeLinecap="round" />
      <ellipse cx="100" cy="132" rx="52" ry="34" fill="#f6b26b" stroke="#c47a3a" strokeWidth="4" />
      <ellipse cx="74" cy="158" rx="14" ry="8" fill="#f8d3a8" stroke="#c47a3a" strokeWidth="3" />
      <ellipse cx="126" cy="158" rx="14" ry="8" fill="#f8d3a8" stroke="#c47a3a" strokeWidth="3" />
      <path d="M62 78 L50 28 L94 64 Z" fill="#f6b26b" stroke="#c47a3a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M138 78 L150 28 L106 64 Z" fill="#f6b26b" stroke="#c47a3a" strokeWidth="4" strokeLinejoin="round" />
      <path d="M66 72 L58 40 L86 62 Z" fill="#f7c6c6" />
      <path d="M134 72 L142 40 L114 62 Z" fill="#f7c6c6" />
      <circle cx="100" cy="88" r="42" fill="#f6b26b" stroke="#c47a3a" strokeWidth="4" />
      <path d="M78 58c6 8 10 8 16 0M96 52c5 8 9 8 14 0M118 58c4 7 8 7 12 0" fill="none" stroke="#e08a45" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="84" cy="88" rx="7" ry="9" fill="#2c3e50" />
      <ellipse cx="116" cy="88" rx="7" ry="9" fill="#2c3e50" />
      <circle cx="86" cy="85" r="2.4" fill="#fff" />
      <circle cx="118" cy="85" r="2.4" fill="#fff" />
      <path d="M100 100 l-6 6 h12 z" fill="#e07a8a" />
      <path d="M94 110c4 6 8 6 12 0" fill="none" stroke="#c47a3a" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M72 102H50M74 110H54M128 102h22M126 110h20" stroke="#c47a3a" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

function ClockArt() {
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      <rect x="70" y="156" width="16" height="12" rx="3" fill="#2f4f86" />
      <rect x="114" y="156" width="16" height="12" rx="3" fill="#2f4f86" />
      <circle cx="100" cy="104" r="56" fill="#6aa2e8" stroke="#2c4d86" strokeWidth="5" />
      <circle cx="100" cy="104" r="42" fill="#fff8ea" stroke="#2c4d86" strokeWidth="4" />
      <path d="M100 70v8M100 130v8M68 104h8M124 104h8" stroke="#2c4d86" strokeWidth="3" strokeLinecap="round" />
      <path d="M100 104V76" stroke="#2c3e50" strokeWidth="4" strokeLinecap="round" />
      <path d="M100 104l20 12" stroke="#e25b6a" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="104" r="5" fill="#e25b6a" />
      <circle cx="64" cy="48" r="16" fill="#f6c445" stroke="#c49212" strokeWidth="4" />
      <circle cx="136" cy="48" r="16" fill="#f6c445" stroke="#c49212" strokeWidth="4" />
      <rect x="94" y="30" width="12" height="16" rx="4" fill="#c49212" />
    </svg>
  );
}

function AppleArt() {
  return (
    <svg viewBox="0 0 200 180" className="h-full w-full" aria-hidden="true">
      <path
        d="M108 58c16-22 34-18 38-6-16 2-24 10-30 20"
        fill="#66bb6a"
        stroke="#3e7a38"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path d="M100 64c2-16 8-28 4-36" stroke="#8a5a32" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path
        d="M100 72c-30-8-54 16-54 48 0 30 24 50 54 52 30-2 54-22 54-52 0-32-24-56-54-48z"
        fill="#ef5350"
        stroke="#b42323"
        strokeWidth="4"
      />
      <path d="M100 78c-8 18-8 40 0 58" stroke="#d33b3b" strokeWidth="3" strokeLinecap="round" fill="none" />
      <ellipse cx="78" cy="100" rx="12" ry="18" fill="#ff9a9a" />
    </svg>
  );
}

function CartoonObject({ name, silhouette = false }: { name: string; silhouette?: boolean }) {
  const art = (() => {
    switch (name) {
      case 'Carro':
        return <CarArt />;
      case 'Pato':
        return <DuckArt />;
      case 'Gato':
        return <CatArt />;
      case 'Reloj':
        return <ClockArt />;
      case 'Manzana':
        return <AppleArt />;
      default:
        return null;
    }
  })();

  return (
    <div
      className={
        silhouette
          ? 'h-full w-full brightness-0 opacity-80 drop-shadow-md'
          : 'h-full w-full drop-shadow-lg'
      }
      aria-hidden="true"
    >
      {art}
    </div>
  );
}

function MysteryBox() {
  return (
    <svg viewBox="0 0 220 200" className="h-full w-full drop-shadow-xl" aria-hidden="true">
      <ellipse cx="110" cy="186" rx="72" ry="10" fill="#8fbf86" />
      <rect x="42" y="92" width="136" height="80" rx="18" fill="#f0a04b" stroke="#c47b28" strokeWidth="5" />
      <path d="M42 128h136v28c0 10-8 16-18 16H60c-10 0-18-6-18-16v-28z" fill="#e08d34" />
      <path
        d="M34 96c10-30 142-30 152 0l-14 12c-12-16-112-16-124 0z"
        fill="#ffc86b"
        stroke="#c47b28"
        strokeWidth="5"
        strokeLinejoin="round"
      />
      <rect x="98" y="78" width="24" height="94" fill="#e25d6c" />
      <rect x="42" y="120" width="136" height="18" fill="#e25d6c" />
      <ellipse cx="86" cy="72" rx="20" ry="12" fill="#f28b96" stroke="#c44758" strokeWidth="3" />
      <ellipse cx="134" cy="72" rx="20" ry="12" fill="#f28b96" stroke="#c44758" strokeWidth="3" />
      <circle cx="110" cy="76" r="10" fill="#d64558" />
      <circle cx="110" cy="148" r="16" fill="#fff8ea" stroke="#c47b28" strokeWidth="3" />
      <text
        x="110"
        y="156"
        textAnchor="middle"
        fontSize="24"
        fontWeight="800"
        fill="#c47b28"
        fontFamily="Quicksand, sans-serif"
      >
        ?
      </text>
    </svg>
  );
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
  const [hearing, setHearing] = useState(false);
  const [hasListened, setHasListened] = useState(false);
  const silhouetteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hearTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrongTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const boxContainerRef = useRef<HTMLDivElement>(null);
  const victoryRef = useRef<HTMLDivElement>(null);
  const hasListenedRef = useRef(false);

  const playClue = useCallback((name: string, fromUser: boolean) => {
    playMysterySound(name);
    if (fromUser) {
      hasListenedRef.current = true;
      setHasListened(true);
    }
    setHearing(true);
    if (hearTimeoutRef.current) clearTimeout(hearTimeoutRef.current);
    hearTimeoutRef.current = setTimeout(() => setHearing(false), 1500);
  }, []);

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
      silhouetteTimeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    startGame();
  }, [startGame]);

  useEffect(() => {
    return () => {
      if (silhouetteTimeoutRef.current) clearTimeout(silhouetteTimeoutRef.current);
      if (hearTimeoutRef.current) clearTimeout(hearTimeoutRef.current);
      if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
      stopMysterySound();
    };
  }, []);

  useEffect(() => {
    if (levels.length > 0 && levelIndex < levels.length) {
      const opts = shuffleArray([...levels[levelIndex].options]);
      setShuffledOptions(opts);
      setCurrentPoints(10);
      setSilhouetteVisible(false);
      setWrongAnswers([]);
      setRevealed(false);
      setWrongClicked(null);
      boxContainerRef.current?.querySelectorAll('.sparkle-particle').forEach((node) => node.remove());
      if (silhouetteTimeoutRef.current) {
        clearTimeout(silhouetteTimeoutRef.current);
        silhouetteTimeoutRef.current = null;
      }
      if (hasListenedRef.current) {
        playClue(levels[levelIndex].name, false);
      } else {
        setHearing(false);
      }
    }
  }, [levelIndex, levels, playClue]);

  useEffect(() => {
    if (gameOver && victoryRef.current) {
      createSparkles(victoryRef.current);
    }
  }, [gameOver]);

  const handleSilhouette = useCallback(() => {
    if (!silhouetteVisible && !revealed) {
      setSilhouetteVisible(true);
      setCurrentPoints(5);
      if (silhouetteTimeoutRef.current) clearTimeout(silhouetteTimeoutRef.current);
      silhouetteTimeoutRef.current = setTimeout(() => {
        setSilhouetteVisible(false);
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
        playSuccess();

        if (boxContainerRef.current) {
          setTimeout(() => {
            if (boxContainerRef.current) createSparkles(boxContainerRef.current);
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
      } else if (!wrongAnswers.includes(selected)) {
        setWrongAnswers((prev) => [...prev, selected]);
        setCurrentPoints((prev) => Math.max(0, prev - 0.5));
        setWrongClicked(selected);
        playMiss();
        if (wrongTimeoutRef.current) clearTimeout(wrongTimeoutRef.current);
        wrongTimeoutRef.current = setTimeout(() => {
          setWrongClicked(null);
        }, 800);
      }
    },
    [revealed, levels, levelIndex, currentPoints, wrongAnswers],
  );

  const handleExit = () => {
    stopMysterySound();
    navigate('/semana/2');
  };

  const level = levels[levelIndex];

  if (gameOver) {
    return (
      <div className="caja-end relative flex h-full min-h-screen w-full flex-col overflow-auto">
        <div className="absolute left-3 top-3 z-50 sm:left-4 sm:top-4">
          <KidBackButton onClick={handleExit} label="Volver a la Semana 2" />
        </div>
        <div ref={victoryRef} className="relative m-auto flex w-full max-w-4xl flex-col items-center gap-4 p-4 md:gap-6 md:p-8">
          <MedalArt />
          <header className="text-center">
            <h1 className="font-headline-md text-3xl text-[#3e6378] md:text-5xl">¡Felicidades!</h1>
            <p className="mt-2 font-headline-md text-lg text-[#243d24] md:text-2xl">
              ¡Lograste {formatPoints(score)} de 50 puntos!
            </p>
          </header>

          <section className="w-full rounded-[2rem] bg-white/90 p-4 shadow-lg md:p-8">
            <h2 className="mb-4 text-center font-headline-md text-xl text-[#3e6378] md:text-2xl">
              Tu colección de pegatinas
            </h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {levels.map((item) => (
                <article
                  key={item.id}
                  className="caja-sticker flex flex-col items-center gap-2 rounded-2xl border-4 border-[#f6c445] bg-white p-3 shadow-md animate-pop-in"
                >
                  <div className="caja-ratio w-full">
                    <CartoonObject name={item.name} />
                  </div>
                  <h3 className="font-headline-md text-base text-[#3e6378]">{item.name}</h3>
                </article>
              ))}
            </div>
          </section>

          <div className="flex w-full flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={startGame}
              className="w-full rounded-2xl bg-[#4a6549] px-8 py-4 font-headline-md text-lg text-white shadow-md transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              Volver a jugar
            </button>
            <button
              type="button"
              onClick={handleExit}
              className="w-full rounded-2xl border-4 border-[#4a6549] bg-white px-8 py-4 font-headline-md text-lg text-[#243d24] shadow-md transition-all hover:scale-105 active:scale-95 sm:w-auto"
            >
              Salir
            </button>
          </div>
        </div>
        <style>{cajaStyles}</style>
      </div>
    );
  }

  if (!level) {
    return (
      <div className="relative flex h-full min-h-screen w-full items-center justify-center">
        <div className="absolute left-3 top-3 z-50 sm:left-4 sm:top-4">
          <KidBackButton onClick={handleExit} label="Volver a la Semana 2" />
        </div>
        <p className="font-headline-md text-2xl text-[#3e6378]">Cargando...</p>
      </div>
    );
  }

  const statusText = revealed
    ? `Correcto. Era ${level.name}. Llevas ${formatPoints(score)} puntos.`
    : wrongClicked
      ? `${wrongClicked} no es. Inténtalo de nuevo.`
      : '';

  return (
    <div className="caja-play flex h-full min-h-screen w-full flex-col">
      <header className="flex shrink-0 items-center justify-between gap-3 px-4 py-2 md:px-6 md:py-3">
        <KidBackButton onClick={handleExit} label="Volver a la Semana 2" />
        <div className="text-center">
          <p className="font-headline-md text-sm text-[#3e6378] md:text-base">La caja misteriosa</p>
          <p className="font-headline-md text-base text-[#243d24] md:text-lg">
            Objeto {levelIndex + 1} de {levels.length}
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 font-headline-md text-base text-[#3e6378] shadow-sm md:text-lg">
          <StarIcon className="h-5 w-5 text-[#e2b23a]" />
          <span>{formatPoints(score)} pts</span>
        </div>
      </header>

      <main className="flex min-h-0 w-full flex-1 flex-col items-center justify-center gap-3 px-4 py-2 md:gap-4 md:px-8">
        <div className="w-full max-w-xl shrink-0 pb-3">
          <button
            type="button"
            onClick={() => playClue(level.name, true)}
            className={`relative w-full rounded-[1.75rem] border-4 border-[#3e6378] bg-white px-4 py-2 text-center text-[#3e6378] shadow-[4px_4px_0_#3e6378] transition-all hover:scale-105 active:scale-95 md:px-6 md:py-3 ${
              hearing ? 'ring-4 ring-[#f6c445]' : ''
            } ${hasListened ? '' : 'caja-invite'}`}
            aria-label="Escucha el sonido del objeto misterioso"
          >
            <span className="flex items-center justify-center gap-2 font-headline-md text-lg md:text-2xl">
              <SpeakerIcon active={hearing} />
              ¡Escucha el sonido!
            </span>
            <span className="mt-1 block font-headline-md text-base text-[#243d24] md:text-xl">
              «{level.sound}»
            </span>
            {!hasListened && (
              <span className="mt-1 block text-sm font-bold text-[#c47b28]">Tócalo para oírlo</span>
            )}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-3 left-10 h-5 w-5 rotate-45 border-b-4 border-r-4 border-inherit bg-inherit"
            />
          </button>
        </div>

        <div className="caja-stage relative mx-auto shrink-0">
          <div className="absolute inset-[10%] rounded-full bg-white/75 shadow-inner" />
          <div ref={boxContainerRef} id="mystery-box-container" className="absolute inset-0">
            {revealed ? (
              <div className="absolute inset-[8%] z-20 animate-pop-in">
                <CartoonObject name={level.name} />
              </div>
            ) : (
              <>
                {silhouetteVisible && (
                  <div className="absolute inset-[12%] z-0">
                    <CartoonObject name={level.name} silhouette />
                  </div>
                )}
                <div
                  className={`absolute inset-0 z-10 transition-opacity duration-300 ${
                    silhouetteVisible ? 'pointer-events-none opacity-0' : 'opacity-100'
                  }`}
                >
                  <div className="h-full w-full animate-float">
                    <MysteryBox />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        <p className="shrink-0 text-center font-headline-md text-base text-[#3e6378] md:text-lg">
          {revealed
            ? `¡Muy bien! Es ${level.name}`
            : silhouetteVisible
              ? 'Así se ve su sombra'
              : `Este objeto vale ${formatPoints(currentPoints)} pts`}
        </p>

        <button
          type="button"
          onClick={handleSilhouette}
          disabled={currentPoints <= 5 || revealed}
          className="flex shrink-0 items-center gap-2 rounded-2xl border-4 border-[#c4ad86] bg-[#f3e0c2] px-4 py-3 font-headline-md text-base text-[#413520] shadow-md transition-all hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 md:text-lg"
        >
          <MagnifierIcon />
          Ver Silueta (-5 pts)
        </button>
      </main>

      <section className="shrink-0 px-4 pb-3 md:px-8 md:pb-4">
        <div className="mx-auto w-full max-w-4xl rounded-[1.75rem] bg-white/90 p-3 shadow-lg md:p-5">
          <h2 className="mb-3 text-center font-headline-md text-lg text-[#3e6378] md:mb-4 md:text-2xl">
            ¿Qué hay en la caja?
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {shuffledOptions.map((opt) => {
              const isWrong = wrongAnswers.includes(opt);
              const isCorrectAndRevealed = revealed && opt === level.name;
              const isAnimatingWrong = wrongClicked === opt;

              let btnClasses =
                'bg-white text-[#243d24] border-[#d5e0d2] hover:scale-105 active:scale-95';
              if (isWrong) {
                btnClasses = 'kid-wrong text-[#6b1c1c] border-[#c62828]';
              } else if (isCorrectAndRevealed) {
                btnClasses = 'bg-[#3e8f4a] text-white border-[#2f6d38]';
              } else if (revealed) {
                btnClasses = 'bg-[#f4f1ea] text-[#8a9184] border-[#e4dfd4] opacity-60';
              }

              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleAnswer(opt)}
                  disabled={isWrong || revealed}
                  className={`relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border-4 px-2 py-2 font-headline-md text-base font-bold shadow-md transition-all md:min-h-16 md:text-lg ${btnClasses}`}
                >
                  {isCorrectAndRevealed ? (
                    <CheckIcon />
                  ) : isWrong ? (
                    <CrossIcon className="h-6 w-6" />
                  ) : (
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-current text-sm">
                      ?
                    </span>
                  )}
                  <span>{opt}</span>
                  {isAnimatingWrong && (
                    <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#c62828] animate-wrong-x">
                      <CrossIcon className="h-14 w-14" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <p className="sr-only" aria-live="polite">
        {statusText}
      </p>
      <style>{cajaStyles}</style>
    </div>
  );
}

const cajaStyles = `
.game-screen > .caja-play,
.game-screen > .caja-end {
  overflow: auto;
}
.caja-play main {
  min-height: min-content;
  overflow: visible;
  justify-content: safe center;
}
.caja-invite {
  animation: caja-invite 1.4s ease-in-out infinite;
}
@keyframes caja-invite {
  0%, 100% { box-shadow: 4px 4px 0 #3e6378; }
  50% { box-shadow: 4px 4px 0 #3e6378, 0 0 0 6px rgba(246, 196, 69, 0.9); }
}
.caja-stage {
  width: clamp(8.5rem, min(64vw, 26vh), 18rem);
  aspect-ratio: 1 / 1;
}
.caja-ratio {
  aspect-ratio: 1 / 1;
}
.caja-sticker {
  width: 7.25rem;
}
@media (min-width: 768px) {
  .caja-sticker {
    width: 9rem;
  }
}
@media (min-width: 1024px) and (min-height: 820px) {
  .caja-stage {
    width: clamp(12rem, min(32vw, 32vh), 22rem);
  }
}
`;
