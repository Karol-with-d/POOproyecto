import { useNavigate } from 'react-router-dom';
import WeekBottomNav, { WeekHubHeader, WEEK_NAV_THEMES } from '../components/WeekBottomNav';

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
      image: '/images/semana3/reflexion/lata.webp',
      extras: ['/images/semana3/reflexion/platano.webp', '/images/semana3/reflexion/frasco.webp'],
      link: '/semana/3/reflection-cards',
    },
  ];

  return (
    <div className="bg-[#f8f5f0] text-[#1b1b1e] antialiased h-screen flex flex-col overflow-hidden font-body-md">
      <WeekHubHeader
        title="Semana 3: Utilidad y Reciclaje"
        theme={WEEK_NAV_THEMES[3]}
        onBack={handleBack}
      />

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-5 md:px-10 py-8 pb-[120px] md:pb-10 flex flex-col gap-8 overflow-y-auto">
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

      <WeekBottomNav theme={WEEK_NAV_THEMES[3]} />
    </div>
  );
}
