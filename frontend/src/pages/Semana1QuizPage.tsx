import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';

// ── Images used in answer options ──────────────────────────────────────────
const IMG_NOTEBOOK =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDV3uGyXldQ7Byt2koKIV-8ED_Rl3wT9NIR7qPNRzDgA6J8K5CHfnb6ax81nnddPavuHUgwOsVLBppX2-OFpBIyuYWO7VkN6mjLgCSxBwrpRoi9Km5pfQk36MraM7K76ZoslzKBaLgF1pNVOrSUVnWZe3KNTxyVyeYkwyClYfYG2_abwduPcpjWyDpngFLWVV1xzjhcAJTRotiaJGPS0r1xc-JP3qjWcHhTstQ0mwBa_I_KdlbuWCcP7CSVV4mbtH-5UppJowL66yyq';
const IMG_RULER =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDTopjy3Gs7VjG2w3yRsiAP2vJxPKN1DNNgCauOgEuzfst1JCXRa-GZjejgtDIEKCxVVTm8HFPfpXk8N4nud7EhBfBtTyPqh1hFY2nvG6l1AP_7Ull10moMrsWa06YdXETV-rXHNSEhaBsb4ojc3oXmzBbSy4PK1h7RE9vwIHn85lf3ud3u1laICFSex5wOt4W0YNBGgGkJZ6uNArbBere_9y_h2Yw8RZx-oK3JSnejTUcvUJFi6wderwz2pppcWkuuCP0C5euOKnU5';
const IMG_SCALE =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCAg1AbMQHyMIyxvlIS31K-puWc-iTLeHDsfKAbA3xUJpKeohnFyJGjjhfbYeMBb2oPO_wpGfagXRE7BUcH47WT283zj-L8tdcrVjT4E9Q1PoANjLGEH6CJNhlI2rxijgmOdnzLjaN4VDMH6Bb6bKRbJY71pfCprNZxMh5G2jaN1nZJRcOqjga34w6rrT6nNNRmcgfDLzu-nIeG7IC4shR3tqAilNz5jZnxmnihSJHAtSdZoVkMi4TTE1HWSilq8_O9PFoosPDTuqJX';
const IMG_FERMI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuCCiytwkMkrjDGC9oDEikU8EaXSO8qBhnidmsG6CfVRWA0USs6YHp_sXBCph4EOGcZr43jBZ2DbQBjpTXfDlJ6e2nwqYVZtBepGBXO1CIeK8aHI7bSFcr3EuSveq87xIEQA4pZ8Rr_r68zcav4ZDXodwby_Eg2CYEa8iBPJPjo_K6EowxrCD5O_RPy27lag924QzRtLiTvZngcBJYof1Vj2sYvnw6SMc18mfykXlOD0UmzSDpp6plPf176k5i9FxysN5sAplNYnSHaf';

// ── Quiz data ──────────────────────────────────────────────────────────────
interface QuizQuestion {
  text: string;
  options: { label: string; img: string }[];
  correctIndex: number;
}

const QUESTIONS: QuizQuestion[] = [
  {
    text: '¿QUÉ NOS ENSEÑA EL JUEGO DE PULGARCITO?',
    options: [
      { label: 'Cuánto "cm" miden las cosas', img: IMG_NOTEBOOK },
      { label: 'Los puentes son pequeños', img: IMG_RULER },
      { label: 'Que Pulgarcito el pequeño', img: IMG_SCALE },
    ],
    correctIndex: 0,
  },
  {
    text: '¿QUÉ NOS ENSEÑA EL JUEGO DE ORDENAR DE MENOR A MAYOR?',
    options: [
      { label: 'Que las cosas tienen diferentes tamaños', img: IMG_NOTEBOOK },
      { label: 'Que juntos forman una subida', img: IMG_RULER },
      { label: 'Las muñecas son bonitas', img: IMG_SCALE },
    ],
    correctIndex: 0,
  },
  {
    text: '¿QUÉ NOS ENSEÑA EL JUEGO DE DESCRIPCIÓN DE LOS OBJETOS?',
    options: [
      { label: 'Que se pueden identificar las cosas por su descripción', img: IMG_NOTEBOOK },
      { label: 'Que las manzanas son rojas', img: IMG_RULER },
      { label: 'Que el cuaderno es grande', img: IMG_SCALE },
    ],
    correctIndex: 0,
  },
];

type Screen = 'intro' | 'question' | 'results';

function getResultData(score: number) {
  if (score === 3) return { stars: 3, title: '¡Perfecto! 🌟', msg: '¡Respondiste todo correctamente! Eres un gran científico.', color: 'text-[#4a6549]' };
  if (score === 2) return { stars: 2, title: '¡Muy bien! 👍', msg: '¡Casi perfecto! Practica un poco más y lo lograrás.', color: 'text-[#3e6378]' };
  if (score === 1) return { stars: 1, title: '¡Sigue intentando!', msg: 'Repasa las actividades y vuelve a intentarlo.', color: 'text-[#6a5d45]' };
  return { stars: 0, title: 'Inténtalo de nuevo', msg: 'No te rindas. ¡Puedes mejorar!', color: 'text-[#ba1a1a]' };
}

// ── Component ─────────────────────────────────────────────────────────────
export default function Semana1QuizPage() {
  const navigate = useNavigate();

  const [screen, setScreen] = useState<Screen>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  const currentQ = QUESTIONS[questionIndex];

  const persistQuizScore = async (finalScore: number) => {
    const stored = localStorage.getItem('plataforma_user');
    if (!stored) {
      setSaveStatus('error');
      setSaveError('No hay usuario activo para guardar la puntuación.');
      return;
    }

    const user = JSON.parse(stored) as { id: string };
    const percentage = Math.round((finalScore / QUESTIONS.length) * 100);
    setSaveStatus('saving');
    setSaveError('');

    try {
      await saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 1, score: percentage });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error guardando quiz Semana 1:', error);
      setSaveStatus('error');
      setSaveError('No se pudo guardar tu puntuación. Intenta de nuevo más tarde.');
    }
  };

  const handleCheck = () => {
    if (selected === null) return;
    const correct = selected === currentQ.correctIndex;
    if (correct) setScore((s) => s + 1);
    setChecked(true);
  };

  const handleNext = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((i) => i + 1);
      setSelected(null);
      setChecked(false);
    } else {
      persistQuizScore(score);
      setScreen('results');
    }
  };

  const handleRestart = () => {
    setScreen('intro');
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setSaveStatus('idle');
    setSaveError('');
  };

  // ── Shared layout wrapper ───────────────────────────────────────────────
  const PageShell = ({ children }: { children: React.ReactNode }) => (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex flex-col">
      {/* Desktop header */}
      <header className="hidden md:flex justify-between items-center w-full px-5 md:px-[120px] py-base bg-surface-container font-headline-md text-headline-md text-primary">
        <div className="font-headline-md text-headline-md font-bold text-primary">UNIVO</div>
        <div className="flex gap-md items-center">
          <nav className="flex gap-md font-label-lg text-label-lg">
            <div className="text-primary font-bold bg-primary-container text-on-primary-container flex items-center gap-xs cursor-pointer px-md py-sm rounded-full">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>science</span>
              Laboratorio
            </div>
          </nav>
          <div className="w-px h-8 bg-outline-variant mx-sm" />
          <span className="material-symbols-outlined cursor-pointer">account_circle</span>
        </div>
      </header>

      {children}

      {/* Mobile nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-5 pb-3 pt-1 bg-surface-container-low shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-xl border-t border-surface-container">
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16">
          <span className="material-symbols-outlined mb-1">map</span>
          <span className="text-[12px]">Mapa</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-md py-xs -mt-md shadow-sm border-2 border-surface">
          <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>science</span>
          <span className="text-[12px] font-bold mt-1">Laboratorio</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-2 w-16">
          <span className="material-symbols-outlined mb-1">trending_up</span>
          <span className="text-[12px]">Progreso</span>
        </div>
      </nav>
    </div>
  );

  // ── INTRO SCREEN ───────────────────────────────────────────────────────
  if (screen === 'intro') {
    return (
      <PageShell>
        <main className="flex-grow flex flex-col items-center justify-center px-5 md:px-[120px] py-8 pb-24 md:pb-8">
          <div className="w-full max-w-2xl flex flex-col items-center gap-6">

            {/* Title chip */}
            <div className="bg-primary-container text-on-primary-container font-label-lg text-label-lg px-5 py-2 rounded-full border-2 border-[#8ba888] flex items-center gap-2">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>quiz</span>
              Quiz · Semana 1
            </div>

            {/* Speech bubble */}
            <div className="relative w-full bg-surface-container-lowest rounded-3xl border-2 border-surface-container shadow-[0_8px_24px_rgba(74,101,73,0.10)] p-6 text-center">
              <p className="font-headline-md text-headline-md text-on-surface leading-snug font-[Quicksand]">
                ¡Hola! Soy Fermi. ¿Estás listo para demostrar todo lo que aprendiste esta semana?
              </p>
              <p className="mt-2 font-body-md text-body-md text-on-surface-variant">
                Prepárate para contestar <strong className="text-primary">3 preguntas</strong> sobre los juegos de la Semana 1.
              </p>
              {/* Bubble tail */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-surface-container border-r-[16px] border-r-transparent" />
              <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-t-[14px] border-t-surface-container-lowest border-r-[14px] border-r-transparent" />
            </div>

            {/* Fermi mascot */}
            <img
              alt="Fermi mascota"
              src={IMG_FERMI}
              className="h-48 md:h-56 object-contain drop-shadow-lg animate-bounce-greet"
            />

            {/* Stats row */}
            <div className="flex flex-wrap justify-center gap-4 font-label-lg text-label-lg text-on-surface-variant">
              <div className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>help</span>
                3 preguntas
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-[#6a5d45]" style={{ fontVariationSettings: '"FILL" 1' }}>military_tech</span>
                30 puntos posibles
              </div>
              <div className="flex items-center gap-1.5 bg-surface-container rounded-full px-4 py-2">
                <span className="material-symbols-outlined text-[#3e6378]" style={{ fontVariationSettings: '"FILL" 1' }}>emoji_events</span>
                Gana tu insignia
              </div>
            </div>

            {/* Activity topics */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: 'straighten', label: 'Pulgarcito' },
                { icon: 'sort', label: 'Ordenar por Tamaño' },
                { icon: 'description', label: 'Descripción de Objetos' },
              ].map((t) => (
                <div
                  key={t.label}
                  className="flex items-center gap-2 bg-primary-fixed text-on-primary-container rounded-xl px-4 py-2 border border-primary-container"
                >
                  <span className="material-symbols-outlined text-primary">{t.icon}</span>
                  <span className="font-label-md text-label-md">{t.label}</span>
                </div>
              ))}
            </div>

            {/* CTA */}
            <button
              onClick={() => setScreen('question')}
              className="w-full max-w-sm bg-primary text-on-primary font-headline-md text-headline-md py-5 rounded-[32px] border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center justify-center gap-3 hover:bg-[#334d33] transition-colors animate-pulse"
            >
              <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: '"FILL" 1' }}>play_arrow</span>
              ¡Empezar Quiz!
            </button>

            <button
              onClick={() => navigate('/semana/1')}
              className="text-on-surface-variant font-label-md text-label-md underline underline-offset-2"
            >
              Volver a las actividades
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  // ── RESULTS SCREEN ─────────────────────────────────────────────────────
  if (screen === 'results') {
    const { stars, title, msg, color } = getResultData(score);
    const points = score * 10;

    return (
      <PageShell>
        <main className="flex-grow flex flex-col items-center justify-center px-5 md:px-[120px] py-8 pb-24 md:pb-8">
          <div className="w-full max-w-xl flex flex-col items-center gap-6">

            {/* Stars */}
            <div className="flex gap-3 text-5xl">
              {[0, 1, 2].map((i) => (
                <span key={i} style={{ filter: i < stars ? 'none' : 'grayscale(1) opacity(0.3)' }}>⭐</span>
              ))}
            </div>

            {/* Score card */}
            <div className="w-full bg-surface-container-lowest rounded-3xl border-2 border-surface-container shadow-[0_12px_24px_rgba(74,101,73,0.1)] p-8 text-center flex flex-col gap-4">
              <h2 className={`font-headline-lg text-headline-lg font-bold ${color}`}>{title}</h2>

              {/* Score donut-style */}
              <div className="flex items-center justify-center gap-4 my-2">
                <div className="flex flex-col items-center">
                  <span className="font-headline-lg text-[56px] leading-none font-black text-primary">{points}</span>
                  <span className="font-label-lg text-label-lg text-on-surface-variant">de 30 puntos</span>
                </div>
                <div className="w-px h-16 bg-surface-container-highest" />
                <div className="flex flex-col items-center">
                  <span className="font-headline-lg text-[56px] leading-none font-black text-[#3e6378]">{score}/3</span>
                  <span className="font-label-lg text-label-lg text-on-surface-variant">respuestas correctas</span>
                </div>
              </div>

              <p className="font-body-lg text-body-lg text-on-surface-variant">{msg}</p>

              {/* Guardado de puntuación */}
              {saveStatus === 'saving' && (
                <div className="text-secondary text-sm animate-pulse flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">sync</span>
                  Guardando puntuación...
                </div>
              )}
              {saveStatus === 'saved' && (
                <div className="text-primary text-sm font-semibold flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">cloud_done</span>
                  Puntuación guardada en tu bitácora.
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="text-error text-sm font-semibold flex items-center justify-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {saveError}
                </div>
              )}


              {/* Per-question summary */}
              <div className="flex flex-col gap-2 mt-2 text-left">
                {QUESTIONS.map((_q, i) => (
                  <div key={i} className="flex items-center gap-3 bg-surface-container rounded-xl px-4 py-3">
                    <span
                      className="material-symbols-outlined"
                      style={{ fontVariationSettings: '"FILL" 1', color: '#4a6549', fontSize: '22px' }}
                    >
                      check_circle
                    </span>
                    <span className="font-label-md text-label-md text-on-surface-variant text-sm flex-1">
                      Pregunta {i + 1}
                    </span>
                    <span className="font-label-md text-label-md text-primary font-bold">+10 pts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fermi */}
            <img alt="Fermi mascota" src={IMG_FERMI} className="h-36 object-contain drop-shadow-lg" />

            {/* Buttons */}
            <button
              onClick={handleRestart}
              className="w-full max-w-sm bg-primary text-on-primary font-headline-md text-headline-md py-4 rounded-[32px] border-b-4 border-[#334d33] active:translate-y-0.5 flex items-center justify-center gap-2 hover:bg-[#334d33] transition-colors"
            >
              <span className="material-symbols-outlined">replay</span>
              Intentar de nuevo
            </button>
            <button
              onClick={() => navigate('/semana/1')}
              className="w-full max-w-sm bg-surface-container text-on-surface-variant font-headline-md text-headline-md py-4 rounded-[32px] border-2 border-surface-container-high flex items-center justify-center gap-2 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined">home</span>
              Volver al inicio
            </button>
          </div>
        </main>
      </PageShell>
    );
  }

  // ── QUESTION SCREEN ─────────────────────────────────────────────────────
  const isCorrect = checked && selected === currentQ.correctIndex;

  const getOptionClass = (idx: number) => {
    const base =
      'option-card w-full bg-surface-container-lowest rounded-2xl p-sm border-2 flex flex-row items-center gap-md group focus:outline-none focus:ring-4 focus:ring-secondary-container transition-all';

    if (checked) {
      if (idx === currentQ.correctIndex)
        return `${base} border-[#4a6549] bg-primary-fixed`;
      if (idx === selected && selected !== currentQ.correctIndex)
        return `${base} border-error bg-error-container`;
      return `${base} border-surface-container opacity-50`;
    }
    if (selected === idx)
      return `${base} border-primary bg-primary-container shadow-[0_4px_0_#4a6549]`;
    return `${base} border-surface-container hover:border-primary-container`;
  };

  return (
    <PageShell>
      <main className="flex-grow flex flex-col items-center justify-center px-5 md:px-[120px] py-8 pb-24 md:pb-8">
        <div
          className="w-full max-w-5xl bg-surface-container-lowest rounded-3xl shadow-[0_12px_24px_rgba(74,101,73,0.1)] p-6 md:p-[80px] border-2 border-surface-container flex flex-col gap-6 relative overflow-hidden"
          style={{
            backgroundImage:
              'repeating-linear-gradient(transparent, transparent 31px, #e3e2e6 31px, #e3e2e6 32px)',
          }}
        >
          {/* Notebook margin line */}
          <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-error-container z-0" />

          {/* Progress bar */}
          <div className="relative z-10 flex items-center gap-3 pl-8 md:pl-0">
            <span className="font-label-lg text-label-lg text-primary whitespace-nowrap">
              Pregunta {questionIndex + 1} de {QUESTIONS.length}
            </span>
            <div className="flex-1 h-3 bg-surface-container-highest rounded-full overflow-hidden border border-outline-variant">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${((questionIndex + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <span className="font-label-md text-label-md text-on-surface-variant whitespace-nowrap">
              {score} ✓
            </span>
          </div>

          {/* Play area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center relative z-10">

            {/* Left: mascot + bubble */}
            <div className="flex flex-col items-center justify-center rounded-2xl p-4 relative h-full">
              <div className="w-full bg-surface-container-lowest p-5 rounded-2xl shadow-sm relative z-10 border-2 border-surface-container mb-4">
                <p className="font-headline-md text-headline-md text-on-surface text-center font-[Quicksand]">
                  {currentQ.text}
                </p>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[16px] border-l-transparent border-t-[16px] border-t-surface-container border-r-[16px] border-r-transparent" />
                <div className="absolute -bottom-[14px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-l-transparent border-t-[14px] border-t-surface-container-lowest border-r-[14px] border-r-transparent" />
              </div>
              <img
                alt="Fermi Mascot"
                className="h-48 md:h-56 object-contain z-0 mt-2 drop-shadow-lg"
                src={IMG_FERMI}
              />
            </div>

            {/* Right: answer options */}
            <div className="flex flex-col gap-3 md:gap-4 h-full pl-8 md:pl-0">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => !checked && setSelected(idx)}
                  disabled={checked}
                  className={getOptionClass(idx)}
                >
                  <img
                    alt={opt.label}
                    className="w-20 h-20 object-contain rounded-xl bg-surface-container-low p-2 pointer-events-none flex-shrink-0"
                    src={opt.img}
                  />
                  <span className="font-headline-md text-headline-md text-on-surface flex-grow text-left">
                    {opt.label}
                  </span>
                  {checked && idx === currentQ.correctIndex && (
                    <span className="material-symbols-outlined text-[#4a6549] flex-shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                  )}
                  {checked && idx === selected && selected !== currentQ.correctIndex && (
                    <span className="material-symbols-outlined text-error flex-shrink-0" style={{ fontVariationSettings: '"FILL" 1' }}>
                      cancel
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback banner */}
          {checked && (
            <div
              className={`relative z-10 pl-8 md:pl-0 rounded-2xl px-5 py-3 flex items-center gap-3 font-label-lg text-label-lg ${
                isCorrect ? 'bg-primary-fixed text-on-primary-container' : 'bg-error-container text-on-error-container'
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
                {isCorrect ? 'celebration' : 'sentiment_dissatisfied'}
              </span>
              {isCorrect
                ? '¡Correcto! Muy bien hecho.'
                : `La respuesta correcta es: "${currentQ.options[currentQ.correctIndex].label}"`}
            </div>
          )}

          {/* Action button */}
          <div className="flex justify-center w-full relative z-10 pl-8 md:pl-0">
            {!checked ? (
              <button
                onClick={handleCheck}
                disabled={selected === null}
                className={`bg-primary text-on-primary font-headline-md text-headline-md px-[80px] py-sm rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center gap-2 transition-all ${
                  selected === null ? 'opacity-40 cursor-not-allowed' : 'hover:bg-[#334d33] shadow-[0_4px_0_#334d33]'
                }`}
              >
                <span className="material-symbols-outlined">check_circle</span>
                Comprobar
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-primary text-on-primary font-headline-md text-headline-md px-[80px] py-sm rounded-full border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 flex items-center gap-2 hover:bg-[#334d33] transition-all shadow-[0_4px_0_#334d33] animate-pulse"
              >
                <span className="material-symbols-outlined">arrow_forward</span>
                {questionIndex < QUESTIONS.length - 1 ? 'Siguiente pregunta' : 'Ver resultados'}
              </button>
            )}
          </div>
        </div>
      </main>
    </PageShell>
  );
}

