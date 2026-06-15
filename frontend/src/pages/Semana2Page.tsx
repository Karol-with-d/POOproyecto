import { useNavigate } from 'react-router-dom';

const IMG_COLECCIONANDO = '/images/semana2/card-coleccionando.png';
const IMG_CAJA = '/images/semana2/card-caja-misteriosa.png';
const IMG_FABRICA = '/images/semana2/card-fabrica.png';
const IMG_MARTA_BG = '/images/semana2/aprende-marta-bg.png';

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
    <div className="font-sans antialiased min-h-screen flex flex-col items-center" style={{ backgroundColor: '#F9F9FA', color: '#1A1A1A' }}>
      <div className="w-full max-w-[946px] min-h-screen relative overflow-hidden flex flex-col shadow-xl" style={{ backgroundColor: '#F9F9FA' }}>

        {/* Background decorators */}
        <div className="absolute top-16 right-8 w-16 h-16 opacity-70 pointer-events-none">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 0L60 40L100 50L60 60L50 100L40 60L0 50L40 40L50 0Z" fill="#F4E08B" />
            <circle cx="80" cy="20" fill="#A7D4AE" r="5" />
            <circle cx="20" cy="80" fill="#A7D4AE" r="3" />
          </svg>
        </div>
        <div className="absolute bottom-10 right-10 w-20 h-20 opacity-70 pointer-events-none">
          <svg fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M50 10L55 45L90 50L55 55L50 90L45 55L10 50L45 45L50 10Z" fill="#F4E08B" />
          </svg>
        </div>

        {/* Header */}
        <header className="w-full h-14 flex items-center justify-between px-6 z-10 sticky top-0" style={{ backgroundColor: '#A7D4AE' }}>
          <button
            onClick={() => navigate('/home')}
            className="hover:opacity-70 transition-opacity p-2"
            style={{ color: '#1A1A1A' }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-xl font-bold tracking-wide" style={{ color: '#1A1A1A' }}>Tiny Travelers</h1>
          <button
            onClick={() => navigate('/home')}
            className="hover:opacity-70 transition-opacity p-2"
            style={{ color: '#1A1A1A' }}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-8 py-10 flex flex-col items-center z-10">

          {/* Section Title */}
          <div className="text-center mb-10 w-full max-w-3xl relative">
            <h2 className="text-[32px] md:text-[40px] font-extrabold mb-3 leading-tight" style={{ color: '#1A1A1A' }}>
              Semana 2: Identificando objetos
            </h2>
            <p className="text-lg md:text-xl font-medium" style={{ color: '#4A4A4A' }}>
              Descubre el mundo de los objetos con estos divertidos desafíos.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full max-w-[850px]">
            {activities.map((activity) => (
              <article
                key={activity.id}
                className="rounded-2xl p-4 flex flex-col h-full hover:-translate-y-1 transition-transform duration-300"
                style={{
                  backgroundColor: '#F2E8D5',
                  border: '2px solid #E1D5BD',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                }}
              >
                <div
                  className="rounded-xl mb-4 aspect-square flex items-center justify-center p-2 overflow-hidden"
                  style={{ backgroundColor: 'white', border: '1px solid #E1D5BD' }}
                >
                  <img
                    alt={activity.title}
                    className="w-full h-full object-cover rounded-lg"
                    src={activity.image}
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col">
                  <h3 className="font-bold text-lg leading-tight mb-2" style={{ color: '#1A1A1A' }}>
                    {activity.title}
                  </h3>
                  <p className="text-sm mb-4 flex-1" style={{ color: '#4A4A4A' }}>
                    {activity.desc}
                  </p>
                  <button
                    onClick={activity.onClick}
                    className="text-white font-bold py-3 px-4 rounded-full w-full hover:opacity-90 transition-colors shadow-sm"
                    style={{ backgroundColor: '#4D6B53' }}
                  >
                    Jugar
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* Aprende con Marta */}
          <section className="mt-12 w-full max-w-[850px] relative">
            <div
              className="absolute -top-8 left-6 z-30 px-4 py-1 rounded-full shadow-sm"
              style={{ backgroundColor: '#F2E8D5', border: '2px solid #E1D5BD' }}
            >
              <span className="font-bold text-sm" style={{ color: '#1A1A1A' }}>Aprende con Marta</span>
            </div>
            <div
              className="rounded-2xl overflow-hidden relative w-full flex items-end"
              style={{
                backgroundColor: '#F0C9A3',
                border: '4px solid white',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.1)',
                height: '220px',
              }}
            >
              <img
                src={IMG_MARTA_BG}
                className="absolute inset-0 w-full h-full object-cover"
                alt="Aula de clases"
                loading="lazy"
              />
              <button
                className="absolute bottom-4 right-4 z-30 w-16 h-16 flex items-center justify-center rounded-full shadow-lg active:scale-95 transition-transform duration-300 hover:scale-110"
                style={{
                  backgroundColor: '#4D6B53',
                  border: '4px solid white',
                  transform: 'translateY(50%)',
                }}
                onClick={() => navigate('/semana/2/marta')}
              >
                <span className="text-white font-bold text-xs tracking-wider">START</span>
              </button>
            </div>
          </section>

          {/* Quiz Banner */}
          <section
            className="mt-8 w-full max-w-[850px] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between shadow-xl mb-10 z-20 relative overflow-hidden"
            style={{ backgroundColor: '#2C2D2E' }}
          >
            <div className="text-white mb-6 md:mb-0 z-10 w-full md:w-auto text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">¡Quiz Final de la Semana!</h2>
              <p className="text-sm md:text-base" style={{ color: '#D1D5DB' }}>
                ¿Cuánto has aprendido esta semana? ¡Hagámoslo!
              </p>
            </div>
            <button
              onClick={() => navigate('/semana/2/quiz')}
              className="text-white font-bold py-3 md:py-4 px-8 md:px-10 rounded-full hover:opacity-90 transition-colors shadow-lg z-10 whitespace-nowrap text-lg"
              style={{ backgroundColor: '#4D6B53', border: '2px solid #668C6D' }}
            >
              Hacer Quiz
            </button>
          </section>

        </main>
      </div>
    </div>
  );
}
