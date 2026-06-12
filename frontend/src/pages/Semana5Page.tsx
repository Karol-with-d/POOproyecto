import { useNavigate, Link } from 'react-router-dom';
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
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKdrIOObHhfbzuMWSlrQq61i-kkuXH8k5YlBEBpcAnqxIwy-8SoTAHrmrn8WikKD9EgMTG8LSJai7_HpPJCjOPeDfCt7tmRUKb8B3ZPtYtzuQAmYA9SeLMIgApmbq8pExD-lnxh16vgFMSx5sb8P3kFIowd9PnArrNNiUHhnr_BrqpCXLQSadzHPqnnw_Q87a3WB4KIM1NxCUuGuU-jCek5ffvaHJI37x9eR-Q5EAzS_H6SrAUyIcMRQGrpvJSMPk3Xpt9CbB137mS',
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
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCpMWrYt7yvsvLu9v0w2mnKbjbMuWfyebb1wZG67BL4Q8pCDNVN98Wvc9tmTfRoz12z9iFRkK5A52iCIhUaudiD4r9E00dHWMVXkw_KmtnRUQvngWEKNJ8R5smkmi1BaxMROODxikWSquoTEThU569nM0RGmPskYfa4NYRci8kjBb3gkD34ega8R-jUgpt0aF_w6JfhKFeh9idXfdCyNCTFEB-2q5B0l5VFxQe29MPOS19LVuTOmalxx0RuLAjcQhePdqfjLis67OYW',
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
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBUHHY8BsXqp5wmFHNEX1bBr0wx2cl2tc3bXbsQTlJsXcIvGof0cwDjltEoLY63UChvQJ0vvBGjEdSn8OdMwC8oB12sB8XV1fksCYgbiOCMkIfGgyY0xG3MdHFVbObGAjIiSEpgNNEMDPblj-Jedj09S4CZ7ZjKav4v4lULy8pFxodu2RaMSmzq7vjxBG0p0QDwVEBhOCwC-kBhj8HHIquU1eNGHhVJR3bmLlPcejuhTm6UJa2a2I9E-VUz2XMrEa-BbnFQK4i8F440',
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
    alert('Próximamente');
  };

  const handleQuizClick = () => {
    navigate('/semana/5/quiz');
  };

  return (
    <div
      className="tc-cursor-magnifier tc-fredoka h-screen flex flex-col overflow-hidden tc-paper-grid"
      style={{ backgroundColor: 'var(--tc-background)', color: 'var(--tc-on-surface)' }}
    >
      {/* Top Navigation Shell */}
      <header
        className="flex justify-between items-center w-full px-6 py-4 shadow-sm z-30"
        style={{ backgroundColor: 'var(--tc-surface-container-low)' }}
      >
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-3xl" style={{ color: 'var(--tc-primary)' }}>
            park
          </span>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--tc-primary)' }}>
            Terra Ciencia
          </h1>
        </div>
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={handleHome}
            className="font-bold transition-transform active:scale-95 flex items-center gap-1"
            style={{ color: 'var(--tc-primary)' }}
          >
            <span className="material-symbols-outlined">home</span>
            Inicio
          </button>
        </nav>
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-[var(--tc-primary-container)]/20 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined" style={{ color: 'var(--tc-secondary)' }}>
              account_circle
            </span>
          </button>
          <button className="p-2 hover:bg-[var(--tc-primary-container)]/20 rounded-full transition-colors active:scale-95">
            <span className="material-symbols-outlined" style={{ color: 'var(--tc-secondary)' }}>
              settings
            </span>
          </button>
        </div>
      </header>

      <main className="flex-1 relative flex flex-col items-center justify-start p-6 space-y-6 overflow-y-auto">
        {/* Field Notebook Header */}
        <div className="relative w-full max-w-4xl text-center">
          <div
            className="absolute -top-12 -left-8 pointer-events-none opacity-40 hidden md:block"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-8xl" style={{ color: 'var(--tc-primary)' }}>
              search
            </span>
          </div>
          <div
            className="absolute -top-4 -right-12 pointer-events-none rotate-12 opacity-30 hidden md:block"
            aria-hidden="true"
          >
            <span className="material-symbols-outlined text-7xl" style={{ color: 'var(--tc-tertiary)' }}>
              potted_plant
            </span>
          </div>
          <div
            className="rounded-xl p-4 inline-block mb-4 shadow-sm border-2 rotate-1"
            style={{
              backgroundColor: 'var(--tc-surface-container)',
              borderColor: 'color-mix(in srgb, var(--tc-primary) 20%, transparent)',
            }}
          >
            <img
              alt="Escritorio de Explorador"
              className="h-32 md:h-44 w-auto rounded-lg"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUnQOF91l6z8uf0-uAa_zSox4zBLQeHMMYuD4JKsfIOSbpKh9-bkxkprysRAPfJdZg7JuYU8wjWabge92dIn0iDi1i58_Ygw2T9lXm3dau52edvh0rchpu3dSp-hQ6LRqtt1CGFK1Q7na3V-jp70tahVdiKzjHd3bgE3c2zQizg4oB2gEXyLB4sV1jt0L6eTYrx38utXA5DIZbv7gp0-VWoaomXKwk81zGQfV9m7a8NYgWm8atF9VxMfqYcmW1UuLet4QPz_BZBAIG"
            />
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold tracking-tight"
            style={{ color: 'var(--tc-primary)' }}
          >
            Semana 5
          </h2>
          <p
            className="tc-literata text-xl mt-2 italic"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            ¿Qué descubriremos hoy, joven explorador?
          </p>
        </div>

        {/* Stamps/Badges Activities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={`group relative flex flex-col items-center p-6 rounded-xl border-4 border-dashed transition-colors tc-clay-button ${activity.hoverBorderClass}`}
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
        <div className="w-full max-w-4xl pt-4 pb-24 md:pb-4">
          <div
            className="relative rounded-xl p-6 border-2 flex flex-col md:flex-row items-center gap-6 overflow-hidden"
            style={{
              backgroundColor: 'var(--tc-surface-container-low)',
              borderColor: 'color-mix(in srgb, var(--tc-tertiary) 20%, transparent)',
            }}
          >
            <div className="absolute inset-x-0 bottom-0 h-2 tc-dot-border opacity-20" aria-hidden="true" />
            <div
              className="flex-shrink-0 bg-white rounded-lg p-3 shadow-md -rotate-2"
              style={{ backgroundColor: 'var(--tc-surface-container-lowest)' }}
            >
              <img
                alt="Cerebro con corona y preguntas"
                className="w-24 h-24 object-contain"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvzDP2g0VXAH2FdmxUq65debKsgcnBtuXxTkohcjuRp25pGWmlTBylK3pgq1lpziKrBzu94vzfuNTLImF92vWzptYsL91tbfeIcJLSbTIfv3R0GFT0UOEqZA4J4QR0ozLqojKnNerFKoHnfqEhWKGfCtqrOWSv0MsC_KgCFZM90y8ebg1gX3gC7Ztx1xMqIoAwxozSe-ylwNDGVQMeSyLtcGG-m5cjw6tJi3ekTulZtg5x8wWN0_va4dPdS-8OjmS4fuZ18r0F8CzX"
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
              className="whitespace-nowrap px-8 py-4 rounded-xl font-bold tc-clay-button text-lg flex items-center gap-2"
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

      {/* Bottom Nav (Mobile) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-4 pt-2 rounded-t-xl"
        style={{
          backgroundColor: 'var(--tc-surface)',
          boxShadow: '0 -4px 20px rgba(46, 50, 48, 0.06)',
        }}
      >
        <Link
          to="/home"
          className="flex flex-col items-center justify-center rounded-full px-5 py-1 scale-90 duration-200"
          style={{
            backgroundColor: 'var(--tc-primary-container)',
            color: 'var(--tc-on-primary-container)',
          }}
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-xs font-semibold tc-nunito">Inicio</span>
        </Link>
        <Link
          to="/home"
          className="flex flex-col items-center justify-center opacity-80 hover:text-[var(--tc-primary)] transition-all"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined">menu_book</span>
          <span className="text-xs font-semibold tc-nunito">Lecciones</span>
        </Link>
        <Link
          to="/home"
          className="flex flex-col items-center justify-center opacity-80 hover:text-[var(--tc-primary)] transition-all"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined">local_florist</span>
          <span className="text-xs font-semibold tc-nunito">Semillas</span>
        </Link>
        <Link
          to="/home"
          className="flex flex-col items-center justify-center opacity-80 hover:text-[var(--tc-primary)] transition-all"
          style={{ color: 'var(--tc-on-surface-variant)' }}
        >
          <span className="material-symbols-outlined">emoji_events</span>
          <span className="text-xs font-semibold tc-nunito">Premios</span>
        </Link>
      </nav>

      {/* Floating Decor */}
      <div
        className="fixed bottom-12 right-8 pointer-events-none opacity-20 hidden md:block"
        aria-hidden="true"
      >
        <span
          className="material-symbols-outlined text-9xl transform -rotate-12"
          style={{ color: 'var(--tc-primary)' }}
        >
          bug_report
        </span>
      </div>
      <div
        className="fixed top-32 left-10 pointer-events-none opacity-10 hidden md:block"
        aria-hidden="true"
      >
        <span
          className="material-symbols-outlined text-[10rem]"
          style={{ color: 'var(--tc-tertiary)' }}
        >
          grass
        </span>
      </div>
    </div>
  );
}
