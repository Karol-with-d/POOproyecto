import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * OxidacionPage — Actividad de la Semana 4: El Misterio de la Oxidación.
 *
 * Administra dos pantallas:
 * 1. Bienvenida y contextualización.
 * 2. Laboratorio virtual con tabla de observación y la familia química (Óxido).
 */
export default function OxidacionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'lab'>('welcome');

  // Form State
  const [freshColor, setFreshColor] = useState('');
  const [oxidizedColor, setOxidizedColor] = useState('');
  const [freshOdor, setFreshOdor] = useState('');
  const [oxidizedOdor, setOxidizedOdor] = useState('');
  const [freshTexture, setFreshTexture] = useState('');
  const [oxidizedTexture, setOxidizedTexture] = useState('');
  const [freshEdible, setFreshEdible] = useState<boolean | null>(null);
  const [oxidizedEdible, setOxidizedEdible] = useState<boolean | null>(null);

  const handleBack = () => {
    if (screen === 'lab') {
      setScreen('welcome');
    } else {
      navigate('/semana/4');
    }
  };

  const handleFinish = () => {
    alert('¡Observación guardada con éxito!');
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
        .speech-bubble {
          position: relative;
          background: #ffffff;
          border-radius: 24px;
          filter: drop-shadow(0px 10px 15px rgba(51, 77, 51, 0.05));
        }
        .speech-bubble:after {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          width: 0;
          height: 0;
          border: 20px solid transparent;
          border-right-color: #ffffff;
          border-left: 0;
          margin-top: -20px;
          margin-left: -20px;
        }
        @media (max-width: 768px) {
          .speech-bubble:after {
            top: 0;
            left: 50%;
            border: 20px solid transparent;
            border-bottom-color: #ffffff;
            border-top: 0;
            margin-left: -20px;
            margin-top: -20px;
          }
        }
      `}} />

      {/* TopAppBar */}
      <nav className="docked full-width top-0 sticky z-50 bg-[#faf9f5] shadow-sm h-16 flex items-center w-full px-margin-mobile md:px-margin-desktop">
        <div className="flex items-center gap-4 w-full">
          <button
            onClick={handleBack}
            aria-label="Volver"
            className="material-symbols-outlined text-[#334d33] hover:bg-surface-container-high transition-colors p-2 rounded-full active:scale-95 transition-transform"
          >
            arrow_back
          </button>
          <h1 className="font-headline-md text-headline-md font-bold text-[#334d33] truncate">
            Semana 4: Propiedades Químicas
          </h1>
        </div>
      </nav>

      {screen === 'welcome' ? (
        /* Screen 1: Welcome */
        <main className="flex-1 flex flex-col items-center py-8 px-margin-mobile md:px-margin-desktop justify-center relative z-10">
          <div className="max-w-2xl w-full bg-[#f4f4ef] p-8 md:p-12 shadow-[0_8px_32px_rgba(74,101,73,0.08)] border border-outline-variant/30 flex flex-col items-center text-center rounded-[32px]">
            <div className="space-y-4 mb-8">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] leading-tight quicksand-text">
                El Misterio de la Oxidación
              </h2>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                En esta lección, exploraremos cómo el oxígeno interactúa con diferentes materiales de nuestro entorno. Aprenderás a identificar las señales químicas de la oxidación y descubrirás por qué este proceso es fundamental tanto en la naturaleza como en nuestra vida diaria.
              </p>
            </div>
            <div className="w-full flex flex-col items-center">
              <button
                onClick={() => setScreen('lab')}
                className="bg-[#4a6549] text-white px-10 py-4 rounded-full font-label-lg text-label-lg active:scale-95 hover:opacity-90 transition-all shadow-md flex items-center gap-3 group quicksand-text"
              >
                <span>Comenzar Lección</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform text-white">
                  arrow_forward
                </span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* Screen 2: Laboratory virtual */
        <main className="flex-1 pt-8 pb-16 px-margin-mobile md:px-margin-desktop max-w-7xl mx-auto space-y-8 relative z-10">
          {/* Activity Title Section */}
          <div className="text-center md:text-left">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#334d33] mb-2 quicksand-text">
              El Secreto de la Fruta Café
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              ¡Investiguemos por qué las frutas cambian de color!
            </p>
          </div>

          {/* Character Intro Row */}
          <section className="flex flex-col md:flex-row items-center gap-8 bg-[#f4f4ef] rounded-[24px] p-6 md:p-10 shadow-sm border border-outline-variant/20">
            <div className="w-48 h-48 md:w-64 md:h-64 flex-shrink-0 relative">
              <img
                alt="Óxido el personaje"
                className="w-full h-full object-contain rounded-full"
                src="/images/semana4/oxidacion.png"
              />
              <div className="absolute -bottom-2 -right-2 bg-[#334d33] text-white p-2 rounded-full shadow-lg flex items-center justify-center">
                <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: '"FILL" 1' }}>
                  science
                </span>
              </div>
            </div>
            <div className="speech-bubble p-8 border-2 border-[#b0cfac] flex-1">
              <p className="font-headline-md text-headline-md-mobile md:text-headline-md text-[#334d33] leading-tight quicksand-text">
                "¡Yo aparezco cuando dejas tu comida al aire y la pongo café sin permiso!"
              </p>
              <p className="mt-4 font-body-md text-on-surface-variant">
                Me llamo <strong>Óxido</strong>, y soy el resultado de una reacción química entre el oxígeno y las frutas.
              </p>
            </div>
          </section>

          {/* Visual Reference */}
          <section className="flex justify-center py-4">
            <div className="bg-white rounded-[24px] p-4 md:p-8 shadow-[0px_15px_30px_rgba(51,77,51,0.08)] max-w-4xl w-full border-b-4 border-[#334d33] border-x border-t border-outline-variant/30">
              <img
                alt="Comparación de peras"
                className="w-full h-auto rounded-xl object-cover aspect-[16/9]"
                src="/images/semana4/peras_comparacion.png"
              />
              <div className="mt-6 flex justify-around items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#ccebc7] rounded-full text-[#334d33]">
                  <span className="material-symbols-outlined text-[#334d33]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    sentiment_satisfied
                  </span>
                  <span className="font-label-lg text-label-lg uppercase tracking-widest quicksand-text">
                    FRESCA
                  </span>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#f3e0c2] rounded-full text-[#51452f]">
                  <span className="material-symbols-outlined text-[#51452f]" style={{ fontVariationSettings: '"FILL" 1' }}>
                    eco
                  </span>
                  <span className="font-label-lg text-label-lg uppercase tracking-widest quicksand-text">
                    OXIDADA
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* Activity Table (Bento Grid Style) */}
          <section className="bg-[#efeeea] rounded-[24px] p-6 md:p-10 shadow-sm border border-outline-variant/20 overflow-hidden">
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-[#4a6549] p-3 rounded-xl text-white">
                <span className="material-symbols-outlined text-white">
                  edit_note
                </span>
              </div>
              <div>
                <h3 className="font-headline-md text-headline-md text-[#334d33] quicksand-text">
                  Tabla de Observación
                </h3>
                <p className="text-on-surface-variant font-body-md">
                  Registra lo que ves en el microscopio virtual
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column Headers (Mobile Hidden) */}
              <div className="hidden md:block"></div>
              <div className="hidden md:flex flex-col items-center justify-center p-4 bg-[#4a6549] text-white rounded-xl font-label-lg quicksand-text">
                <span className="material-symbols-outlined mb-1 text-white">
                  restaurant
                </span>
                Pera Fresca
              </div>
              <div className="hidden md:flex flex-col items-center justify-center p-4 bg-[#6a5d45] text-white rounded-xl font-label-lg quicksand-text">
                <span className="material-symbols-outlined mb-1 text-white">
                  science
                </span>
                Pera Oxidada
              </div>

              {/* Row: Color */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl md:bg-transparent md:p-0">
                <span className="material-symbols-outlined text-[#334d33] md:hidden">palette</span>
                <span className="font-label-lg text-[#334d33] quicksand-text">Color</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <input
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent placeholder-outline-variant outline-none"
                  placeholder="Escribe el color..."
                  type="text"
                  value={freshColor}
                  onChange={(e) => setFreshColor(e.target.value)}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <input
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent placeholder-outline-variant outline-none"
                  placeholder="Escribe el color..."
                  type="text"
                  value={oxidizedColor}
                  onChange={(e) => setOxidizedColor(e.target.value)}
                />
              </div>

              {/* Row: Olor */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl md:bg-transparent md:p-0">
                <span className="material-symbols-outlined text-[#334d33] md:hidden">air</span>
                <span className="font-label-lg text-[#334d33] quicksand-text">Olor</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <select
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent text-on-surface-variant appearance-none cursor-pointer outline-none"
                  value={freshOdor}
                  onChange={(e) => setFreshOdor(e.target.value)}
                >
                  <option disabled value="">
                    Elige un olor...
                  </option>
                  <option>Dulce</option>
                  <option>Fresco</option>
                  <option>Ácido</option>
                  <option>Sin olor</option>
                </select>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <select
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent text-on-surface-variant appearance-none cursor-pointer outline-none"
                  value={oxidizedOdor}
                  onChange={(e) => setOxidizedOdor(e.target.value)}
                >
                  <option disabled value="">
                    Elige un olor...
                  </option>
                  <option>Fuerte</option>
                  <option>A vinagre</option>
                  <option>Diferente</option>
                  <option>Desagradable</option>
                </select>
              </div>

              {/* Row: Textura */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl md:bg-transparent md:p-0">
                <span className="material-symbols-outlined text-[#334d33] md:hidden">texture</span>
                <span className="font-label-lg text-[#334d33] quicksand-text">Textura</span>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <input
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent placeholder-outline-variant outline-none"
                  placeholder="¿Cómo se siente?"
                  type="text"
                  value={freshTexture}
                  onChange={(e) => setFreshTexture(e.target.value)}
                />
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden focus-within:border-[#b0cfac] focus-within:border-2 transition-all">
                <input
                  className="w-full p-4 border-none focus:ring-0 font-body-md bg-transparent placeholder-outline-variant outline-none"
                  placeholder="¿Cómo se siente?"
                  type="text"
                  value={oxidizedTexture}
                  onChange={(e) => setOxidizedTexture(e.target.value)}
                />
              </div>

              {/* Row: Es Comestible */}
              <div className="flex items-center gap-3 p-4 bg-white rounded-xl md:bg-transparent md:p-0">
                <span className="material-symbols-outlined text-[#334d33] md:hidden">nutrition</span>
                <span className="font-label-lg text-[#334d33] quicksand-text">¿Es comestible?</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setFreshEdible(true)}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                    freshEdible === true
                      ? 'bg-[#ccebc7] border-[#334d33]'
                      : 'bg-white border-transparent hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#334d33]" style={{ fontVariationSettings: freshEdible === true ? '"FILL" 1' : undefined }}>check_circle</span>
                  <span className="font-label-sm quicksand-text">Sí</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFreshEdible(false)}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                    freshEdible === false
                      ? 'bg-[#ccebc7] border-[#334d33]'
                      : 'bg-white border-transparent hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#737970]" style={{ fontVariationSettings: freshEdible === false ? '"FILL" 1' : undefined }}>cancel</span>
                  <span className="font-label-sm quicksand-text">No</span>
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOxidizedEdible(true)}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                    oxidizedEdible === true
                      ? 'bg-[#ccebc7] border-[#334d33]'
                      : 'bg-white border-transparent hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#737970]" style={{ fontVariationSettings: oxidizedEdible === true ? '"FILL" 1' : undefined }}>check_circle</span>
                  <span className="font-label-sm quicksand-text">Sí</span>
                </button>
                <button
                  type="button"
                  onClick={() => setOxidizedEdible(false)}
                  className={`p-3 rounded-lg flex items-center justify-center gap-2 border-2 transition-all active:scale-95 ${
                    oxidizedEdible === false
                      ? 'bg-[#ccebc7] border-[#334d33]'
                      : 'bg-white border-transparent hover:border-primary'
                  }`}
                >
                  <span className="material-symbols-outlined text-[#ba1a1a]" style={{ fontVariationSettings: oxidizedEdible === false ? '"FILL" 1' : undefined }}>cancel</span>
                  <span className="font-label-sm quicksand-text">No</span>
                </button>
              </div>
            </div>
          </section>

          {/* Final Footer CTA */}
          <footer className="flex flex-col items-center justify-center py-8 gap-4">
            <p className="font-body-md text-on-surface-variant text-center max-w-md">
              Recuerda que la oxidación ocurre por el contacto con el oxígeno. ¡Tus notas ayudan a entender la química!
            </p>
            <button
              onClick={handleFinish}
              className="flex items-center gap-4 bg-[#334d33] text-white px-10 py-5 rounded-full font-headline-md text-headline-md scale-down-on-press shadow-lg hover:shadow-xl hover:bg-opacity-95 transition-all duration-300 quicksand-text"
            >
              <span>Finalizar Observación</span>
              <span className="material-symbols-outlined text-white">save</span>
            </button>
          </footer>

          {/* Navigation controls (Bottom Bar) */}
          <nav className="flex items-center justify-between py-6 border-t border-outline-variant mt-8">
            <button
              onClick={() => setScreen('welcome')}
              className="flex items-center gap-2 text-on-surface-variant font-label-lg scale-down-on-press transition-all duration-200 quicksand-text"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span>Anterior</span>
            </button>
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 bg-[#334d33] text-white px-6 py-3 rounded-full font-label-lg scale-down-on-press shadow-sm hover:shadow-md hover:bg-opacity-95 transition-all duration-200 quicksand-text"
            >
              <span>Siguiente</span>
              <span className="material-symbols-outlined text-white">arrow_forward</span>
            </button>
          </nav>
        </main>
      )}
    </div>
  );
}
