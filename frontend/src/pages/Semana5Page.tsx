import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import WeekBottomNav, { WeekHubHeader, WEEK_NAV_THEMES } from '../components/WeekBottomNav';
import '../styles/terra-ciencia.css';

/**
 * Semana5Page — Hub de actividades de la Semana 5: Vida.
 *
 * Diseño "Terra Ciencia" (explorador de la naturaleza) adaptado del mockup
 * de Stitch. Paleta crema/sage/wood + tipografía Fredoka/Literata/Nunito
 * Sans, definida en `styles/terra-ciencia.css`. Solo se aplica a esta vista.
 */
export default function Semana5Page() {
  const navigate = useNavigate();

  const handleHome = () => navigate('/home');

  const activities = [
    {
      id: 'mis-semillas',
      title: 'Mis Semillas',
      desc: 'Colecciona vida vegetal',
      cta: 'Explorar',
      hoverBorderClass: 'hover:border-[var(--tc-primary)]',
      buttonClass: 'bg-[var(--tc-primary)] text-[var(--tc-on-primary)]',
      shadowClass: 'shadow-[var(--tc-shadow-3d-primary)]',
      textClass: 'text-[var(--tc-secondary)]',
      image: '/images/semana5/card-semillas.webp',
    },
    {
      id: 'superpoderes',
      title: 'Superpoderes',
      desc: 'Aprende sobre la fauna',
      cta: 'Aprender',
      hoverBorderClass: 'hover:border-[var(--tc-tertiary)]',
      buttonClass: 'bg-[var(--tc-tertiary)] text-[var(--tc-on-tertiary)]',
      shadowClass: 'shadow-[var(--tc-shadow-3d-tertiary)]',
      textClass: 'text-[var(--tc-tertiary)]',
      image: '/images/semana5/card-superpoderes.webp',
    },
    {
      id: 'busqueda',
      title: 'Búsqueda',
      desc: 'Encuentra los tesoros',
      cta: 'Cazar',
      hoverBorderClass: 'hover:border-[var(--tc-primary-container)]',
      buttonClass: 'bg-[var(--tc-primary-container)] text-[var(--tc-on-primary-container)]',
      shadowClass: 'shadow-[var(--tc-shadow-3d-primary)]',
      textClass: 'text-[var(--tc-on-primary-fixed-variant)]',
      image: '/images/semana5/card-busqueda.webp',
    },
  ];

  const handleActivityClick = (id: string) => {
    if (id === 'superpoderes') {
      navigate('/semana/5/superpoderes');
      return;
    }
    if (id === 'mis-semillas') {
      navigate('/semana/5/semillas');
      return;
    }
    if (id === 'busqueda') {
      navigate('/semana/5/busqueda');
      return;
    }
    showKidMessage('Muy pronto podrás jugar esta actividad.', 'soon');
  };

  const handleQuizClick = () => {
    navigate('/semana/5/quiz');
  };

  return (
    <div
      className="tc-cursor-magnifier tc-fredoka h-screen flex flex-col overflow-hidden tc-paper-grid relative"
      style={{ backgroundColor: 'var(--tc-background)', color: 'var(--tc-on-surface)' }}
    >
      <div className="tc-life-atmosphere" aria-hidden="true">
        <span className="tc-life-blob" />
      </div>
      <WeekHubHeader title="Semana 5: Vida" theme={WEEK_NAV_THEMES[5]} onBack={handleHome} />

      <main className="min-h-0 flex-1 relative flex flex-col items-center justify-start p-6 space-y-6 overflow-y-auto overflow-x-hidden scroll-pb-32 md:scroll-pb-0">
        {/* Field Notebook Header */}
        <div className="relative w-full max-w-4xl text-center">
          <div
            className="rounded-3xl p-4 inline-block mb-4 shadow-sm border-2 rotate-1 tc-soft-float"
            style={{
              backgroundColor: 'var(--tc-surface-container)',
              borderColor: 'color-mix(in srgb, var(--tc-primary) 20%, transparent)',
            }}
          >
            <img
              alt="Escritorio de Explorador"
              className="h-32 md:h-44 w-auto rounded-2xl"
              src="/images/hosted/3516f415c28c.webp"
            />
          </div>
          <p
            className="tc-literata text-xl mt-2 italic"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            ¿Qué descubriremos hoy, joven explorador?
          </p>
        </div>

        {/* Stamps/Badges Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`group relative flex flex-col items-center p-6 rounded-3xl border-4 border-dashed transition-colors tc-clay-button tc-rise-in tc-rise-delay-${index + 1} ${activity.hoverBorderClass}`}
              style={{
                backgroundColor: 'var(--tc-surface-container-lowest)',
                borderColor: 'var(--tc-outline-variant)',
              }}
            >
              <div
                className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 shadow-inner"
                style={{
                  borderColor: 'var(--tc-surface)',
                  backgroundColor: 'var(--tc-surface)',
                }}
              >
                <img
                  alt={activity.title}
                  className="w-full h-full object-cover tc-img-zoom"
                  src={activity.image}
                  loading="lazy"
                />
              </div>
              <h3 className={`font-bold text-lg ${activity.textClass}`}>{activity.title}</h3>
              <p
                className="text-xs tc-nunito text-center"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                {activity.desc}
              </p>
              <button
                onClick={() => handleActivityClick(activity.id)}
                className={`mt-4 px-4 py-2 rounded-lg font-bold tc-clay-button ${activity.buttonClass} ${activity.shadowClass}`}
              >
                {activity.cta}
              </button>
            </div>
          ))}
        </div>

        {/* Quiz Section */}
        <div className="w-full max-w-4xl pt-4 pb-36 md:pb-4">
          <div
            className="relative rounded-3xl p-6 border-2 flex flex-col md:flex-row items-center gap-6 overflow-hidden tc-rise-in tc-rise-delay-4"
            style={{
              backgroundColor: 'var(--tc-surface-container-low)',
              borderColor: 'color-mix(in srgb, var(--tc-tertiary) 20%, transparent)',
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2 tc-dot-border opacity-20" aria-hidden="true" />
            <div
              className="flex-shrink-0 bg-white rounded-2xl p-3 shadow-md -rotate-2 tc-soft-float"
              style={{ backgroundColor: 'var(--tc-surface-container-lowest)' }}
            >
              <img
                alt="Cerebro con corona y preguntas"
                className="w-24 h-24 object-contain"
                src="/images/semana5/quiz/intro-brain.png"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h4
                className="text-2xl font-bold"
                style={{ color: 'var(--tc-tertiary)' }}
              >
                ¿Listo para el Gran Reto?
              </h4>
              <p
                className="tc-nunito"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Demuestra tus conocimientos y gana insignias especiales.
              </p>
            </div>
            <button
              onClick={handleQuizClick}
              className="whitespace-nowrap px-8 py-4 rounded-xl font-bold tc-clay-button text-lg flex items-center gap-2 scroll-mb-28 md:scroll-mb-0"
              style={{
                backgroundColor: 'var(--tc-tertiary-container)',
                color: 'var(--tc-on-tertiary-container)',
                boxShadow: 'var(--tc-shadow-3d-tertiary)',
              }}
            >
              ¡Empezar Quiz! <span className="material-symbols-outlined">rocket_launch</span>
            </button>
          </div>
        </div>
      </main>

      <WeekBottomNav theme={WEEK_NAV_THEMES[5]} />
    </div>
  );
}
