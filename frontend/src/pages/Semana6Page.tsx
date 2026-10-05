import { useNavigate } from 'react-router-dom';
import WeekBottomNav, { WeekHubHeader, WEEK_NAV_THEMES } from '../components/WeekBottomNav';
import '../styles/bosque-vivo.css';
import { playClick } from '../services/sounds';

const IMG_HERO = '/images/semana6/hero-personajes.webp';
const IMG_SIMILITUDES = '/images/semana6/card-similitudes.webp';
const IMG_MOVIMIENTO = '/images/semana6/card-movimiento.webp';
const IMG_HABITATS = '/images/semana6/card-habitats.svg';
const IMG_QUIZ = '/images/semana6/quiz/intro-hero.png';

/**
 * Semana 6 — Hub "Bosque Vivo"
 * Expedición de campo: similitudes, movimiento, hábitats y quiz.
 */
export default function Semana6Page() {
  const navigate = useNavigate();
  const theme = WEEK_NAV_THEMES[6];

  const missions = [
    {
      id: 'similitudes',
      badge: 'Observa',
      badgeTone: 'river' as const,
      title: '¿Qué tenemos en común?',
      desc: 'Descubre qué une a plantas y animales en el gran tejido de la vida.',
      cta: 'Salir al campo',
      image: IMG_SIMILITUDES,
      accent: '#1a7a96',
      path: '/semana/6/similitudes',
      icon: 'psychology',
    },
    {
      id: 'movimiento',
      badge: 'Muévete',
      badgeTone: 'coral' as const,
      title: '¡A moverse!',
      desc: 'Activa músculos y corazón: siente cómo tu cuerpo explora el bosque.',
      cta: '¡A saltar!',
      image: IMG_MOVIMIENTO,
      accent: '#ff7a59',
      path: '/semana/6/movimiento',
      icon: 'directions_run',
    },
    {
      id: 'habitats',
      badge: 'Explora',
      badgeTone: 'leaf' as const,
      title: '¿Dónde vivo yo?',
      desc: 'Lleva cada animal a su hogar: océano, bosque, desierto o campo.',
      cta: 'Mapear hábitats',
      image: IMG_HABITATS,
      accent: '#2f9e6b',
      path: '/semana/6/habitats',
      icon: 'travel_explore',
    },
  ];

  const badgeClass = {
    river: { bg: 'rgba(26,122,150,0.15)', color: '#1a7a96' },
    coral: { bg: 'rgba(255,122,89,0.18)', color: '#e85a3a' },
    leaf: { bg: 'rgba(47,158,107,0.18)', color: '#1f6b4a' },
  };

  return (
    <div className="bv-root bv-shell relative">
      <div className="bv-atmosphere" aria-hidden="true">
        <div className="bv-fireflies">
          <span /><span /><span /><span />
        </div>
      </div>

      <WeekHubHeader title="Semana 6: Naturaleza" theme={theme} onBack={() => navigate('/home')} />

      <main className="bv-scroll relative z-[1] px-5 md:px-10 py-6 md:py-8 pb-36 md:pb-10">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">

          {/* Expedition banner */}
          <section className="bv-card bv-rise relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  'linear-gradient(120deg, rgba(15,47,40,0.92) 0%, rgba(26,122,150,0.85) 55%, rgba(47,158,107,0.75) 100%)',
              }}
              aria-hidden="true"
            />
            <div className="relative z-[1] flex flex-col md:flex-row items-center gap-5 p-6 md:p-8">
              <div className="flex-1 text-center md:text-left text-white">
                <span
                  className="bv-chip mb-3"
                  style={{ background: 'rgba(212,245,66,0.95)', color: '#0f2f28' }}
                >
                  <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    forest
                  </span>
                  Expedición Bosque Vivo
                </span>
                <h2 className="bv-baloo text-3xl md:text-4xl font-extrabold leading-tight mb-2">
                  ¡Salimos al campo!
                </h2>
                <p className="text-white/85 font-semibold max-w-md mx-auto md:mx-0">
                  Observa, muévete y coloca a cada ser vivo en su hogar. El bosque te espera.
                </p>
              </div>
              <div className="bv-float shrink-0">
                <img
                  src={IMG_HERO}
                  alt="Exploradores de la naturaleza"
                  className="h-36 md:h-44 w-auto object-contain drop-shadow-lg"
                />
              </div>
            </div>
          </section>

          {/* Missions */}
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="bv-title text-2xl md:text-3xl">Misiones del día</h3>
                <p className="bv-subtitle text-sm md:text-base">Elige tu siguiente descubrimiento</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {missions.map((m, i) => (
                <article
                  key={m.id}
                  className={`bv-card bv-rise flex flex-col`}
                  style={{ animationDelay: `${0.08 * (i + 1)}s` }}
                >
                  <div className="relative h-40 overflow-hidden" style={{ background: `${m.accent}22` }}>
                    <img
                      src={m.image}
                      alt={m.title}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to top, ${m.accent}99 0%, transparent 55%)`,
                      }}
                    />
                    <span
                      className="bv-chip absolute top-3 left-3"
                      style={badgeClass[m.badgeTone]}
                    >
                      <span className="material-symbols-outlined text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {m.icon}
                      </span>
                      {m.badge}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <h4 className="bv-baloo text-xl font-extrabold" style={{ color: m.accent }}>
                      {m.title}
                    </h4>
                    <p className="bv-subtitle text-sm flex-1">{m.desc}</p>
                    <button
                      type="button"
                      onClick={() => { playClick(); navigate(m.path); }}
                      className="bv-btn w-full text-white"
                      style={{
                        background: m.accent,
                        boxShadow: `0 8px 0 0 color-mix(in srgb, ${m.accent} 70%, #0f2f28)`,
                      }}
                    >
                      {m.cta}
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Quiz band */}
          <section className="bv-panel bv-rise relative overflow-hidden p-5 md:p-6">
            <div
              className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full opacity-40"
              style={{ background: 'radial-gradient(circle, #d4f542, transparent 70%)' }}
              aria-hidden="true"
            />
            <div className="relative flex flex-col md:flex-row items-center gap-5">
              <div
                className="shrink-0 rounded-2xl p-3 -rotate-2"
                style={{ background: 'rgba(212,245,66,0.35)', border: '3px solid rgba(15,47,40,0.1)' }}
              >
                <img src={IMG_QUIZ} alt="Quiz de la expedición" className="h-24 w-24 object-contain" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <span
                  className="bv-chip mb-2"
                  style={{ background: 'rgba(255,122,89,0.2)', color: '#e85a3a' }}
                >
                  Reto final
                </span>
                <h3 className="bv-title text-2xl md:text-3xl mb-1">¿Listo para el gran quiz?</h3>
                <p className="bv-subtitle">
                  Demuestra lo que aprendiste sobre similitudes, movimiento y hábitats.
                </p>
              </div>
              <button
                type="button"
                onClick={() => { playClick(); navigate('/semana/6/quiz'); }}
                className="bv-btn bv-btn-coral shrink-0 whitespace-nowrap"
              >
                ¡Empezar Quiz!
                <span className="material-symbols-outlined">rocket_launch</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <WeekBottomNav theme={theme} />
    </div>
  );
}
