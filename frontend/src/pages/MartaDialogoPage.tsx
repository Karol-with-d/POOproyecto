import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';


const SENSOR_IMAGES = {
  eye: '/images/semana2/ojos.png',
  nose: '/images/semana2/nariz.png',
  hand: '/images/semana2/mano.png',
  mouth: '/images/semana2/boca.png',
  ear: '/images/semana2/oreja.png',
} as const;


//── Componente de Marta
// ─────────────────────────────────────────────────────────────────────────────

function MartaCharacter({ talking }: { talking: boolean }) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-2xl"
    >
      <g>
        {/* Borde exterior para que Marta destaque del fondo */}
        <g
          fill="none"
          stroke="#ffffff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="16"
        >
          <path d="M 90 250 C 70 190, 90 110, 150 90 C 180 70, 220 70, 250 90 C 310 110, 330 190, 310 250 C 330 290, 300 330, 250 320 C 250 320, 150 320, 150 320 C 100 330, 70 290, 90 250 Z" />
          <path d="M 140 320 L 120 380 L 280 380 L 260 320 Z" />
        </g>

        {/* Cabello / cuerpo */}
        <path
          d="M 90 250 C 70 190, 90 110, 150 90 C 180 70, 220 70, 250 90 C 310 110, 330 190, 310 250 C 330 290, 300 330, 250 320 C 250 320, 150 320, 150 320 C 100 330, 70 290, 90 250 Z"
          fill="#754C3A"
          stroke="#4A3025"
          strokeWidth="4"
        />

        {/* Cara */}
        <ellipse
          cx="200"
          cy="200"
          rx="75"
          ry="65"
          fill="#F5D3BB"
          stroke="#4A3025"
          strokeWidth="4"
        />

        {/* Orejas */}
        <ellipse cx="125" cy="200" rx="15" ry="20" fill="#F5D3BB" stroke="#4A3025" strokeWidth="4" />
        <ellipse cx="275" cy="200" rx="15" ry="20" fill="#F5D3BB" stroke="#4A3025" strokeWidth="4" />

        {/* Cabello */}
        <path
          d="M 115 170 C 120 130, 160 110, 200 120 C 240 110, 280 130, 285 170 C 260 140, 200 150, 200 150 C 200 150, 140 140, 115 170 Z"
          fill="#754C3A"
          stroke="#4A3025"
          strokeWidth="4"
        />

        {/* Detalles de orejas */}
        <path d="M 130 190 Q 140 230 135 250" fill="none" stroke="#4A3025" strokeLinecap="round" strokeWidth="4" />
        <path d="M 270 190 Q 260 230 265 250" fill="none" stroke="#4A3025" strokeLinecap="round" strokeWidth="4" />

        {/* Mejillas */}
        <ellipse cx="155" cy="215" rx="12" ry="8" fill="#F0A39D" opacity="0.8" />
        <ellipse cx="245" cy="215" rx="12" ry="8" fill="#F0A39D" opacity="0.8" />

        {/* Gafas */}
        <circle cx="165" cy="190" r="28" fill="none" stroke="#2D2D2D" strokeWidth="6" />
        <circle cx="235" cy="190" r="28" fill="none" stroke="#2D2D2D" strokeWidth="6" />
        <path d="M 193 190 L 207 190" stroke="#2D2D2D" strokeLinecap="round" strokeWidth="6" />

        {/* Ojos */}
        <ellipse cx="165" cy="190" rx="7" ry="10" fill="#2D2D2D" />
        <ellipse cx="235" cy="190" rx="7" ry="10" fill="#2D2D2D" />

        {/* Ropa */}
        <path
          d="M 145 260 C 165 285, 235 285, 255 260 L 265 290 C 235 315, 165 315, 135 290 Z"
          fill="#856046"
          stroke="#4A3025"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        <path
          d="M 215 280 L 215 330 L 245 330 L 245 275 Z"
          fill="#856046"
          stroke="#4A3025"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        <line x1="220" y1="330" x2="220" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />
        <line x1="230" y1="330" x2="230" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />
        <line x1="240" y1="330" x2="240" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />

        <path
          d="M 140 290 L 120 380 L 280 380 L 260 290 Z"
          fill="#EBE1D5"
          stroke="#4A3025"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        <path
          d="M 140 290 L 110 330 L 120 380 Z"
          fill="#D5CBBF"
          stroke="#4A3025"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        <path
          d="M 260 290 L 290 330 L 280 380 Z"
          fill="#D5CBBF"
          stroke="#4A3025"
          strokeLinejoin="round"
          strokeWidth="4"
        />

        {/* Boca animada */}
        {talking ? (
          <g>
            <path
              d="M 178 225 C 178 225, 200 255, 222 225 Z"
              fill="#4A2511"
              stroke="#4A3025"
              strokeLinejoin="round"
              strokeWidth="4"
            />
            <path
              d="M 186 238 C 195 230, 205 230, 214 238 C 210 248, 190 248, 186 238 Z"
              fill="#E86A6A"
            />
            <path d="M 183 227 C 190 232, 210 232, 217 227 Z" fill="#ffffff" />
          </g>
        ) : (
          <path
            d="M 182 228 C 190 236, 210 236, 218 228"
            fill="none"
            stroke="#4A3025"
            strokeLinecap="round"
            strokeWidth="4"
          />
        )}
      </g>
    </svg>
  );
}


// ── Tarjeta reutilizable para los sentidos
// ─────────────────────────────────────────────────────────────────────────────


function SenseIcon({
  image,
  alt,
  label,
  colorClass = 'bg-[#f5d0c5] border-outline-variant/40',
}: {
  image: string;
  alt: string;
  label: string;
  colorClass?: string;
}) {
  return (
    <div className={`${colorClass} p-2 rounded-xl border flex flex-col items-center justify-center`}>
      <div className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-white p-0.5 border border-outline-variant/50 flex items-center justify-center shadow-sm">
        <img src={image} alt={alt} className="w-full h-full object-contain" />
      </div>
      <span className="text-xs md:text-sm font-bold block mt-1">{label}</span>
    </div>
  );
}


//── Contenido de cada paso
// ─────────────────────────────────────────────────────────────────────────────

function DialogueContent({ index }: { index: number }) {

  switch (index) {
    case 0:
      return (
        <>
          <p className="mb-2">
            ¡Hola, amiguito! Soy <strong>Marta</strong>, tu compañera de aventuras.
          </p>
          <p>
            Hoy te enseñaré el significado de una palabra que suena un poco extraña pero que es súper interesante:{' '}
            <span className="highlight-word"><strong>Organoléptico</strong></span>.
          </p>
        </>
      );

    case 1:
      return (
        <>
          <p className="mb-3">
             ¡Imagina que tu cuerpo viene equipado con un equipo de{' '}
            <strong>5 superpoderes</strong> para explorar todo lo que te rodea!
            Vamos a descubrir cómo funcionan usando una deliciosa manzana como ejemplo. 🍎
          </p>

          <div className="grid grid-cols-5 gap-2 md:gap-3 text-center pt-1">
            <SenseIcon image={SENSOR_IMAGES.eye} alt="Ojos" label="Ojos" />
            <SenseIcon image={SENSOR_IMAGES.nose} alt="Nariz" label="Nariz" />
            <SenseIcon image={SENSOR_IMAGES.hand} alt="Manos" label="Manos" />
            <SenseIcon image={SENSOR_IMAGES.mouth} alt="Boca" label="Boca" />
            <SenseIcon image={SENSOR_IMAGES.ear} alt="Oídos" label="Oídos" />
          </div>

          <p className="text-sm md:text-base text-[#00000] mt-3">
             ¡Exacto! Son tus <strong>cinco sentidos</strong>. ¡Vamos a descubrir qué podemos percibir con cada uno! 🍎
          </p>
        </>
      );

    case 2:
      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-amber-100 flex items-center justify-center shrink-0 shadow-sm border border-amber-300 p-2 overflow-hidden">
            <img src={SENSOR_IMAGES.eye} alt="Sentido de la vista" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl md:text-2xl text-[#e5c982] mb-1 flex items-center gap-2">
              ¡Activamos nuestros Ojos!
            </h4>
            <p>
              Miramos la manzana con mucha atención: descubrimos su{' '}
              <strong>color rojo brillante</strong>, su <strong>forma redonda</strong> y su aspecto jugoso.
            </p>
          </div>
        </div>
      );

    case 3:
      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-rose-100 flex items-center justify-center shrink-0 shadow-sm border border-rose-300 p-2 overflow-hidden">
            <img src={SENSOR_IMAGES.nose} alt="Nariz - Olfato" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl md:text-2xl text-[#f7c8db] mb-1 flex items-center gap-2">
              ¡Activamos nuestra Nariz!
            </h4>
            <p>
              Acercamos la fruta para respirar su <strong>aroma dulce y fresco</strong>.
              Las frutas desprenden olores naturales que nos ayudan a reconocerlas.
            </p>
          </div>
        </div>
      );

    case 4:
      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0 shadow-sm border border-emerald-300 p-2 overflow-hidden">
            <img src={SENSOR_IMAGES.hand} alt="Mano - El Tacto" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl md:text-2xl text-[#b8c99a] mb-1 flex items-center gap-2">
              ¡Activamos nuestras Manos!
            </h4>
            <p>
              Tocamos la manzana con nuestros dedos: sentimos que su cáscara es{' '}
              <strong>lisa y firme</strong>, sin partes blandas ni arrugadas.
            </p>
          </div>
        </div>
      );

    case 5:
      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0 shadow-sm border border-orange-300 p-2 overflow-hidden">
            <img src={SENSOR_IMAGES.mouth} alt="El Gusto" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl md:text-2xl text-[#fec89a] mb-1 flex items-center gap-2">
              ¡Activamos nuestra Lengua y Boca!
            </h4>
            <p>
              ¡El momento más delicioso! Saboreamos la manzana y descubrimos un sabor{' '}
              <strong>dulce natural</strong> con un pequeño toque <strong>ácido</strong>.
            </p>
          </div>
        </div>
      );

    case 6:
      return (
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-[#8d99ae] flex items-center justify-center shrink-0 shadow-sm border border-[#ccd6eb] p-2 overflow-hidden">
            <img src={SENSOR_IMAGES.ear} alt="El Oído" className="w-full h-full object-contain drop-shadow-sm" />
          </div>

          <div>
            <h4 className="font-headline font-bold text-xl md:text-2xl text-[#ffffff] mb-1 flex items-center gap-2">
              ¡Activamos nuestros Oídos!
            </h4>
            <p>
              Al darle un gran mordisco a la manzana... ¡escuchamos un crujido perfecto:{' '}
              <span className="bg-[#8d99ae] text-[#ffffff] font-black px-2 py-0.5 rounded text-lg md:text-xl">
                ¡CRUNCH!
              </span>
                Ese sonido nos dice que está bien fresca.
            </p>
          </div>
        </div>
      );

    case 7:
      return (
        <>
          <p className="mb-2">¿No es asombroso? ¡Es algo que podemos hacer todos los dias!</p>
          <p>
            Cada vez que comes, hueles o tocas un alimento prestando atención con tus{' '}
            <strong>5 sentidos</strong>, estás realizando un examen{' '}
            <span className="highlight-word">organoléptico</span>, igual que los científicos
            y chefs de todo el mundo.
          </p>
        </>
      );

    case 8:
      return (
        <div>
          <p className="font-headline font-bold text-xl md:text-2xl mb-3 text-[#fffff]">
            ¡Recordemos nuestros 5 superpoderes organolépticos!
          </p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2.5 md:gap-3 text-sm md:text-base mb-4">
            <SenseIcon
              image={SENSOR_IMAGES.eye}
              alt="Vista"
              label="Vista"
              colorClass="bg-[#e5c982] border-amber-200/90"
            />
            <SenseIcon
              image={SENSOR_IMAGES.nose}
              alt="Nariz"
              label="Olfato"
              colorClass="bg-[#f7c8db] border-rose-200/90"
            />
            <SenseIcon
              image={SENSOR_IMAGES.hand}
              alt="Mano"
              label="Tacto"
              colorClass="bg-[#b8c99a] border-emerald-200/90"
            />
            <SenseIcon
              image={SENSOR_IMAGES.mouth}
              alt="Gusto"
              label="Gusto"
              colorClass="bg-[#fec89a] border-orange-200/90"
            />
            <SenseIcon
              image={SENSOR_IMAGES.ear}
              alt="Oído"
              label="Oído"
              colorClass="bg-[#8d99ae] border-sky-200/90 col-span-2 md:col-span-1"
            />
          </div>

          <p className="text-base md:text-xl font-medium text-[#ffffff] leading-relaxed">
            ¡Muchas gracias por acompañarme hoy! ¡Sigue usando tus sentidos para explorar el planeta! ¡Adiós!
          </p>
        </div>
      );

    default:
      return null;
  }
}

// ── Datos de la secuencia
// ─────────────────────────────────────────────────────────────────────────────

const SEQUENCE = [
  '¡Bienvenido a la lección!',
  'Tus 5 Superpoderes',
  'Superpoder 1: La Vista',
  'Superpoder 2: El Olfato',
  'Superpoder 3: El Tacto',
  'Superpoder 4: El Gusto',
  'Superpoder 5: El Oído',
  '¡Eres un Mini-Científico!',
  'RESUMEN',
];


//──  Página principal
// ─────────────────────────────────────────────────────────────────────────────

export default function MartaDialogoPage() {
  const navigate = useNavigate();

  const [idx, setIdx] = useState(0);
  const [talking, setTalking] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);

  const talkingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Animación sencilla de la boca de Marta.
  useEffect(() => {
    setTalking(true);

    talkingRef.current = setInterval(() => {
      setTalking((current) => !current);
    }, 400);

    const stop = setTimeout(() => {
      if (talkingRef.current) {
        clearInterval(talkingRef.current);
      }
      setTalking(false);
    }, 3000);

    return () => {
      if (talkingRef.current) {
        clearInterval(talkingRef.current);
      }
      clearTimeout(stop);
    };
  }, [idx]);

  const goTo = (next: number) => {
    setIdx(next);
    setFadeKey((current) => current + 1);
  };

  const isFirst = idx === 0;
  const isLast = idx === SEQUENCE.length - 1;

  return (
    <div
      className="relative flex h-full min-h-screen w-full max-w-full flex-col overflow-x-hidden"
      style={{
        fontFamily: 'Nunito Sans, Nunito, sans-serif',
        backgroundColor: '#FAF6F0',
      }}
    >
      {/* ───────────────────────── Fondo ───────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 min-h-screen">
        <img
          src="/images/semana2/salon_clases.png"
          alt="Aula de clases"
          className="h-full min-h-screen w-full object-cover opacity-90"
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(250,246,240,0.35)',
            mixBlendMode: 'multiply',
          }}
        />
      </div>

      {/* ───────────────────────── Header ──────────────────────── */}
      <header className="relative z-40 flex w-full shrink-0 items-center justify-center border-b border-[#C4C8BC]/30 bg-[#FAF6F0]/95 px-8 py-5 shadow-sm backdrop-blur">
        <div className="flex items-center gap-3 text-center text-2xl font-extrabold tracking-wide text-[#4A7C59] md:text-3xl">
          <span className="h-3 w-3 rounded-full border border-[#705C30] bg-[#F8E0A8]" />
          Aprende con Marta
          <span className="h-3 w-3 rounded-full border border-[#4A7C59] bg-[#C8E8D0]" />
        </div>
      </header>

      {/* ───────────────────────── Escenario ───────────────────── */}
      <main
        className="relative z-10 flex min-h-0 w-full flex-1 flex-col overflow-x-hidden overflow-y-auto px-4 pb-4 pt-2 md:px-10 md:pb-8"
        style={{ justifyContent: 'flex-start' }}
      >
        <div className="relative z-20 mx-auto mt-auto flex w-full max-w-5xl flex-col">

          {/* Marta y su nombre quedan en el flujo: el alto se reserva y no se recorta */}
          <div className="relative z-30 flex max-w-full items-end pl-1 sm:pl-4 md:pl-8">
            <div
              className="pointer-events-none shrink-0 transition-all duration-300"
              style={{ width: 'clamp(7.75rem, min(42%, 26vw, 32dvh), 17.2rem)' }}
            >
              <MartaCharacter talking={talking} />
            </div>

            <div className="relative z-40 mb-2 ml-2 flex shrink-0 translate-y-1/2 items-center gap-2 whitespace-nowrap rounded-xl border border-white/25 bg-[#705C30] px-4 py-2 text-sm font-bold text-white shadow-md md:ml-3 md:px-5 md:text-base">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#F8E0A8]" />
              MARTA
            </div>
          </div>

          {/* ───────────────────── Caja de diálogo ───────────────────── */}
          <div className="relative z-20 w-full rounded-2xl border-2 border-[#C4C8BC]/60 bg-[#FAF6F0]/98 p-5 pt-8 shadow-[0_16px_45px_rgba(46,50,48,0.2)] backdrop-blur-xl transition-all md:rounded-3xl md:p-8 md:pt-9">

            {/* Encabezado de cada paso */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#C99582a]/30">
              <div className="flex items-center gap-2 text-lg md:text-x1 font-bold text-[#eef0eb] uppercase tracking-widest">
                <span aria-hidden="true">✦</span>
                {SEQUENCE[idx]}
              </div>

              <div className="text-base md:text-lg font-bold text-[#4A4E4A] bg-[#F0ECE4] px-3 py-1 rounded-full border border-[#C4C8BC]/40">
                Paso {idx + 1} de {SEQUENCE.length}
              </div>
            </div>

            {/* Contenido */}
            <div className="min-h-[170px] md:min-h-[195px] flex items-center py-1">
              <div
                key={fadeKey}
                className="w-full text-[#ffffff] text-2x1 md:text-3xl leading-relaxed fade-in"
              >
                <DialogueContent index={idx} />
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#C4C8BC]/20">
              <button
                onClick={() => goTo(idx - 1)}
                className={`${
                  isFirst ? 'invisible pointer-events-none' : ''
                } bg-[#E4E0D8] text-[#4A4E4A] hover:bg-[#D4CCBF] transition-all rounded-xl px-5 md:px-7 py-3 flex items-center gap-2 font-bold text-sm md:text-base active:scale-95 duration-200 shadow-sm`}
                aria-label="Regresar al paso anterior"
              >
                <span aria-hidden="true">←</span>
                Regresar
              </button>

              <button
                onClick={() => {
                  if (isLast) {
                    navigate('/semana/2');
                  } else {
                    goTo(idx + 1);
                  }
                }}
                className="bg-[#936639] text-white hover:bg-[#a68a64] transition-all rounded-xl px-7 md:px-9 py-3 flex items-center gap-2 md:gap-3 font-bold text-sm md:text-base active:scale-95 duration-200 shadow-md ml-auto"
              >
                {isLast ? (
                  <>
                    Completar
                    <span aria-hidden="true">✓</span>
                  </>
                ) : (
                  <>
                    Siguiente
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* ───────────────────── Animación ───────────────────── */}
      <style>{`
        .fade-in {
          animation: martaFadeIn 0.35s ease-out forwards;
        }

        @keyframes martaFadeIn {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}