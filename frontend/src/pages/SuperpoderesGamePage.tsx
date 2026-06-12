import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/terra-ciencia.css';

/**
 * SuperpoderesGamePage — Juego de tarjetas volteables de los 4 superpoderes.
 *
 * 4 tarjetas (Broti-Crecer, Veloz-Moverse, Mamá Rana-Familia, Comi-Comer)
 * se voltean al tocarlas. Cuando las 4 están volteadas, se muestra una
 * pantalla de celebración con botón "¡Jugar otra vez!".
 *
 * Tema visual Terra Ciencia: fondo de puntos verdes, animaciones de volteo
 * 3D, paper-shadow, celebración con bounce-slow.
 */
export default function SuperpoderesGamePage() {
  const navigate = useNavigate();
  const [flippedCards, setFlippedCards] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [popCounter, setPopCounter] = useState(false);

  const totalCards = 4;

  const handleFlip = (cardId: number) => {
    if (flippedCards.has(cardId)) return;
    const next = new Set(flippedCards);
    next.add(cardId);
    setFlippedCards(next);
    setPopCounter(true);
    if (next.size === totalCards) {
      setTimeout(() => setShowCelebration(true), 1200);
    }
  };

  useEffect(() => {
    if (!popCounter) return;
    const t = setTimeout(() => setPopCounter(false), 200);
    return () => clearTimeout(t);
  }, [popCounter]);

  const handleSiguienteLeccion = () => {
    setFlippedCards(new Set());
    setShowCelebration(false);
    navigate('/semana/5');
  };

  const handleBack = () => navigate('/semana/5/superpoderes');

  return (
    <div
      className="min-h-screen flex flex-col tc-dot-pattern-bg relative overflow-x-hidden"
      style={{ color: 'var(--tc-on-surface)' }}
    >
      {/* TopAppBar */}
      <header
        className="w-full top-0 sticky z-40 flex justify-between items-center border-b-4"
        style={{
          backgroundColor: 'var(--tc-surface)',
          borderColor: 'var(--tc-outline)',
          boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
        }}
      >
        <div className="flex justify-between items-center px-[var(--tc-margin-mobile)] md:px-[var(--tc-margin-desktop)] py-[var(--tc-sm)] max-w-7xl mx-auto w-full">
          <div className="flex flex-col items-center">
            <span
              className="font-tc-headline text-2xl md:text-3xl font-bold tracking-tight tc-text-shadow-sm"
              style={{ color: 'var(--tc-primary)' }}
            >
              Exploradores de la Naturaleza
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              aria-label="Volver"
              className="w-10 h-10 rounded-full flex items-center justify-center border-2 active:scale-95 transition-transform"
              style={{
                backgroundColor: 'var(--tc-surface-container-highest)',
                borderColor: 'var(--tc-outline)',
                color: 'var(--tc-tertiary)',
              }}
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div
              className={`flex items-center rounded-full px-4 py-2 font-bold transition-transform ${
                popCounter ? 'scale-110' : 'scale-100'
              }`}
              style={{
                backgroundColor: 'var(--tc-surface-container-highest)',
                color: 'var(--tc-tertiary)',
              }}
            >
              <span
                className="material-symbols-outlined mr-2"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
              <span id="star-counter">{flippedCards.size}</span> / {totalCards}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center p-6 md:p-12 pb-32">
        {/* Decorative floating SVGs */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30" aria-hidden="true">
          <svg
            className="absolute top-10 left-10 w-24 h-24 tc-bounce-slow"
            style={{ color: 'var(--tc-primary)' }}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
            <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
          </svg>
          <svg
            className="absolute bottom-20 right-10 w-32 h-32 tc-bounce-slow"
            style={{ color: 'var(--tc-tertiary)', animationDelay: '1s' }}
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="M5 5l1.5 1.5" />
            <path d="M17.5 17.5L19 19" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="M5 19l1.5-1.5" />
            <path d="M17.5 6.5L19 5" />
          </svg>
        </div>

        <div className="z-10 max-w-5xl w-full flex flex-col items-center">
          {/* Instruction banner */}
          <div
            className="border-4 rounded-2xl p-4 md:p-6 mb-12 inline-block"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--tc-surface-bright) 90%, transparent)',
              borderColor: 'color-mix(in srgb, var(--tc-primary) 20%, transparent)',
              boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
              backdropFilter: 'blur(4px)',
            }}
          >
            <p
              className="text-center text-xl md:text-2xl mb-0 font-bold tc-text-shadow-sm"
              style={{ color: 'var(--tc-on-surface)' }}
            >
              ¡Toca cada tarjeta para descubrir los increíbles superpoderes de la naturaleza!
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 w-full">
            {/* Card 1: Broti - Crecer */}
            <div
              className={`tc-flip-card cursor-pointer group h-[400px] ${
                flippedCards.has(1) ? 'tc-flipped' : ''
              }`}
              onClick={() => handleFlip(1)}
              role="button"
              tabIndex={0}
              aria-label="Tarjeta Broti - El superpoder de crecer"
            >
              <div className="tc-flip-card-inner relative w-full h-full">
                <div
                  className="tc-flip-card-face tc-flip-card-front rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow group-hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    backgroundColor: 'var(--tc-surface-bright)',
                    borderColor: 'var(--tc-primary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-3xl font-bold mb-6 text-center"
                    style={{ color: 'var(--tc-primary)' }}
                  >
                    Broti
                  </h3>
                  <div
                    className="w-48 h-48 rounded-full overflow-hidden border-4"
                    style={{
                      borderColor: 'var(--tc-primary-container)',
                      backgroundColor: 'var(--tc-surface-container)',
                    }}
                  >
                    <img
                      alt="Broti - semilla con cara sonriente brotando"
                      className="w-full h-full object-cover"
                      src="/images/niñocrece.png"
                    />
                  </div>
                  <p
                    className="mt-6 text-xl font-semibold text-center"
                    style={{ color: 'var(--tc-on-surface)' }}
                  >
                    ¡El superpoder de CRECER!
                  </p>
                </div>
                <div
                  className="tc-flip-card-face tc-flip-card-back rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow"
                  style={{
                    backgroundColor: 'var(--tc-primary-container)',
                    borderColor: 'var(--tc-primary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-2xl font-bold mb-4 text-center"
                    style={{ color: 'var(--tc-on-primary-container)' }}
                  >
                    Como tú, las plantas crecen.
                  </h3>
                  <div
                    className="w-full flex-grow rounded-lg overflow-hidden border-2 p-2"
                    style={{
                      borderColor: 'var(--tc-primary)',
                      backgroundColor: 'var(--tc-surface-bright)',
                    }}
                  >
                    <img
                      alt="Niño probándose ropa pequeña"
                      className="w-full h-full object-contain"
                      src="/images/niñocrece.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Veloz - Moverse */}
            <div
              className={`tc-flip-card cursor-pointer group h-[400px] ${
                flippedCards.has(2) ? 'tc-flipped' : ''
              }`}
              onClick={() => handleFlip(2)}
              role="button"
              tabIndex={0}
              aria-label="Tarjeta Veloz - El superpoder de moverse"
            >
              <div className="tc-flip-card-inner relative w-full h-full">
                <div
                  className="tc-flip-card-face tc-flip-card-front rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow group-hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    backgroundColor: 'var(--tc-surface-bright)',
                    borderColor: 'var(--tc-tertiary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-3xl font-bold mb-6 text-center"
                    style={{ color: 'var(--tc-tertiary)' }}
                  >
                    Veloz
                  </h3>
                  <div
                    className="w-48 h-48 rounded-full overflow-hidden border-4"
                    style={{
                      borderColor: 'var(--tc-tertiary-container)',
                      backgroundColor: 'var(--tc-surface-container)',
                    }}
                  >
                    <img
                      alt="Veloz - guepardo corriendo feliz"
                      className="w-full h-full object-cover"
                      src="/images/Juaguar.png"
                    />
                  </div>
                  <p
                    className="mt-6 text-xl font-semibold text-center"
                    style={{ color: 'var(--tc-on-surface)' }}
                  >
                    ¡El superpoder de MOVERSE!
                  </p>
                </div>
                <div
                  className="tc-flip-card-face tc-flip-card-back rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow"
                  style={{
                    backgroundColor: 'var(--tc-tertiary-container)',
                    borderColor: 'var(--tc-tertiary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-2xl font-bold mb-4 text-center"
                    style={{ color: 'var(--tc-on-tertiary-container)' }}
                  >
                    Los seres vivos se mueven, las rocas no.
                  </h3>
                  <div
                    className="w-full flex-grow rounded-lg overflow-hidden border-2 p-2"
                    style={{
                      borderColor: 'var(--tc-tertiary)',
                      backgroundColor: 'var(--tc-surface-bright)',
                    }}
                  >
                    <img
                      alt="Veloz el guepardo corriendo feliz por la sabana"
                      className="w-full h-full object-contain"
                      src="/images/Juaguar.png"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3: Mamá Rana - Tener Familia */}
            <div
              className={`tc-flip-card cursor-pointer group h-[400px] ${
                flippedCards.has(3) ? 'tc-flipped' : ''
              }`}
              onClick={() => handleFlip(3)}
              role="button"
              tabIndex={0}
              aria-label="Tarjeta Mamá Rana - El superpoder de tener familia"
            >
              <div className="tc-flip-card-inner relative w-full h-full">
                <div
                  className="tc-flip-card-face tc-flip-card-front rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow group-hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    backgroundColor: 'var(--tc-surface-bright)',
                    borderColor: 'var(--tc-secondary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-3xl font-bold mb-6 text-center"
                    style={{ color: 'var(--tc-secondary)' }}
                  >
                    Mamá Rana
                  </h3>
                  <div
                    className="w-48 h-48 rounded-full overflow-hidden border-4"
                    style={{
                      borderColor: 'var(--tc-secondary-container)',
                      backgroundColor: 'var(--tc-surface-container)',
                    }}
                  >
                    <img
                      alt="Mamá Rana - una mamá con sus crías"
                      className="w-full h-full object-cover"
                      src="/images/momfrog.jpg"
                    />
                  </div>
                  <p
                    className="mt-6 text-xl font-semibold text-center"
                    style={{ color: 'var(--tc-on-surface)' }}
                  >
                    ¡El superpoder de TENER FAMILIA!
                  </p>
                </div>
                <div
                  className="tc-flip-card-face tc-flip-card-back rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow"
                  style={{
                    backgroundColor: 'var(--tc-secondary-container)',
                    borderColor: 'var(--tc-secondary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-2xl font-bold mb-4 text-center"
                    style={{ color: 'var(--tc-on-secondary-container)' }}
                  >
                    ¡Las ranas tienen renacuajos!
                  </h3>
                  <div
                    className="w-full flex-grow rounded-lg overflow-hidden border-2 p-2"
                    style={{
                      borderColor: 'var(--tc-secondary)',
                      backgroundColor: 'var(--tc-surface-bright)',
                    }}
                  >
                    <img
                      alt="Mamá rana con sus renacuajos"
                      className="w-full h-full object-contain"
                      src="/images/momfrog.jpg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4: Comi - Comer */}
            <div
              className={`tc-flip-card cursor-pointer group h-[400px] ${
                flippedCards.has(4) ? 'tc-flipped' : ''
              }`}
              onClick={() => handleFlip(4)}
              role="button"
              tabIndex={0}
              aria-label="Tarjeta Comi - El superpoder de comer"
            >
              <div className="tc-flip-card-inner relative w-full h-full">
                <div
                  className="tc-flip-card-face tc-flip-card-front rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow group-hover:-translate-y-1 transition-transform duration-300"
                  style={{
                    backgroundColor: 'var(--tc-surface-bright)',
                    borderColor: 'var(--tc-primary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-3xl font-bold mb-6 text-center"
                    style={{ color: 'var(--tc-primary)' }}
                  >
                    Comi
                  </h3>
                  <div
                    className="w-48 h-48 rounded-full overflow-hidden border-4"
                    style={{
                      borderColor: 'var(--tc-primary-container)',
                      backgroundColor: 'var(--tc-surface-container)',
                    }}
                  >
                    <img
                      alt="Comi - oruga feliz comiendo una hoja verde"
                      className="w-full h-full object-cover"
                      src="/images/comi"
                    />
                  </div>
                  <p
                    className="mt-6 text-xl font-semibold text-center"
                    style={{ color: 'var(--tc-on-surface)' }}
                  >
                    ¡El superpoder de COMER!
                  </p>
                </div>
                <div
                  className="tc-flip-card-face tc-flip-card-back rounded-xl border-4 p-6 flex flex-col items-center justify-center tc-paper-shadow"
                  style={{
                    backgroundColor: 'var(--tc-primary-fixed)',
                    borderColor: 'var(--tc-primary)',
                  }}
                >
                  <h3
                    className="font-tc-headline text-2xl font-bold mb-4 text-center"
                    style={{ color: 'var(--tc-on-primary-fixed)' }}
                  >
                    Sin comida, no hay energía.
                  </h3>
                  <div
                    className="w-full flex-grow rounded-lg overflow-hidden border-2 p-2"
                    style={{
                      borderColor: 'var(--tc-primary)',
                      backgroundColor: 'var(--tc-surface-bright)',
                    }}
                  >
                    <img
                      alt="Oruga comiendo vs hambrienta"
                      className="w-full h-full object-contain"
                      src="/images/comi"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Misión Cumplida Overlay */}
      <div
        className={`tc-celebration-overlay fixed inset-0 z-50 overflow-y-auto ${
          showCelebration ? 'tc-active' : ''
        }`}
        style={{ backgroundColor: 'var(--tc-background)' }}
      >
        {/* Ambient Background Blobs (Soft Jungle Feel) */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
          <div
            className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply filter blur-[100px] tc-pulse-slow"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tc-primary-container) 30%, transparent)' }}
          />
          <div
            className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply filter blur-[120px] tc-float-anim"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tc-tertiary-container) 20%, transparent)' }}
          />
          <div
            className="absolute top-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full mix-blend-multiply filter blur-[80px]"
            style={{ backgroundColor: 'color-mix(in srgb, var(--tc-secondary-container) 50%, transparent)' }}
          />
        </div>

        <main
          className="relative z-10 w-full max-w-6xl mx-auto px-4 py-12 md:py-20 flex flex-col items-center text-center min-h-screen justify-center"
        >
          {/* Badge Element */}
          <div className="relative mb-8 tc-float-anim">
            <div
              className="absolute inset-0 rounded-full blur-xl opacity-30 tc-glow"
              style={{ backgroundColor: 'var(--tc-tertiary)' }}
            />
            <div
              className="relative w-28 h-28 rounded-full flex flex-col items-center justify-center border-4"
              style={{
                backgroundImage: 'linear-gradient(to bottom right, var(--tc-tertiary-container), var(--tc-tertiary))',
                color: 'var(--tc-on-tertiary-container)',
                borderColor: 'var(--tc-surface)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
              }}
            >
              <span
                className="material-symbols-outlined text-5xl mb-1"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
            <div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 font-bold font-tc-label text-sm px-4 py-1.5 rounded-full whitespace-nowrap border"
              style={{
                backgroundColor: 'var(--tc-surface)',
                color: 'var(--tc-tertiary)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                borderColor: 'color-mix(in srgb, var(--tc-outline-variant) 30%, transparent)',
              }}
            >
              ¡Insignia Ganada!
            </div>
          </div>

          {/* Typography */}
          <h1
            className="font-tc-headline text-4xl md:text-6xl font-bold mb-4 tracking-tight"
            style={{ color: 'var(--tc-primary)' }}
          >
            ¡Misión Cumplida, Explorador!
          </h1>
          <p
            className="font-tc-body text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            Has descubierto los 4 superpoderes de los seres vivos.
          </p>

          {/* Bento Grid Recap */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full max-w-5xl mb-16">
            {/* Card 1: Crecer (Broti) */}
            <div
              className="rounded-3xl p-4 border transition-transform duration-300 hover:-translate-y-2 group"
              style={{
                backgroundColor: 'var(--tc-surface)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                borderColor: 'var(--tc-surface-container-highest)',
              }}
            >
              <div
                className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
                style={{ backgroundColor: 'var(--tc-surface-container)' }}
              >
                <img
                  alt="Personaje Broti"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKX9hIziY26X60dWmlqrNiqC1wfM7RcwKjhcNbCXq78Y14r9WKbnE0mrWhr2gdyJNchQ7NIM_jVe9oUHYX5Dgd8e07LCmCmb3SiUgX3znRWWtLnEy88g3Q17mCxDFgj0CH7l2w-W5gFWLIkNK-U_iBB3CEj5hr2dhR1A_y1jcxzLkZvgRNdVVLEJEI54IiUDAnF593P8yqJMDdOHgNPYbSxO3MNA3AilgcehU6Pe4M0f0CQeC4ttVj0rysyThw53ORKbh9IYLLZWLh"
                />
              </div>
              <h3
                className="font-tc-headline font-bold text-xl mb-1"
                style={{ color: 'var(--tc-primary)' }}
              >
                Crecer
              </h3>
              <p
                className="font-tc-body text-sm"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Con Broti
              </p>
            </div>

            {/* Card 2: Moverse (Veloz) */}
            <div
              className="rounded-3xl p-4 border transition-transform duration-300 hover:-translate-y-2 group md:mt-8"
              style={{
                backgroundColor: 'var(--tc-surface)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                borderColor: 'var(--tc-surface-container-highest)',
              }}
            >
              <div
                className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
                style={{ backgroundColor: 'var(--tc-surface-container)' }}
              >
                <img
                  alt="Personaje Veloz"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCjzHEtnZMQdJOIdl8keCaMOgHTyfV8M08ZyxuW_AR7-mDKxkKyzArF5kmQQ1uI52usoD5Svkdz6QYErAHdYWzu9VuDEK0-2Su-1OtzzQIY1PqbfUWPDjZ-4IFKQZvE6-fRghrEZLWPKP8QnhaBol9YpPZGdqHn1YBvbVFIe5qQNcrUtNg_OvLy2f9CSFdlLbhLMU2x_1fMQ45AnUzixaMlxTGuA8Wd7Tb15s6hoIvuZudueOkQWsjg_JkhpXS0_U0XKaBjYTbj1V29"
                />
              </div>
              <h3
                className="font-tc-headline font-bold text-xl mb-1"
                style={{ color: 'var(--tc-primary)' }}
              >
                Moverse
              </h3>
              <p
                className="font-tc-body text-sm"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Con Veloz
              </p>
            </div>

            {/* Card 3: Familia (Mamá Rana) */}
            <div
              className="rounded-3xl p-4 border transition-transform duration-300 hover:-translate-y-2 group"
              style={{
                backgroundColor: 'var(--tc-surface)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                borderColor: 'var(--tc-surface-container-highest)',
              }}
            >
              <div
                className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
                style={{ backgroundColor: 'var(--tc-surface-container)' }}
              >
                <img
                  alt="Personaje Mamá Rana"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAnCoxE4kvWzKZBJ7gRWb5OKIYkE4ULdjE-d9KtZT3sEtVI20G4oUQ5_WT0FEdbPxYfBI8Xlq4dImO0jrQ-UW9UAYbuRrDUJ0khTnyyXGFLApH3mJmuS-8fW27w68rbFVzTIoqUHuh23XkZi-gRNjWDbsQXA1n8zY5E3Th8-DA82zj7oRDT8U5hPqWpqn5_1AqlBRH0kc3LK-8OViGUY9XHsm9mOgCFFzC_vUWqAPkQUa_TEI2vJ_brAaJy4aTgl_vbbs50zvGeYHpp"
                />
              </div>
              <h3
                className="font-tc-headline font-bold text-xl mb-1"
                style={{ color: 'var(--tc-primary)' }}
              >
                Familia
              </h3>
              <p
                className="font-tc-body text-sm"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Con Mamá Rana
              </p>
            </div>

            {/* Card 4: Comer (Comi) */}
            <div
              className="rounded-3xl p-4 border transition-transform duration-300 hover:-translate-y-2 group md:mt-8"
              style={{
                backgroundColor: 'var(--tc-surface)',
                boxShadow: '0 4px 20px rgba(46, 50, 48, 0.06)',
                borderColor: 'var(--tc-surface-container-highest)',
              }}
            >
              <div
                className="aspect-square rounded-2xl overflow-hidden mb-4 relative"
                style={{ backgroundColor: 'var(--tc-surface-container)' }}
              >
                <img
                  alt="Personaje Comi"
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  src="/images/comi"
                />
              </div>
              <h3
                className="font-tc-headline font-bold text-xl mb-1"
                style={{ color: 'var(--tc-primary)' }}
              >
                Comer
              </h3>
              <p
                className="font-tc-body text-sm"
                style={{ color: 'var(--tc-on-surface-variant)' }}
              >
                Con Comi
              </p>
            </div>
          </div>

          {/* Main Action Button */}
          <button
            onClick={handleSiguienteLeccion}
            className="group relative inline-flex items-center justify-center gap-3 font-bold font-tc-label text-xl md:text-2xl py-5 px-12 rounded-full hover:-translate-y-1 active:translate-y-0 transition-all duration-300 tc-bounce-subtle overflow-hidden"
            style={{
              backgroundColor: 'var(--tc-primary)',
              color: 'var(--tc-on-primary)',
              boxShadow: '0 8px 24px rgba(74, 124, 89, 0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 12px 32px rgba(74, 124, 89, 0.5)';
              e.currentTarget.style.backgroundColor = 'var(--tc-surface-tint)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(74, 124, 89, 0.4)';
              e.currentTarget.style.backgroundColor = 'var(--tc-primary)';
            }}
          >
            <div
              className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full opacity-0 group-hover:opacity-100 tc-shimmer-anim skew-x-12 pointer-events-none"
            />
            <span>¡SIGUIENTE LECCIÓN!</span>
            <span
              className="material-symbols-outlined text-3xl group-hover:translate-x-1 transition-transform"
              style={{ fontVariationSettings: "'wght' 600" }}
            >
              arrow_forward
            </span>
          </button>
        </main>
      </div>

      {/* BottomNavBar (Mobile Only) */}
      <nav
        className="fixed bottom-0 w-full z-40 rounded-t-lg border-t-4 md:hidden"
        style={{
          backgroundColor: 'var(--tc-surface-container-highest)',
          borderColor: 'var(--tc-outline)',
          boxShadow: '0px -4px 0px 0px rgba(0,0,0,1)',
        }}
      >
        <div className="flex justify-around items-center h-20 px-2" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
          <Link
            to="/home"
            className="flex flex-col items-center justify-center rounded-lg p-2 border-2 active:scale-95 transition-all duration-150 w-20"
            style={{
              backgroundColor: 'var(--tc-primary-container)',
              color: 'var(--tc-on-primary-container)',
              borderColor: 'var(--tc-outline)',
            }}
          >
            <span
              className="material-symbols-outlined mb-1"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              rocket_launch
            </span>
            <span className="font-tc-label text-sm font-bold">Misión</span>
          </Link>
          <Link
            to="/home"
            className="flex flex-col items-center justify-center p-2 active:scale-95 transition-all duration-150 w-20 rounded-lg"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            <span className="material-symbols-outlined mb-1">map</span>
            <span className="font-tc-label text-sm">Mapa</span>
          </Link>
          <Link
            to="/perfil"
            className="flex flex-col items-center justify-center p-2 active:scale-95 transition-all duration-150 w-20 rounded-lg"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            <span className="material-symbols-outlined mb-1">workspace_premium</span>
            <span className="font-tc-label text-sm">Logros</span>
          </Link>
          <Link
            to="/semana/5/superpoderes"
            className="flex flex-col items-center justify-center p-2 active:scale-95 transition-all duration-150 w-20 rounded-lg"
            style={{ color: 'var(--tc-on-surface-variant)' }}
          >
            <span className="material-symbols-outlined mb-1">help</span>
            <span className="font-tc-label text-sm">Ayuda</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
