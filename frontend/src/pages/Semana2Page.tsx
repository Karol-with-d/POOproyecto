import { useNavigate } from 'react-router-dom';
import WeekBottomNav, { WeekHubHeader, WEEK_NAV_THEMES } from '../components/WeekBottomNav';

const IMG_COLECCIONANDO = '/images/semana2/card-coleccionando.png';
const IMG_CAJA = '/images/semana2/card-caja-misteriosa.webp';
const IMG_FABRICA = '/images/semana2/card-fabrica.webp';
const IMG_MARTA_BG = '/images/semana2/page marta.webp';

export default function Semana2Page() {
  const navigate = useNavigate();

  const activities = [
    {
      id: 'coleccionando-objetos',
      title: 'Coleccionando objetos',
      desc: 'Busca y colecciona objetos ocultos en el aula.',
      image: IMG_COLECCIONANDO,
      onClick: () => navigate('/semana/2/coleccionando-objetos/play'),
    },
    {
      id: 'caja-misteriosa',
      title: 'La caja misteriosa',
      desc: '¿Qué objeto hay dentro? Usa pistas para adivinar.',
      image: IMG_CAJA,
      onClick: () => navigate('/semana/2/caja-misteriosa/play'),
    },
    {
      id: 'fabrica-misteriosa',
      title: 'La fábrica misteriosa',
      desc: 'Observa y clasifica objetos que se están creando.',
      image: IMG_FABRICA,
      onClick: () => navigate('/semana/2/fabrica-misteriosa/play'),
    },
  ];

  return (
    <div
      className="font-sans antialiased h-screen w-full flex flex-col relative overflow-hidden"
      style={{ backgroundColor: '#FAF6F0', color: '#1A1A1A' }}
    >
      {/* Patrón de puntos */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#A7D4AE 1.6px, transparent 1.6px)',
          backgroundSize: '22px 22px',
          opacity: 0.45,
        }}
        aria-hidden="true"
      />

      {/* Estrellas y chispas flotantes */}
      <div className="absolute top-20 right-3 sm:right-8 lg:right-14 w-12 h-12 sm:w-16 sm:h-16 opacity-80 pointer-events-none animate-bounce [animation-duration:3.2s]">
        <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z" fill="#F4E08B" />
          <circle cx="80" cy="20" fill="#A7D4AE" r="5" />
          <circle cx="20" cy="80" fill="#A7D4AE" r="3" />
        </svg>
      </div>
      <div className="absolute top-40 left-2 sm:left-8 w-8 h-8 sm:w-10 sm:h-10 opacity-70 pointer-events-none animate-spin [animation-duration:14s]">
        <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 8L56 44L92 50L56 56L50 92L44 56L8 50L44 44L50 8Z" fill="#A7D4AE" />
        </svg>
      </div>
      <div className="absolute bottom-28 left-4 sm:left-12 w-10 h-10 sm:w-14 sm:h-14 opacity-60 pointer-events-none animate-bounce [animation-duration:4.2s]">
        <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="10" fill="#F4E08B" />
          <circle cx="22" cy="30" r="5" fill="#A7D4AE" />
          <circle cx="78" cy="24" r="4" fill="#4D6B53" />
          <circle cx="70" cy="74" r="6" fill="#F4E08B" />
        </svg>
      </div>
      <div className="absolute bottom-6 right-4 sm:bottom-10 sm:right-10 lg:right-16 w-14 h-14 sm:w-20 sm:h-20 opacity-70 pointer-events-none animate-spin [animation-duration:18s]">
        <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 10L55 45L90 50L55 55L50 90L45 55L10 50L45 45L50 10Z" fill="#F4E08B" />
        </svg>
      </div>

      <WeekHubHeader
        title="Semana 2: Materiales"
        theme={WEEK_NAV_THEMES[2]}
        onBack={() => navigate('/home')}
      />

      {/* Main Content */}
      <main className="flex-1 w-full px-4 py-6 pb-40 sm:px-6 sm:py-8 md:px-8 md:py-10 md:pb-10 lg:px-12 lg:py-12 xl:px-16 flex flex-col z-10 overflow-y-auto">

        {/* Section Title */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 w-full">
          <span
            className="inline-block mb-3 px-4 py-1 rounded-full text-xs sm:text-sm font-black uppercase tracking-widest"
            style={{ backgroundColor: '#A7D4AE', color: '#1A1A1A' }}
          >
            Elige tu misión
          </span>
          <p className="text-base sm:text-lg md:text-xl font-bold" style={{ color: '#4A4A4A' }}>
            Descubre el mundo de los objetos con estos divertidos desafíos.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 w-full">
          {activities.map((activity, index) => (
            <article
              key={activity.id}
              className="rounded-3xl p-4 sm:p-5 flex flex-col h-full border-4 border-[#E1D5BD] shadow-[0_8px_0_#D3C4A5] hover:-translate-y-2 transition-all duration-300"
              style={{ backgroundColor: '#F2E8D5' }}
            >
              <div className="flex items-center justify-between mb-3">
                <span
                  className="text-[11px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: '#A7D4AE', color: '#1A1A1A' }}
                >
                  Misión {index + 1}
                </span>
                <span className="text-lg" aria-hidden="true">⭐</span>
              </div>
              <div className="rounded-2xl mb-4 aspect-square flex items-center justify-center p-1.5 overflow-hidden border-2 border-[#E1D5BD] bg-white">
                <img
                  alt={activity.title}
                  className="w-full h-full object-cover rounded-xl"
                  src={activity.image}
                  loading="lazy"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-black text-lg sm:text-xl leading-tight mb-2" style={{ color: '#1A1A1A' }}>
                  {activity.title}
                </h3>
                <p className="text-sm mb-4 flex-1 font-medium" style={{ color: '#4A4A4A' }}>
                  {activity.desc}
                </p>
                <button
                  onClick={activity.onClick}
                  className="text-white font-black uppercase tracking-wider py-3 px-4 rounded-2xl w-full shadow-[0_4px_0_#364B3A] active:translate-y-1 active:shadow-none hover:brightness-110 transition-all duration-200"
                  style={{ backgroundColor: '#4D6B53' }}
                >
                  Jugar
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Aprende con Marta */}
        <section className="mt-14 sm:mt-16 md:mt-20 w-full relative pb-10 sm:pb-12">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 sm:left-8 sm:translate-x-0 z-30">
            <div
              className="relative px-4 sm:px-5 py-2 rounded-full shadow-[0_4px_0_#D3C4A5] border-4 border-[#E1D5BD] flex items-center gap-2"
              style={{ backgroundColor: '#F2E8D5' }}
            >
              <span className="text-lg leading-none" aria-hidden="true">🌟</span>
              <span className="font-black text-sm sm:text-base whitespace-nowrap" style={{ color: '#1A1A1A' }}>
                Aprende con Marta
              </span>
              <span
                className="hidden sm:block absolute -bottom-3 left-8 w-4 h-4 rotate-45 border-b-4 border-r-4 border-[#E1D5BD]"
                style={{ backgroundColor: '#F2E8D5' }}
                aria-hidden="true"
              />
            </div>
          </div>
          <div
            className="rounded-3xl relative w-full h-52 sm:h-60 md:h-72 lg:h-80 border-4 border-white shadow-[0_8px_0_#D3C4A5]"
            style={{ backgroundColor: '#F0C9A3' }}
          >
            <div className="absolute inset-0 overflow-hidden rounded-[1.3rem]">
              <img
                src={IMG_MARTA_BG}
                className="w-full h-full object-cover"
                alt="Aula de clases"
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(180deg, rgba(26,26,26,0.05) 40%, rgba(26,26,26,0.28) 100%)' }}
                aria-hidden="true"
              />
            </div>
            <div className="absolute bottom-0 right-4 sm:right-8 translate-y-1/2 z-30">
              <button
                className="w-[4.5rem] h-[4.5rem] sm:w-24 sm:h-24 flex flex-col items-center justify-center rounded-full border-[5px] border-white shadow-[0_0_22px_#A7D4AE,0_6px_0_#364B3A] animate-pulse [animation-duration:2.4s] hover:scale-110 active:scale-95 active:translate-y-1 active:shadow-none transition-transform duration-300"
                style={{ backgroundColor: '#4D6B53' }}
                onClick={() => navigate('/semana/2/marta')}
                aria-label="Empezar Aprende con Marta"
              >
                <svg className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-1" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M8 5.14v13.72a1 1 0 0 0 1.5.86l11-6.86a1 1 0 0 0 0-1.72l-11-6.86A1 1 0 0 0 8 5.14z" />
                </svg>
                <span className="text-white font-black text-[10px] sm:text-xs tracking-widest leading-none mt-0.5">
                  PLAY
                </span>
              </button>
            </div>
          </div>
        </section>

        {/* Quiz Banner */}
        <section
          className="mt-6 sm:mt-8 w-full rounded-3xl p-5 sm:p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-center justify-between gap-5 md:gap-8 mb-6 md:mb-10 z-20 relative border-4 border-[#4D6B53] shadow-[0_8px_0_#1A1A1B]"
          style={{ backgroundColor: '#2C2D2E' }}
        >
          <div className="absolute -top-5 -left-3 w-10 h-10 sm:w-12 sm:h-12 opacity-95 pointer-events-none animate-spin [animation-duration:16s]" aria-hidden="true">
            <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 8L58 42L92 50L58 58L50 92L42 58L8 50L42 42L50 8Z" fill="#F4E08B" />
            </svg>
          </div>
          <div className="absolute top-3 right-6 w-6 h-6 rounded-full pointer-events-none" style={{ backgroundColor: '#A7D4AE', opacity: 0.7 }} aria-hidden="true" />
          <div className="absolute bottom-4 right-24 w-3 h-3 rounded-full pointer-events-none hidden sm:block" style={{ backgroundColor: '#F4E08B' }} aria-hidden="true" />
          <div className="text-white z-10 w-full md:flex-1 text-center md:text-left">
            <p className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] mb-2" style={{ color: '#A7D4AE' }}>
              Reto final
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black mb-2">¡Quiz Final de la Semana!</h2>
            <p className="text-sm md:text-base font-medium" style={{ color: '#D1D5DB' }}>
              ¿Cuánto has aprendido esta semana? ¡Hagámoslo!
            </p>
          </div>
          <button
            onClick={() => navigate('/semana/2/quiz')}
            className="text-white font-black uppercase tracking-wider text-lg md:text-xl py-4 md:py-5 px-8 md:px-12 rounded-2xl border-4 border-[#A7D4AE] shadow-[0_6px_0_#1A1A1B] hover:-translate-y-1 hover:brightness-110 hover:shadow-[0_8px_0_#1A1A1B] active:translate-y-1 active:shadow-none transition-all duration-200 z-10 whitespace-nowrap w-full sm:w-auto shrink-0"
            style={{ backgroundColor: '#4D6B53' }}
          >
            Hacer Quiz
          </button>
        </section>

      </main>

      <WeekBottomNav theme={WEEK_NAV_THEMES[2]} />
    </div>
  );
}
