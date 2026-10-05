import { useState, type ReactNode } from 'react';

export const S4 = {
  ink: '#12263a',
  teal: '#0f766e',
  tealDark: '#115e59',
  cyan: '#67e8f9',
  mint: '#ccfbf1',
  ice: '#ecfeff',
  lime: '#d9f99d',
  violet: '#6d28d9',
  lilac: '#ddd6fe',
};

export const S4_STYLES = `
.s4-sky {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background-color: #d7f6f4;
  background-image:
    radial-gradient(circle at 16% 22%, #67e8f9 0 14%, transparent 36%),
    radial-gradient(circle at 86% 18%, #ccfbf1 0 16%, transparent 38%),
    radial-gradient(circle at 78% 80%, #0f766e 0 12%, transparent 34%),
    radial-gradient(circle at 20% 78%, #d9f99d 0 13%, transparent 36%),
    radial-gradient(circle at 52% 48%, #a5f3fc 0 11%, transparent 32%),
    linear-gradient(180deg, #c5f4f8 0%, #d7f6f4 42%, #e8fff4 100%),
    repeating-linear-gradient(60deg, transparent 0 18px, rgba(15,118,110,0.07) 18px 19px),
    repeating-linear-gradient(-60deg, transparent 0 18px, rgba(109,40,217,0.05) 18px 19px);
  background-size: 160% 160%, 150% 150%, 170% 170%, 140% 140%, 130% 130%, 100% 100%, 36px 40px, 36px 40px;
  animation: s4-sky-wash 7s ease-in-out infinite;
}
.s4-sky::before,
.s4-sky::after,
.s4-sky-blob,
.s4-sky-blob::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(22px);
  will-change: transform, background-color;
}
.s4-sky::before {
  width: 40vmin;
  height: 40vmin;
  top: 6%;
  left: 4%;
  background: #67e8f9;
  opacity: 0.55;
  animation: s4-sky-drift-a 6.5s ease-in-out infinite;
}
.s4-sky::after {
  width: 46vmin;
  height: 46vmin;
  bottom: 4%;
  right: 2%;
  background: #0f766e;
  opacity: 0.28;
  animation: s4-sky-drift-b 8s ease-in-out infinite;
}
.s4-sky-blob {
  width: 34vmin;
  height: 34vmin;
  top: 38%;
  left: 38%;
  background: #ccfbf1;
  opacity: 0.58;
  animation: s4-sky-drift-c 7s ease-in-out infinite;
}
.s4-sky-blob::after {
  width: 26vmin;
  height: 26vmin;
  top: -28%;
  right: -36%;
  background: #d9f99d;
  opacity: 0.45;
  animation: s4-sky-drift-a 9s ease-in-out infinite reverse;
}
.s4-hex {
  position: absolute;
  width: 72px;
  height: 64px;
  clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%);
  border: 2px solid rgba(15,118,110,0.18);
  background: rgba(255,255,255,0.18);
}
.s4-hex-1 { top: 8%; left: 6%; animation: s4-drift 9s ease-in-out infinite; }
.s4-hex-2 { top: 28%; right: 8%; width: 54px; height: 48px; animation: s4-drift 11s ease-in-out -4s infinite; }
.s4-hex-3 { bottom: 16%; left: 18%; width: 44px; height: 40px; animation: s4-drift 10s ease-in-out -8s infinite; }
.s4-hex-4 { bottom: 8%; right: 16%; animation: s4-drift 12s ease-in-out -2s infinite; }
.s4-hex-5 { top: 58%; left: 4%; width: 36px; height: 32px; animation: s4-drift 8s ease-in-out -6s infinite; }
.s4-hex-6 { top: 42%; left: 78%; width: 48px; height: 42px; animation: s4-drift 9s ease-in-out -3s infinite; }
.s4-hex-7 { top: 12%; right: 28%; width: 30px; height: 26px; animation: s4-spin-hex 14s linear infinite; }
.s4-lab-bubble {
  position: absolute;
  border-radius: 999px;
  background: rgba(103,232,249,0.45);
  border: 2px solid rgba(15,118,110,0.25);
  animation: s4-bubble 6s ease-in infinite;
}
.s4-spark {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #d9f99d;
  clip-path: polygon(50% 0, 61% 35%, 100% 50%, 61% 65%, 50% 100%, 39% 65%, 0 50%, 39% 35%);
  animation: s4-star 1.6s ease-in-out infinite;
}
.s4-drop {
  position: absolute;
  width: 11px;
  height: 16px;
  border-radius: 50% 50% 50% 50% / 35% 35% 65% 65%;
  background: rgba(103,232,249,0.55);
  border: 2px solid rgba(15,118,110,0.22);
  animation: s4-drip 5.5s ease-in infinite;
}
.s4-wave {
  position: absolute;
  left: -8%;
  bottom: -28px;
  width: 116%;
  height: 110px;
  border-radius: 50%;
  background: radial-gradient(ellipse at 50% 0%, rgba(15,118,110,0.16) 0%, rgba(103,232,249,0.08) 42%, transparent 70%);
  animation: s4-wave 5s ease-in-out infinite;
}
.s4-wave-2 {
  bottom: -42px;
  opacity: 0.7;
  animation-delay: -2.4s;
}

@keyframes s4-sky-wash {
  0% { background-position: 0% 10%, 100% 0%, 90% 100%, 0% 90%, 40% 40%, 0 0, 0 0, 0 0; }
  50% { background-position: 80% 70%, 0% 55%, 15% 15%, 70% 5%, 85% 75%, 0 0, 18px 10px, -18px 10px; }
  100% { background-position: 0% 10%, 100% 0%, 90% 100%, 0% 90%, 40% 40%, 0 0, 36px 20px, -36px 20px; }
}
@keyframes s4-sky-drift-a {
  0% { transform: translate(0, 0) scale(1); background-color: #67e8f9; }
  33% { transform: translate(28%, 18%) scale(1.26); background-color: #ccfbf1; }
  66% { transform: translate(-12%, 30%) scale(0.82); background-color: #5eead4; }
  100% { transform: translate(0, 0) scale(1); background-color: #67e8f9; }
}
@keyframes s4-sky-drift-b {
  0% { transform: translate(0, 0) scale(1); background-color: #0f766e; }
  40% { transform: translate(-26%, -20%) scale(1.22); background-color: #14b8a6; }
  75% { transform: translate(16%, -26%) scale(0.86); background-color: #99f6e4; }
  100% { transform: translate(0, 0) scale(1); background-color: #0f766e; }
}
@keyframes s4-sky-drift-c {
  0% { transform: translate(0, 0) scale(1); background-color: #ccfbf1; }
  45% { transform: translate(-24%, 20%) scale(1.2); background-color: #d9f99d; }
  80% { transform: translate(22%, -16%) scale(0.84); background-color: #a5f3fc; }
  100% { transform: translate(0, 0) scale(1); background-color: #ccfbf1; }
}
@keyframes s4-drift { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(18px,-22px) rotate(12deg); } }
@keyframes s4-spin-hex { 0% { transform: rotate(0deg) translateY(0); } 50% { transform: rotate(180deg) translateY(-12px); } 100% { transform: rotate(360deg) translateY(0); } }
@keyframes s4-pop { from { opacity: 0; transform: translateY(16px) rotate(-1deg); } to { opacity: 1; transform: translateY(0) rotate(0); } }
@keyframes s4-bob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
@keyframes s4-bubble { 0% { transform: translateY(0) scale(0.7); opacity: 0.75; } 100% { transform: translateY(-240px) scale(1.25); opacity: 0; } }
@keyframes s4-drip { 0% { transform: translateY(-30px) scale(0.7); opacity: 0; } 15% { opacity: 0.85; } 100% { transform: translateY(110vh) scale(1); opacity: 0; } }
@keyframes s4-wave { 0%,100% { transform: translateX(-4%) scaleY(1); } 50% { transform: translateX(4%) scaleY(1.18); } }
@keyframes s4-card-live {
  0%,100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-8px) rotate(-0.5deg); }
}
@keyframes s4-pip-bob {
  0%,100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-6px) scale(1.06); }
}
@keyframes s4-shake {
  10%,90% { transform: translate3d(-1px,0,0); }
  20%,80% { transform: translate3d(2px,0,0); }
  30%,50%,70% { transform: translate3d(-4px,0,0); }
  40%,60% { transform: translate3d(4px,0,0); }
}
@keyframes s4-wiggle { 0%,100% { transform: rotate(-2deg); } 50% { transform: rotate(2deg); } }
@keyframes s4-glow {
  0%,100% { box-shadow: 0 0 0 0 rgba(103,232,249,0.25); }
  50% { box-shadow: 0 0 26px 8px rgba(103,232,249,0.45); }
}
@keyframes s4-star { 0%,100% { transform: scale(0.7) rotate(0deg); opacity: 0.4; } 50% { transform: scale(1.15) rotate(18deg); opacity: 1; } }
@keyframes s4-confetti { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(160px) rotate(420deg); opacity: 0; } }
@keyframes s4-stamp { 0% { transform: scale(1.3) rotate(-6deg); opacity: 0; } 100% { transform: scale(1) rotate(0deg); opacity: 1; } }
@keyframes s4-pulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.05); } }
@keyframes s4-shine { 0% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(220%) skewX(-18deg); } }
@keyframes s4-jiggle { 0%,100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(-4deg) scale(1.06); } 75% { transform: rotate(4deg) scale(1.06); } }
@keyframes s4-ring { 0% { box-shadow: 0 0 0 0 rgba(15,118,110,0.35); } 100% { box-shadow: 0 0 0 14px rgba(15,118,110,0); } }

.s4-pop { animation: s4-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.s4-float { animation: s4-bob 3.4s ease-in-out infinite; }
.s4-shake { animation: s4-shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
.s4-wiggle { animation: s4-wiggle 1.6s ease-in-out infinite; }
.s4-glow { animation: s4-glow 1.8s ease-in-out infinite; }
.s4-star { animation: s4-star 1.4s ease-in-out infinite; }
.s4-stamp { animation: s4-stamp 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both; }
.s4-pulse { animation: s4-pulse 1.2s ease-in-out infinite; }
.s4-ring { animation: s4-ring 1.6s ease-out infinite; }

.s4-frame {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.s4-frame-img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  object-position: center center;
  padding: 4%;
  opacity: 0;
  transition: transform 0.35s ease, opacity 0.2s ease;
}
.s4-frame-img.is-on { opacity: 1; }
.s4-frame:hover .s4-frame-img.is-on { transform: scale(1.05); }

.s4-btn-lab {
  position: relative;
  overflow: hidden;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  transition: transform 0.18s ease, filter 0.18s ease;
}
.s4-btn-lab::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 40%;
  background: linear-gradient(120deg, transparent, rgba(255,255,255,0.42), transparent);
  transform: translateX(-140%) skewX(-18deg);
  pointer-events: none;
}
.s4-btn-lab:hover:not(:disabled) {
  transform: translateY(-4px);
  filter: brightness(1.08);
}
.s4-btn-lab:hover:not(:disabled)::after { animation: s4-shine 0.7s ease; }
.s4-btn-lab:active:not(:disabled) {
  transform: translate(2px, 2px);
  filter: brightness(0.98);
}

.s4-icon-btn {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.s4-icon-btn:hover {
  transform: rotate(-8deg) scale(1.1);
}
.s4-icon-btn:active {
  transform: translate(2px, 2px) rotate(0deg);
}

.s4-choice {
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  min-height: 48px;
  transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.2s ease, border-color 0.2s ease, background-color 0.2s ease;
}
@media (hover: hover) and (pointer: fine) {
  .s4-choice:hover {
    transform: translateY(-6px) scale(1.03) rotate(-1deg);
    box-shadow: 0 12px 0 rgba(15, 118, 110, 0.16);
    border-color: #0f766e;
  }
}
.s4-choice:active { transform: translateY(1px) scale(0.97) rotate(0deg); }

.s4-tube {
  position: relative;
  cursor: pointer;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  animation: s4-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both, s4-card-live 3.6s ease-in-out var(--s4-bob, 0.5s) infinite;
  transition: box-shadow 0.25s ease, border-color 0.25s ease, filter 0.25s ease;
}
@media (hover: hover) and (pointer: fine) {
  .s4-tube:hover {
    animation-play-state: running, paused;
    transform: translateY(-10px) scale(1.015);
    box-shadow: 12px 14px 0 #99f6e4;
    filter: brightness(1.03);
  }
  .s4-tube:hover .s4-tube-cta { transform: translateY(-2px) scale(1.04); }
}
.s4-tube:active { transform: translateY(-2px); }
.s4-card-shine {
  pointer-events: none;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  overflow: hidden;
}
.s4-card-shine::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 42%;
  background: linear-gradient(110deg, transparent, rgba(255,255,255,0.5), transparent);
  animation: s4-shine 4s ease-in-out infinite;
}
.s4-card-live {
  animation: s4-pop 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both, s4-card-live 3.8s ease-in-out 0.4s infinite;
}

.s4-pip { animation: s4-pip-bob 2.1s ease-in-out infinite; }
.s4-pip:nth-child(1) { animation-delay: 0s; }
.s4-pip:nth-child(2) { animation-delay: 0.15s; }
.s4-pip:nth-child(3) { animation-delay: 0.3s; }
.s4-pip:nth-child(4) { animation-delay: 0.45s; }
.s4-pip:nth-child(5) { animation-delay: 0.6s; }
.s4-pip:hover { transform: scale(1.18); }

@media (max-width: 640px) {
  .s4-choice, .s4-btn-lab, .s4-tube-cta { min-height: 48px; }
  .game-screen main.scroll-board { padding-bottom: 1.25rem !important; }
  .game-screen main.scroll-board > article,
  .game-screen main.scroll-board > div { max-height: none !important; overflow: visible !important; }
  .game-screen main > section:first-child,
  .game-screen main > section:nth-child(2) { max-height: none !important; overflow: visible !important; }
}

@media (prefers-reduced-motion: reduce) {
  .s4-sky, .s4-sky::before, .s4-sky::after, .s4-sky-blob, .s4-sky-blob::after, .s4-hex, .s4-lab-bubble, .s4-spark, .s4-drop, .s4-wave, .s4-pop, .s4-float, .s4-wiggle, .s4-glow, .s4-star, .s4-pulse, .s4-ring, .s4-tube, .s4-card-live, .s4-card-shine::after, .s4-pip { animation: none !important; }
  .s4-choice:hover, .s4-tube:hover, .s4-btn-lab:hover:not(:disabled), .s4-icon-btn:hover { transform: none; }
  .s4-frame:hover .s4-frame-img.is-on { transform: none; }
}
`;

const S4_BUBBLES = [
  { left: '8%', bottom: '4%', size: 14, delay: '0s', dur: '5.5s' },
  { left: '18%', bottom: '0%', size: 10, delay: '1.1s', dur: '6.4s' },
  { left: '28%', bottom: '6%', size: 18, delay: '2.2s', dur: '5.8s' },
  { left: '40%', bottom: '2%', size: 12, delay: '0.6s', dur: '7s' },
  { left: '52%', bottom: '8%', size: 16, delay: '3s', dur: '6s' },
  { left: '64%', bottom: '1%', size: 11, delay: '1.8s', dur: '5.2s' },
  { left: '74%', bottom: '5%', size: 20, delay: '2.6s', dur: '6.8s' },
  { left: '86%', bottom: '3%', size: 13, delay: '0.3s', dur: '5.6s' },
  { left: '93%', bottom: '10%', size: 9, delay: '3.8s', dur: '6.2s' },
];

export function S4Sky() {
  return (
    <div className="s4-sky" aria-hidden="true">
      <span className="s4-sky-blob" />
      <span className="s4-wave" />
      <span className="s4-wave s4-wave-2" />
      <span className="s4-hex s4-hex-1" />
      <span className="s4-hex s4-hex-2" />
      <span className="s4-hex s4-hex-3" />
      <span className="s4-hex s4-hex-4" />
      <span className="s4-hex s4-hex-5" />
      <span className="s4-hex s4-hex-6" />
      <span className="s4-hex s4-hex-7" />
      <span className="s4-spark" style={{ top: '12%', left: '46%' }} />
      <span className="s4-spark" style={{ top: '32%', left: '22%', animationDelay: '0.4s' }} />
      <span className="s4-spark" style={{ top: '58%', left: '70%', animationDelay: '0.9s' }} />
      <span className="s4-spark" style={{ top: '74%', right: '12%', animationDelay: '0.6s' }} />
      <span className="s4-spark" style={{ top: '20%', right: '18%', animationDelay: '1.2s' }} />
      <span className="s4-drop" style={{ left: '16%', top: '0%', animationDelay: '0.4s' }} />
      <span className="s4-drop" style={{ left: '58%', top: '-8%', animationDelay: '2.1s' }} />
      <span className="s4-drop" style={{ left: '81%', top: '-4%', animationDelay: '3.4s' }} />
      {S4_BUBBLES.map((bubble) => (
        <span
          key={`${bubble.left}-${bubble.delay}`}
          className="s4-lab-bubble"
          style={{
            left: bubble.left,
            bottom: bubble.bottom,
            width: bubble.size,
            height: bubble.size,
            animationDelay: bubble.delay,
            animationDuration: bubble.dur,
          }}
        />
      ))}
    </div>
  );
}

export function S4Image({
  src,
  alt,
  filename,
  hint,
  className = '',
  imgClassName = '',
}: {
  src: string;
  alt: string;
  filename: string;
  hint: string;
  className?: string;
  imgClassName?: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={`s4-frame ${className}`}>
      <img
        src={src}
        alt={alt}
        className={`s4-frame-img ${failed ? '' : 'is-on'} ${imgClassName}`}
        onLoad={() => setFailed(false)}
        onError={() => setFailed(true)}
      />
      {failed && (
        <div className="absolute inset-2 flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-teal-400/50 px-3 text-center">
          <span className="material-symbols-outlined text-3xl text-teal-700" aria-hidden="true">science</span>
          <span className="text-xs font-black text-[#12263a] break-all">{filename}</span>
          <span className="text-[11px] font-medium leading-snug text-teal-800">{hint}</span>
        </div>
      )}
    </div>
  );
}

export function S4Header({
  title,
  onBack,
  badge,
}: {
  title: string;
  onBack: () => void;
  badge?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b-4 border-[#99f6e4] bg-[#0f766e] px-4 py-3 text-white md:px-10">
      <button
        type="button"
        onClick={onBack}
        aria-label="Volver"
        className="s4-icon-btn flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9f99d] text-[#115e59] shadow-[3px_3px_0_#115e59]"
      >
        <span className="material-symbols-outlined">arrow_back</span>
      </button>
      <div className="min-w-0 flex-1 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#99f6e4]">Laboratorio 04</p>
        <h1 className="font-headline-md text-base font-black leading-tight md:text-xl">{title}</h1>
      </div>
      <div className="flex min-w-11 justify-end">{badge ?? <span className="w-11" aria-hidden="true" />}</div>
    </header>
  );
}

export function S4Button({
  children,
  onClick,
  color = '#0f766e',
  dark = '#115e59',
  className = '',
  type = 'button',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  color?: string;
  dark?: string;
  className?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`s4-btn-lab inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 font-black text-white shadow-[4px_4px_0_0] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      style={{ backgroundColor: color, boxShadow: `4px 4px 0 ${dark}` }}
    >
      {children}
    </button>
  );
}

export function S4GhostButton({
  children,
  onClick,
  className = '',
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`s4-choice inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#0f766e] bg-[#ecfeff] px-5 py-3 font-black text-[#115e59] ${className}`}
    >
      {children}
    </button>
  );
}

export function S4Levels({ current, total = 5 }: { current: number; total?: number }) {
  return (
    <div className="mb-4 flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, index) => {
        const n = index + 1;
        const done = n < current;
        const active = n === current;
        return (
          <span
            key={n}
            className={`s4-pip flex h-10 w-10 items-center justify-center text-sm font-black ${
              done
                ? 'bg-[#0f766e] text-white'
                : active
                  ? 's4-ring bg-[#d9f99d] text-[#115e59]'
                  : 'bg-white/70 text-[#5b7c78]'
            }`}
            style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' }}
          >
            {done ? (
              <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
            ) : (
              n
            )}
          </span>
        );
      })}
    </div>
  );
}

export function S4Clear({
  last,
  title,
  text,
  onNext,
  color = '#0f766e',
}: {
  last: boolean;
  title: string;
  text: string;
  onNext: () => void;
  color?: string;
}) {
  return (
    <div className="s4-stamp mx-auto flex w-full max-w-md flex-col items-center gap-4 rounded-[2rem] border-2 bg-[#ecfeff] p-6 text-center shadow-[8px_8px_0_#99f6e4]" style={{ borderColor: color }}>
      <span className="material-symbols-outlined s4-star text-5xl text-[#0f766e]" style={{ fontVariationSettings: "'FILL' 1" }}>
        science
      </span>
      <h3 className="font-headline-md text-2xl font-black" style={{ color }}>{title}</h3>
      <p className="font-body-md text-[#12263a]">{text}</p>
      <S4Button onClick={onNext} color={color} dark="#115e59" className="w-full">
        {last ? '¡Experimento listo!' : 'Siguiente tubo'}
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          {last ? 'emoji_events' : 'arrow_forward'}
        </span>
      </S4Button>
    </div>
  );
}

export function S4Confetti() {
  const bits = [
    { left: '8%', color: '#0f766e', delay: '0s' },
    { left: '18%', color: '#67e8f9', delay: '0.08s' },
    { left: '28%', color: '#6d28d9', delay: '0.04s' },
    { left: '40%', color: '#d9f99d', delay: '0.16s' },
    { left: '52%', color: '#fb7185', delay: '0.06s' },
    { left: '64%', color: '#f59e0b', delay: '0.2s' },
    { left: '76%', color: '#67e8f9', delay: '0.12s' },
    { left: '88%', color: '#0f766e', delay: '0.22s' },
  ];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 h-44 overflow-hidden" aria-hidden="true">
      {bits.map((bit) => (
        <span
          key={bit.left}
          className="absolute top-0 h-3 w-3"
          style={{
            left: bit.left,
            backgroundColor: bit.color,
            clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)',
            animation: 's4-confetti 1.15s ease-in forwards',
            animationDelay: bit.delay,
          }}
        />
      ))}
    </div>
  );
}

export function S4Welcome({
  badge,
  title,
  text,
  filename,
  hint,
  src,
  cta,
  onStart,
  accent = '#0f766e',
}: {
  badge: string;
  title: string;
  text: string;
  filename: string;
  hint: string;
  src: string;
  cta: string;
  onStart: () => void;
  accent?: string;
}) {
  return (
    <article className="s4-card-live relative mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-[2rem] border-2 bg-[#ecfeff] p-6 text-center shadow-[10px_10px_0_#99f6e4] md:p-10" style={{ borderColor: accent }}>
      <span className="s4-card-shine" aria-hidden="true" />
      <span className="rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-white" style={{ backgroundColor: accent }}>
        {badge}
      </span>
      <S4Image
        src={src}
        alt={title}
        filename={filename}
        hint={hint}
        className="s4-float h-52 w-52 rounded-[2rem] border-4 border-white bg-white shadow-[6px_6px_0_#99f6e4]"
      />
      <h2 className="font-headline-lg text-3xl font-black leading-tight text-[#12263a]">{title}</h2>
      <p className="font-body-lg text-[#1f3a40]">{text}</p>
      <p className="rounded-full bg-[#d9f99d] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#115e59]">
        5 tubos · 5 niveles
      </p>
      <S4Button color={accent} dark="#115e59" className="s4-pulse mt-1 w-full max-w-xs" onClick={onStart}>
        {cta}
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>science</span>
      </S4Button>
    </article>
  );
}

export function S4Page({
  title,
  onBack,
  badge,
  children,
}: {
  title: string;
  onBack: () => void;
  badge?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col text-[#12263a] antialiased">
      <style>{S4_STYLES}</style>
      <S4Sky />
      <S4Header title={title} onBack={onBack} badge={badge} />
      <main className="scroll-board relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 pb-10 md:px-8">
        {children}
      </main>
    </div>
  );
}
