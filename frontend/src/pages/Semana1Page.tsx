import { useNavigate, Link } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';

function ActivityArt({ id }: { id: string }) {
  if (id === 'description-match') {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full" aria-hidden="true">
        <rect width="200" height="120" fill="#fff6df" />
        <circle cx="58" cy="60" r="28" fill="#ff8a65" />
        <rect x="112" y="32" width="58" height="56" rx="12" fill="#64b5f6" />
      </svg>
    );
  }
  if (id === 'rescata-pulgarcito') {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full" aria-hidden="true">
        <rect width="200" height="120" fill="#e3f4ff" />
        <rect x="20" y="78" width="50" height="16" rx="4" fill="#8d6e63" />
        <rect x="78" y="70" width="50" height="16" rx="4" fill="#a1887f" transform="rotate(-8 103 78)" />
        <rect x="130" y="78" width="50" height="16" rx="4" fill="#8d6e63" />
        <circle cx="100" cy="42" r="16" fill="#ffd54f" />
      </svg>
    );
  }
  if (id === 'sort-by-size') {
    return (
      <svg viewBox="0 0 200 120" className="w-full h-full" aria-hidden="true">
        <rect width="200" height="120" fill="#fff6df" />
        <circle cx="40" cy="78" r="14" fill="#ef5350" />
        <circle cx="90" cy="70" r="22" fill="#ff7043" />
        <circle cx="150" cy="60" r="30" fill="#e53935" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 200 120" className="w-full h-full" aria-hidden="true">
      <rect width="200" height="120" fill="#fff6df" />
      <polygon points="100,22 112,52 146,52 118,70 128,102 100,82 72,102 82,70 54,52 88,52" fill="#ffd54f" />
    </svg>
  );
}

/**
 * Semana1Page — Hub de actividades de la Semana 1: Medidas.
 *
 * Diseño exacto según mockup UNIVO: 4 actividades en grid 2x2.
 */
export default function Semana1Page() {
  const navigate = useNavigate();

  const handleBack = () => navigate('/home');
  const handleHome = () => navigate('/home');

  const activities = [
    {
      id: 'description-match',
      title: 'Empareja palabras',
      desc: 'Empareja las palabras.',
      color: 'bg-[#c4b5a0]',
      borderColor: 'border-[#a89880]',
      textColor: 'text-[#3a3228]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUh9ZUpEiJCxXjDW0BptNAMSojyZgEl5cxqnTBCws5JCbAH9B1RI6-BwjiRs9YHD4LwwwMrvPyzxNqu2x7Ai5WDiwP7vBhxNmyXtMe9pgrERiQLrnSYPdPalV8OoIuuyqs9cfi3AYmFwNqTh7lnv7dmPsRJeWHAXE8u0HQNRLDPULid0CNeB8h_k5Ld4J3U1wVHuGN3FXDacHnDa0URjEjiBdxtXM8eP8SWTcnaJVgAgjik2xFI9WvhhXTEAqz_V5tPAlEWSmjnmkg',
      link: '/semana/1/description-match',
    },
    {
      id: 'rescata-pulgarcito',
      title: 'Rescata a Pulgarcito',
      desc: 'Construye el puente.',
      color: 'bg-[#b8d4f0]',
      borderColor: 'border-[#9ab8d8]',
      textColor: 'text-[#2a3a4a]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbRWh9PWGY4o2FaTuAcATF6q7Hyiic8udl8WNMrZ1s87iZKZAgcDOVVxRyqDyMcbQMZdWm-EoAe4cKnD9TgbKj-0qo0smwnzD7BlLVkzGdyzfKgR4rbYKsrZTjS2KJgbUGw-UmQD0yWyD_0sqniJ7-4NsQrIWliY72bUXroQ9ixfHlLLggQ0Hron9mqTBMJW-rqgZwc1n531-dFs3WqWHXeeLO8pJtcL9yWJufbsYWTMfQnKSeS9DkM5HlaF3cFHZbT9BdxZA_9uJP',
      link: '/semana/1/rescata-pulgarcito',
    },
    {
      id: 'sort-by-size',
      title: 'Ordena por tamaño',
      desc: 'Ordena de menor a mayor.',
      color: 'bg-[#c4b5a0]',
      borderColor: 'border-[#a89880]',
      textColor: 'text-[#3a3228]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCa6VnhV7WOI8gDWhwuCXcMFAmtTv5Dxgm-5hWpXe6SkyP2x0gVAlY9h4TfEUiE94LfzZBOkDqxIG3m0v-9Rr9RlhSBBmuEYbxqKdkUzWqDExWS7k97tP3IWcOMQO2GQD0ee6I5DV2VH6Xzy7fWB3ag8VgnCw0l6fFxXcQx8RNkEVQZdCuRz81CkhrfvuNikB_FRFyoorGfpiRi7oxvu9RGGxhOjc35OYkokZG8p9YOb_BJ99LMCFoeodLVmGoezhWDXIBegdXnDlkt',
      link: '/semana/1/sort-by-size',
    },
    {
      id: 'quiz',
      title: 'Quiz',
      desc: '¡Pon a prueba lo que has aprendido!',
      color: 'bg-[#c4b5a0]',
      borderColor: 'border-[#a89880]',
      textColor: 'text-[#3a3228]',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB5iLzQhBmpvdhN880h1nFnbhV7A07HKfSX7Z2KM-8FAGfko7Imk5NV8Ie0MVSMpj-jNS8OLfyGjmLBXiwTbStvWkjsb4yB1xJHDqYkVOJ1VDZk4cZehc6N_Dy6i9KcP5z2Le9rlNNXYJYs3IVWuH4v6VMA85VfrunOrrt84KOaXE2o2DhAbCruSzZgvCeOQoYFIpQl2JZ_E5dTu79e1NU1SHYNpZhBIIkk3PToJpOKnrMxQWmpvUC2dIa4fRCDQN9kLJx_N3X31IZX',
      link: '/semana/1/quiz',
    },
  ];

  return (
    <div className="bg-transparent text-[#1b1b1e] antialiased min-h-screen flex flex-col font-body-md">
      {/* ===== TopAppBar ===== */}
      <header className="bg-[#fbf8fc] text-[#4a6549] top-0 sticky z-50 flex justify-between items-center w-full px-5 md:px-[120px] py-2 shadow-sm">
        <button
          onClick={handleBack}
          className="text-[#4a6549] hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-[#e3e2e6]"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-[#4a6549] text-center flex-1 mx-4 truncate">
          Semana 1: Medidas
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

      {/* ===== Main Content ===== */}
      <main className="flex-1 w-full max-w-[800px] mx-auto px-5 md:px-[120px] py-8 pb-[120px] md:pb-8 flex flex-col gap-8">
        {/* Hero Section */}
        <section className="text-center">
          <p className="font-body-lg text-body-lg text-[#434841]">
            Explora el mundo a tu alrededor con estas divertidas actividades de medición.
          </p>
          <p className="font-body-lg text-body-lg text-[#434841]">
            ¡Toca una tarjeta para empezar tu aventura!
          </p>
        </section>

        {/* Activities Grid — 2 columns */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {activities.map((activity) => (
            <article
              key={activity.id}
              className={`${activity.color} border-2 ${activity.borderColor} rounded-xl p-4 flex flex-col gap-4 shadow-[0_8px_32px_rgba(74,101,73,0.08)] hover:-translate-y-1 transition-transform duration-300`}
            >
              {/* Image */}
              <div className="w-full h-40 rounded-lg overflow-hidden border-2 border-white bg-[#fbf8fc] relative">
                <ActivityArt id={activity.id} />
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className={`font-label-lg text-label-lg ${activity.textColor} mb-1`}>
                    {activity.title}
                  </h3>
                  <p className="font-body-md text-body-md text-[#434841] text-sm">
                    {activity.desc}
                  </p>
                </div>
                <button
                  onClick={() => activity.link ? navigate(activity.link) : showKidMessage('Muy pronto podrás jugar esta actividad.', 'soon')}
                  className="mt-3 w-full bg-[#4a6549] text-white font-label-md text-label-md py-2 px-6 rounded-full transition-all border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                    play_arrow
                  </span>
                  Jugar
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      {/* ===== BottomNavBar (Mobile Only) ===== */}
      <nav className="bg-[#fbf8fc] shadow-[0_-4px_20px_rgba(74,101,73,0.1)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 md:hidden rounded-t-xl">
        <Link
          to="/home"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="font-label-md text-label-md text-xs">Mapa</span>
        </Link>

        <div className="flex flex-col items-center justify-center bg-[#8ba888] text-[#243d24] rounded-full px-6 py-2 scale-90 transition-all duration-200 ease-out">
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: '"FILL" 1' }}>
            experiment
          </span>
          <span className="font-label-md text-label-md text-xs">Laboratorio</span>
        </div>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">groups</span>
          <span className="font-label-md text-label-md text-xs text-center leading-tight">
            Amigos
          </span>
        </Link>

        <Link
          to="/perfil"
          className="flex flex-col items-center justify-center text-[#434841] px-4 py-2 hover:bg-[#8ba888]/50 hover:scale-105 transition-transform duration-200"
        >
          <span className="material-symbols-outlined mb-1">stars</span>
          <span className="font-label-md text-label-md text-xs">Progreso</span>
        </Link>
      </nav>
    </div>
  );
}
