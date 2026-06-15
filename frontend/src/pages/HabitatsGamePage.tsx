import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Data ─────────────────────────────────────────────────────────────────────
type Habitat = 'ocean' | 'forest' | 'desert' | 'field';
type Screen = 'start' | 'game' | 'results';

const HABITAT_SPRITE = '/images/semana6/habitats/habitat-sprite.png';
const ANIMAL_SPRITE1 = '/images/semana6/habitats/animals-sprite1.png';
const ANIMAL_SPRITE2 = '/images/semana6/habitats/animals-sprite2.png';

const HABITATS: { id: Habitat; label: string; bgPos: string; bgTint: string; icon: string }[] = [
  { id: 'ocean',  label: 'Océano',   bgPos: '0% 0%',     bgTint: 'bg-[#a6cce4]/30', icon: 'waves'        },
  { id: 'forest', label: 'Bosque',   bgPos: '100% 0%',   bgTint: 'bg-[#b0cfad]/30', icon: 'forest'       },
  { id: 'desert', label: 'Desierto', bgPos: '0% 100%',   bgTint: 'bg-[#d6c4a7]/30', icon: 'wb_sunny'     },
  { id: 'field',  label: 'Campo',    bgPos: '100% 100%', bgTint: 'bg-[#ccebc7]/30', icon: 'grass'        },
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
  { id: 'fish',    label: 'Pez',       correctHabitat: 'ocean',  sprite: 1, bgPosition: '0% 0%',         cardBg: '#bfe5fe' },
  { id: 'eagle',   label: 'Águila',    correctHabitat: 'forest', sprite: 1, bgPosition: '33.33% 0%',     cardBg: '#e3e2e6' },
  { id: 'camel',   label: 'Camello',   correctHabitat: 'desert', sprite: 1, bgPosition: '66.66% 0%',     cardBg: '#f3e0c2' },
  { id: 'cow',     label: 'Vaca',      correctHabitat: 'field',  sprite: 1, bgPosition: '100% 0%',       cardBg: '#b0cfad' },
  { id: 'frog',    label: 'Rana',      correctHabitat: 'forest', sprite: 1, bgPosition: '0% 33.33%',     cardBg: '#ccebc7' },
  { id: 'shark',   label: 'Tiburón',   correctHabitat: 'ocean',  sprite: 1, bgPosition: '33.33% 33.33%', cardBg: '#bfe5fe' },
  { id: 'monkey',  label: 'Mono',      correctHabitat: 'forest', sprite: 1, bgPosition: '66.66% 33.33%', cardBg: '#b0cfad' },
  { id: 'owl',     label: 'Búho',      correctHabitat: 'forest', sprite: 1, bgPosition: '66.66% 66.66%', cardBg: '#ccebc7' },
  { id: 'sheep',   label: 'Oveja',     correctHabitat: 'field',  sprite: 2, bgPosition: '100% 0%',       cardBg: '#e3e2e6' },
  { id: 'snake',   label: 'Serpiente', correctHabitat: 'desert', sprite: 2, bgPosition: '50% 50%',       cardBg: '#d6c4a7' },
  { id: 'crab',    label: 'Cangrejo',  correctHabitat: 'ocean',  sprite: 2, bgPosition: '0% 100%',       cardBg: '#a6cce4' },
  { id: 'lizard',  label: 'Lagarto',   correctHabitat: 'desert', sprite: 2, bgPosition: '50% 100%',      cardBg: '#f3e0c2' },
  { id: 'horse',   label: 'Caballo',   correctHabitat: 'field',  sprite: 2, bgPosition: '100% 100%',     cardBg: '#e3e2e6' },
];

// ── Confetti Canvas ──────────────────────────────────────────────────────────
function ConfettiCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { if (canvas) { canvas.width = window.innerWidth; canvas.height = window.innerHeight; } };
    window.addEventListener('resize', resize);
    resize();
    const colors = ['#4a6549', '#3e6378', '#6a5d45', '#ccebc7', '#bfe5fe'];
    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 8 + 4, sy: Math.random() * 3 + 2, sx: (Math.random() - 0.5) * 4,
      rot: Math.random() * 360, rs: Math.random() * 10 - 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));
    let raf: number;
    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pieces.forEach((p) => {
        p.y += p.sy; p.x += p.sx; p.rot += p.rs;
        if (p.y > canvas.height) { p.y = -20; p.x = Math.random() * canvas.width; }
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color; ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size); ctx.restore();
      });
      raf = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 w-full h-full z-10" />;
}

// ── Animal Card ──────────────────────────────────────────────────────────────
function AnimalCard({ animal, onDragStart }: { animal: AnimalData; onDragStart: (id: string) => void }) {
  const spriteUrl = animal.sprite === 1 ? ANIMAL_SPRITE1 : ANIMAL_SPRITE2;
  const bgSize = animal.sprite === 1 ? '400% 400%' : '300% 300%';
  const innerSize = animal.sprite === 1 ? '48px' : '64px';

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.setData('animalId', animal.id); onDragStart(animal.id); }}
      className="w-28 h-32 md:w-36 md:h-40 bg-surface rounded-xl border-2 border-outline-variant shadow-sm flex flex-col items-center p-2 cursor-grab shrink-0 select-none transition-transform active:scale-110 active:shadow-lg active:z-50"
    >
      <div className="flex-1 w-full rounded-lg mb-2 flex items-center justify-center" style={{ backgroundColor: animal.cardBg }}>
        <div style={{ width: innerSize, height: innerSize, backgroundImage: `url(${spriteUrl})`, backgroundSize: bgSize, backgroundPosition: animal.bgPosition, backgroundRepeat: 'no-repeat' }} />
      </div>
      <span className="font-label-lg text-label-lg text-on-surface text-sm">{animal.label}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function HabitatsGamePage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>('start');
  const [placedAnimals, setPlacedAnimals] = useState<Set<string>>(new Set());
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverHabitat, setDragOverHabitat] = useState<string | null>(null);
  const [flashHabitat, setFlashHabitat] = useState<{ id: string; type: 'correct' | 'wrong' } | null>(null);

  const remaining = ANIMALS.filter((a) => !placedAnimals.has(a.id));

  useEffect(() => {
    if (placedAnimals.size === ANIMALS.length && screen === 'game') {
      setTimeout(() => setScreen('results'), 900);
    }
  }, [placedAnimals, screen]);

  function handleDrop(e: React.DragEvent, habitatId: string) {
    e.preventDefault();
    setDragOverHabitat(null);
    const animalId = e.dataTransfer.getData('animalId') || draggingId || '';
    if (!animalId) return;
    const animal = ANIMALS.find((a) => a.id === animalId);
    if (!animal || placedAnimals.has(animalId)) return;

    if (animal.correctHabitat === habitatId) {
      setPlacedAnimals((prev) => new Set([...prev, animalId]));
      setFlashHabitat({ id: habitatId, type: 'correct' });
      setTimeout(() => setFlashHabitat(null), 600);
    } else {
      setFlashHabitat({ id: habitatId, type: 'wrong' });
      setTimeout(() => setFlashHabitat(null), 500);
    }
    setDraggingId(null);
  }

  function getHabitatClass(habitatId: string) {
    if (flashHabitat?.id === habitatId) {
      return flashHabitat.type === 'correct' ? 'habitats-correct' : 'habitats-wrong';
    }
    if (dragOverHabitat === habitatId) return 'scale-[1.02] border-primary border-dashed bg-primary-fixed/50';
    return '';
  }

  function getHabitatBorderColor(habitatId: string) {
    if (flashHabitat?.id === habitatId && flashHabitat.type === 'correct') return '#4a6549';
    if (flashHabitat?.id === habitatId && flashHabitat.type === 'wrong') return '#ba1a1a';
    return '#c3c8bf';
  }

  // ── START ─────────────────────────────────────────────────────────────────
  if (screen === 'start') {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col items-center justify-center font-body-md">
        <main className="w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col items-center gap-lg py-xl text-center">
          <div className="w-20 h-20 rounded-full bg-primary-fixed flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>travel_explore</span>
          </div>

          <div>
            <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-sm">
              ¿Dónde vivo yo?
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              ¡Arrastra cada animal a su hábitat y descubre dónde viven!
            </p>
          </div>

          {/* Habitat preview badges */}
          <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
            {HABITATS.map((h) => (
              <div key={h.id} className={`${h.bgTint} border-2 border-outline-variant rounded-2xl p-4 flex items-center gap-3`}>
                <div
                  className="w-10 h-10 rounded-full bg-surface-container-lowest flex items-center justify-center shrink-0"
                  style={{ backgroundImage: `url(${HABITAT_SPRITE})`, backgroundSize: '200% 200%', backgroundPosition: h.bgPos }}
                />
                <span className="font-label-lg text-label-lg text-on-surface">{h.label}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md">
            <span className="material-symbols-outlined text-[18px]">pets</span>
            <span>{ANIMALS.length} animales por clasificar</span>
          </div>

          <button
            onClick={() => setScreen('game')}
            className="bg-primary text-on-primary font-headline-md text-headline-md py-md px-xl rounded-xl flex items-center gap-sm active:translate-y-1 transition-transform"
            style={{ boxShadow: '0 4px 0 0 #334d33', borderBottom: '4px solid #334d33' }}
          >
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_circle</span>
            ¡Empezar Aventura!
          </button>
        </main>
      </div>
    );
  }

  // ── RESULTS ───────────────────────────────────────────────────────────────
  if (screen === 'results') {
    const score = placedAnimals.size;
    return (
      <div className="bg-background min-h-screen flex flex-col font-body-md text-on-surface overflow-hidden">
        <ConfettiCanvas />

        <header className="flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 bg-surface shadow-sm sticky top-0 z-40">
          <div className="font-headline-md text-headline-md font-bold text-primary">¿Dónde vivo yo?</div>
          <button onClick={() => navigate('/semana/6')} className="w-12 h-12 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors text-on-surface-variant">
            <span className="material-symbols-outlined text-3xl">close</span>
          </button>
        </header>

        <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-lg relative z-20">
          <div className="absolute -left-20 top-1/4 opacity-10 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[200px] text-primary">eco</span>
          </div>
          <div className="absolute -right-20 bottom-1/4 opacity-10 pointer-events-none hidden md:block">
            <span className="material-symbols-outlined text-[200px] text-secondary">water_drop</span>
          </div>

          <div className="bg-surface-container-lowest border-2 border-outline-variant rounded-2xl p-md md:p-lg w-full max-w-2xl flex flex-col items-center text-center gap-md shadow-[0_10px_40px_-10px_rgba(74,101,73,0.15)]">
            {/* Trophy illustration */}
            <div className="w-28 h-28 rounded-full bg-tertiary-fixed flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-7xl text-[#6a5d45]" style={{ fontVariationSettings: "'FILL' 1" }}>
                {score >= 10 ? 'emoji_events' : score >= 6 ? 'military_tech' : 'star'}
              </span>
            </div>

            <div className="space-y-xs">
              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary">
                ¡Excelente trabajo!
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Has encontrado <span className="font-bold text-secondary">{score} de {ANIMALS.length}</span> animales
              </p>
            </div>

            <div className="w-full bg-surface-container-low rounded-xl p-md border-2 border-outline-variant/30 flex items-center gap-md">
              <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-secondary-container text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  military_tech
                </span>
              </div>
              <div className="text-left">
                <h3 className="font-label-lg text-label-lg text-on-surface">¡Eres un experto explorador!</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Conoces muy bien los hábitats naturales.</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-md w-full pt-sm">
              <button
                onClick={() => navigate('/semana/6')}
                className="flex-1 bg-primary text-on-primary font-label-lg text-label-lg px-lg py-md rounded-full flex items-center justify-center gap-sm border-b-4 border-[#334d33] active:translate-y-0.5 transition-transform"
              >
                Regresar a la semana
              </button>
              <button
                onClick={() => { setPlacedAnimals(new Set()); setScreen('start'); }}
                className="flex-1 border-2 border-primary text-primary font-label-lg text-label-lg px-lg py-md rounded-full flex items-center justify-center gap-sm hover:bg-primary-fixed active:scale-95 transition-all"
              >
                Intentar de nuevo
              </button>
            </div>
          </div>

          <p className="mt-lg max-w-lg text-center font-body-md text-body-md text-on-surface-variant italic">
            "¿Sabías que algunas tortugas pueden vivir más de 100 años?"
          </p>
        </main>
      </div>
    );
  }

  // ── GAME ──────────────────────────────────────────────────────────────────
  return (
    <div className="h-screen flex flex-col font-body-md overflow-hidden bg-surface-container-lowest">
      {/* Header */}
      <header className="bg-surface text-primary shadow-sm flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop h-20 shrink-0 relative z-20">
        <h1 className="font-headline-md text-headline-md font-bold text-primary">¿Dónde vivo yo?</h1>
        <div className="flex items-center gap-4">
          <span className="font-label-md text-label-md text-on-surface-variant">{ANIMALS.length - remaining.length}/{ANIMALS.length}</span>
          <button
            onClick={() => navigate('/semana/6')}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>close</span>
          </button>
        </div>
      </header>

      {/* Progress bar (mobile) */}
      <div className="w-full bg-surface-container px-margin-mobile py-2 md:hidden shrink-0">
        <div className="w-full bg-surface-container-highest rounded-full h-3 overflow-hidden border-2 border-outline-variant">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${(placedAnimals.size / ANIMALS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Main game area */}
      <main className="flex-1 flex flex-col w-full overflow-hidden">
        {/* Top 60%: Habitat dropzones */}
        <section
          className="shrink-0 w-full p-4 md:p-8 flex items-center justify-center"
          style={{ height: '60%' }}
        >
          <div className="w-full max-w-4xl h-full grid grid-cols-2 grid-rows-2 gap-4 md:gap-6">
            {HABITATS.map((h) => {
              const habitatAnimals = ANIMALS.filter((a) => a.correctHabitat === h.id && placedAnimals.has(a.id));
              return (
                <div
                  key={h.id}
                  data-habitat={h.id}
                  onDragOver={(e) => { e.preventDefault(); setDragOverHabitat(h.id); }}
                  onDragLeave={() => setDragOverHabitat(null)}
                  onDrop={(e) => handleDrop(e, h.id)}
                  className={`rounded-xl border-4 overflow-hidden relative shadow-sm flex flex-col items-center justify-start transition-all duration-200 ${getHabitatClass(h.id)}`}
                  style={{
                    borderColor: getHabitatBorderColor(h.id),
                    backgroundImage: `url(${HABITAT_SPRITE})`,
                    backgroundSize: '200% 200%',
                    backgroundPosition: h.bgPos,
                  }}
                >
                  {/* Label */}
                  <div className="absolute top-2 md:top-4 bg-surface px-4 py-1 rounded-full border-2 border-outline-variant shadow-sm z-10">
                    <span className="font-headline-md text-headline-md md:text-headline-lg-mobile text-on-surface text-[16px] md:text-[20px]">
                      {h.label}
                    </span>
                  </div>

                  {/* Placed animals mini-icons */}
                  {habitatAnimals.length > 0 && (
                    <div className="absolute bottom-2 left-2 flex flex-wrap gap-1 max-w-full">
                      {habitatAnimals.map((a) => (
                        <div
                          key={a.id}
                          className="w-8 h-8 rounded-full border-2 border-surface shadow-sm"
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
        </section>

        {/* Bottom 40%: Animal cards */}
        <section
          className="shrink-0 w-full bg-surface-container-low border-t-2 border-outline-variant relative"
          style={{ height: '40%' }}
        >
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-on-primary font-label-lg text-label-lg px-6 py-1 rounded-full shadow-md border-2 border-surface z-10 whitespace-nowrap text-sm">
            ¡Arrastra el animal a su casa!
          </div>
          <div className="w-full h-full overflow-x-auto flex items-center px-margin-mobile md:px-margin-desktop gap-4" style={{ scrollbarWidth: 'none' }}>
            {remaining.length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant font-label-lg text-label-lg gap-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                ¡Todos los animales en casa!
              </div>
            ) : (
              <div className="flex gap-4 min-w-max pb-4">
                {remaining.map((animal) => (
                  <AnimalCard key={animal.id} animal={animal} onDragStart={setDraggingId} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
