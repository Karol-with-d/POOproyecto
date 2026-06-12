import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/terra-ciencia.css';

/**
 * SemillasGamePage — Juego de Germinación Mágica.
 *
 * 7 slides en carrusel horizontal:
 *   0 = Intro ("¡Siembra tu Semilla!")
 *   1-5 = Días 1-5 con ilustraciones, sellos y burbujas de observación
 *   6 = Pantalla final con la colección de sellos ganados
 *
 * Cada día tiene un sello interactivo (botón "?" → ícono del día)
 * que al tocarse muestra una animación de emoji + auto-muestra la
 * burbuja con la observación del día. El progreso se navega con
 * Atrás/Siguiente en el footer, y con los círculos del header.
 */

const DAYS = [
  {
    id: 1,
    badge: 'Día 1',
    text: 'La semilla está dormida bajo la tierra',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJ2qp9d_e2-fk2OkXSEHOuquFw-c9hlFfOajqEvC4voKJ8i9iAHSBPGyiYZQ4a6ehfxkXJVsjzuPQ4AgcXOSj0QKPexMgVxfiSM3_rThqpATY3jRBLpg8hwXHQKAM0K5SvkG8-QM7KdgldjLrEtTUWEsHYUUBeEq6QI5UDuy4BVWj9XYGaYukfJir5AcHt3QQQzusqzWNdCuq1yRPwtSpuAwupCqF4WDeC7DHkZXa-fMYK8QiLT1f3KAvwyNngi3Oupbi7duXj9op-',
    bgClass: 'tc-bg-day-1',
    icon: 'water_drop',
    effect: '💧',
  },
  {
    id: 2,
    badge: 'Día 2',
    text: 'La semilla se abre y aparece una raíz',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUsual176_ApSXW-ehXFv83o74nMkdQ7jxpqnz7yvPPgfH0Bb77TrLmj4anWFF2tpzhYUzyHJvjB_erxpWC4QoY3kay35vKEh4aBu_NIEt7NcHDPDR4dcSrLtYQVMP4AW64mSdpQuG5Es0AFJ6EFPAuSwsPgUMpMmqqno3w3C5ReoDlq3ubXYfPG9apeIXJFZXGcjGiC63JB1jzJL9o95Pch4yxTNyGNbH-woSEBBQ5I6hGkJbklTKrtVWX2x2gzlSMWycI_X8bkog',
    bgClass: 'tc-bg-day-2',
    icon: 'wb_sunny',
    effect: '☀️',
  },
  {
    id: 3,
    badge: 'Día 3',
    text: 'Asoma un tallo muy delgadito',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvmKh4OY_vXebkDkmM-rp5TxcZasdNBwtgAWJPcmEg2BzVgH0hYybKbmy2bPDA1bDyrc55VUJI3xLuZVtkzgY-qoki68OtPesIyxhtZsl2MCLC91zT9qDX9IT0Ki01NAy7eqB6liaM25VwHAuilvHzTa0eFilwXDV3rBbBez9d-wfFLi9LPfAgwqeca-C5YmZYPGA8bZloh3fR4pOfb5wgysSuS0eOUO34ryu75XkeT5ZEkm6Eb_fHH0JyQuCXF7_i2j2JRryXYANo',
    bgClass: 'tc-bg-day-3',
    icon: 'eco',
    effect: '🌿',
  },
  {
    id: 4,
    badge: 'Día 4',
    text: 'Salen las primeras hojitas grandes',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCPvT6G3k2GTGUh4Ff5ESGbTMZIDQDaNuyMTUP9ozgEVJUsfhIgO5L9vq683OEnsJaVzcCQ97UhUl9kAnYDqq6aYjriFBcGQC6KNmiSnvkar4ZrTUJ1XTTHzdk-2JSh-TtOtWB3rtaGXHpddS6C_3U5Ycfm57-_8YBtr5COyHZ3K33eQ8vDS7MkWG22mtLq7s6n_j9_KVbDvlelcF-81sfhv6sk7Chg9ceEnOMKcyRM3DtWuYMO6ErJUEwiuMLgNyNj31kF-8_-2aKI',
    bgClass: 'tc-bg-day-4',
    icon: 'grade',
    effect: '⭐',
  },
  {
    id: 5,
    badge: 'Día 5',
    text: '¡Ya es una plántula! Necesita luz y agua',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKQSqQRIsw5NCsWvCjf9VX_et-I5ae7cDhPJxWjTaklCWCMEodAqbATuyqTj9oNBLARg9lsmV9Yllx-wC9gMLK_OTOlwS34XhWY_RdiAinCJWg-gvKqR1zoVnA3WoIkW1xa9SSaqv16ppeqZxGvJK4lP4lZI4SCX6NKdk_Qs0ky4G6Sic47eVzWNAKW3_8uhF4AE1WiLtLlNqDgaKs9RcH3zWk7W0yDxVmUMbTiB2A1-aJ3oTF7UW__rGd_9CmWNDq_sQBsOXDVUbB',
    bgClass: 'tc-bg-day-5',
    icon: 'filter_vintage',
    effect: '🌸',
  },
];

const INTRO_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDtpq6R-vsADMxp_zqulEUIuWVxmShOI8wkYJT5xDfqeI2RbPPzYKB-w6AXnnX3j4MkYiZ1qjZzEHsoXsfLSkPbVolmk_QZZVATEB1u46hAnBqpiDG--4Mq1mwACnT3GmHVdNP4GHY9lQijnDmZBW3ElywLtuRY2v6dADuNXijrv2gHT7pm6YnzTg3sVosbKBe18l2T4cJv5Tr_60Abjr4WH6CN9agXLm1GI9DrLwpjKif0y0L06CBwuouO_vpXCuCxAU-_rQgyjrj8';
const FINAL_IMG =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDdENmR_FzpUmAkW7eFrWZLNRWHQDk2GrzSngMBk2pSNVOTWeoS9OV6IRfGXNnr41SkvB2l9qPC_H7pE7ha0yysR2INJto6cKd1Mt4hvUbXe9vfrU6kLP92Gxm72pOCjvn_ilZcmOrY9ZJykOTiTnzNtf2h9tGqXRQOv_keBpN2MlkSgXTfgg3ldBh8qWZI9K3CwIIYJA_wXCa1TXIDKLKvtaPbaPdzBxqGn3iJiXOScANVV2UU_MwjML6YaXd8UR5hLxO7sqQyQVvu';

const TOTAL_SLIDES = 7;

export default function SemillasGamePage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const [stampedSteps, setStampedSteps] = useState<Set<number>>(new Set());
  const [activeBubbles, setActiveBubbles] = useState<Set<number>>(new Set());
  const [effects, setEffects] = useState<Record<number, string>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const goTo = (step: number) => {
    if (step === 0) {
      setStampedSteps(new Set());
      setActiveBubbles(new Set());
      setEffects({});
    } else {
      setActiveBubbles(new Set());
    }
    setCurrentStep(step);
    setVisitedSteps((prev) => new Set([...prev, step]));
  };

  const goNext = () => {
    if (currentStep < TOTAL_SLIDES - 1) goTo(currentStep + 1);
  };

  const goBack = () => {
    if (currentStep > 0) goTo(currentStep - 1);
  };

  const toggleBubble = (dayId: number) => {
    setActiveBubbles((prev) => {
      const next = new Set(prev);
      if (next.has(dayId)) {
        next.delete(dayId);
      } else {
        next.add(dayId);
      }
      return next;
    });
  };

  const applyStamp = (dayId: number) => {
    if (stampedSteps.has(dayId)) return;
    const day = DAYS.find((d) => d.id === dayId);
    if (!day) return;
    setStampedSteps((prev) => new Set([...prev, dayId]));
    setEffects((prev) => ({ ...prev, [dayId]: day.effect }));
    setTimeout(() => {
      setEffects((prev) => {
        const next = { ...prev };
        delete next[dayId];
        return next;
      });
    }, 1500);
    setActiveBubbles((prev) => new Set([...prev, dayId]));
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.transform = `translateX(-${currentStep * (100 / TOTAL_SLIDES)}%)`;
    }
  }, [currentStep]);

  const showBottomNav = currentStep > 0 && currentStep < TOTAL_SLIDES - 1;
  const isFinalStep = currentStep === TOTAL_SLIDES - 1;
  const isLastDay = currentStep === TOTAL_SLIDES - 2;

  return (
    <div
      className="bg-background text-on-surface overflow-hidden h-screen flex flex-col"
      style={{ backgroundColor: 'var(--tc-background)' }}
    >
      {/* Top Navigation Bar (Progress) */}
      <header
        className="w-full z-50 px-6 py-3 flex flex-col items-center shadow-sm shrink-0"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--tc-surface) 80%, transparent)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="flex items-center justify-between w-full mb-2">
          <button
            onClick={() => navigate('/semana/5')}
            aria-label="Salir de Germinación Mágica"
            className="flex items-center gap-1 font-bold text-sm transition-transform active:scale-95"
            style={{ color: 'var(--tc-primary)' }}
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Salir</span>
          </button>
          <h1
            className="text-lg font-tc-headline font-bold"
            style={{ color: 'var(--tc-primary)' }}
          >
            Germinación Mágica
          </h1>
          <div className="w-12" aria-hidden="true" />
        </div>
        <nav className="flex items-center gap-2 md:gap-4">
          {DAYS.map((day, i) => {
            const isVisited = visitedSteps.has(day.id);
            const isActive = currentStep === day.id;
            const bgColor = isActive
              ? 'bg-primary text-on-primary'
              : isVisited
                ? 'bg-primary-fixed'
                : 'bg-surface-container-highest';
            const textColor = isActive
              ? 'text-on-primary'
              : isVisited
                ? 'text-on-primary-fixed-variant'
                : 'text-on-surface-variant';
            return (
              <div key={day.id} className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => isVisited && goTo(day.id)}
                  disabled={!isVisited}
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all ${bgColor} ${textColor} ${
                    isVisited && !isActive ? 'opacity-100 cursor-pointer' : isActive ? 'opacity-100' : 'opacity-40 cursor-default'
                  }`}
                  aria-label={`Ir al ${day.badge}`}
                >
                  {isVisited && !isActive ? (
                    <span className="material-symbols-outlined text-xs">check</span>
                  ) : (
                    day.id
                  )}
                </button>
                {i < DAYS.length - 1 && (
                  <div
                    className={`w-4 h-0.5 rounded-full ${
                      isVisited ? 'bg-primary-fixed' : 'bg-surface-container-highest'
                    } ${!isVisited ? 'opacity-20' : ''}`}
                  />
                )}
              </div>
            );
          })}
        </nav>
      </header>

      {/* Main Content Canvas */}
      <main className="grow overflow-hidden relative">
        <div
          ref={containerRef}
          className="tc-slide-container"
          style={{ width: `${TOTAL_SLIDES * 100}%` }}
        >
          {/* Slide 0: Intro */}
          <section className="tc-slide justify-center px-6" id="step-0">
            <div className="max-w-md text-center space-y-6">
              <div
                className="relative w-64 h-64 mx-auto rounded-full flex items-center justify-center p-4"
                style={{ backgroundColor: 'color-mix(in srgb, var(--tc-primary-fixed) 30%, transparent)' }}
              >
                <img
                  alt="Niño plantando una semilla"
                  className="w-full h-full object-contain tc-bounce-pop"
                  src={INTRO_IMG}
                />
              </div>
              <h2
                className="text-4xl font-tc-headline font-extrabold"
                style={{ color: 'var(--tc-primary)' }}
              >
                ¡Siembra tu Semilla!
              </h2>
              <p
                className="text-lg font-tc-body font-medium"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Acompaña a Broti en su emocionante viaje desde el suelo hasta el sol.
              </p>
              <button
                onClick={() => goTo(1)}
                className="font-bold font-tc-label text-xl px-10 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                style={{
                  backgroundColor: 'var(--tc-primary)',
                  color: 'var(--tc-on-primary)',
                  boxShadow: '0 8px 24px rgba(74, 124, 89, 0.4)',
                }}
              >
                ¡Empezar a sembrar!
              </button>
            </div>
          </section>

          {/* Slides 1-5: Days */}
          {DAYS.map((day) => {
            const isStamped = stampedSteps.has(day.id);
            const bubbleOpen = activeBubbles.has(day.id);
            const effect = effects[day.id];
            return (
              <section key={day.id} className={`tc-slide pt-4 ${day.bgClass}`} id={`step-${day.id}`}>
                {/* Background grass silhouette */}
                <div className="tc-grass-element" aria-hidden="true" />

                {/* Day Badge */}
                <span
                  className="px-6 py-2 rounded-full font-bold shadow-sm mb-4 shrink-0"
                  style={{
                    backgroundColor: 'var(--tc-tertiary)',
                    color: 'var(--tc-on-tertiary)',
                    boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                  }}
                >
                  {day.badge}
                </span>

                {/* Illustration Center */}
                <div className="relative w-full h-1/2 flex items-center justify-center p-4">
                  <img
                    alt={day.badge}
                    className="max-h-full max-w-full object-contain"
                    style={{ filter: 'drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15))' }}
                    src={day.img}
                  />

                  {/* Stamp Button (fixed bottom-right) */}
                  <div className="absolute bottom-4 right-4 flex flex-col items-center gap-1 z-30">
                    <button
                      onClick={() => applyStamp(day.id)}
                      disabled={isStamped}
                      aria-label={`Sello del ${day.badge}`}
                      className={`w-[70px] h-[70px] rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90 border-4 ${
                        isStamped
                          ? 'border-solid scale-100'
                          : 'border-dashed hover:scale-110'
                      }`}
                      style={{
                        backgroundColor: isStamped ? 'var(--tc-primary)' : '#ffffff',
                        color: isStamped ? 'var(--tc-on-primary)' : 'var(--tc-primary)',
                        borderColor: isStamped ? 'var(--tc-primary)' : 'var(--tc-primary-fixed)',
                      }}
                    >
                      <span
                        className={`material-symbols-outlined text-4xl ${isStamped ? 'tc-stamp-anim' : ''}`}
                      >
                        {isStamped ? day.icon : 'help'}
                      </span>
                    </button>
                    <span
                      className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                      style={{
                        color: 'var(--tc-primary)',
                        backgroundColor: 'color-mix(in srgb, #ffffff 80%, transparent)',
                      }}
                    >
                      ¡Toca el sello!
                    </span>
                  </div>

                  {/* Effect Layer (emoji animation) */}
                  {effect && (
                    <div
                      className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center text-8xl"
                      aria-hidden="true"
                    >
                      <span className="tc-bounce-pop">{effect}</span>
                    </div>
                  )}
                </div>

                {/* Bottom Interaction Row */}
                <div className="w-full max-w-md px-6 mt-4 flex flex-col items-center gap-4 grow">
                  <div className="flex items-center gap-4 w-full justify-center">
                    <button
                      onClick={() => toggleBubble(day.id)}
                      aria-label={`Ver observación del ${day.badge}`}
                      className="p-4 rounded-full shadow-sm transition-colors hover:scale-105 active:scale-95"
                      style={{
                        backgroundColor: 'color-mix(in srgb, var(--tc-primary) 10%, transparent)',
                        color: 'var(--tc-primary)',
                      }}
                    >
                      <span className="material-symbols-outlined text-3xl">search</span>
                    </button>

                    <div
                      className={`tc-observation-bubble p-4 rounded-2xl shadow-lg border-2 max-w-[200px] ${
                        bubbleOpen ? 'tc-active' : ''
                      }`}
                      style={{
                        backgroundColor: 'color-mix(in srgb, #ffffff 90%, transparent)',
                        color: 'var(--tc-on-surface)',
                        borderColor: 'var(--tc-primary-fixed)',
                        backdropFilter: 'blur(8px)',
                      }}
                    >
                      <p className="text-sm font-bold text-center">"{day.text}"</p>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {/* Slide 6: Final */}
          <section
            className={`tc-slide justify-center px-6 ${isFinalStep ? DAYS[DAYS.length - 1].bgClass : ''}`}
            id="step-6"
          >
            <div className="tc-grass-element" aria-hidden="true" />
            <div
              className="max-w-2xl w-full p-8 rounded-3xl shadow-2xl space-y-6 text-center relative overflow-hidden"
              style={{
                backgroundColor: 'color-mix(in srgb, #ffffff 90%, transparent)',
                color: 'var(--tc-on-surface-variant)',
                borderTop: `8px solid var(--tc-primary)`,
                backdropFilter: 'blur(8px)',
              }}
            >
              <img
                alt="Tarjeta Final"
                className="w-full max-h-48 object-contain mb-4"
                src={FINAL_IMG}
              />
              <h2
                className="text-3xl font-tc-headline font-black"
                style={{ color: 'var(--tc-primary)' }}
              >
                ¡Esto es la GERMINACIÓN!
              </h2>
              <p
                className="text-lg font-tc-body font-medium"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Has visto cómo Broti crece con agua, tierra y mucho sol. ¡Eres un gran botánico!
              </p>

              {/* Stamp Collection */}
              <div className="flex justify-center gap-3 py-2" aria-label="Sellos coleccionados">
                {DAYS.map((day) => {
                  const isStamped = stampedSteps.has(day.id);
                  return (
                    <div
                      key={day.id}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        isStamped ? 'scale-110 shadow-md' : ''
                      }`}
                      style={{
                        backgroundColor: isStamped
                          ? 'var(--tc-primary)'
                          : 'color-mix(in srgb, var(--tc-primary-fixed) 30%, transparent)',
                        color: isStamped ? 'var(--tc-on-primary)' : 'color-mix(in srgb, var(--tc-primary) 20%, transparent)',
                      }}
                    >
                      <span className="material-symbols-outlined text-xl">{day.icon}</span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => goTo(0)}
                className="font-bold font-tc-label text-xl px-10 py-4 rounded-full shadow-lg hover:brightness-110 active:scale-95 transition-all"
                style={{
                  backgroundColor: 'var(--tc-tertiary)',
                  color: 'var(--tc-on-tertiary)',
                  boxShadow: '0 8px 24px rgba(112, 92, 48, 0.4)',
                }}
              >
                Volver a sembrar
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Bottom Navigation Bar - Docked */}
      <footer
        className="w-full z-50 flex justify-between items-center px-6 py-4 shrink-0"
        style={{
          backgroundColor: 'color-mix(in srgb, var(--tc-surface) 40%, transparent)',
          backdropFilter: 'blur(8px)',
          visibility: showBottomNav ? 'visible' : 'hidden',
        }}
      >
        <button
          onClick={goBack}
          aria-label="Día anterior"
          className="flex flex-row items-center gap-2 rounded-full px-6 py-3 shadow-sm hover:scale-105 active:scale-90 transition-all"
          style={{
            backgroundColor: 'color-mix(in srgb, var(--tc-tertiary-container) 80%, transparent)',
            color: 'var(--tc-on-tertiary-container)',
          }}
        >
          <span className="material-symbols-outlined">arrow_back_ios</span>
          <span className="font-tc-label font-bold">Atrás</span>
        </button>
        <button
          onClick={goNext}
          aria-label={isLastDay ? 'Finalizar' : 'Día siguiente'}
          className="flex flex-row items-center gap-2 rounded-full px-10 py-4 shadow-lg hover:scale-105 active:scale-90 transition-all"
          style={{
            backgroundColor: 'var(--tc-primary)',
            color: 'var(--tc-on-primary)',
          }}
        >
          <span className="font-tc-label font-bold text-lg">
            {isLastDay ? 'Finalizar' : 'Siguiente'}
          </span>
          <span className="material-symbols-outlined">
            {isLastDay ? 'auto_awesome' : 'arrow_forward_ios'}
          </span>
        </button>
      </footer>
    </div>
  );
}
