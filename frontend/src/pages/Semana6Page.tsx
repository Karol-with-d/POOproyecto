import { useNavigate, Link } from 'react-router-dom';

const IMG_HERO = '/images/semana6/hero-personajes.png';
const IMG_SIMILITUDES = '/images/semana6/card-similitudes.png';
const IMG_MOVIMIENTO = '/images/semana6/card-movimiento.png';

interface ActivityCard {
  id: string;
  image?: string;
  imageBg: string;
  iconFallback?: string;
  badgeIcon: string;
  badgeLabel: string;
  badgeColor: string;
  title: string;
  desc: string;
  btnLabel: string;
  btnIcon: string;
  btnClass: string;
  onClick: () => void;
}

export default function Semana6Page() {
  const navigate = useNavigate();
  const handleBack = () => navigate('/home');

  const cards: ActivityCard[] = [
    {
      id: 'similitudes',
      image: IMG_SIMILITUDES,
      imageBg: 'bg-tertiary-fixed',
      badgeIcon: 'psychology',
      badgeLabel: 'Observación',
      badgeColor: 'text-primary',
      title: '¿Qué tenemos en común?',
      desc: 'Descubre las similitudes entre seres vivos y aprende cómo todos estamos conectados en este gran planeta.',
      btnLabel: 'Empezar aventura',
      btnIcon: 'arrow_forward',
      btnClass:
        'bg-primary text-on-primary border-b-4 border-primary-container hover:bg-primary-container hover:text-on-primary-container',
      onClick: () => alert('Próximamente'),
    },
    {
      id: 'movimiento',
      image: IMG_MOVIMIENTO,
      imageBg: 'bg-secondary-fixed',
      badgeIcon: 'directions_run',
      badgeLabel: 'Acción',
      badgeColor: 'text-secondary',
      title: '¡A moverse!',
      desc: '¡Es hora de hacer ejercicio y conocer tu cuerpo! Aprende cómo tus músculos y huesos trabajan juntos.',
      btnLabel: '¡Vamos a jugar!',
      btnIcon: 'play_circle',
      btnClass:
        'bg-secondary text-on-secondary border-b-4 border-secondary-fixed-dim hover:bg-secondary-container hover:text-on-secondary-container',
      onClick: () => alert('Próximamente'),
    },
    {
      id: 'habitats',
      imageBg: 'bg-tertiary-container',
      iconFallback: 'travel_explore',
      badgeIcon: 'public',
      badgeLabel: 'Entorno',
      badgeColor: 'text-tertiary',
      title: '¿Dónde vivo yo?',
      desc: 'Acompáñanos a explorar diferentes hábitats y descubre los increíbles animales y plantas que viven allí.',
      btnLabel: 'Explorar hábitats',
      btnIcon: 'search',
      btnClass:
        'bg-tertiary text-on-tertiary border-b-4 border-tertiary-fixed hover:bg-tertiary-fixed hover:text-on-tertiary-fixed',
      onClick: () => alert('Próximamente'),
    },
    {
      id: 'quiz',
      imageBg: 'bg-surface-variant',
      iconFallback: 'quiz',
      badgeIcon: 'assignment',
      badgeLabel: 'Evaluación',
      badgeColor: 'text-on-surface-variant',
      title: 'Quiz Semanal',
      desc: '¡Demuestra todo lo que has aprendido esta semana! Pon a prueba tus conocimientos de una forma divertida.',
      btnLabel: 'Iniciar Quiz',
      btnIcon: 'fact_check',
      btnClass:
        'bg-surface-container-highest text-on-surface border-b-4 border-outline-variant hover:bg-surface-dim',
      onClick: () => alert('Próximamente'),
    },
  ];

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen overflow-x-hidden">

      {/* ── Main ─────────────────────────────────────────────────────── */}
      <main className="min-h-screen">
        <section className="p-6 md:px-margin-desktop py-xl">
          <div className="max-w-6xl mx-auto flex flex-col gap-lg">

            {/* Hero banner */}
            <div className="flex flex-col md:flex-row items-center gap-6 bg-surface-container-lowest rounded-3xl p-6 shadow-sm border border-outline-variant/30">
              <div className="flex-grow text-center md:text-left">
                <div className="flex justify-between items-start mb-4">
                  <button
                    onClick={handleBack}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-colors font-label-md text-label-md"
                  >
                    <span className="material-symbols-outlined text-[20px]">close</span>
                    <span>Salir</span>
                  </button>
                </div>
                <h1 className="font-headline-lg text-headline-lg text-primary mb-2">
                  Semana de Exploración
                </h1>
                <p className="font-body-lg text-body-lg text-on-surface-variant">
                  ¡Hola, pequeño científico! Mira lo que tenemos preparado para ti hoy.
                </p>
              </div>
              <div className="w-full md:w-1/3 flex justify-center md:justify-end">
                <img
                  alt="Personajes de ciencia UNIVO"
                  className="h-32 object-contain"
                  src={IMG_HERO}
                />
              </div>
            </div>

            {/* Activities grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="bg-surface-container-lowest rounded-3xl overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-300"
                  style={{
                    boxShadow:
                      '0 10px 15px -3px rgba(74,101,73,0.1), 0 4px 6px -4px rgba(74,101,73,0.1)',
                    border: '2px solid rgba(195,200,191,0.3)',
                  }}
                >
                  {/* Card image area */}
                  <div className={`h-56 relative ${card.imageBg} overflow-hidden`}>
                    {card.image ? (
                      <img
                        alt={card.title}
                        className="w-full h-full object-cover opacity-90 mix-blend-multiply transition-transform duration-500"
                        src={card.image}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)')}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = 'scale(1)')}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center opacity-80">
                        <span className="material-symbols-outlined text-[100px]" style={{ fontVariationSettings: "'FILL' 0" }}>
                          {card.iconFallback}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-4 py-1 flex items-center gap-2">
                      <span className={`material-symbols-outlined ${card.badgeColor} text-[20px]`}>
                        {card.badgeIcon}
                      </span>
                      <span className={`font-label-md text-label-md ${card.badgeColor}`}>
                        {card.badgeLabel}
                      </span>
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-md flex-grow flex flex-col">
                    <h3 className="font-headline-md text-headline-md text-on-surface mb-sm">
                      {card.title}
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-lg flex-grow">
                      {card.desc}
                    </p>
                    <button
                      onClick={card.onClick}
                      className={`w-full py-4 rounded-2xl font-label-lg text-label-lg transition-colors flex items-center justify-center gap-2 active:translate-y-1 active:border-b-0 ${card.btnClass}`}
                    >
                      <span>{card.btnLabel}</span>
                      <span className="material-symbols-outlined">{card.btnIcon}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      </main>

      {/* ── Mobile bottom nav ─────────────────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center py-3 z-50">
        <Link to="/home" className="flex flex-col items-center gap-1 text-primary">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
          <span className="text-[10px] font-bold">Aprender</span>
        </Link>
        <Link to="/home" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">rocket_launch</span>
          <span className="text-[10px]">Misiones</span>
        </Link>
        <Link to="/home" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">shopping_bag</span>
          <span className="text-[10px]">Tienda</span>
        </Link>
        <Link to="/perfil" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">person</span>
          <span className="text-[10px]">Perfil</span>
        </Link>
      </nav>
    </div>
  );
}
