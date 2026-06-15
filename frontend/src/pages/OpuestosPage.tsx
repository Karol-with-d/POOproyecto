import { useNavigate } from 'react-router-dom';

/**
 * OpuestosPage — Actividad de la Semana 4: Conoce a los Opuestos.
 *
 * Muestra las tarjetas de los personajes Señor Ácido y Don Básico,
 * con explicaciones interactivas sobre ácidos y bases.
 */
export default function OpuestosPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/semana/4');
  };

  const handleFinish = () => {
    alert('¡Lección de Ácidos y Bases completada!');
    navigate('/semana/4');
  };

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
        .bento-card {
          border-radius: 24px;
          background: #ffffff;
          transition: all 0.2s ease;
        }
        .card-hover:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(51, 77, 51, 0.12);
        }
      `}} />

      {/* TopAppBar */}
      <header className="bg-[#faf9f5] shadow-sm w-full top-0 sticky z-50 h-16 flex justify-between items-center px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-surface-container-low transition-colors duration-200 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[#334d33]">arrow_back</span>
          </button>
          <h1 className="font-headline-md text-[20px] md:text-headline-md text-[#334d33] truncate quicksand-text">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-8 mb-24 relative z-10 flex-1 w-full">
        {/* Welcome Hero Section */}
        <section className="mb-8">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] mb-2 quicksand-text">
            ¡Conoce a los Opuestos!
          </h2>
          <p className="text-on-surface-variant font-body-lg">
            En el laboratorio hoy descubriremos por qué algunas cosas nos hacen arrugar la nariz y otras son tan suaves.
          </p>
        </section>

        {/* Character Comparison Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Card 1: Acid */}
          <div className="bento-card p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="relative w-48 h-48 mb-6 mt-6">
              <img
                alt="Ácido Character"
                className="w-full h-full object-contain rounded-2xl scale-110"
                src="/images/semana4/acido.png"
              />
              <div className="absolute -right-8 bg-[#4a6549] text-white p-4 rounded-2xl rounded-bl-none shadow-md font-label-lg max-w-[200px] -top-10 quicksand-text text-left">
                ¡Yo soy lo que hace tu cara así, como el limón!
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 rounded-full font-label-sm uppercase tracking-wider mb-2 quicksand-text">
                ÁCIDO
              </span>
              <h3 className="font-headline-md text-on-surface mb-2 quicksand-text">
                Señor Ácido
              </h3>
              <p className="text-on-surface-variant">
                Es amarillo brillante y siempre tiene una cara graciosa porque todo lo que prueba es ¡super ácido!
              </p>
            </div>
          </div>

          {/* Card 2: Base */}
          <div className="bento-card p-6 shadow-sm border border-outline-variant/30 flex flex-col items-center text-center hover:-translate-y-1 transition-transform duration-200">
            <div className="relative w-48 h-48 mb-6 mt-6">
              <img
                alt="Básico Character"
                className="w-full h-full object-contain rounded-2xl scale-110"
                src="/images/semana4/basico.avif"
              />
              <div className="absolute -left-8 bg-[#bfe5fe] text-[#42677c] p-4 rounded-2xl rounded-br-none shadow-md font-label-lg max-w-[200px] -top-10 quicksand-text text-left">
                ¡Yo soy suavecito como el jabón!
              </div>
            </div>
            <div className="mt-4">
              <span className="inline-block px-4 py-1 bg-blue-100 text-blue-800 rounded-full font-label-sm uppercase tracking-wider mb-2 quicksand-text">
                BÁSICO
              </span>
              <h3 className="font-headline-md text-on-surface mb-2 quicksand-text">
                Don Básico
              </h3>
              <p className="text-on-surface-variant">
                Es como una nube azul y esponjosa. Todo en él es suave, resbaladizo y muy tranquilo.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Section: Explanation */}
        <section className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bento-card p-6 border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-yellow-600">
                  nutrition
                </span>
              </div>
              <h3 className="font-headline-md text-[#334d33] quicksand-text">
                Ácidos
              </h3>
            </div>
            <p className="text-on-surface-variant font-body-md">
              Sustancias inquietas y agrias. <br />
              <b>Ejemplos:</b> Limón, Vinagre.
            </p>
          </div>

          <div className="bento-card p-6 border border-outline-variant/30 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-600">
                  soap
                </span>
              </div>
              <h3 className="font-headline-md text-[#3e6378] quicksand-text">
                Bases
              </h3>
            </div>
            <p className="text-on-surface-variant font-body-md">
              Sustancias tranquilas y resbaladizas. <br />
              <b>Ejemplos:</b> Jabón, Pasta dental.
            </p>
          </div>
        </section>

        {/* Progress/Fun Fact Section */}
        <section className="bg-[#e3e3de] rounded-[32px] p-8 border border-outline-variant/20 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="flex-grow space-y-4">
            <p className="font-body-lg text-on-surface">
              <span className="font-label-lg text-label-lg text-[#3e6378] uppercase tracking-widest block mb-2 quicksand-text">
                Dato Curioso
              </span>
              Científicos usan la <b>escala de pH</b> (0 al 14) para medir qué tan ácido o básico es algo. ¡El agua pura es un 7 perfecto!
            </p>
          </div>
        </section>
      </main>

      {/* Navigation Controls / Footer */}
      <footer className="bg-[#faf9f5] py-4 border-t border-outline-variant/20 z-10">
        <div className="max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop flex justify-between items-center">
          <button
            onClick={handleBack}
            className="flex flex-row items-center justify-center text-on-surface-variant px-6 py-2 gap-2 hover:bg-primary-container/10 transition-colors active:scale-[0.98] duration-200 quicksand-text font-label-lg text-label-lg"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span>Anterior</span>
          </button>
          <button
            onClick={handleFinish}
            className="flex flex-row items-center justify-center bg-[#4a6549] text-white rounded-full px-8 py-3 gap-2 hover:bg-[#334d33] transition-all active:scale-[0.98] duration-200 shadow-md quicksand-text font-label-lg text-label-lg"
          >
            <span>Siguiente</span>
            <span className="material-symbols-outlined text-white">arrow_forward</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
