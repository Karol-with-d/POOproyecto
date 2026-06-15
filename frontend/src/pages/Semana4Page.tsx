import { useNavigate, Link } from 'react-router-dom';

/**
 * Semana4Page — Hub de actividades de la Semana 4: Propiedades Químicas.
 *
 * Presenta un grid estilo Bento con las actividades y el quiz de la semana,
 * adaptado al stack y diseño general de la plataforma.
 */
export default function Semana4Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');
  const handleHome = () => navigate('/home');

  const handleStartQuiz = () => {
    alert('Próximamente');
  };

  const handleActivityClick = (activityName: string) => {
    if (activityName === 'Oxidación') {
      navigate('/semana/4/oxidacion');
    } else if (activityName === 'Fermentación') {
      navigate('/semana/4/fermentacion');
    } else {
      alert(`${activityName}: Próximamente`);
    }
  };

  return (
    <div className="bg-[#faf9f5] text-[#1a1c1a] antialiased min-h-screen flex flex-col font-body-md relative overflow-x-hidden">
      {/* Custom Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .quicksand-text {
          font-family: 'Quicksand', sans-serif;
        }
        .interactive-card {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 2px solid transparent;
        }
        .interactive-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 35px rgba(74, 101, 73, 0.12);
          border-color: #c2e1be;
        }
        .interactive-card:active {
          transform: scale(0.98);
        }
        .floating {
          animation: floating 3s ease-in-out infinite;
        }
        @keyframes floating {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}} />

      {/* Ambient Laboratory Silhouettes */}
      <div
        className="fixed inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: 'radial-gradient(#334d33 0.5px, transparent 0.5px)',
          backgroundSize: '40px 40px',
          zIndex: 0,
        }}
      />
      <span className="material-symbols-outlined absolute text-[#334d33] opacity-10 text-[120px] pointer-events-none" style={{ top: '10%', left: '5%', zIndex: 0 }}>biotech</span>
      <span className="material-symbols-outlined absolute text-[#334d33] opacity-10 text-[120px] pointer-events-none" style={{ top: '60%', right: '5%', zIndex: 0 }}>science</span>
      <span className="material-symbols-outlined absolute text-[#334d33] opacity-10 text-[120px] pointer-events-none" style={{ bottom: '10%', left: '15%', zIndex: 0 }}>pill</span>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-[#faf9f5] shadow-[0_4px_15px_rgba(74,101,73,0.08)] py-4 px-margin-mobile md:px-margin-desktop flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
          >
            <span className="material-symbols-outlined text-[#334d33]">arrow_back</span>
          </button>
          <h1 className="text-[#334d33] quicksand-text font-headline-md text-headline-md font-bold">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
        <button
          onClick={handleHome}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[#334d33]">home</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-8 relative z-10">
        {/* Welcome Hero */}
        <section className="mb-8 text-center md:text-left">
          <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] mb-2 quicksand-text">
            ¡Bienvenido a la Semana 4!
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
            Explora los secretos de la materia. Aprende cómo los elementos se transforman, brillan y cambian nuestro mundo a través de las reacciones químicas.
          </p>
        </section>

        {/* Bento Grid of Experiments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {/* 1. Oxidación */}
          <div
            onClick={() => handleActivityClick('Oxidación')}
            className="interactive-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_15px_rgba(74,101,73,0.08)] flex flex-col cursor-pointer"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#fff5f0] mb-4 overflow-hidden relative group">
              <img
                alt="Oxidación"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                src="/images/semana4/oxidacion.png"
              />
            </div>
            <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text mb-2">
              El Misterio de la Oxidación
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Descubre por qué cambian las frutas.
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#334d33] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:scale-105 transition-all quicksand-text text-label-lg ml-auto">
                <span>Ir</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* 2. Fermentación */}
          <div
            onClick={() => handleActivityClick('Fermentación')}
            className="interactive-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_15px_rgba(74,101,73,0.08)] flex flex-col cursor-pointer"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#f0f8ff] mb-4 overflow-hidden relative group">
              <img
                alt="Fermentación"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                src="/images/semana4/fermentacion.png"
              />
            </div>
            <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text mb-2">
              La Magia de la Fermentación
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              ¡El secreto de la fermentación!
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#334d33] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:scale-105 transition-all quicksand-text text-label-lg ml-auto">
                <span>Ir</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* 3. Ácidos y Bases */}
          <div
            onClick={() => handleActivityClick('Ácidos y Bases')}
            className="interactive-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_15px_rgba(74,101,73,0.08)] flex flex-col cursor-pointer lg:row-span-1"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#f5f5f5] mb-4 overflow-hidden relative group flex items-center justify-center gap-2">
              <div className="w-1/2 h-full flex items-center justify-center">
                <img
                  alt="Ácido"
                  className="w-full h-4/5 object-contain"
                  src="/images/semana4/acido.png"
                />
              </div>
              <div className="w-1/2 h-full flex items-center justify-center">
                <img
                  alt="Básico"
                  className="w-full h-4/5 object-contain"
                  src="/images/semana4/basico.avif"
                />
              </div>
              </div>
            <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text mb-2">
              Conoce a los Opuestos
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              ¿Agrio o suavecito?
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#334d33] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:scale-105 transition-all quicksand-text text-label-lg ml-auto">
                <span>Ir</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* 4. Quimioluminiscencia */}
          <div
            onClick={() => handleActivityClick('Quimioluminiscencia')}
            className="interactive-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_15px_rgba(74,101,73,0.08)] flex flex-col cursor-pointer"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#1a1c1a] mb-4 overflow-hidden relative group flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-[#4a654922] to-transparent"></div>
              <img
                alt="Lumi"
                className="w-4/5 h-4/5 object-contain floating"
                src="/images/semana4/lumi.png"
              />
            </div>
            <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text mb-2">
              Lumi y las Luces
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Brilla en la oscuridad.
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#334d33] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:scale-105 transition-all quicksand-text text-label-lg ml-auto">
                <span>Ir</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* 5. Combustión */}
          <div
            onClick={() => handleActivityClick('Combustión')}
            className="interactive-card bg-surface-container-lowest p-6 rounded-[24px] shadow-[0_4px_15px_rgba(74,101,73,0.08)] flex flex-col cursor-pointer"
          >
            <div className="aspect-square w-full rounded-2xl bg-[#fff0f0] mb-4 overflow-hidden relative group">
              <img
                alt="Combus"
                className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                src="/images/semana4/combustion.png"
              />
            </div>
            <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text mb-2">
              El Gran Drama Químico
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant mb-4">
              Transformación total con fuego.
            </p>
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-2 bg-[#334d33] text-white px-8 py-3 rounded-full font-bold shadow-sm hover:scale-105 transition-all quicksand-text text-label-lg ml-auto">
                <span>Ir</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </div>
            </div>
          </div>

          {/* 6. Desafío Final / Quiz */}
          <div
            onClick={handleStartQuiz}
            className="interactive-card bg-[#4a6549] p-6 rounded-[24px] shadow-[0_10px_25px_rgba(74,101,73,0.2)] flex flex-col cursor-pointer text-white"
          >
            <div className="aspect-square w-full rounded-2xl bg-white/10 mb-4 flex items-center justify-center relative overflow-hidden">
              <span className="material-symbols-outlined text-[100px] text-white/50 absolute -right-4 -bottom-4 rotate-12">
                emoji_events
              </span>
              <div className="text-center">
                <span className="material-symbols-outlined text-6xl text-white block mb-2">
                  military_tech
                </span>
                <p className="quicksand-text font-bold text-xl">¿Estás listo?</p>
              </div>
            </div>
            <h3 className="font-headline-md text-headline-md text-[#c2e1be] quicksand-text mb-2">
              Quiz de la Semana
            </h3>
            <p className="font-body-md text-body-md text-[#c2e1be]/80 mb-4">
              Pon a prueba tus conocimientos de científico.
            </p>
            <div className="mt-auto flex items-center justify-end">
              <div className="bg-white text-[#334d33] px-6 py-2 rounded-full font-bold shadow-md hover:scale-105 active:scale-95 transition-all">
                ¡EMPEZAR!
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-12 px-margin-mobile md:px-margin-desktop bg-[#f4f4ef] mt-12 flex flex-col items-center z-10 pb-[120px] md:pb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="material-symbols-outlined text-[#334d33] text-3xl">biotech</span>
          <span className="font-headline-md text-headline-md font-bold text-[#334d33]">Discovery Lab</span>
        </div>
        <p className="font-body-md text-body-md text-on-surface-variant text-center max-w-md">
          Semana 4: Propiedades Químicas
        </p>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="bg-[#fbf8fc] shadow-[0_-4px_20px_rgba(74,101,73,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-xl z-20">
        <Link
          to="/home"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md text-xs">Map</span>
        </Link>
        <div className="flex flex-col items-center justify-center bg-[#8ba888] text-[#243d24] rounded-full px-6 py-2 scale-90 transition-all duration-200 ease-out">
          <span
            className="material-symbols-outlined mb-1"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
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
