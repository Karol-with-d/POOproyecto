import { useNavigate, Link } from 'react-router-dom';

/**
 * Semana3Page — Hub de actividades de la Semana 3: Utilidad y Reciclaje.
 *
 * Diseño UNIVO verde (alineado con Semana1Page). 3 tarjetas de actividad
 * + banner de Quiz Final. Los botones "Jugar" / "Empezar" muestran
 * "Próximamente" hasta que existan las páginas de juego.
 */
export default function Semana3Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');
  const handleHome = () => navigate('/home');

  const activities = [
    {
      id: 'de-que-estan-hechos',
      title: '¿De qué están hechos?',
      desc: 'Explora el jardín y el mercado para descubrir de qué materiales están hechos los objetos que nos rodean.',
      color: 'bg-[#ccebc7]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDB2C7fpZD0p374C5W7SgegXpBjwu3EcQshRAj88SjhM2hErvVZcl3N39HmSNv0BSnJnh8kK3XYG6hT1Tvz4mQxB-aOv2X8qnFLY48MAO_SPBllgQvdzQamChc7m2luD0SFtCG4kEs41woHBXl79-AFBHdiCoXilykFLhMywAiwwbE5S4KT5cFnYYOwI88D4YdjwfzA-7VCTEXiC6pH3nH5qvbTzKXC2YUGaTdaBHlewqBlCC5xkGeTvi1SoXEfgjNrJIXtY1xS-bQ',
    },
    {
      id: 'a-reparar',
      title: '¡A reparar!',
      desc: '¡Manos a la obra! Ayuda a reparar los objetos rotos en el taller de inventos.',
      color: 'bg-[#bfe5fe]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDrC3TntOYS6w71TVxV7FdfvIavyh_EMQ61tnM71T1n55obBOYHNjUJqeJvcuj_CFSbzFNMpDcDFoHmhHW5vzY4Js7NK5AIi9bEUHf5_xie23VoOG-auodzX0qj1HCMo7O_85XLMOq_FAfaRaOZWKpW9NFgxM_iRGtRQTSpwsBpJF1VZ7B2ERZgYQRgc0MDdwqkZumBDaOp2ewyTlDZ-QsNt77xDrVSI6bnIjlGmp4Zss0zsne8WUVZ9ntLqp8190ei3LKkkFhKEvM',
    },
    {
      id: 'tarjetas-reflexion',
      title: 'Tarjetas de Reflexión',
      desc: 'Piensa y reflexiona sobre lo que has aprendido hoy sobre el cuidado de nuestro planeta.',
      color: 'bg-[#f3e0c2]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKm3lu7LMBEFgBLFnCugX1k5aoX1-4pD3T5xSurow1c94J--e-p_JFl4qSW0L1XciQbfCQkEQmoSrB-t4lExqDORSa726IoOTOCW24BFSTw2Lsur5zp_AWgpVs8IjU7oD4-VCZG5ZcSkBnCqR7F7AfW_InJHRwQjTg5vASrTW5sOkfajaiI7M_fHly_HnMzFIrcezYpzOnUnQpGuVx2V8CxXXKNDjj6oEWauVnUE4uadP87yylcBikUvhRMH-abEs5j5EKiLE4BkA',
    },
  ];

  return (
    <div className="bg-[#f8f5f0] text-[#1b1b1e] antialiased min-h-screen flex flex-col font-body-md">
      {/* ===== TopAppBar ===== */}
      <header className="bg-[#fbf8fc] text-[#4a6549] top-0 sticky z-50 flex justify-between items-center w-full px-5 md:px-[120px] py-2 shadow-sm">
        <button
          onClick={handleBack}
          className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-[#4a6549] text-center flex-1 mx-4 truncate">
          UNIVO
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleHome}
            className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
          >
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-5 md:px-[120px] py-8 pb-[120px] md:pb-8 flex flex-col gap-8">
        {/* Hero Section */}
        <section className="text-left">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#1b1b1e] mb-2">
            Semana 3: Utilidad y Reciclaje
          </h2>
          <p className="font-body-lg text-body-lg text-[#434841]">
            Descubre cómo los materiales se transforman y cómo podemos darles una nueva vida.
          </p>
        </section>

        {/* Activity Cards Grid — 3 columns on desktop, 1 on mobile */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className="bg-[#ffffff] rounded-xl overflow-hidden card-shadow flex flex-col transition-transform hover:-translate-y-2 duration-300"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  alt={activity.title}
                  className="w-full h-full object-cover opacity-90"
                  src={activity.image}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              <div className="p-md flex flex-col flex-grow gap-base">
                <h3 className="font-headline-md text-headline-md text-[#4a6549]">
                  {activity.title}
                </h3>
                <p className="font-body-md text-body-md text-[#434841] flex-grow">
                  {activity.desc}
                </p>
                <button
                  onClick={() => alert('Próximamente')}
                  className="squishy-button w-full mt-4 py-3 px-6 bg-[#4a6549] text-white font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                    play_arrow
                  </span>
                  Jugar
                </button>
              </div>
            </article>
          ))}
        </section>

        {/* Quiz Final Banner */}
        <section className="mt-xl p-md md:p-lg bg-[#e9e7eb] rounded-xl card-shadow flex flex-col md:flex-row items-center justify-between gap-md">
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-md text-headline-md text-[#4a6549]">
              Quiz Final: Pon a prueba tu conocimiento
            </h2>
            <p className="font-body-md text-body-md text-[#434841]">
              ¡Demuestra todo lo que has aprendido sobre el reciclaje!
            </p>
          </div>
          <button
            onClick={() => alert('Próximamente')}
            className="squishy-button whitespace-nowrap py-3 px-lg bg-[#4a6549] text-white font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">play_circle</span>
            Empezar
          </button>
        </section>

        {/* Decorative gradient divider */}
        <div className="mt-xl h-2 w-full bg-gradient-to-r from-transparent via-[#c3c8bf]/30 to-transparent rounded-full" />
      </main>

      {/* ===== BottomNavBar (Mobile Only) ===== */}
      <nav className="bg-[#fbf8fc] shadow-[0_-4px_20px_rgba(74,101,73,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-xl">
        <Link
          to="/home"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md text-xs">Map</span>
        </Link>

        <div className="flex flex-col items-center justify-center bg-[#8ba888] text-[#243d24] rounded-full px-6 py-2 scale-90 transition-all duration-200 ease-out">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: '"FILL" 1' }}>
            experiment
          </span>
          <span className="font-label-md text-label-md text-xs">Lab</span>
        </div>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="font-label-md text-label-md text-xs text-center leading-tight">
            Science
            <br />
            Buddies
          </span>
        </Link>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">stars</span>
          <span className="font-label-md text-label-md text-xs">Progress</span>
        </Link>
      </nav>
    </div>
  );
}
