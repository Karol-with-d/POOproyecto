import { useNavigate } from 'react-router-dom';
import { playClick } from '../services/sounds';

/**
 * HechoDeStartPage — Pantalla de inicio de "¿De qué están hechos?".
 *
 * Misma estética UNIVO que el resto de start pages: TopAppBar, tarjeta
 * central con ilustración, instrucción y botón "¡Jugar!".
 */
export default function HechoDeStartPage() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/semana/3');
  const handlePlay = () => navigate('/semana/3/hecho-de/play');

  return (
    <div
      className="text-[#1b1b1e] font-body-lg flex flex-col items-center justify-center min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #fbf8fc 0%, #e8f5e9 100%)' }}
    >
      {/* Top App Bar */}
      <header className="relative w-full grid grid-cols-[2.75rem_1fr_2.75rem] items-center px-4 py-3 md:px-8 z-20 shrink-0">
        <button
          onClick={handleBack}
          className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-lg-mobile md:font-headline-lg text-[#4a6549] text-center leading-tight">
          ¿De qué están hechos?
        </h1>
      </header>

      {/* Main Content Canvas */}
      <main className="w-full max-w-3xl flex-1 min-h-0 flex flex-col items-center justify-center relative z-20 px-5 pb-4">
        <div
          className="bg-[#e7f6e4] rounded-3xl p-8 md:p-10 flex flex-col items-center gap-6 w-full max-w-md border-4 border-[#8ba888] relative overflow-hidden"
          style={{ boxShadow: '0 0 80px 20px rgba(139, 168, 136, 0.2), 0 10px 40px -10px rgba(74, 101, 73, 0.15)' }}
        >
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#ccebc7] opacity-50 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#bfe5fe] opacity-40 rounded-full blur-3xl pointer-events-none"></div>

          {/* Illustration Container */}
          <div className="w-full aspect-square max-w-[280px] bg-white rounded-2xl overflow-hidden border-4 border-white relative z-10 shadow-md">
            <img
              alt="Regadera, calabazas y botella en el huerto"
              className="w-full h-full object-cover"
              src="/images/semana3/card-hechos.png"
            />
          </div>

          {/* Instruction Text */}
          <div className="text-center z-10">
            <p className="font-body-lg text-[#434841] max-w-sm mx-auto">
              Explora la escena y descubre de qué está hecho cada objeto.
            </p>
          </div>

          {/* Play Button */}
          <button
            onClick={handlePlay}
            className="bg-[#4a6549] text-white font-headline-md rounded-2xl py-6 px-12 flex items-center gap-3 mt-2 w-full md:w-auto justify-center z-10 hover:bg-opacity-90 transition-all border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2"
          >
            <span>¡Jugar!</span>
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: '32px' }}
            >
              arrow_forward
            </span>
          </button>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#b0cfad]/30 to-transparent pointer-events-none z-0"></div>
    </div>
  );
}
