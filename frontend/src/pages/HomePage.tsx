import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getUserProgress } from '../services/api';

// Ilustraciones originales: iconos Material Symbols por tema de semana
const WEEK_CONFIG = [
  { number: 1, label: 'Semana 1: Medidas', icon: 'straighten', color: 'bg-primary-container', textColor: 'text-on-primary-container' },
  { number: 2, label: 'Semana 2: Objetos', icon: 'category', color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
  { number: 3, label: 'Semana 3: Reciclaje', icon: 'recycling', color: 'bg-tertiary-container', textColor: 'text-on-tertiary-container' },
  { number: 4, label: 'Semana 4: Química', icon: 'science', color: 'bg-primary-container', textColor: 'text-on-primary-container' },
  { number: 5, label: 'Semana 5: Vida', icon: 'psychology', color: 'bg-secondary-container', textColor: 'text-on-secondary-container' },
  { number: 6, label: 'Semana 6: Naturaleza', icon: 'forest', color: 'bg-tertiary-container', textColor: 'text-on-tertiary-container' },
];

/**
 * HomePage — Mapa de aprendizaje con las 6 semanas.
 * 
 * Nota: Diseño visual adaptado del mockup UNIVO Learning Map.
 * Semana 1 disponible, resto bloqueadas hasta completar la anterior.
 */
export default function HomePage() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Explorador');
  const [completed, setCompleted] = useState<number[]>([]);

  useEffect(() => {
    // Cargar nombre del usuario desde localStorage
    const stored = localStorage.getItem('plataforma_user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(String(user.randomName || 'Explorador').trim());
      if (user.id) {
        getUserProgress(user.id)
          .then((rows) => setCompleted(rows.filter((row) => row.completed).map((row) => row.semanaNumber)))
          .catch(() => undefined);
      }
    }
  }, []);

  const handleWeekClick = (weekNumber: number) => {
    navigate(`/semana/${weekNumber}`);
  };

  // Determina el offset de zigzag para cada nodo
  const getOffset = (index: number) => {
    const offsets = ['translate-x-0', 'translate-x-12 md:translate-x-24', '-translate-x-12 md:-translate-x-24', 'translate-x-8 md:translate-x-16', '-translate-x-8 md:-translate-x-16', 'translate-x-0'];
    return offsets[index] || 'translate-x-0';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-on-background antialiased">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r-4 border-surface-container-highest h-screen sticky top-0 p-6 z-50 bg-surface-bright">
        <div className="mb-8">
          <h2 className="font-headline-md text-primary uppercase tracking-tighter text-headline-md">CIENCIA SEGUNDO GRADO</h2>
        </div>
        <nav className="flex flex-col gap-4">
          <Link
            to="/home"
            className="flex items-center gap-4 rounded-xl px-4 py-3 border-b-4 transition-transform hover:-translate-y-1 bg-primary-container text-on-primary-container border-[#334d33]"
          >
            <span className="material-symbols-outlined">map</span>
            <span className="font-label-lg">Mapa</span>
          </Link>
          <Link
            to="/perfil"
            className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 border-b-4 transition-transform hover:-translate-y-1 border-[#334d33] bg-white text-on-surface"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
                <img
                  alt="Avatar de usuario"
                  className="w-full h-full object-cover"
                  src="/images/LoginImage.webp"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <span className="font-label-lg">{userName}</span>
            </div>
            <span className="material-symbols-outlined text-on-surface opacity-80">settings</span>
          </Link>
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col items-center px-margin-mobile md:px-margin-desktop py-lg pb-40 md:pb-32 relative overflow-y-auto overflow-x-hidden scroll-pb-28">
        {/* Character Guide */}
        <div className="flex flex-col items-center mb-8 z-40">
          <div className="bg-white border-4 border-surface-container-highest rounded-2xl p-4 mb-4 shadow-lg relative max-w-xs">
            <p className="font-label-lg text-on-surface text-center">¡Hola {userName}! ¿Listo para nuestra aventura científica?</p>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-4 border-r-4 border-surface-container-highest transform rotate-45"></div>
          </div>
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-surface-container-highest shadow-md bg-primary-container flex items-center justify-center overflow-hidden">
            <img
              alt="Guia de aventura"
              className="w-full h-full object-cover"
              src="/images/LoginImage.webp"
              onError={(e) => {
                // Fallback si la imagen no existe aun
                (e.target as HTMLImageElement).style.display = 'none';
                const parent = (e.target as HTMLImageElement).parentElement;
                if (parent) {
                  const fallback = document.createElement('span');
                  fallback.className = 'material-symbols-outlined text-6xl md:text-7xl text-on-primary-container';
                  fallback.textContent = 'psychology';
                  parent.appendChild(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Section Title */}
        <div className="w-full max-w-2xl flex flex-col items-center mb-xl">
          <h1 className="font-headline-md text-headline-md text-on-surface text-center font-extrabold uppercase tracking-wide">
            Nuestra Gran Aventura Científica
          </h1>
        </div>

        {/* Learning Path (Zigzag) */}
        <div className="relative flex flex-col items-center w-full gap-16 md:gap-24 max-w-md mx-auto">
          {WEEK_CONFIG.map((week, index) => {
            const isLocked = false;
            const done = completed.includes(week.number);
            const nextWeek = [1, 2, 3, 4, 5, 6].find((number) => !completed.includes(number));
            const isNext = week.number === nextWeek;

            return (
              <div
                key={week.number}
                className={`relative z-10 flex flex-col items-center w-full transform ${getOffset(index)} ${isLocked ? 'opacity-80' : ''}`}
              >
                {/* SVG Path to next node */}
                {index < 5 && (
                  <svg
                    className={`absolute top-24 ${index % 2 === 0 ? 'left-1/2' : 'right-1/2'} w-32 h-32 md:w-48 md:h-48 z-0 text-surface-container-highest drop-shadow-sm pointer-events-none`}
                    preserveAspectRatio="none"
                    viewBox="0 0 100 100"
                    style={{
                      strokeWidth: 4,
                      fill: 'none',
                      stroke: 'currentColor',
                      strokeDasharray: '8 8',
                      strokeLinecap: 'round',
                    }}
                  >
                    <path
                      d={index % 2 === 0 ? 'M 0,0 C 50,20 100,50 80,100' : 'M 100,0 C 50,20 0,50 20,100'}
                    />
                  </svg>
                )}

                {/* Floating Island / Node */}
                <div
                  className={`relative w-24 h-24 md:w-32 md:h-32 border-4 border-surface-container-highest shadow-[0_8px_0_0_#e3e2e6] flex flex-col items-center justify-center p-4 transform hover:-translate-y-2 transition-transform duration-300 z-10 mb-6 rounded-full ${
                    isLocked ? 'bg-surface-container-low grayscale' : week.color
                  }`}
                >
                  <span className={`material-symbols-outlined text-5xl md:text-6xl drop-shadow-md ${isLocked ? 'text-outline-variant opacity-60' : week.textColor}`}>
                    {week.icon}
                  </span>
                  {done && (
                    <div className="absolute -right-1 -top-1 bg-[#ffe38a] text-[#243d24] rounded-full px-2 py-1 text-xs font-bold border-2 border-[#e2b100]">
                      ¡Lista!
                    </div>
                  )}
                  {isNext && !done && (
                    <div className="absolute -right-2 -top-2 bg-[#3d9a4a] text-white rounded-full px-2 py-1 text-xs font-bold">
                      ¡Vamos!
                    </div>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleWeekClick(week.number)}
                  disabled={isLocked}
                  className={`btn-3d flex items-center gap-2 px-6 py-4 rounded-2xl border-4 font-label-lg text-xl z-10 w-full max-w-[280px] justify-center scroll-mb-28 min-h-[52px] ${
                    isLocked
                      ? 'bg-surface-container text-outline-variant border-surface-container-highest cursor-not-allowed'
                      : 'bg-primary text-white border-[#334d33] hover:bg-primary-container hover:text-on-primary-container'
                  }`}
                >
                  {!isLocked && (
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                      play_arrow
                    </span>
                  )}
                  Semana {week.number}
                </button>
              </div>
            );
          })}
        </div>
      </main>
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-2 bg-[#fffdf6] border-t-4 border-[#2f6a38] pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link to="/home" className="flex flex-col items-center justify-center min-h-[48px] px-4 py-2 font-bold text-[#243d24]">
          <span className="material-symbols-outlined">map</span>
          Mapa
        </Link>
        <Link to="/perfil" className="flex flex-col items-center justify-center min-h-[48px] px-4 py-2 font-bold text-[#243d24]">
          <span className="material-symbols-outlined">face</span>
          Mi perfil
        </Link>
      </nav>
    </div>
  );
}
