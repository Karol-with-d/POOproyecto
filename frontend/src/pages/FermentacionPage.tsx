import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * FermentacionPage — Actividad de la Semana 4: La Magia de la Fermentación.
 *
 * Administra dos pantallas:
 * 1. Bienvenida y contextualización.
 * 2. Laboratorio virtual con Fermi, el secreto de las burbujas y efecto de burbujas ascendentes.
 */
export default function FermentacionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'lab'>('welcome');

  const handleBack = () => {
    if (screen === 'lab') {
      setScreen('welcome');
    } else {
      navigate('/semana/4');
    }
  };

  const handleFinish = () => {
    alert('¡Lección de fermentación completada!');
    navigate('/semana/4');
  };

  // Ambient bubbles generation
  useEffect(() => {
    if (screen !== 'lab') return;

    const interval = setInterval(() => {
      const bubble = document.createElement('div');
      // Use standard custom bubble-anim class and background color
      bubble.className = 'fixed rounded-full bg-[#ccebc7]/30 pointer-events-none bubble-anim';
      bubble.style.zIndex = '0';
      const size = `${Math.random() * 20 + 10}px`;
      bubble.style.width = size;
      bubble.style.height = size;
      bubble.style.left = `${Math.random() * 100}vw`;
      bubble.style.bottom = '-50px';
      bubble.style.animationDuration = `${Math.random() * 4 + 3}s`;
      document.body.appendChild(bubble);

      setTimeout(() => {
        bubble.remove();
      }, 7000);
    }, 1200);

    return () => {
      clearInterval(interval);
      // Clean up bubbles from body
      document.querySelectorAll('.bubble-anim').forEach((el) => {
        if (el.parentElement === document.body) {
          el.remove();
        }
      });
    };
  }, [screen]);

  return (
    <div className="bg-[#faf9f5] text-[#1a1c1a] antialiased min-h-screen flex flex-col font-body-md relative overflow-x-hidden">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quicksand-text {
          font-family: 'Quicksand', sans-serif;
        }
        .scale-down-on-press:active {
          transform: scale(0.98);
        }
        .floating {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
        @keyframes bubble-rise {
          0% { transform: translateY(0) scale(1); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.4; }
          100% { transform: translateY(-120vh) scale(1.5); opacity: 0; }
        }
        .bubble-anim {
          animation: bubble-rise 6s ease-in infinite;
        }
        .speech-bubble {
          position: relative;
          background: #ffffff;
          border: 2px solid #c3c8be;
          border-radius: 1.5rem;
          padding: 1.5rem;
        }
        .speech-bubble::after {
          content: '';
          position: absolute;
          left: -20px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 10px 20px 10px 0;
          border-style: solid;
          border-color: transparent #ffffff transparent transparent;
        }
        .speech-bubble::before {
          content: '';
          position: absolute;
          left: -23px;
          top: 50%;
          transform: translateY(-50%);
          border-width: 11px 22px 11px 0;
          border-style: solid;
          border-color: transparent #c3c8be transparent transparent;
        }
        @media (max-width: 768px) {
          .speech-bubble::after {
            left: 50%;
            top: -20px;
            transform: translateX(-50%);
            border-width: 0 10px 20px 10px;
            border-color: transparent transparent #ffffff transparent;
          }
          .speech-bubble::before {
            left: 50%;
            top: -23px;
            transform: translateX(-50%);
            border-width: 0 11px 22px 11px;
            border-color: transparent transparent #c3c8be transparent;
          }
        }
      `}} />

      {/* TopAppBar Navigation Shell */}
      <header className="bg-[#faf9f5] sticky top-0 z-50 shadow-sm flex items-center h-16 px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleBack}
            aria-label="Volver"
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95 transition-transform text-[#334d33]"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-[#334d33] quicksand-text">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
      </header>

      {screen === 'welcome' ? (
        /* Screen 1: Welcome */
        <main className="flex-grow px-margin-mobile md:px-margin-desktop flex flex-col items-center justify-center max-w-7xl mx-auto w-full py-8 relative z-10">
          <article className="w-full max-w-2xl bg-[#f4f4ef] rounded-[24px] p-8 md:p-12 shadow-[0_8px_32px_rgba(74,101,73,0.08)] border border-outline-variant/30 flex flex-col items-center text-center">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] leading-tight quicksand-text mb-4">
              La Magia de la Fermentación
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant px-4 mb-8">
              ¡El secreto de las burbujas! En esta lección aprenderás cómo los microorganismos transforman los alimentos de manera sorprendente a través de procesos biológicos y químicos que puedes ver y sentir.
            </p>
            <div className="w-full flex justify-center">
              <button
                onClick={() => setScreen('lab')}
                className="bg-[#4a6549] text-white px-12 py-4 rounded-full font-label-lg text-label-lg active:scale-95 hover:bg-[#334d33] transition-all shadow-lg flex items-center gap-3 group quicksand-text"
              >
                <span>Comenzar Lección</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-white">
                  arrow_forward
                </span>
              </button>
            </div>
          </article>
        </main>
      ) : (
        /* Screen 2: Laboratory virtual */
        <main className="flex-grow max-w-7xl mx-auto w-full px-margin-mobile md:px-margin-desktop py-8 space-y-8 relative z-10">
          {/* Hero Section with Fermi */}
          <section className="mb-8">
            <div className="flex flex-col md:flex-row items-center gap-8 bg-white rounded-[32px] p-8 shadow-sm border border-outline-variant/30">
              <div className="relative flex-shrink-0">
                <div className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden border-8 border-[#bfe5fe] bg-[#efeeea] floating flex items-center justify-center">
                  <img
                    alt="Fermi the fermentation buddy"
                    className="w-full h-full object-cover"
                    src="/images/semana4/fermentacion.png"
                  />
                </div>
                {/* Ambient Bubbles Decoration */}
                <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-[#bfe5fe]/40 blur-sm"></div>
                <div className="absolute -bottom-2 -left-4 w-8 h-8 rounded-full bg-[#ccebc7]/40 blur-sm"></div>
              </div>
              <div className="flex-grow space-y-4">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] quicksand-text">
                  Fermi y el Secreto de las Burbujas
                </h1>
                <div className="speech-bubble border-2 border-[#c3c8be]">
                  <p className="font-body-lg text-body-lg text-on-surface leading-relaxed italic">
                    "¡Buurp! perdón, es que como azúcar y levadura y no puedo parar de hacer gases!"
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Informative Visual Section (Bento Style) */}
          <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Process Step 1: The Feast */}
            <div className="md:col-span-4 bg-[#efeeea] rounded-3xl p-6 flex flex-col items-center text-center space-y-4 border border-outline-variant/20 shadow-sm">
              <div className="w-24 h-24 bg-[#f3e0c2] rounded-2xl flex items-center justify-center relative overflow-hidden group">
                <span className="material-symbols-outlined text-[#51452f] text-5xl">
                  bakery_dining
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text">
                1. El Festín
              </h3>
              <p className="text-on-surface-variant font-body-md">
                ¡La levadura ama el azúcar! Estos microorganismos se alimentan de los dulces que encuentran en las masas y jugos.
              </p>
            </div>

            {/* Process Step 2: Transformation */}
            <div className="md:col-span-4 bg-[#ccebc7] rounded-3xl p-6 flex flex-col items-center text-center space-y-4 border border-outline-variant/20 shadow-sm relative overflow-hidden">
              <div className="w-24 h-24 bg-[#4a6549] rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-white text-5xl">
                  bubble_chart
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text">
                2. ¡Burbujas!
              </h3>
              <p className="text-on-surface font-body-md">
                Mientras comen, sueltan un gas llamado <b>CO₂</b>. ¡Ese es el gas que hace que el pan se infle y las bebidas tengan gas!
              </p>
            </div>

            {/* Process Step 3: Result */}
            <div className="md:col-span-4 bg-[#efeeea] rounded-3xl p-6 flex flex-col items-center text-center space-y-4 border border-outline-variant/20 shadow-sm">
              <div className="w-24 h-24 bg-[#c4e7ff] rounded-2xl flex items-center justify-center">
                <span className="material-symbols-outlined text-[#3e6378] text-5xl">
                  breakfast_dining
                </span>
              </div>
              <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text">
                3. ¡Magia!
              </h3>
              <p className="text-on-surface-variant font-body-md">
                Sin la fermentación, no tendríamos pan esponjoso, queso rico ni yogures deliciosos. ¡Es magia biológica!
              </p>
            </div>

            {/* Large Explanation Card */}
            <div className="bg-[#e3e3de] rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 border border-outline-variant/20 md:col-span-12 shadow-sm">
              <div className="flex-grow space-y-4">
                <h4 className="font-label-lg text-label-lg text-[#3e6378] uppercase tracking-wider quicksand-text">
                  Dato Curioso
                </h4>
                <p className="font-body-lg text-body-lg text-on-surface leading-relaxed">
                  ¿Sabías que la fermentación ha sido usada por humanos por más de 10,000 años? ¡Es uno de los inventos más antiguos del mundo!
                </p>
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Footer Navigation */}
      <footer className="bg-[#faf9f5] py-8 mt-auto border-t border-outline-variant/20 z-10">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-on-surface-variant hover:text-[#334d33] transition-colors font-label-lg text-label-lg quicksand-text"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            Anterior
          </button>
          <button
            onClick={screen === 'welcome' ? () => setScreen('lab') : handleFinish}
            className="bg-[#334d33] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:bg-[#4a6549] transition-all group scale-down-on-press shadow-md font-label-lg text-label-lg quicksand-text"
          >
            <span>Siguiente</span>
            <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-white">
              arrow_forward
            </span>
          </button>
        </div>
      </footer>
    </div>
  );
}
