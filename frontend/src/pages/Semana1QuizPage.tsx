import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';
import { playMiss, playSuccess } from '../services/sounds';

const DIRECTOR = '/images/semana1/director.jpg';

type Option = { emoji: string; label: string };
type Question = {
  topic: string;
  prompt: string;
  hint: string;
  options: [Option, Option, Option];
  correctIndex: number;
};

const QUESTIONS: Question[] = [
  {
    topic: 'Rescata a Pulgarcito',
    prompt: '¿Con qué unidad se mide la grieta que Pulgarcito tiene que cruzar?',
    hint: 'Piensa en la regla del laboratorio, no en la báscula ni en el termómetro.',
    options: [
      { emoji: '📏', label: 'Centímetros (cm)' },
      { emoji: '⚖️', label: 'Kilogramos (kg)' },
      { emoji: '🌡️', label: 'Grados de temperatura' },
    ],
    correctIndex: 0,
  },
  {
    topic: 'Rescata a Pulgarcito',
    prompt: 'En el primer nivel la grieta mide 10 cm. ¿Qué tabla lo cruza justo?',
    hint: 'La tabla correcta mide lo mismo que la grieta. Ni más corta ni más larga.',
    options: [
      { emoji: '🪵', label: 'La tabla de 5 cm' },
      { emoji: '🪵', label: 'La tabla de 10 cm' },
      { emoji: '🪵', label: 'La tabla de 15 cm' },
    ],
    correctIndex: 1,
  },
  {
    topic: 'Rescata a Pulgarcito',
    prompt: 'En el nivel 2 hay que elegir dos tablas. ¿Cuánto deben sumar?',
    hint: 'Ya no basta una sola tabla. Las dos juntas tienen que cubrir 20 cm.',
    options: [
      { emoji: '➕', label: '10 cm' },
      { emoji: '➕', label: '20 cm' },
      { emoji: '➕', label: '40 cm' },
    ],
    correctIndex: 1,
  },
  {
    topic: 'Rescata a Pulgarcito',
    prompt: 'Si las tablas suman menos que la grieta, ¿qué le pasa a Pulgarcito?',
    hint: 'Si el puente no alcanza el otro risco, no hay suelo donde apoyar el pie.',
    options: [
      { emoji: '🏕️', label: 'Llega al campamento y celebra' },
      { emoji: '🕳️', label: 'Cae al abismo' },
      { emoji: '⭐', label: 'La grieta se hace más pequeña sola' },
    ],
    correctIndex: 1,
  },
  {
    topic: 'Rescata a Pulgarcito',
    prompt: 'Si la tabla es más larga que la grieta, ¿qué ocurre?',
    hint: 'Una tabla que sobresale no queda horizontal sobre los dos riscos.',
    options: [
      { emoji: '📐', label: 'Queda inclinada y Pulgarcito se resbala' },
      { emoji: '🎉', label: 'Pulgarcito cruza todavía más rápido' },
      { emoji: '🥛', label: 'La tabla se convierte en mililitros' },
    ],
    correctIndex: 0,
  },
  {
    topic: 'Ordenar por tamaño',
    prompt: 'En la repisa de juguetes, ¿cuál es el más alto?',
    hint: 'Compara los centímetros: 25 cm es más alto que 10 cm y que 5 cm.',
    options: [
      { emoji: '🦆', label: 'El patito de goma, de 5 cm' },
      { emoji: '🧸', label: 'El osito de peluche, de 10 cm' },
      { emoji: '🦒', label: 'La jirafa de madera, de 25 cm' },
    ],
    correctIndex: 2,
  },
  {
    topic: 'Ordenar por tamaño',
    prompt: 'En estas bebidas, ¿cuál tiene más líquido?',
    hint: 'Mira los mililitros de la etiqueta. 500 ml caben más que 100 ml.',
    options: [
      { emoji: '🍓', label: 'El yogur de fresa, de 100 ml' },
      { emoji: '🧃', label: 'El vaso de jugo' },
      { emoji: '💧', label: 'La botella de agua, de 500 ml' },
    ],
    correctIndex: 2,
  },
  {
    topic: 'Ordenar por tamaño',
    prompt: '¿Qué tienes que comparar para colocar cada objeto en su puesto?',
    hint: 'El color no decide el puesto. Cada nivel pide altura, capacidad, cantidad o grosor.',
    options: [
      { emoji: '🎨', label: 'Solo el color de cada objeto' },
      { emoji: '📐', label: 'Su tamaño, de mayor a menor o de menor a mayor' },
      { emoji: '🔤', label: 'El orden de las letras de su nombre' },
    ],
    correctIndex: 1,
  },
  {
    topic: 'Descubre el objeto',
    prompt: 'El Prof. Leo pide algo GRANDE y VERDE. ¿Qué objeto debes llevar al pupitre?',
    hint: 'Es el objeto donde escribes muchas páginas, y en el juego es verde.',
    options: [
      { emoji: '📗', label: 'El cuaderno' },
      { emoji: '🧼', label: 'El borrador' },
      { emoji: '✂️', label: 'Las tijeras' },
    ],
    correctIndex: 0,
  },
  {
    topic: 'Descubre el objeto',
    prompt: '¿Qué objeto es LARGO y DE MADERA?',
    hint: 'Sirve para trazar líneas rectas y para medir.',
    options: [
      { emoji: '🧴', label: 'El pegamento' },
      { emoji: '📏', label: 'La regla' },
      { emoji: '✏️', label: 'El sacapuntas' },
    ],
    correctIndex: 1,
  },
];

const POINTS_PER_QUESTION = 10;

function getResultCopy(score: number) {
  if (score >= 9) {
    return {
      stars: 3,
      title: '¡Explorador experto!',
      message: 'Mediste, ordenaste y reconociste los objetos. El Director está orgulloso.',
    };
  }
  if (score >= 6) {
    return {
      stars: 2,
      title: '¡Muy bien, explorador!',
      message: 'Ya dominas gran parte de la semana. Repasa el juego que se te complicó.',
    };
  }
  if (score >= 3) {
    return {
      stars: 1,
      title: '¡Buen intento!',
      message: 'Vuelve a jugar Pulgarcito, Ordenar por tamaño y Descubre el objeto.',
    };
  }
  return {
    stars: 0,
    title: '¡A seguir practicando!',
    message: 'Juega otra vez los tres minijuegos y regresa a medir con calma.',
  };
}

export default function Semana1QuizPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>(() => QUESTIONS.map(() => false));
  const [saveError, setSaveError] = useState('');

  const question = QUESTIONS[questionIndex];
  const progress = ((questionIndex + 1) / QUESTIONS.length) * 100;
  const points = score * POINTS_PER_QUESTION;

  const persistQuizScore = async (correctCount: number) => {
    const userRaw = localStorage.getItem('plataforma_user');
    if (!userRaw) {
      setSaveError('Inicia sesión para guardar tu puntaje.');
      return;
    }
    try {
      const user = JSON.parse(userRaw) as { id: string };
      const percentage = Math.round((correctCount / QUESTIONS.length) * 100);
      await saveQuizScoreForSemanaNumber({
        userId: user.id,
        semanaNumber: 1,
        score: percentage,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '';
      if (message.includes('no existe')) {
        setSaveError('No se pudo guardar: faltan las semanas en la base de datos.');
      } else {
        setSaveError('No se pudo guardar el puntaje. Revisa tu conexión.');
      }
    }
  };

  const handleCheck = () => {
    if (selected === null || checked) return;
    const correct = selected === question.correctIndex;
    setAnswers((prev) => {
      const next = [...prev];
      next[questionIndex] = correct;
      return next;
    });
    if (correct) {
      setScore((value) => value + 1);
      playSuccess();
    } else {
      playMiss();
    }
    setChecked(true);
  };

  const handleNext = () => {
    if (questionIndex < QUESTIONS.length - 1) {
      setQuestionIndex((value) => value + 1);
      setSelected(null);
      setChecked(false);
      return;
    }
    const finalScore = answers.filter(Boolean).length;
    void persistQuizScore(finalScore);
    setScreen('results');
  };

  const resetQuiz = () => {
    setScreen('intro');
    setQuestionIndex(0);
    setSelected(null);
    setChecked(false);
    setScore(0);
    setAnswers(QUESTIONS.map(() => false));
    setSaveError('');
  };

  const result = getResultCopy(score);

  return (
    <div className="min-h-screen bg-[#f6efe4] text-[#3d2914] font-body-md">
      <header className="sticky top-0 z-20 border-b border-[#ead9c4] bg-[#fffaf3]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/semana/1')}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#8a5a2b] shadow-sm"
            aria-label="Volver a la semana 1"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-wide text-[#b7793d]">Semana 1 · Evaluación</p>
            <h1 className="font-headline-md text-lg leading-tight text-[#3d2914]">El Director te pregunta</h1>
          </div>
          {screen === 'quiz' && (
            <div className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#8a5a2b] shadow-sm">
              {points} pts
            </div>
          )}
        </div>
        {screen === 'quiz' && (
          <div className="mx-auto max-w-6xl px-4 pb-3">
            <div className="mb-1 flex justify-between text-xs font-bold text-[#8a5a2b]">
              <span>Pregunta {questionIndex + 1} de {QUESTIONS.length}</span>
              <span>{question.topic}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-[#ead9c4]">
              <div className="h-full rounded-full bg-[#e07a2f] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 py-6">
        {screen === 'intro' && (
          <div className="grid items-center gap-6 rounded-[2rem] bg-white p-6 shadow-sm md:grid-cols-[420px_1fr] md:p-8">
            <img
              src={DIRECTOR}
              alt="El Director celebrando en su oficina"
              className="mx-auto h-[clamp(13rem,62vh,34rem)] w-full max-w-[420px] rounded-3xl object-cover object-[center_15%]"
            />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-[#b7793d]">Bienvenida al laboratorio</p>
              <h2 className="mt-1 font-headline-md text-3xl text-[#3d2914]">¡Hola, explorador!</h2>
              <p className="mt-3 text-base leading-relaxed text-[#5c4632]">
                Soy el Director. Hoy vamos a recordar los tres minijuegos de la semana:
                <strong> Rescata a Pulgarcito</strong>, <strong>Ordenar por tamaño</strong> y
                <strong> Descubre el objeto</strong>.
              </p>
              <ul className="mt-4 space-y-2 text-sm text-[#5c4632]">
                <li>10 preguntas, tocadas con el dedo. No hay que escribir.</li>
                <li>Cada acierto vale {POINTS_PER_QUESTION} puntos. El máximo es {QUESTIONS.length * POINTS_PER_QUESTION}.</li>
                <li>Yo estaré a un lado con una pista, por si la necesitas.</li>
              </ul>
              <button
                type="button"
                onClick={() => setScreen('quiz')}
                className="mt-6 rounded-full bg-[#e07a2f] px-6 py-3 font-bold text-white shadow-md"
              >
                ¡Empezar el quiz!
              </button>
            </div>
          </div>
        )}

        {screen === 'quiz' && question && (
          <div className="grid gap-5 lg:grid-cols-[420px_1fr]">
            <aside className="order-2 rounded-[2rem] bg-[#fff8ee] p-4 shadow-sm lg:order-1">
              <img
                src={DIRECTOR}
                alt="El Director"
                className="mx-auto h-[clamp(8rem,22vh,26rem)] w-full rounded-2xl object-cover object-[center_20%] lg:h-[clamp(9rem,36vh,26rem)]"
              />
              <p className="mt-3 text-center font-headline-md text-lg">El Director</p>
              <p className="mt-2 rounded-2xl bg-white p-3 text-sm leading-relaxed text-[#5c4632]">
                <span className="font-bold text-[#b7793d]">Pista: </span>
                {question.hint}
              </p>
            </aside>

            <div className="order-1 rounded-[2rem] bg-white p-5 shadow-sm md:p-7 lg:order-2">
              <h2 className="font-headline-md text-2xl leading-snug text-[#3d2914]">{question.prompt}</h2>
              <div className="mt-5 space-y-3">
                {question.options.map((option, index) => {
                  const isSelected = selected === index;
                  const isCorrect = index === question.correctIndex;
                  let tone = 'border-[#ead9c4] bg-[#fffaf3]';
                  if (checked && isCorrect) tone = 'border-emerald-500 bg-emerald-50';
                  else if (checked && isSelected) tone = 'border-rose-400 bg-rose-50';
                  else if (isSelected) tone = 'border-[#e07a2f] bg-[#fff1e4]';
                  return (
                    <button
                      key={option.label}
                      type="button"
                      disabled={checked}
                      onClick={() => setSelected(index)}
                      className={`flex w-full items-center gap-3 rounded-2xl border-2 px-4 py-3 text-left ${tone}`}
                    >
                      <span className="text-2xl" aria-hidden="true">{option.emoji}</span>
                      <span className="flex-1 font-semibold">{option.label}</span>
                      {checked && isCorrect && <span className="material-symbols-outlined text-emerald-600">check_circle</span>}
                      {checked && isSelected && !isCorrect && <span className="material-symbols-outlined text-rose-500">cancel</span>}
                    </button>
                  );
                })}
              </div>

              {checked && (
                <p className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${selected === question.correctIndex ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                  {selected === question.correctIndex
                    ? '¡Correcto! Sumaste 10 puntos.'
                    : `Casi. La respuesta es: ${question.options[question.correctIndex].label}.`}
                </p>
              )}

              <div className="mt-5 flex justify-end">
                {!checked ? (
                  <button
                    type="button"
                    disabled={selected === null}
                    onClick={handleCheck}
                    className="rounded-full bg-[#e07a2f] px-6 py-3 font-bold text-white disabled:opacity-40"
                  >
                    Comprobar
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full bg-[#3d2914] px-6 py-3 font-bold text-white"
                  >
                    {questionIndex === QUESTIONS.length - 1 ? 'Ver resultados y trofeo' : 'Siguiente pregunta'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {screen === 'results' && (
          <div className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
            <div className="grid items-center gap-6 md:grid-cols-[340px_1fr]">
              <img
                src={DIRECTOR}
                alt="El Director celebrando"
                className="mx-auto h-[clamp(10rem,36vh,24rem)] w-full max-w-[340px] rounded-3xl object-cover object-[center_18%]"
              />
              <div>
                <div className="flex gap-1 text-3xl text-amber-400" aria-label={`${result.stars} de 3 estrellas`}>
                  {[0, 1, 2].map((star) => (
                    <span key={star} className="material-symbols-outlined" style={{ fontVariationSettings: star < result.stars ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  ))}
                </div>
                <h2 className="mt-2 font-headline-md text-3xl">{result.title}</h2>
                <p className="mt-2 text-[#5c4632]">{result.message}</p>
                <p className="mt-3 text-lg font-bold text-[#8a5a2b]">
                  {points} de {QUESTIONS.length * POINTS_PER_QUESTION} puntos · {score} de {QUESTIONS.length} aciertos
                </p>
              </div>
            </div>

            {saveError && (
              <p className="mt-4 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-800">{saveError}</p>
            )}

            <ul className="mt-6 space-y-2">
              {QUESTIONS.map((item, index) => (
                <li key={item.prompt} className="flex items-start gap-3 rounded-2xl bg-[#fffaf3] px-4 py-3">
                  <span className={`material-symbols-outlined ${answers[index] ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {answers[index] ? 'check_circle' : 'cancel'}
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase text-[#b7793d]">{item.topic}</p>
                    <p className="text-sm">{item.prompt}</p>
                    <p className="text-sm font-semibold text-[#5c4632]">
                      {answers[index] ? '+10 pts' : '0 pts'} · {item.options[item.correctIndex].label}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" onClick={resetQuiz} className="rounded-full bg-[#e07a2f] px-6 py-3 font-bold text-white">
                Volver a intentar
              </button>
              <button type="button" onClick={() => navigate('/semana/1')} className="rounded-full bg-[#3d2914] px-6 py-3 font-bold text-white">
                Volver a la semana
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
