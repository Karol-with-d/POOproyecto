import { useNavigate, Link } from 'react-router-dom';

/**
 * Semana4Page — Stub de la Semana 4: Química.
 *
 * Página placeholder que mantiene consistencia con los demás hubs de semana
 * (TopAppBar, hero, mensaje "Próximamente" y bottom nav móvil). El contenido
 * real se implementará en una iteración futura.
 */
export default function Semana4Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');
  const handleHome = () => navigate('/home');

  return (
    <div className="bg-[#f8f5f0] text-[#1b1b1e] antialiased min-h-screen flex flex-col font-body-md">
      {/* TopAppBar */}
      <header className="bg-[#fbf8fc] text-[#4a6549] top-0 sticky z-50 flex justify-between items-center w-full px-5 md:px-[120px] py-2 shadow-sm">
        <button
          onClick={handleBack}
          className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-[#4a6549] text-center flex-1 mx-4 truncate">
          Semana 4
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleHome}
            className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
          >
            <span className="material-symbols-outlined">home</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-[1024px] mx-auto px-5 md:px-[120px] py-12 pb-[120px] md:pb-12 flex flex-col items-center justify-center text-center gap-6">
        <span
          className="material-symbols-outlined text-7xl"
          style={{ color: '#4a6549', fontVariationSettings: "'FILL' 1" }}
        >
          science
        </span>
        <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-[#1b1b1e]">
          Semana 4: Química
        </h2>
        <p className="font-body-lg text-body-lg text-[#434841] max-w-md">
          Las actividades de esta semana están en construcción. ¡Vuelve pronto para descubrirlas!
        </p>
        <button
          onClick={handleHome}
          className="mt-4 px-8 py-4 bg-[#4a6549] text-white font-label-lg text-label-lg rounded-xl flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            home
          </span>
          Volver al inicio
        </button>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="bg-[#fbf8fc] shadow-[0_-4px_20px_rgba(74,101,73,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-xl">
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
            style={{ fontVariationSettings: "'FILL' 1" }}
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
