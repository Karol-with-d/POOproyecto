import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSemanas } from '../services/api';

interface SemanaData {
  id: string;
  number: number;
  title: string;
  topic: string;
}

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
  const [semanas, setSemanas] = useState<SemanaData[]>([]);
  const [userName, setUserName] = useState('Explorador');

  useEffect(() => {
    // Cargar nombre del usuario desde localStorage
    const stored = localStorage.getItem('plataforma_user');
    if (stored) {
      const user = JSON.parse(stored);
      setUserName(user.randomName);
    }

    // Cargar semanas desde la API
    getSemanas().then((data) => setSemanas(data)).catch(console.error);
  }, []);

  const handleWeekClick = (weekNumber: number) => {
    if (weekNumber === 1) {
      navigate(`/semana/1`);
    }
    // Semanas bloqueadas no navegan
  };

  // Determina el offset de zigzag para cada nodo
  const getOffset = (index: number) => {
    const offsets = ['translate-x-0', 'translate-x-12 md:translate-x-24', '-translate-x-12 md:-translate-x-24', 'translate-x-8 md:translate-x-16', '-translate-x-8 md:-translate-x-16', 'translate-x-0'];
    return offsets[index] || 'translate-x-0';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-background antialiased">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r-4 border-surface-container-highest h-screen sticky top-0 p-6 z-50 bg-surface-bright">
        <div className="mb-8">
          <h2 className="font-headline-md text-primary uppercase tracking-tighter text-headline-md">CIENCIA SEGUNDO GRADO</h2>
        </div>
        <nav className="flex flex-col gap-4">
          <a className="flex items-center gap-4 rounded-xl px-4 py-3 border-b-4 transition-transform hover:-translate-y-1 bg-primary-container text-on-primary-container border-[#334d33]" href="#">
            <span className="material-symbols-outlined">map</span>
            <span className="font-label-lg">Mapa</span>
          </a>
          <div className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 border-b-4 transition-transform hover:-translate-y-1 border-[#334d33] bg-white text-on-surface">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-container flex items-center justify-center">
                <img
                  alt="Avatar de usuario"
                  className="w-full h-full object-cover"
                  src="/images/avatar.png"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
              </div>
              <span className="font-label-lg">{userName}</span>
            </div>
            <button className="text-on-surface opacity-80 hover:opacity-100 transition-opacity">
              <span className="material-symbols-outlined">settings</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Canvas */}
      <main className="flex-1 flex flex-col items-center px-margin-mobile md:px-margin-desktop py-lg pb-32 relative overflow-hidden">
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
              src="/images/guide.png"
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
            const isFirst = index === 0;
            const isLocked = !isFirst;
            const semana = semanas.find((s) => s.number === week.number);
            const displayTitle = semana?.title || week.label;

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
                  className={`relative w-24 h-24 md:w-32 md:h-32 border-4 border-surface-container-highest shadow-[0_8px_0_0_#e3e2e6] flex flex-col items-center justify-center p-4 transform hover:-translate-y-2 transition-transform duration-300 z-10 mb-6 rounded-full overflow-hidden ${
                    isLocked ? 'bg-surface-container-low grayscale' : week.color
                  }`}
                >
                  <span className={`material-symbols-outlined text-5xl md:text-6xl drop-shadow-md ${isLocked ? 'text-outline-variant opacity-60' : week.textColor}`}>
                    {week.icon}
                  </span>
                  {isLocked && (
                    <div className="absolute bg-surface-container-highest rounded-full p-2 border-2 border-outline-variant">
                      <span className="material-symbols-outlined text-outline-variant text-2xl">lock</span>
                    </div>
                  )}
                </div>

                {/* Button */}
                <button
                  onClick={() => handleWeekClick(week.number)}
                  disabled={isLocked}
                  className={`btn-3d flex items-center gap-2 px-6 py-4 rounded-2xl border-4 font-label-lg text-xl z-10 w-full max-w-[280px] justify-center ${
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
                  {displayTitle}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
