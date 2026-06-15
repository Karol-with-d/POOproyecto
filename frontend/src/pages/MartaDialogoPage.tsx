import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Dialogue sequence ──────────────────────────────────────────────────────
const SEQUENCE = [
  {
    text: '¡Hola! Soy Marta, y hoy te enseñaré el significado de una palabra que suena un poco extraña pero que es súper interesante: Organoléptico.',
  },
  {
    text: '¡Imagínate que tu cuerpo tiene un equipo de superpoderes secretos para descubrir el mundo! Ese equipo está formado por tus cinco sentidos: tus ojos, tu nariz, tu boca, tus oídos y tus manos.',
  },
  {
    text: 'Por ejemplo, si hacemos un examen "organoléptico" a una manzana, usamos nuestros superpoderes así: 👀 Vista: Miramos su color rojo brillante y su forma redonda. 👃 Olfato: Sentimos su aroma dulce y fresco. ✋ Tacto: Tocamos su piel lisita y dureza. 👅 Gusto: Saboreamos si está dulce o ácida. 👂 Oído: ¡Escuchamos el CRUNCH al morderla!',
  },
  {
    text: 'Así que, cada vez que comes, hueles o tocas algo prestando mucha atención... ¡estás haciendo un examen organoléptico como un verdadero científico! 🔬',
  },
  {
    text: 'Hagamos un resumen: 👀 Vista → color y forma. 👃 Olfato → aroma. ✋ Tacto → textura (lisa, suave, dura). 👅 Gusto → dulce, ácido, amargo o salado. 👂 Oído → el sonido que hace.',
  },
  {
    text: '¡Qué divertido es explorar el mundo con nuestros superpoderes! Muchas gracias por acompañarme hoy. ¡Nos vemos en nuestra próxima clase científica! ¡Adiós! 👋',
  },
];

// ── Marta SVG character ────────────────────────────────────────────────────
function MartaCharacter({ talking }: { talking: boolean }) {
  return (
    <svg
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-xl"
    >
      <g>
        {/* Body */}
        <path
          d="M 90 250 C 70 190, 90 110, 150 90 C 180 70, 220 70, 250 90 C 310 110, 330 190, 310 250 C 330 290, 300 330, 250 320 C 250 320, 150 320, 150 320 C 100 330, 70 290, 90 250 Z"
          fill="#754C3A" stroke="#4A3025" strokeWidth="4"
        />
        {/* Face */}
        <ellipse cx="200" cy="200" rx="75" ry="65" fill="#F5D3BB" stroke="#4A3025" strokeWidth="4" />
        {/* Ears */}
        <ellipse cx="125" cy="200" rx="15" ry="20" fill="#F5D3BB" stroke="#4A3025" strokeWidth="4" />
        <ellipse cx="275" cy="200" rx="15" ry="20" fill="#F5D3BB" stroke="#4A3025" strokeWidth="4" />
        {/* Hair */}
        <path
          d="M 115 170 C 120 130, 160 110, 200 120 C 240 110, 280 130, 285 170 C 260 140, 200 150, 200 150 C 200 150, 140 140, 115 170 Z"
          fill="#754C3A" stroke="#4A3025" strokeWidth="4"
        />
        {/* Ear details */}
        <path d="M 130 190 Q 140 230 135 250" fill="none" stroke="#4A3025" strokeLinecap="round" strokeWidth="4" />
        <path d="M 270 190 Q 260 230 265 250" fill="none" stroke="#4A3025" strokeLinecap="round" strokeWidth="4" />
        {/* Blush */}
        <ellipse cx="155" cy="215" rx="12" ry="8" fill="#F0A39D" opacity="0.8" />
        <ellipse cx="245" cy="215" rx="12" ry="8" fill="#F0A39D" opacity="0.8" />
        {/* Glasses frames */}
        <circle cx="165" cy="190" r="28" fill="none" stroke="#2D2D2D" strokeWidth="6" />
        <circle cx="235" cy="190" r="28" fill="none" stroke="#2D2D2D" strokeWidth="6" />
        <path d="M 193 190 L 207 190" stroke="#2D2D2D" strokeLinecap="round" strokeWidth="6" />
        {/* Eyes */}
        <ellipse cx="165" cy="190" rx="7" ry="10" fill="#2D2D2D" />
        <ellipse cx="235" cy="190" rx="7" ry="10" fill="#2D2D2D" />
        {/* Collar */}
        <path
          d="M 145 260 C 165 285, 235 285, 255 260 L 265 290 C 235 315, 165 315, 135 290 Z"
          fill="#856046" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
        />
        {/* Skirt detail */}
        <path
          d="M 215 280 L 215 330 L 245 330 L 245 275 Z"
          fill="#856046" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
        />
        <line x1="220" y1="330" x2="220" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />
        <line x1="230" y1="330" x2="230" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />
        <line x1="240" y1="330" x2="240" y2="345" stroke="#4A3025" strokeLinecap="round" strokeWidth="3" />
        {/* Lower body */}
        <path
          d="M 140 290 L 120 380 L 280 380 L 260 290 Z"
          fill="#EBE1D5" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
        />
        <path
          d="M 140 290 L 110 330 L 120 380 Z"
          fill="#D5CBBF" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
        />
        <path
          d="M 260 290 L 290 330 L 280 380 Z"
          fill="#D5CBBF" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
        />
        {/* Mouth — open (talking) */}
        {talking && (
          <g>
            <path
              d="M 178 225 C 178 225, 200 255, 222 225 Z"
              fill="#4A2511" stroke="#4A3025" strokeLinejoin="round" strokeWidth="4"
            />
            <path
              d="M 186 238 C 195 230, 205 230, 214 238 C 210 248, 190 248, 186 238 Z"
              fill="#E86A6A"
            />
            <path d="M 183 227 C 190 232, 210 232, 217 227 Z" fill="#ffffff" />
          </g>
        )}
        {/* Mouth — closed (not talking) */}
        {!talking && (
          <path
            d="M 182 228 C 190 236, 210 236, 218 228"
            fill="none" stroke="#4A3025" strokeLinecap="round" strokeWidth="4"
          />
        )}
      </g>
    </svg>
  );
}

// ── Main component ──────────────────────────────────────────────────────────
export default function MartaDialogoPage() {
  const navigate = useNavigate();
  const [idx, setIdx] = useState(0);
  const [talking, setTalking] = useState(true);
  const [fadeKey, setFadeKey] = useState(0);
  const talkingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Lip-sync: toggle talking state periodically while "speaking"
  useEffect(() => {
    setTalking(true);
    talkingRef.current = setInterval(() => {
      setTalking((t) => !t);
    }, 400);
    const stop = setTimeout(() => {
      if (talkingRef.current) clearInterval(talkingRef.current);
      setTalking(false);
    }, 3000);
    return () => {
      if (talkingRef.current) clearInterval(talkingRef.current);
      clearTimeout(stop);
    };
  }, [idx]);

  const goTo = (next: number) => {
    setIdx(next);
    setFadeKey((k) => k + 1);
  };

  const isLast = idx === SEQUENCE.length - 1;

  return (
    <div
      className="relative w-full min-h-screen flex flex-col overflow-hidden"
      style={{ fontFamily: 'Nunito, sans-serif', backgroundColor: '#1A1A1A' }}
    >
      {/* ── Background ─────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/semana2/aprende-marta-bg.png"
          alt="Aula de clases"
          className="w-full h-full object-cover"
          style={{ opacity: 0.9 }}
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(250,246,240,0.25)' }} />
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <header
        className="relative z-30 flex items-center justify-between px-5 py-3 shadow-sm"
        style={{ backgroundColor: '#A7D4AE' }}
      >
        <button
          onClick={() => navigate('/semana/2')}
          className="flex items-center gap-2 font-bold text-sm px-4 py-2 rounded-full hover:opacity-80 transition-opacity"
          style={{ color: '#1A1A1A', backgroundColor: 'rgba(255,255,255,0.4)' }}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Salir
        </button>
        <span className="font-extrabold text-lg" style={{ color: '#1A1A1A' }}>Aprende con Marta</span>
        <div
          className="flex gap-1.5 items-center px-3 py-1.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.5)' }}
        >
          {SEQUENCE.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === idx ? '20px' : '8px',
                height: '8px',
                backgroundColor: i <= idx ? '#4D6B53' : '#C4C8BC',
              }}
            />
          ))}
        </div>
      </header>

      {/* ── Character ──────────────────────────────────────────────────── */}
      <div
        className="absolute z-10"
        style={{
          bottom: '22%',
          left: '-3%',
          width: '52%',
          maxWidth: '420px',
        }}
      >
        <MartaCharacter talking={talking} />
      </div>

      {/* ── Dialogue box ───────────────────────────────────────────────── */}
      <div className="absolute bottom-0 left-0 w-full z-20 px-4 pb-5 md:px-10 md:pb-8">
        <div
          className="relative w-full max-w-4xl mx-auto rounded-2xl p-5 md:p-7 pt-8"
          style={{
            backgroundColor: 'rgba(250,246,240,0.97)',
            border: '1.5px solid rgba(196,200,188,0.4)',
            boxShadow: '0 4px 24px rgba(46,50,48,0.10)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Name tag */}
          <div
            className="absolute -top-5 left-6 font-extrabold text-base px-5 py-2 rounded-xl shadow-sm"
            style={{ backgroundColor: '#705C30', color: '#ffffff', fontFamily: 'Literata, serif' }}
          >
            MARTA
          </div>

          {/* Dialogue text */}
          <div className="min-h-[90px] flex items-start mt-1 mb-4">
            <p
              key={fadeKey}
              className="text-base md:text-lg leading-relaxed"
              style={{
                color: '#2e3230',
                animation: 'martaFadeIn 0.35s ease forwards',
              }}
            >
              {SEQUENCE[idx].text}
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-3 justify-end">
            {idx > 0 && (
              <button
                onClick={() => goTo(idx - 1)}
                className="flex items-center gap-2 font-bold text-sm px-5 py-2.5 rounded-xl transition-all active:scale-95"
                style={{ backgroundColor: '#EBE1D5', color: '#4A4E4A', border: '2px solid #C4C8BC' }}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Regresar
              </button>
            )}
            <button
              onClick={() => {
                if (isLast) navigate('/semana/2');
                else goTo(idx + 1);
              }}
              className="flex items-center gap-2 font-bold text-sm px-6 py-2.5 rounded-xl text-white transition-all active:scale-95 shadow-sm"
              style={{ backgroundColor: '#4D6B53' }}
            >
              {isLast ? (
                <>
                  Terminar
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              ) : (
                <>
                  Siguiente
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* fade-in keyframe */}
      <style>{`
        @keyframes martaFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
