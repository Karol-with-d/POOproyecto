import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface UserData {
  randomName: string;
}

/**
 * ProfilePage — Perfil del usuario con progreso de semanas.
 * 
 * Nota: Diseño visual adaptado del mockup UNIVO Perfil.
 */
export default function ProfilePage() {
  const [userName, setUserName] = useState('Explorador');
  const [completedWeeks] = useState<number[]>([1, 2, 3]);

  useEffect(() => {
    const stored = localStorage.getItem('plataforma_user');
    if (stored) {
      const user: UserData = JSON.parse(stored);
      setUserName(user.randomName);
    }
  }, []);

  const weeks = [
    { number: 1, label: 'Sem. 1' },
    { number: 2, label: 'Sem. 2' },
    { number: 3, label: 'Sem. 3' },
    { number: 4, label: 'Sem. 4' },
    { number: 5, label: 'Sem. 5' },
    { number: 6, label: 'Sem. 6' },
  ];

  return (
    <div className="font-body-md text-on-surface antialiased overflow-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Top AppBar (Mobile Only) */}
      <header className="md:hidden flex justify-between items-center px-margin-mobile py-4 w-full top-0 sticky bg-surface shadow-sm z-50">
        <div className="font-headline-md text-headline-md text-primary font-bold tracking-tight">CIENCIA SEGUNDO GRADO</div>
        <div className="flex gap-4 text-primary">
          <span className="material-symbols-outlined fill">star</span>
          <span className="material-symbols-outlined fill">bolt</span>
        </div>
      </header>

      <div className="flex h-screen w-full relative">
        {/* Side Navigation Bar (Desktop Only) */}
        <nav className="hidden md:flex flex-col p-6 gap-2 bg-surface-container-low border-r-2 border-outline-variant h-screen w-64 fixed left-0 top-0 z-40">
          <div className="font-headline-md text-headline-md text-primary font-bold mb-8 tracking-tight pl-4">CIENCIA SEGUNDO GRADO</div>

          <Link
            to="/home"
            className="flex items-center gap-4 text-on-surface-variant px-4 py-3 hover:bg-surface-variant rounded-xl transition-all font-label-lg text-label-lg active:translate-y-1 duration-75"
          >
            <span className="material-symbols-outlined">map</span>
            Mapa
          </Link>

          {/* Active State */}
          <Link
            to="/perfil"
            className="flex items-center gap-4 rounded-xl px-4 py-3 border-b-4 font-label-lg text-label-lg active:translate-y-1 transition-all duration-75 bg-primary-container text-on-primary-container border-primary"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-on-primary-container">
              <img
                alt="Avatar de usuario"
                className="w-full h-full object-cover"
                src="/images/Boxer Frog Box Toad.jpg"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            </div>
            Perfil
          </Link>
        </nav>

        {/* Main Content Canvas */}
        <main className="flex-1 md:ml-64 relative overflow-y-auto bg-surface bg-opacity-50">
          {/* Floating Background Elements */}
          <span className="material-symbols-outlined absolute top-[15%] left-[10%] opacity-10 animate-[float_15s_infinite_ease-in-out] pointer-events-none text-primary text-[80px]">search</span>
          <span className="material-symbols-outlined absolute top-[60%] left-[8%] opacity-10 animate-[float_15s_infinite_ease-in-out] pointer-events-none text-primary text-[60px]" style={{ animationDelay: '2s' }}>science</span>
          <span className="material-symbols-outlined absolute top-[20%] right-[15%] opacity-10 animate-[float_15s_infinite_ease-in-out] pointer-events-none text-primary text-[100px]" style={{ animationDelay: '4s' }}>biotech</span>
          <span className="material-symbols-outlined absolute top-[70%] right-[12%] opacity-10 animate-[float_15s_infinite_ease-in-out] pointer-events-none text-primary text-[70px]" style={{ animationDelay: '1s' }}>emoji_nature</span>

          <div className="max-w-[800px] mx-auto px-margin-mobile md:px-margin-desktop py-lg min-h-full flex flex-col items-center justify-center relative z-10">
            {/* Avatar & Header Section */}
            <div className="flex flex-col items-center text-center mb-xl w-full max-w-md">
              <div className="relative mb-6">
                {/* Decorative ring */}
                <div className="absolute inset-0 -m-4 border-4 border-dashed border-primary opacity-20 rounded-full animate-[spin_60s_linear_infinite]"></div>
                {/* Avatar Container */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-surface-container-lowest border-4 border-surface-tint shadow-[0_8px_24px_rgba(74,101,73,0.15)] overflow-hidden flex items-center justify-center relative z-10">
                  <img
                    alt="Avatar de usuario"
                    className="w-full h-full object-cover"
                    src="/images/Boxer Frog Box Toad.jpg"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>

              <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface tracking-tight mb-2">
                ¡Hola, {userName}!
              </h1>
              <p className="font-body-lg text-body-lg text-outline">Explorador Científico - Grado 2</p>
            </div>

            {/* Progress Section (Bento Box Style) */}
            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Main XP Card */}
              <div className="glass-card rounded-3xl p-6 md:col-span-2 flex flex-col gap-4">
                <div className="flex justify-between items-end mb-2">
                  <h2 className="font-label-lg text-label-lg text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">bolt</span>
                    Energía de Aprendizaje
                  </h2>
                </div>

                {/* Large Progress Bar */}
                <div className="flex gap-2 w-full h-10">
                  {weeks.map((week) => {
                    const isCompleted = completedWeeks.includes(week.number);
                    return (
                      <div key={week.number} className="flex-1 flex flex-col gap-1">
                        <div
                          className={`h-4 w-full rounded-full shadow-sm ${
                            isCompleted
                              ? 'bg-primary'
                              : 'bg-surface-container-highest border border-outline-variant'
                          }`}
                        ></div>
                        <span
                          className={`text-[10px] text-center font-bold ${
                            isCompleted ? 'text-primary' : 'text-outline'
                          }`}
                        >
                          {week.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-lg w-full flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/home"
                className="squishy-button flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-2xl font-label-lg text-label-lg w-full sm:w-auto"
              >
                <span className="material-symbols-outlined">map</span>
                Volver al Mapa
              </Link>
            </div>
          </div>
        </main>
      </div>

      {/* Bottom Navigation Bar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 w-full bg-surface-container-lowest flex justify-around items-center pb-6 pt-3 px-2 z-50 border-t-2 border-outline-variant">
        <Link to="/home" className="flex flex-col items-center gap-1 text-on-surface-variant p-2 w-20">
          <span className="material-symbols-outlined">school</span>
          <span className="text-xs font-label-md">Aprender</span>
        </Link>
        <Link to="/home" className="flex flex-col items-center gap-1 text-on-surface-variant p-2 w-20">
          <span className="material-symbols-outlined">rocket_launch</span>
          <span className="text-xs font-label-md">Misiones</span>
        </Link>
        <Link
          to="/perfil"
          className="flex flex-col items-center gap-1 bg-secondary-container text-on-secondary-container rounded-2xl p-2 w-20 border-b-4 border-secondary"
        >
          <span className="material-symbols-outlined fill">person</span>
          <span className="text-xs font-label-md font-bold">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
