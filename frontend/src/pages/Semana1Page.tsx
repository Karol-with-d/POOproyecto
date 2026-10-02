import { useNavigate, Link } from 'react-router-dom';

/** Paleta por nivel: cada actividad de la semana tiene su color propio. */
type Activity = {
  id: string;
  level: string;
  title: string;
  desc: string;
  skill: string;
  link: string;
  accent: string;
  accentDark: string;
  soft: string;
  card: string;
  ring: string;
};

const ACTIVITIES: Activity[] = [
  {
    id: 'description-match',
    level: 'Nivel 1',
    title: 'Descubre el objeto',
    desc: 'El Prof. Leo describe un objeto. ¡Encuéntralo en la repisa!',
    skill: 'Escuchar y observar',
    link: '/semana/1/description-match',
    accent: '#f59e0b',
    accentDark: '#b45309',
    soft: '#fff5e0',
    card: 'from-[#ffe9b8] to-[#ffd77a]',
    ring: 'rgba(245,158,11,0.45)',
  },
  {
    id: 'rescata-pulgarcito',
    level: 'Nivel 2',
    title: 'Rescata a Pulgarcito',
    desc: 'Mide la grieta y arma el puente con las tablas exactas.',
    skill: 'Medir en centímetros',
    link: '/semana/1/rescata-pulgarcito',
    accent: '#0ea5e9',
    accentDark: '#0369a1',
    soft: '#e4f5ff',
    card: 'from-[#cceeff] to-[#8fd7f7]',
    ring: 'rgba(14,165,233,0.45)',
  },
  {
    id: 'sort-by-size',
    level: 'Nivel 3',
    title: 'Ordena por tamaño',
    desc: 'Coloca los cinco objetos en el puesto que les toca por su tamaño.',
    skill: 'Comparar tamaños',
    link: '/semana/1/sort-by-size',
    accent: '#a855f7',
    accentDark: '#6d28d9',
    soft: '#f6ecff',
    card: 'from-[#efd9ff] to-[#d4a8f8]',
    ring: 'rgba(168,85,247,0.45)',
  },
  {
    id: 'quiz',
    level: 'Reto final',
    title: 'Quiz del Director',
    desc: '10 preguntas de los tres juegos. ¡Gana tu trofeo!',
    skill: 'Demostrar lo aprendido',
    link: '/semana/1/quiz',
    accent: '#ef4444',
    accentDark: '#b91c1c',
    soft: '#ffecec',
    card: 'from-[#ffd9d9] to-[#ffaaa5]',
    ring: 'rgba(239,68,68,0.45)',
  },
];

const styles = `
/* Fondo propio de la Semana 1: papel de cuaderno cálido para que resalten los colores de cada nivel.
   Se dibuja después de .kid-sky en el DOM, así que lo cubre con el mismo z-index. */
.s1-sky {
  position: fixed;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
  background-color: #fff8ee;
  background-image:
    linear-gradient(#eedcc2 1px, transparent 1px),
    linear-gradient(90deg, #eedcc2 1px, transparent 1px),
    linear-gradient(180deg, #fffdf7 0%, #fff4e4 60%, #ffeeda 100%);
  background-size: 48px 48px, 48px 48px, 100% 100%;
}
.s1-sky-blob {
  position: absolute;
  display: block;
  border-radius: 999px;
  filter: blur(70px);
  opacity: 0.2;
  animation: s1-drift 16s ease-in-out infinite;
}
.s1-sky-blob-1 { width: 22vw; height: 22vw; top: -5vw; left: -4vw; background: #f59e0b; }
.s1-sky-blob-2 { width: 20vw; height: 20vw; top: 10%; right: -6vw; background: #0ea5e9; animation-delay: -5s; }
.s1-sky-blob-3 { width: 22vw; height: 22vw; bottom: -7vw; left: 16%; background: #a855f7; animation-delay: -9s; }
.s1-sky-blob-4 { width: 18vw; height: 18vw; bottom: 4%; right: 4%; background: #ef4444; animation-delay: -12s; }
.s1-tape {
  position: absolute;
  display: block;
  height: 26px;
  width: 42%;
  border-radius: 999px;
  opacity: 0.16;
  background: repeating-linear-gradient(90deg, #b45309 0 2px, transparent 2px 16px);
  border-bottom: 3px solid #b45309;
  animation: s1-slide 26s linear infinite;
}
.s1-tape-1 { top: 24%; left: -42%; }
.s1-tape-2 { top: 66%; left: -42%; animation-delay: -13s; }

@keyframes s1-drift { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(18px,-22px) scale(1.07); } }
@keyframes s1-slide { from { transform: translateX(0); } to { transform: translateX(340%); } }

@keyframes s1-pop { from { opacity: 0; transform: translateY(26px) scale(0.94); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes s1-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-7px); } }
@keyframes s1-wobble { 0%,100% { transform: rotate(-7deg); } 50% { transform: rotate(7deg); } }
@keyframes s1-grow { 0%,100% { transform: scale(1); } 50% { transform: scale(1.16); } }
@keyframes s1-spin { to { transform: rotate(360deg); } }
@keyframes s1-twinkle { 0%,100% { opacity: 0.25; transform: scale(0.7); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes s1-shine { 0% { transform: translateX(-130%) skewX(-18deg); } 100% { transform: translateX(260%) skewX(-18deg); } }
@keyframes s1-bob { 0%,100% { transform: translateX(0); } 50% { transform: translateX(5px); } }
@keyframes s1-badge { 0%,100% { transform: rotate(-3deg) scale(1); } 50% { transform: rotate(3deg) scale(1.06); } }

.s1-card { animation: s1-pop 0.55s cubic-bezier(0.175,0.885,0.32,1.275) both; position: relative; overflow: hidden; }
.s1-card:hover, .s1-card:focus-within { transform: translateY(-10px) rotate(-0.6deg); box-shadow: 0 22px 44px var(--s1-ring); }
.s1-card { transition: transform 0.3s ease, box-shadow 0.3s ease; }
.s1-card::after {
  content: ''; position: absolute; top: 0; bottom: 0; left: 0; width: 45%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent);
  opacity: 0; pointer-events: none;
}
.s1-card:hover::after { opacity: 1; animation: s1-shine 0.9s ease-out; }
.s1-art { animation: s1-float 3.4s ease-in-out infinite; }
.s1-card:hover .s1-art { animation-duration: 1.5s; }
.s1-badge { animation: s1-badge 2.6s ease-in-out infinite; }
.s1-plank { transform-origin: center; animation: s1-wobble 2.4s ease-in-out infinite; }
.s1-pencil { transform-origin: 70% 70%; animation: s1-wobble 3s ease-in-out infinite; }
.s1-ball-1 { transform-origin: center; animation: s1-grow 2s ease-in-out infinite; }
.s1-ball-2 { transform-origin: center; animation: s1-grow 2s ease-in-out 0.25s infinite; }
.s1-ball-3 { transform-origin: center; animation: s1-grow 2s ease-in-out 0.5s infinite; }
.s1-star { transform-origin: center; animation: s1-spin 9s linear infinite; }
.s1-sparkle { animation: s1-twinkle 1.8s ease-in-out infinite; }
.s1-sparkle-2 { animation-delay: 0.6s; }
.s1-sparkle-3 { animation-delay: 1.1s; }
.s1-arrow { animation: s1-bob 1.2s ease-in-out infinite; }
.s1-title-emoji { display: inline-block; animation: s1-float 2.6s ease-in-out infinite; }

@media (prefers-reduced-motion: reduce) {
  .s1-card, .s1-art, .s1-badge, .s1-plank, .s1-pencil, .s1-ball-1, .s1-ball-2, .s1-ball-3,
  .s1-star, .s1-sparkle, .s1-arrow, .s1-title-emoji, .s1-sky-blob, .s1-tape { animation: none !important; }
  .s1-card:hover::after { animation: none; opacity: 0; }
}
`;

function ActivityArt({ id, accent, accentDark }: { id: string; accent: string; accentDark: string }) {
  if (id === 'description-match') {
    return (
      <svg viewBox="0 0 200 120" className="s1-art h-full w-full" aria-hidden="true">
        <rect x="18" y="26" width="104" height="48" rx="14" fill="#ffffff" stroke={accent} strokeWidth="3" />
        <path d="M44 74 L40 90 L60 74 Z" fill="#ffffff" stroke={accent} strokeWidth="3" />
        <circle cx="46" cy="50" r="5" fill={accentDark} />
        <circle cx="68" cy="50" r="5" fill={accentDark} />
        <circle cx="90" cy="50" r="5" fill={accentDark} />
        <g className="s1-pencil">
          <rect x="136" y="34" width="16" height="56" rx="5" fill={accent} stroke={accentDark} strokeWidth="3" />
          <path d="M136 90 L144 106 L152 90 Z" fill="#fde68a" stroke={accentDark} strokeWidth="3" />
          <rect x="136" y="28" width="16" height="9" rx="4" fill="#f87171" stroke={accentDark} strokeWidth="2.5" />
        </g>
        <circle className="s1-sparkle" cx="172" cy="34" r="5" fill={accentDark} />
        <circle className="s1-sparkle s1-sparkle-2" cx="28" cy="98" r="4" fill={accentDark} />
      </svg>
    );
  }
  if (id === 'rescata-pulgarcito') {
    return (
      <svg viewBox="0 0 200 120" className="s1-art h-full w-full" aria-hidden="true">
        <path d="M0 76 L52 76 L52 120 L0 120 Z" fill="#7cb342" />
        <path d="M148 76 L200 76 L200 120 L148 120 Z" fill="#7cb342" />
        <rect y="86" width="52" height="34" fill="#8d6e63" />
        <rect x="148" y="86" width="52" height="34" fill="#8d6e63" />
        <g className="s1-plank">
          <rect x="54" y="68" width="92" height="14" rx="5" fill="#c08457" stroke="#6d4c41" strokeWidth="3" />
        </g>
        <circle cx="30" cy="56" r="13" fill="#ffd54f" stroke={accentDark} strokeWidth="3" />
        <circle cx="26" cy="54" r="2.5" fill={accentDark} />
        <circle cx="34" cy="54" r="2.5" fill={accentDark} />
        <rect x="156" y="52" width="32" height="24" rx="5" fill="#ffffff" stroke={accentDark} strokeWidth="3" />
        <path d="M156 52 L172 38 L188 52 Z" fill={accent} stroke={accentDark} strokeWidth="3" />
        <circle className="s1-sparkle" cx="100" cy="24" r="5" fill={accentDark} />
        <circle className="s1-sparkle s1-sparkle-3" cx="124" cy="36" r="4" fill={accentDark} />
      </svg>
    );
  }
  if (id === 'sort-by-size') {
    return (
      <svg viewBox="0 0 200 120" className="s1-art h-full w-full" aria-hidden="true">
        <rect x="12" y="96" width="176" height="10" rx="5" fill={accentDark} opacity="0.35" />
        <circle className="s1-ball-1" cx="44" cy="82" r="14" fill="#f9a8d4" stroke={accentDark} strokeWidth="3" />
        <circle className="s1-ball-2" cx="98" cy="72" r="23" fill={accent} stroke={accentDark} strokeWidth="3" />
        <circle className="s1-ball-3" cx="160" cy="60" r="32" fill="#7c3aed" stroke={accentDark} strokeWidth="3" />
        <text x="36" y="34" fontSize="22" fill={accentDark} fontWeight="bold">1</text>
        <text x="90" y="30" fontSize="22" fill={accentDark} fontWeight="bold">2</text>
        <text x="150" y="20" fontSize="22" fill={accentDark} fontWeight="bold">3</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 120" className="s1-art h-full w-full" aria-hidden="true">
      <rect x="74" y="92" width="52" height="12" rx="5" fill={accentDark} />
      <rect x="88" y="72" width="24" height="22" fill="#fcd34d" stroke={accentDark} strokeWidth="3" />
      <path d="M68 24 H132 V48 A32 32 0 0 1 68 48 Z" fill="#fcd34d" stroke={accentDark} strokeWidth="3" />
      <path d="M68 30 H52 A14 14 0 0 0 68 48 Z" fill="#fde68a" stroke={accentDark} strokeWidth="3" />
      <path d="M132 30 H148 A14 14 0 0 1 132 48 Z" fill="#fde68a" stroke={accentDark} strokeWidth="3" />
      <g className="s1-star">
        <polygon points="100,30 105,44 120,44 108,52 113,66 100,57 87,66 92,52 80,44 95,44" fill={accent} />
      </g>
      <circle className="s1-sparkle" cx="36" cy="76" r="5" fill={accent} />
      <circle className="s1-sparkle s1-sparkle-2" cx="168" cy="82" r="5" fill={accent} />
      <circle className="s1-sparkle s1-sparkle-3" cx="154" cy="18" r="4" fill={accent} />
    </svg>
  );
}

/**
 * Semana1Page — Hub de actividades de la Semana 1: Medidas.
 * Cada minijuego tiene su color de nivel y su propia animación.
 */
export default function Semana1Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');

  return (
    <div className="bg-transparent text-[#1b1b1e] antialiased min-h-screen flex flex-col font-body-md">
      <style>{styles}</style>

      {/* Fondo exclusivo de la semana: cubre el cielo verde del menú de semanas */}
      <div className="s1-sky" aria-hidden="true">
        <span className="s1-sky-blob s1-sky-blob-1" />
        <span className="s1-sky-blob s1-sky-blob-2" />
        <span className="s1-sky-blob s1-sky-blob-3" />
        <span className="s1-sky-blob s1-sky-blob-4" />
        <span className="s1-tape s1-tape-1" />
        <span className="s1-tape s1-tape-2" />
      </div>

      {/* ===== TopAppBar ===== */}
      <header className="bg-[#fbf8fc] text-[#4a6549] top-0 sticky z-50 flex justify-between items-center w-full px-5 md:px-[120px] py-2 shadow-sm">
        <button
          onClick={handleBack}
          className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-[#4a6549] text-center flex-1 mx-4 truncate">
          Semana 1: Medidas
        </h1>
        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full max-w-[920px] mx-auto px-5 py-8 pb-[120px] md:pb-10 flex flex-col gap-8">
        {/* Hero */}
        <section className="text-center">
          <p className="font-headline-md text-2xl font-bold text-[#2f4a2f]">
            <span className="s1-title-emoji">📏</span> ¡Tres juegos y un gran reto!
          </p>
          <p className="mt-2 font-body-lg text-body-lg text-[#434841]">
            Pasa por cada nivel para aprender a medir, comparar y descubrir objetos.
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            {ACTIVITIES.map((activity) => (
              <span
                key={activity.id}
                className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: activity.accent }}
              >
                {activity.level}
              </span>
            ))}
          </div>
        </section>

        {/* Activities Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {ACTIVITIES.map((activity, index) => (
            <article
              key={activity.id}
              className={`s1-card bg-gradient-to-br ${activity.card} rounded-[1.75rem] p-4 flex flex-col gap-4 border-[3px]`}
              style={{
                borderColor: activity.accent,
                boxShadow: `0 10px 26px ${activity.ring}`,
                animationDelay: `${index * 110}ms`,
                ['--s1-ring' as string]: activity.ring,
              }}
            >
              {/* Nivel */}
              <div className="flex items-center justify-between">
                <span
                  className="s1-badge rounded-full px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow"
                  style={{ backgroundColor: activity.accentDark }}
                >
                  {activity.level}
                </span>
                <span
                  className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-bold"
                  style={{ color: activity.accentDark }}
                >
                  {activity.skill}
                </span>
              </div>

              {/* Arte animado */}
              <div
                className="relative h-40 w-full overflow-hidden rounded-2xl border-[3px] border-white"
                style={{ backgroundColor: activity.soft }}
              >
                <ActivityArt id={activity.id} accent={activity.accent} accentDark={activity.accentDark} />
              </div>

              {/* Texto + botón */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-headline-md text-xl font-bold" style={{ color: activity.accentDark }}>
                    {activity.title}
                  </h3>
                  <p className="mt-1 font-body-md text-sm text-[#3a3228]">{activity.desc}</p>
                </div>
                <button
                  onClick={() => navigate(activity.link)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-full px-6 py-2.5 font-label-md text-label-md font-bold text-white transition-all active:translate-y-0.5 active:border-b-2"
                  style={{
                    backgroundColor: activity.accent,
                    borderBottom: `4px solid ${activity.accentDark}`,
                  }}
                >
                  <span className="material-symbols-outlined s1-arrow" style={{ fontVariationSettings: '"FILL" 1' }}>
                    play_arrow
                  </span>
                  {activity.id === 'quiz' ? '¡A responder!' : '¡Jugar!'}
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* ===== BottomNavBar (Mobile Only) ===== */}
      <nav className="bg-[#fbf8fc] shadow-[0_-4px_20px_rgba(74,101,73,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-xl">
        <Link
          to="/home"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md text-xs">Mapa</span>
        </Link>

        <div className="flex flex-col items-center justify-center bg-[#8ba888] text-[#243d24] rounded-full px-6 py-2 scale-90 transition-all duration-200 ease-out">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: '"FILL" 1' }}>
            experiment
          </span>
          <span className="font-label-md text-label-md text-xs">Laboratorio</span>
        </div>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="font-label-md text-label-md text-xs text-center leading-tight">
            Amigos
          </span>
        </Link>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">stars</span>
          <span className="font-label-md text-label-md text-xs">Progreso</span>
        </Link>
      </nav>
    </div>
  );
}
