import { useState, useEffect, useRef, type DragEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResetScrollOn } from '../components/WeekScrollReset';
import '../styles/bosque-vivo.css';
import { playClick, playLevelUp, playMiss, playSuccess } from '../services/sounds';

type Habitat = 'ocean' | 'forest' | 'desert' | 'field';
type Screen = 'start' | 'game' | 'results';

const HABITAT_SPRITE = '/images/semana6/habitats/habitat-sprite.png';
const ANIMAL_SPRITE1 = '/images/semana6/habitats/animals-sprite1.png';
const ANIMAL_SPRITE2 = '/images/semana6/habitats/animals-sprite2.webp';

const HABITATS: { id: Habitat; label: string; bgPos: string; tint: string; icon: string }[] = [
  { id: 'ocean', label: 'Océano', bgPos: '0% 0%', tint: 'rgba(26,122,150,0.2)', icon: 'waves' },
  { id: 'forest', label: 'Bosque', bgPos: '100% 0%', tint: 'rgba(47,158,107,0.22)', icon: 'forest' },
  { id: 'desert', label: 'Desierto', bgPos: '0% 100%', tint: 'rgba(255,122,89,0.2)', icon: 'wb_sunny' },
  { id: 'field', label: 'Campo', bgPos: '100% 100%', tint: 'rgba(212,245,66,0.28)', icon: 'grass' },
];

interface AnimalData {
  id: string;
  label: string;
  correctHabitat: Habitat;
  sprite: 1 | 2;
  bgPosition: string;
  cardBg: string;
}

const ANIMALS: AnimalData[] = [
  { id: 'fish', label: 'Pez', correctHabitat: 'ocean', sprite: 1, bgPosition: '0% 0%', cardBg: '#bfe5fe' },
  { id: 'eagle', label: 'Águila', correctHabitat: 'forest', sprite: 1, bgPosition: '33.33% 0%', cardBg: '#e3e2e6' },
  { id: 'camel', label: 'Camello', correctHabitat: 'desert', sprite: 1, bgPosition: '66.66% 0%', cardBg: '#f3e0c2' },
  { id: 'cow', label: 'Vaca', correctHabitat: 'field', sprite: 1, bgPosition: '100% 0%', cardBg: '#b0cfad' },
  { id: 'frog', label: 'Rana', correctHabitat: 'forest', sprite: 1, bgPosition: '0% 33.33%', cardBg: '#ccebc7' },
  { id: 'shark', label: 'Tiburón', correctHabitat: 'ocean', sprite: 1, bgPosition: '33.33% 33.33%', cardBg: '#bfe5fe' },
  { id: 'monkey', label: 'Mono', correctHabitat: 'forest', sprite: 1, bgPosition: '66.66% 33.33%', cardBg: '#b0cfad' },
  { id: 'owl', label: 'Búho', correctHabitat: 'forest', sprite: 1, bgPosition: '66.66% 66.66%', cardBg: '#ccebc7' },
  { id: 'sheep', label: 'Oveja', correctHabitat: 'field', sprite: 2, bgPosition: '100% 0%', cardBg: '#e3e2e6' },
  { id: 'snake', label: 'Serpiente', correctHabitat: 'desert', sprite: 2, bgPosition: '50% 50%', cardBg: '#d6c4a7' },
  { id: 'crab', label: 'Cangrejo', correctHabitat: 'ocean', sprite: 2, bgPosition: '0% 100%', cardBg: '#a6cce4' },
  { id: 'lizard', label: 'Lagarto', correctHabitat: 'desert', sprite: 2, bgPosition: '50% 100%', cardBg: '#f3e0c2' },
  { id: 'horse', label: 'Caballo', correctHabitat: 'field', sprite: 2, bgPosition: '100% 100%', cardBg: '#e3e2e6' },
];

function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();
    const colors = ['#2f9e6b', '#1a7a96', '#d4f542', '#ff7a59', '#0f2f28'];
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4,
      sy: Math.random() * 3 + 2,
      sx: (Math.random() - 0.5) * 4,
      rot: Math.random() * 360,
      rs: Math.random() * 10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.sy;
        p.x += p.sx;
        p.rot += p.rs;
        if (p.y > canvas.height) {
          p.y = -20;
          p.x = Math.random() * canvas.width;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-10 h-full w-full" />;
}

function AnimalCard({
  animal,
  onDragStart,
  onFingerDown,
  dimmed,
}: {
  animal: AnimalData;
  onDragStart: (id: string) => void;
  onFingerDown: (animalId: string, event: ReactPointerEvent<HTMLDivElement>) => void;
  dimmed: boolean;
}) {
  const spriteUrl = animal.sprite === 1 ? ANIMAL_SPRITE1 : ANIMAL_SPRITE2;
  const bgSize = animal.sprite === 1 ? '400% 400%' : '300% 300%';
  const innerSize = animal.sprite === 1 ? '48px' : '64px';

  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('animalId', animal.id);
        onDragStart(animal.id);
      }}
      onPointerDown={(e) => onFingerDown(animal.id, e)}
      className={`bv-animal-card flex h-32 w-28 shrink-0 select-none flex-col items-center p-2 md:h-40 md:w-36 ${dimmed ? 'opacity-40' : ''}`}
      style={{ touchAction: 'pan-x' }}
    >
      <div
        className="mb-2 flex w-full flex-1 items-center justify-center rounded-lg"
        style={{ backgroundColor: animal.cardBg }}
      >
        <div
          style={{
            width: innerSize,
            height: innerSize,
            backgroundImage: `url(${spriteUrl})`,
            backgroundSize: bgSize,
            backgroundPosition: animal.bgPosition,
            backgroundRepeat: 'no-repeat',
          }}
        />
      </div>
      <span className="bv-baloo text-sm font-bold">{animal.label}</span>
    </div>
  );
}

function BvShell({ children, flush }: { children: ReactNode; flush?: boolean }) {
  return (
    <div
      className={`bv-root relative flex flex-col overflow-x-hidden ${
        flush ? 'h-screen h-dvh' : 'bv-page min-h-screen'
      }`}
    >
      {!flush && (
        <div className="bv-atmosphere" aria-hidden="true">
          <div className="bv-fireflies">
            <span /><span /><span /><span />
          </div>
        </div>
      )}
      <div
        className={`relative z-[1] flex min-h-0 flex-col ${flush ? 'h-full flex-1' : 'min-h-screen'}`}
      >
        {children}
      </div>
    </div>
  );
}

export default function HabitatsGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('start');
  useResetScrollOn(screen);
  const [placedAnimals, setPlacedAnimals] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverHabitat, setDragOverHabitat] = useState<string | null>(null);
  const [flashHabitat, setFlashHabitat] = useState<{ id: string; type: 'correct' | 'wrong' } | null>(null);
  const [ghost, setGhost] = useState<{ animalId: string; x: number; y: number } | null>(null);
  const placedRef = useRef(placedAnimals);
  placedRef.current = placedAnimals;
  const pointerRef = useRef<{
    id: string;
    pointerId: number;
    startX: number;
    startY: number;
    active: boolean;
  } | null>(null);

  const remaining = ANIMALS.filter((a) => !placedAnimals.has(a.id));

  useEffect(() => {
    if (placedAnimals.size === ANIMALS.length && screen === 'game') {
      setTimeout(() => setScreen('results'), 900);
    }
  }, [placedAnimals, screen]);

  function placeAnimal(animalId: string, habitatId: string) {
    setDragOverHabitat(null);
    const animal = ANIMALS.find((a) => a.id === animalId);
    if (!animal || placedRef.current.has(animalId)) return;

    if (animal.correctHabitat === habitatId) {
      if (placedRef.current.size + 1 === ANIMALS.length) playLevelUp();
      else playSuccess();
      setPlacedAnimals((prev) => new Set([...prev, animalId]));
      setFlashHabitat({ id: habitatId, type: 'correct' });
      setTimeout(() => setFlashHabitat(null), 600);
    } else {
      playMiss();
      setFlashHabitat({ id: habitatId, type: 'wrong' });
      setTimeout(() => setFlashHabitat(null), 500);
    }
    setDraggingId(null);
  }

  const placeAnimalRef = useRef(placeAnimal);
  placeAnimalRef.current = placeAnimal;

  useEffect(() => {
    function habitatAt(x: number, y: number) {
      const under = document.elementFromPoint(x, y);
      return under?.closest('[data-habitat]')?.getAttribute('data-habitat') ?? null;
    }

    function onMove(event: PointerEvent) {
      const drag = pointerRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (!drag.active) {
        if (Math.hypot(dx, dy) < 14) return;
        if (Math.abs(dx) > Math.abs(dy)) {
          pointerRef.current = null;
          return;
        }
        drag.active = true;
        setDraggingId(drag.id);
      }
      event.preventDefault();
      setGhost({ animalId: drag.id, x: event.clientX, y: event.clientY });
      setDragOverHabitat(habitatAt(event.clientX, event.clientY));
    }

    function onUp(event: PointerEvent) {
      const drag = pointerRef.current;
      if (!drag || event.pointerId !== drag.pointerId) return;
      const wasActive = drag.active;
      const animalId = drag.id;
      pointerRef.current = null;
      setGhost(null);
      setDraggingId(null);
      setDragOverHabitat(null);
      if (!wasActive) return;
      const habitatId = habitatAt(event.clientX, event.clientY);
      if (habitatId) placeAnimalRef.current(animalId, habitatId);
    }

    window.addEventListener('pointermove', onMove, { passive: false });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
  }, []);

  function handleDrop(e: DragEvent, habitatId: string) {
    e.preventDefault();
    const animalId = e.dataTransfer.getData('animalId') || draggingId || '';
    if (!animalId) return;
    placeAnimal(animalId, habitatId);
  }

  function handleFingerDown(animalId: string, event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === 'mouse') return;
    pointerRef.current = {
      id: animalId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
  }

  function zoneClass(habitatId: string) {
    let cls = 'bv-habitat-zone';
    if (flashHabitat?.id === habitatId) {
      cls += flashHabitat.type === 'correct' ? ' is-ok' : ' is-bad';
    } else if (dragOverHabitat === habitatId) {
      cls += ' is-over';
    }
    return cls;
  }

  if (screen === 'start') {
    return (
      <BvShell>
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:px-8"
          style={{ background: 'rgba(15,47,40,0.92)', color: '#eef8f4' }}
        >
          <button type="button" onClick={() => navigate('/semana/6')} aria-label="Volver" className="bv-icon-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="bv-baloo flex-1 text-center text-lg font-extrabold">¿Dónde vivo yo?</h1>
          <div className="w-11" />
        </header>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center gap-6 px-5 py-8 text-center">
          <div
            className="flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: '#d4f542', boxShadow: '0 8px 0 #9cbc1f' }}
          >
            <span className="material-symbols-outlined text-5xl text-[var(--bv-canopy)]" style={{ fontVariationSettings: "'FILL' 1" }}>
              travel_explore
            </span>
          </div>
          <div>
            <h2 className="bv-title mb-2 text-3xl md:text-4xl">¿Dónde vivo yo?</h2>
            <p className="bv-subtitle">¡Arrastra cada animal a su hábitat y descubre dónde viven!</p>
          </div>

          <div className="grid w-full max-w-sm grid-cols-2 gap-3">
            {HABITATS.map((h) => (
              <div
                key={h.id}
                className="bv-panel flex items-center gap-3 p-3 text-left"
                style={{ background: h.tint }}
              >
                <div
                  className="h-10 w-10 shrink-0 rounded-full border-2 border-white"
                  style={{
                    backgroundImage: `url(${HABITAT_SPRITE})`,
                    backgroundSize: '200% 200%',
                    backgroundPosition: h.bgPos,
                  }}
                />
                <span className="bv-baloo font-bold">{h.label}</span>
              </div>
            ))}
          </div>

          <p className="bv-subtitle flex items-center gap-2 text-sm">
            <span className="material-symbols-outlined text-[18px]">pets</span>
            {ANIMALS.length} animales por clasificar
          </p>

          <button type="button" onClick={() => { playClick(); setScreen('game'); }} className="bv-btn bv-btn-leaf">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            ¡Empezar Aventura!
          </button>
        </main>
      </BvShell>
    );
  }

  if (screen === 'results') {
    const score = placedAnimals.size;
    return (
      <BvShell>
        <ConfettiCanvas />
        <header
          className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 md:px-8"
          style={{ background: 'rgba(15,47,40,0.92)', color: '#eef8f4' }}
        >
          <button type="button" onClick={() => navigate('/semana/6')} aria-label="Volver" className="bv-icon-btn">
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="bv-baloo flex-1 text-center text-lg font-extrabold">¿Dónde vivo yo?</h1>
          <div className="w-11" />
        </header>

        <main className="relative z-20 mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center px-5 py-8">
          <div className="bv-card flex w-full flex-col items-center gap-5 p-6 text-center">
            <div
              className="flex h-24 w-24 items-center justify-center rounded-full"
              style={{ background: 'rgba(212,245,66,0.45)' }}
            >
              <span
                className="material-symbols-outlined text-6xl text-[var(--bv-canopy)]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                {score >= 10 ? 'emoji_events' : score >= 6 ? 'military_tech' : 'star'}
              </span>
            </div>
            <h2 className="bv-title text-3xl">¡Excelente trabajo!</h2>
            <p className="bv-subtitle">
              Has encontrado{' '}
              <strong className="text-[var(--bv-river)]">
                {score} de {ANIMALS.length}
              </strong>{' '}
              animales
            </p>
            <div className="bv-panel flex w-full items-center gap-3 p-4 text-left">
              <span
                className="material-symbols-outlined text-4xl text-[var(--bv-leaf)]"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                military_tech
              </span>
              <div>
                <p className="bv-baloo font-bold">¡Eres un experto explorador!</p>
                <p className="bv-subtitle text-sm">Conoces muy bien los hábitats naturales.</p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-3 md:flex-row">
              <button type="button" onClick={() => navigate('/semana/6')} className="bv-btn bv-btn-leaf flex-1">
                Regresar a la semana
              </button>
              <button
                type="button"
                onClick={() => {
                  setPlacedAnimals(new Set());
                  setScreen('start');
                }}
                className="bv-btn bv-btn-ghost flex-1"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>
          <p className="bv-subtitle mt-6 max-w-md text-center italic">
            ¿Sabías que algunas tortugas pueden vivir más de 100 años?
          </p>
        </main>
      </BvShell>
    );
  }

  return (
    <BvShell flush>
      <header
        className="flex shrink-0 items-center justify-between px-4 py-3 md:px-8"
        style={{ background: '#0f2f28', color: '#eef8f4' }}
      >
        <button type="button" onClick={() => navigate('/semana/6')} aria-label="Volver" className="bv-icon-btn">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="bv-baloo text-lg font-extrabold md:text-xl">¿Dónde vivo yo?</h1>
        <span className="bv-baloo min-w-12 text-right font-bold text-[var(--bv-firefly)]">
          {ANIMALS.length - remaining.length}/{ANIMALS.length}
        </span>
      </header>

      <div className="shrink-0 px-4 py-2 md:hidden" style={{ background: 'rgba(15,47,40,0.06)' }}>
        <div className="bv-progress">
          <span style={{ width: `${(placedAnimals.size / ANIMALS.length) * 100}%` }} />
        </div>
      </div>

      <main
        className="scroll-board flex min-h-0 flex-1 flex-col !justify-start"
        style={{ background: 'var(--bv-mist)' }}
      >
        {/* div (no section): evita max-height del media query .game-screen main > section */}
        <div className="flex min-h-0 flex-[3] items-stretch justify-center p-3 md:p-5">
          <div className="grid h-full w-full max-w-4xl grid-cols-2 grid-rows-2 gap-3 md:gap-4">
            {HABITATS.map((h) => {
              const habitatAnimals = ANIMALS.filter(
                (a) => a.correctHabitat === h.id && placedAnimals.has(a.id),
              );
              return (
                <div
                  key={h.id}
                  data-habitat={h.id}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverHabitat(h.id);
                  }}
                  onDragLeave={() => setDragOverHabitat(null)}
                  onDrop={(e) => handleDrop(e, h.id)}
                  className={`${zoneClass(h.id)} relative flex h-full min-h-0 flex-col items-center`}
                  style={{
                    backgroundImage: `url(${HABITAT_SPRITE})`,
                    backgroundSize: '200% 200%',
                    backgroundPosition: h.bgPos,
                    backgroundColor: h.tint,
                  }}
                >
                  <div
                    className="absolute top-2 z-10 rounded-full px-3 py-1 md:top-3"
                    style={{ background: 'rgba(255,255,255,0.92)', border: '2px solid rgba(15,47,40,0.12)' }}
                  >
                    <span className="bv-baloo text-sm font-bold md:text-base">{h.label}</span>
                  </div>
                  {habitatAnimals.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex max-w-full flex-wrap gap-1">
                      {habitatAnimals.map((a) => (
                        <div
                          key={a.id}
                          className="h-8 w-8 rounded-full border-2 border-white shadow-sm"
                          style={{
                            backgroundImage: `url(${a.sprite === 1 ? ANIMAL_SPRITE1 : ANIMAL_SPRITE2})`,
                            backgroundSize: a.sprite === 1 ? '400% 400%' : '300% 300%',
                            backgroundPosition: a.bgPosition,
                            backgroundColor: a.cardBg,
                          }}
                          title={a.label}
                        />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div
          className="relative min-h-[140px] flex-[2] border-t-4"
          style={{ background: 'rgba(255,255,255,0.9)', borderColor: 'rgba(15,47,40,0.12)' }}
        >
          <div
            className="bv-baloo absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full px-5 py-1 text-sm font-bold text-[var(--bv-canopy)]"
            style={{ background: '#d4f542', boxShadow: '0 4px 0 #9cbc1f' }}
          >
            ¡Arrastra el animal a su casa!
          </div>
          <div className="flex h-full items-center gap-4 overflow-x-auto px-5" style={{ scrollbarWidth: 'none' }}>
            {remaining.length === 0 ? (
              <div className="bv-baloo flex flex-1 items-center justify-center gap-2 font-bold text-[var(--bv-leaf)]">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                ¡Todos los animales en casa!
              </div>
            ) : (
              <div className="flex min-w-max gap-4 pb-3">
                {remaining.map((animal) => (
                  <AnimalCard
                    key={animal.id}
                    animal={animal}
                    onDragStart={setDraggingId}
                    onFingerDown={handleFingerDown}
                    dimmed={ghost?.animalId === animal.id}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      {ghost && <AnimalGhost animalId={ghost.animalId} x={ghost.x} y={ghost.y} />}
    </BvShell>
  );
}

function AnimalGhost({ animalId, x, y }: { animalId: string; x: number; y: number }) {
  const animal = ANIMALS.find((item) => item.id === animalId);
  if (!animal) return null;
  const spriteUrl = animal.sprite === 1 ? ANIMAL_SPRITE1 : ANIMAL_SPRITE2;
  return (
    <div
      className="pointer-events-none fixed z-[80] flex h-24 w-20 flex-col items-center justify-center rounded-2xl border-2 border-white shadow-lg"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -70%)',
        background: animal.cardBg,
      }}
    >
      <div
        style={{
          width: animal.sprite === 1 ? 48 : 56,
          height: animal.sprite === 1 ? 48 : 56,
          backgroundImage: `url(${spriteUrl})`,
          backgroundSize: animal.sprite === 1 ? '400% 400%' : '300% 300%',
          backgroundPosition: animal.bgPosition,
          backgroundRepeat: 'no-repeat',
        }}
      />
      <span className="bv-baloo text-xs font-bold">{animal.label}</span>
    </div>
  );
}
