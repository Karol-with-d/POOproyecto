import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGlobalScore, getSemanas, getUserProgress, type GlobalScoreResponse, type Semana, type UserProgress } from '../services/api';

interface UserData {
  id: string;
  randomName: string;
}


/**
 * ProfilePage — Perfil del usuario con progreso de semanas.
 * 
 * Nota: Diseño visual adaptado del mockup UNIVO Perfil.
 * La barra de progreso se sincroniza con el backend en tiempo real.
 */
export default function ProfilePage() {
  const [userName, setUserName] = useState('Explorador');
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [semanas, setSemanas] = useState<Semana[]>([]);
  const [globalScore, setGlobalScore] = useState<GlobalScoreResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('plataforma_user');
    if (stored) {
      const user: UserData = JSON.parse(stored);
      setUserName(user.randomName);

      // Cargar progreso real, semanas y nota global en paralelo
      Promise.all([
        getUserProgress(user.id),
        getSemanas(),
        getGlobalScore(user.id)
      ])
        .then(([progressData, semanasData, globalScoreData]) => {
          setProgress(progressData);
          setSemanas(semanasData);
          setGlobalScore(globalScoreData);
        })
        .catch((err) => {
          console.error('Error cargando progreso:', err);
          setLoadError('No se pudieron cargar las puntuaciones.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
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

  // Determinar si una semana está completada según el progreso del API
  const isWeekCompleted = (weekNumber: number): boolean => {
    const weekProgress = progress.find((p) => p.semanaNumber === weekNumber);
    return weekProgress?.completed ?? false;
  };

  // Contar semanas completadas
  const completedCount = progress.filter((p) => p.completed).length;

  const completedQuizCount = progress.filter((p) => p.score !== null).length;

  const recordedScores = progress.filter((p) => p.score !== null).map((p) => p.score as number);
  const averageOfRecordedScores = recordedScores.length > 0
    ? recordedScores.reduce((sum, s) => sum + s, 0) / recordedScores.length
    : 0;

  const displayGlobal = Math.round(
    globalScore && typeof globalScore.global === 'number'
      ? globalScore.global
      : averageOfRecordedScores
  );
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

          <div className="max-w-[950px] w-full mx-auto px-margin-mobile md:px-margin-desktop py-lg min-h-full flex flex-col items-center justify-center relative z-10">
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
                  {!isLoading && (
                    <span className="font-label-md text-label-md text-primary">
                      {completedCount} de 6 semanas
                    </span>
                  )}
                </div>

                {/* Large Progress Bar */}
                {isLoading ? (
                  <div className="flex items-center justify-center h-10">
                    <span className="font-body-md text-outline">Cargando progreso...</span>
                  </div>
                ) : (
                  <div className="flex gap-2 w-full h-10">
                    {weeks.map((week) => {
                      const completed = isWeekCompleted(week.number);
                      return (
                        <div key={week.number} className="flex-1 flex flex-col gap-1">
                          <div
                            className={`h-4 w-full rounded-full shadow-sm transition-all duration-500 ${
                              completed
                                ? 'bg-primary'
                                : 'bg-surface-container-highest border border-outline-variant'
                            }`}
                          ></div>
                          <span
                            className={`text-[10px] text-center font-bold ${
                              completed ? 'text-primary' : 'text-outline'
                            }`}
                          >
                            {week.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Score Dashboard Section */}
            <div className="w-full mt-6 bg-surface-container-lowest rounded-3xl border-2 border-surface-container p-6 md:p-8 flex flex-col gap-6 shadow-[0_4px_12px_rgba(74,101,73,0.05)]">
              <div>
                <h2 className="font-headline-md text-headline-md text-primary font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined">analytics</span>
                  Sistema de Puntuación
                </h2>
                <p className="font-body-md text-body-md text-outline">
                  Seguimiento de tu rendimiento académico
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <span className="font-body-md text-outline animate-pulse">Cargando puntuaciones...</span>
                </div>
              ) : loadError ? (
                <div className="bg-error-container text-on-error-container p-4 rounded-2xl text-center text-sm font-semibold flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">error</span>
                  {loadError}
                </div>
              ) : (
                <>
                  {/* Global and Weekly summary Widgets */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Global Score Widget */}
                    <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 border border-outline-variant">
                      <div className="flex-shrink-0 text-primary">
                        <svg viewBox="0 0 36 36" className="w-20 h-20">
                          <path
                            className="text-surface-container-highest"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="none"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-primary transition-all duration-500"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            strokeDasharray={`${displayGlobal}, 100`}
                            strokeLinecap="round"
                            fill="none"
                            d="M18 2.0845
                              a 15.9155 15.9155 0 0 1 0 31.831
                              a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <text x="18" y="21.5" className="font-bold font-headline-md text-[8px]" fill="currentColor" textAnchor="middle">
                            {displayGlobal}%
                          </text>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Nota Global</h3>
                        <p className="font-body-md text-body-md text-outline">
                          Promedio de tus actividades y quizes calificados.
                        </p>
                      </div>
                    </div>

                    {/* Weekly Summary Widget */}
                    <div className="bg-surface-container-low rounded-2xl p-4 flex items-center gap-4 border border-outline-variant">
                      <div className="w-20 h-20 rounded-full bg-primary-container text-on-primary-container flex flex-col items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-3xl">emoji_events</span>
                        <span className="font-headline-sm text-headline-sm font-bold mt-0.5">
                          {completedQuizCount}/{semanas.length || 6}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-label-lg text-label-lg text-on-surface font-bold">Pruebas Completadas</h3>
                        <p className="font-body-md text-body-md text-outline">
                          Quizes aprobados y guardados en tu bitácora de ciencias.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Table of Scores */}
                  <div className="overflow-x-auto border border-outline-variant rounded-2xl bg-surface-container-low w-full">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-high border-b border-outline-variant">
                          <th className="p-3 font-label-md text-label-md text-on-surface font-bold">Semana</th>
                          <th className="p-3 font-label-md text-label-md text-on-surface font-bold">Tema</th>
                          <th className="p-3 font-label-md text-label-md text-on-surface-variant font-bold text-center">Peso</th>
                          <th className="p-3 font-label-md text-label-md text-on-surface font-bold text-right">Calificación</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semanas.slice().sort((a, b) => a.number - b.number).map((semana) => {
                          const matchingProgress = progress.find(
                            (p) => p.semanaId === semana.id || p.semanaNumber === semana.number
                          );
                          const score = matchingProgress?.score ?? null;
                          const topicText = semana.title.replace(/^Semana \d+:\s*/, '');
                          const weight = `${(100 / (semanas.length || 6)).toFixed(2)}%`;

                          return (
                            <tr key={semana.id} className="border-b border-outline-variant last:border-b-0 hover:bg-surface-container-high transition-colors">
                              <td className="p-3 font-body-md font-semibold text-primary whitespace-nowrap">
                                Sem. {semana.number}
                              </td>
                              <td className="p-3 font-body-md text-on-surface-variant">
                                {topicText}
                              </td>
                              <td className="p-3 font-body-md text-on-surface-variant text-center whitespace-nowrap">
                                {weight}
                              </td>
                              <td className="p-3 font-body-md text-right whitespace-nowrap">
                                {score !== null ? (
                                  <span className="font-bold text-primary">{score}/100</span>
                                 ) : (
                                  <span className="text-outline italic">Pendiente</span>
                                 )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-lg w-full flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="squishy-button flex items-center justify-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-2xl font-label-lg text-label-lg w-full sm:w-auto"
              >
                <span className="material-symbols-outlined">logout</span>
                Cambiar de usuario
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
