import { useNavigate, Link } from 'react-router-dom';

/**
 * Semana3Page — Hub de actividades de la Semana 3: Utilidad y Reciclaje.
 *
 * Diseño UNIVO verde (alineado con Semana1Page). 3 tarjetas de actividad
 * + banner de Quiz Final. La tarjeta "Tarjetas de Reflexión" enlaza al
 * juego Reflection Cards; las otras dos muestran "Próximamente".
 */
export default function Semana3Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');

  const activities = [
    {
      id: 'de-que-estan-hechos',
      title: '¿De qué están hechos?',
      desc: 'Mira la regadera, la caja y la botella. ¿De qué material es cada una?',
      color: 'bg-[#e7f6e4]',
      border: 'border-[#8ba888]',
      image: '/images/semana3/card-hechos.png',
      link: '/semana/3/hecho-de',
    },
    {
      id: 'a-reparar',
      title: '¡A reparar!',
      desc: 'La mesa, la ventana y la caja están rotas. Elige el material correcto.',
      color: 'bg-[#e5f4fc]',
      border: 'border-[#7eb6d4]',
      image: '/images/semana3/card-reparar.png',
      link: '/semana/3/build-it',
    },
    {
      id: 'tarjetas-reflexion',
      title: 'Tarjetas de Reflexión',
      desc: '¿Se bota, se recicla o se reutiliza? Tú decides.',
      color: 'bg-[#fbf3e4]',
      border: 'border-[#e0c48a]',
      image: '/images/semana3/reflexion/lata.png',
      extras: ['/images/semana3/reflexion/platano.png', '/images/semana3/reflexion/frasco.png'],
      link: '/semana/3/reflection-cards',
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
          Semana 3: Utilidad y Reciclaje
        </h1>
        <div className="w-10 h-10" aria-hidden="true" />
      </header>

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-[120px] md:pb-10 flex flex-col gap-8">
        <section className="text-center">
          <p className="font-body-lg text-body-lg text-[#434841]">
            Descubre de qué están hechas las cosas y cómo darles una nueva vida.
          </p>
          <p className="font-body-lg text-body-lg text-[#4a6549] font-bold mt-1">
            ¡Toca una tarjeta para jugar!
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className={`${activity.color} border-4 ${activity.border} rounded-3xl p-4 flex flex-col gap-4 shadow-[0_10px_0_rgba(74,101,73,0.08)] hover:-translate-y-1 transition-transform duration-300`}
            >
              <div className="w-full h-44 rounded-2xl overflow-hidden border-4 border-white bg-white relative">
                {activity.extras ? (
                  <div className="grid grid-cols-3 h-full gap-1 p-2">
                    {[activity.image, ...activity.extras].map((src) => (
                      <img key={src} alt="" src={src} className="w-full h-full object-contain" />
                    ))}
                  </div>
                ) : (
                  <img alt={activity.title} className="w-full h-full object-cover" src={activity.image} />
                )}
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-headline-md text-headline-md text-[#4a6549]">{activity.title}</h3>
                <p className="font-body-md text-body-md text-[#434841] mt-1 flex-grow">{activity.desc}</p>
                <button
                  onClick={() => navigate(activity.link)}
                  className="mt-4 w-full bg-[#4a6549] text-white font-label-lg py-3 px-6 rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
                  Jugar
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="p-5 md:p-6 bg-[#ccebc7] border-4 border-[#8ba888] rounded-3xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img src="/images/semana3/quiz/badge-medal.png" alt="" className="w-16 h-16 object-contain hidden sm:block" />
            <div>
              <h2 className="font-headline-md text-headline-md text-[#243d24]">Quiz: 10 preguntas</h2>
              <p className="font-body-md text-[#334d33]">Pon a prueba lo que aprendiste sobre materiales y reciclaje.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/semana/3/quiz')}
            className="whitespace-nowrap py-3 px-8 bg-[#4a6549] text-white font-label-lg rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center gap-2"
          >
            <span className="material-symbols-outlined">emoji_events</span>
            Empezar
          </button>
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
