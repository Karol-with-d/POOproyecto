import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { saveScore, markSemanaCompleted } from '../services/api';

type ZoneId = 'table' | 'window' | 'toolbox';
type Material = 'wood' | 'glass' | 'metal';

interface Zone {
  id: ZoneId;
  name: string;
  image: string;
  correct: Material;
}

const ZONES: Zone[] = [
  {
    id: 'table',
    name: 'Mesa Rota',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR_ADx2JxqRI_64HXuIgn3puBWU5__DhPjx20qGX0ub_5K6znUS814I7w5-lwC28TlpRVDGXTxdsyjhRVb9cfoD3nFlMTJWDzizEQrgYnkIIM7Q57gk9d21yBREKZ7xaseplTobOVI7oUzUtEaCAiGjVIcXEg_JZsw1MFe7Fik3S8qq_G9afor02E4lKEMnEuuEJHWYu-4QJlH1FUwMB9r3SLNEUmiSXp0P_3apnMt1IwcQazLkzCiGW29o0QIYVk0HYp2DS17gwQ',
    correct: 'wood',
  },
  {
    id: 'window',
    name: 'Ventana Rota',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAqlA6l7xSv5tvsRNvq5oVf-n77LVsS1KCknSGn7EmdHlQJqbf_NUjLhi8jrUO1iBmziw8JzOL2HW-rXPOwBhZqgi9Q8RfVXpkehK5vGjIkUjJXU8gMb8otUiY5oVm1ZKqMOGl7iLKxD8X2iDRtm3uVZgdTrYjmbXN6V4ann_kTOqw0Pjk2RVchoqGwqxiSfmp-eTHKsk7OZVObMtCqU5slLThmrAjD8i2Q9-ct-6W1VRoH0R1Eb9vekrnODm2BBT8A6rFU3Se_znk',
    correct: 'glass',
  },
  {
    id: 'toolbox',
    name: 'Caja Rota',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBil4co6kRWO1ac2ylegthibLIN3ZVRmn9IuVMjvJ6e9a_j9jOUW_4wcua5WuxDjF9_-XcDY_zcno-4BbvPPwqh3k7Eq4AShfVs_FDrm9-TPx4GVnuZbEj137b8zsMfQYD7m29bsJ8P5L2dN2Vy_DnMONuw5FeEzljfCM3CC5uJ39VTFWZNgjdxVAwzPxiiKtRAFaQ0qZ7Q2j8B3DcZioMcQAv4qF6Xe5_TGS3LuWH1a8QLGX_ukvOIDuUS0VYiH8YgrvAO8ypy64I',
    correct: 'metal',
  },
];

const MATERIALS: { id: Material; label: string; icon: string; bgClass: string; iconColor: string }[] = [
  { id: 'wood', label: 'Madera', icon: 'forest', bgClass: 'bg-tertiary-fixed hover:bg-[#eadeb5] border-[#d5c09e]', iconColor: 'text-on-tertiary-fixed' },
  { id: 'glass', label: 'Vidrio', icon: 'window', bgClass: 'bg-secondary-fixed hover:bg-[#d8efff] border-[#add6f4]', iconColor: 'text-on-secondary-fixed' },
  { id: 'metal', label: 'Metal', icon: 'precision_manufacturing', bgClass: 'bg-surface-variant hover:bg-surface-container-high border-[#cfced2]', iconColor: 'text-on-surface-variant' },
];

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

export default function BuildItGamePage() {
  const navigate = useNavigate();
  const params = useParams();
  const semanaId = params.semanaId || '3';

  const [activeZone, setActiveZone] = useState<ZoneId | null>(null);
  const [repaired, setRepaired] = useState<Record<ZoneId, boolean>>({ table: false, window: false, toolbox: false });
  const [score, setScore] = useState(0);
  const [panelShake, setPanelShake] = useState(0);
  const [showSuccessFlash, setShowSuccessFlash] = useState<ZoneId | null>(null);
  const [gameFinished, setGameFinished] = useState(false);

  const totalRepairs = ZONES.length;
  const percentage = Math.round((score / totalRepairs) * 100);

  const openZone = (id: ZoneId) => {
    if (repaired[id] || gameFinished) return;
    setActiveZone(id);
  };

  const closePanel = () => {
    setActiveZone(null);
  };

  const handleMaterialSelect = (material: Material) => {
    if (!activeZone) return;
    const zone = ZONES.find((z) => z.id === activeZone);
    if (!zone) return;
    if (material === zone.correct) {
      const next = { ...repaired, [activeZone]: true };
      setRepaired(next);
      setScore((s) => s + 1);
      setShowSuccessFlash(activeZone);
      setTimeout(() => setShowSuccessFlash(null), 1000);
      setActiveZone(null);
    } else {
      setPanelShake((k) => k + 1);
    }
  };

  useEffect(() => {
    if (score === totalRepairs && !gameFinished) {
      setGameFinished(true);
      triggerConfetti();
    }
  }, [score, totalRepairs, gameFinished]);

  useEffect(() => {
    if (!gameFinished) return;
    const userRaw = localStorage.getItem('plataforma_user');
    if (!userRaw) return;
    try {
      const user = JSON.parse(userRaw);
      saveScore({ userId: user.id, semanaId, score: percentage, type: 'activity' }).catch(() => {});
      markSemanaCompleted(user.id, semanaId, percentage).catch(() => {});
    } catch {
      // ignore
    }
  }, [gameFinished, percentage, semanaId]);

  const activeZoneData = activeZone ? ZONES.find((z) => z.id === activeZone) ?? null : null;

  return (
    <div
      className="text-on-background min-h-screen flex flex-col font-body-md overflow-x-hidden background-canvas"
    >
      {/* Gradient overlay for readability */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-overlay"></div>

      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-40 flex justify-between items-center px-5 md:px-8 h-20 bg-surface-container-low border-b border-outline-variant shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/semana/${semanaId}`)}
            className="material-symbols-outlined text-primary hover:text-secondary transition-colors text-[28px]"
          >
            arrow_back
          </button>
          <h1 className="font-headline-md text-headline-md-mobile md:text-headline-md text-primary font-bold hidden sm:block">
            Build It! / ¿Qué va dónde?
          </h1>
          <h1 className="font-headline-md text-primary font-bold sm:hidden">¡A reparar!</h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-primary-container text-on-primary-container px-4 py-2 rounded-full font-label-lg shadow-inner">
            <span className="font-bold">{score}</span>/{totalRepairs} Reparaciones
          </div>
          <button
            onClick={() => navigate('/home')}
            className="material-symbols-outlined text-primary hover:bg-secondary-container rounded-full p-2 transition-colors active:scale-95"
            style={{ fontSize: '28px' }}
          >
            map
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-grow pt-20 pb-24 md:pb-8 relative min-h-screen z-10">
        <div className="container mx-auto px-5 md:px-8 flex flex-col items-center justify-center min-h-[calc(100vh-80px)]">
          {/* Hero text */}
          <div className="text-center mb-8">
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
              ¡A reparar!
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
              Toca un objeto roto y elige el material correcto para arreglarlo.
            </p>
          </div>

          {/* Workbench — 3 object cards in a row */}
          <div className="relative w-full max-w-5xl bg-tertiary-container/30 rounded-xl border-2 border-tertiary-container backdrop-blur-sm shadow-[0_20px_40px_-15px_rgba(74,101,73,0.2)] flex flex-col md:flex-row items-end justify-around gap-4 p-6 md:py-12">
            {ZONES.map((zone) => {
              const isRepaired = repaired[zone.id];
              const showFlash = showSuccessFlash === zone.id;
              return (
                <button
                  key={zone.id}
                  onClick={() => openZone(zone.id)}
                  disabled={isRepaired}
                  className={`interaction-zone clay-object relative group w-full md:w-1/3 flex flex-col items-center justify-end rounded-lg p-4 focus:outline-none ${
                    isRepaired ? 'pointer-events-none' : ''
                  } ${showFlash ? 'success-flash' : ''}`}
                >
                  <div className={`relative ${isRepaired ? 'opacity-60' : ''}`}>
                    <img
                      alt={zone.name}
                      className="w-32 h-32 md:w-48 md:h-48 object-contain drop-shadow-xl"
                      src={zone.image}
                      loading="lazy"
                    />
                    {isRepaired && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="material-symbols-outlined text-primary"
                          style={{ fontSize: '64px', fontVariationSettings: "'FILL' 1" }}
                        >
                          verified
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-surface px-4 py-2 rounded-full shadow-md border-2 border-outline-variant mt-2">
                    <span className="font-label-md text-label-md text-on-surface">{zone.name}</span>
                  </div>
                  <span
                    className="material-symbols-outlined text-primary text-5xl opacity-0 group-hover:opacity-100 transition-opacity absolute -top-4"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    build
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* Floating Material Selection Panel (centered, fixed) */}
      {activeZoneData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div
            className="absolute inset-0 bg-on-background/40 modal-backdrop"
            onClick={closePanel}
          ></div>
          <div
            key={panelShake}
            className={`floating-panel relative bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-[0_24px_48px_-12px_rgba(36,61,36,0.25)] border-2 border-surface-container-highest p-8 md:p-12 flex flex-col items-center ${
              panelShake > 0 && repaired[activeZoneData.id] === false && activeZone !== null
                ? 'animate-shake'
                : ''
            }`}
          >
            <button
              onClick={closePanel}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-container-high text-on-surface-variant transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-8 text-center">
              ¿Qué material falta?
            </h3>

            <div className="flex items-center justify-center gap-4 mb-8">
              <img
                alt={activeZoneData.name}
                className="w-24 h-24 md:w-32 md:h-32 object-contain"
                src={activeZoneData.image}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full mb-4">
              {MATERIALS.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => handleMaterialSelect(mat.id)}
                  className={`tactile-button flex flex-col items-center justify-center p-4 ${mat.bgClass} rounded-xl border-2 focus:ring-4 focus:ring-secondary-container outline-none group`}
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-inner bg-white/40">
                    <span
                      className={`material-symbols-outlined text-[32px] ${mat.iconColor}`}
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {mat.icon}
                    </span>
                  </div>
                  <span className="font-label-lg text-label-lg">{mat.label}</span>
                </button>
              ))}
            </div>

            <button
              onClick={closePanel}
              className="mt-4 text-on-surface-variant font-label-md underline hover:text-primary"
            >
              Cerrar
            </button>
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
            <h2 className="font-headline-lg text-headline-lg text-primary">¡Felicidades!</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Has reparado todo el taller.
            </p>
            <div className="bg-surface-container-highest rounded-2xl px-6 py-4">
              <p className="font-label-md text-label-md text-on-surface-variant">Reparaciones</p>
              <p className="font-headline-lg text-headline-lg text-primary">
                {score} / {totalRepairs} · {percentage}%
              </p>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="clay-button bg-primary text-on-primary font-label-lg text-label-lg px-8 py-3 rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 w-full"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center px-4 pb-4 pt-2 bg-surface rounded-t-xl shadow-[0_-4px_6px_-1px_rgba(74,101,73,0.1)]">
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-high transition-all rounded-xl">
          <span className="material-symbols-outlined text-[24px] mb-1">explore</span>
          <span className="font-label-md text-label-md">Map</span>
        </button>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-6 py-2 shadow-inner">
          <span
            className="material-symbols-outlined text-[24px] mb-1"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            handyman
          </span>
          <span className="font-label-md text-label-md">Build</span>
        </div>
        <button className="flex flex-col items-center justify-center text-on-surface-variant px-4 py-2 hover:bg-surface-container-high transition-all rounded-xl">
          <span className="material-symbols-outlined text-[24px] mb-1">potted_plant</span>
          <span className="font-label-md text-label-md">Stickers</span>
        </button>
      </nav>
    </div>
  );
}
