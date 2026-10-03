import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveQuizScoreForSemanaNumber } from '../services/api';
import { playFanfare, playMiss, playSuccess, playWhoosh } from '../services/sounds';
import { showKidMessage } from '../components/KidFrame';
import { S4Button, S4Confetti, S4Image, S4Page } from '../components/Semana4Ui';

const QUESTIONS = [
  {
    text: 'El oxígeno puede poner café a una fruta cortada.',
    ans: true,
    icon: 'apple',
    msg: 'Sí. El aire toca la fruta y la oxida.',
  },
  {
    text: 'Para frenar a Óxido, sirve el limón o tapar la fruta.',
    ans: true,
    icon: 'eco',
    msg: 'Correcto. Menos aire, menos oxidación.',
  },
  {
    text: 'Fermi suelta humo de fuego cuando come azúcar.',
    ans: false,
    icon: 'bakery_dining',
    msg: 'Falso. Suelta un gas llamado CO₂, no humo.',
  },
  {
    text: 'El pan, el yogurt y el queso pueden nacer con fermentación.',
    ans: true,
    icon: 'lunch_dining',
    msg: '¡Exacto! Fermi ayuda a crear esos alimentos.',
  },
  {
    text: 'El jabón es un ácido como el limón.',
    ans: false,
    icon: 'soap',
    msg: 'Falso. El jabón es básico. El limón sí es ácido.',
  },
  {
    text: 'El agua pura está en el 7 de la escala de pH.',
    ans: true,
    icon: 'water_drop',
    msg: 'Sí. Ni muy ácido ni muy básico: justo en el medio.',
  },
  {
    text: 'Una barra luminosa necesita pilas para brillar.',
    ans: false,
    icon: 'bolt',
    msg: 'No. Brilla por una reacción química, sin calor ni electricidad.',
  },
  {
    text: 'Las luciérnagas también hacen luz fría, como Lumi.',
    ans: true,
    icon: 'emoji_nature',
    msg: '¡Así es! Se llama quimioluminiscencia.',
  },
  {
    text: 'Después de quemar un papel, las cenizas pueden volver a ser papel.',
    ans: false,
    icon: 'delete_forever',
    msg: 'No. La combustión no se puede deshacer.',
  },
  {
    text: 'Para que haya fuego hacen falta combustible, oxígeno y calor.',
    ans: true,
    icon: 'local_fire_department',
    msg: '¡El triángulo del fuego! Si falta uno, no hay llama.',
  },
];

export default function Semana4QuizPage() {
  const navigate = useNavigate();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [started, setStarted] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [saveError, setSaveError] = useState('');

  const totalQuestions = QUESTIONS.length;
  const currentQ = QUESTIONS[currentIdx];

  const persistQuizScore = async (finalScore: number) => {
    const stored = localStorage.getItem('plataforma_user');
    if (!stored) {
      setSaveStatus('error');
      setSaveError('No hay usuario activo para guardar la puntuación.');
      return;
    }

    const user = JSON.parse(stored) as { id: string };
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    setSaveStatus('saving');
    setSaveError('');

    try {
      await saveQuizScoreForSemanaNumber({ userId: user.id, semanaNumber: 4, score: percentage });
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error guardando quiz Semana 4:', error);
      setSaveStatus('error');
      setSaveError('No se pudo guardar tu puntuación. Intenta de nuevo más tarde.');
      showKidMessage('No se pudo guardar tu nota. Intenta otra vez.', 'soon');
    }
  };

  const handleAnswer = (choice: boolean) => {
    if (showFeedback) return;
    setSelectedAnswer(choice);
    setShowFeedback(true);
    if (choice === currentQ.ans) {
      setScore((prev) => prev + 1);
      playSuccess();
    } else {
      playMiss();
    }
  };

  const nextQuestion = () => {
    playWhoosh();
    setShowFeedback(false);
    setSelectedAnswer(null);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      persistQuizScore(score);
      playFanfare();
      setQuizFinished(true);
    }
  };

  return (
    <S4Page
      title="Semana 4 · Quiz"
      onBack={() => navigate('/semana/4')}
      badge={
        started && !quizFinished ? (
          <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">
            {currentIdx + 1}/{totalQuestions}
          </span>
        ) : undefined
      }
    >
      {!started ? (
        <article className="s4-card-live relative mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-[2rem] border-2 border-[#0f766e] bg-[#ecfeff] p-6 text-center shadow-[10px_10px_0_#99f6e4] md:p-10">
          <span className="s4-card-shine" aria-hidden="true" />
          <span className="s4-pulse rounded-full bg-[#0f766e] px-4 py-1 text-[11px] font-black uppercase tracking-[0.2em] text-[#d9f99d]">
            Reto final
          </span>
          <S4Image
            src="/images/semana4/quiz-hero.jpg"
            alt="Héroe del quiz"
            filename="quiz-hero.jpg"
            hint="Científico niño o medalla"
            className="s4-float h-52 w-52 rounded-[2rem] border-4 border-white bg-white shadow-[6px_6px_0_#99f6e4]"
          />
          <h2 className="font-headline-lg text-3xl font-black text-[#12263a]">¡Quiz de los 5 tubos!</h2>
          <p className="font-body-lg text-[#1f3a40]">
            10 preguntas de verdadero o falso. Cada acierto suma para tu nota final.
          </p>
          <S4Button
            className="s4-pulse w-full max-w-xs"
            onClick={() => {
              playWhoosh();
              setStarted(true);
            }}
          >
            ¡Empezar quiz!
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
          </S4Button>
        </article>
      ) : !quizFinished ? (
        <div className="mx-auto max-w-2xl space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-black text-[#0f766e]">
              <span>Pregunta {currentIdx + 1} de {totalQuestions}</span>
              <span>{score} aciertos</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#99f6e4]">
              <div className="h-full bg-[#0f766e] transition-all duration-500" style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }} />
            </div>
          </div>

          <article className="s4-pop relative min-h-[22rem] rounded-[2rem] border-2 border-[#0f766e] bg-[#ecfeff] p-6 text-center shadow-[8px_8px_0_#99f6e4] md:p-8">
            <div className="s4-float mx-auto mb-4 flex h-20 w-20 items-center justify-center bg-[#d9f99d] text-[#115e59]" style={{ clipPath: 'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)' }}>
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {currentQ.icon}
              </span>
            </div>
            <h2 className="font-headline-md text-2xl font-black leading-snug text-[#12263a]">{currentQ.text}</h2>
            <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
              <S4Button onClick={() => handleAnswer(true)} color="#0f766e" dark="#115e59" className="w-full py-5">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                Verdadero
              </S4Button>
              <S4Button onClick={() => handleAnswer(false)} color="#d64545" dark="#8f1f1f" className="w-full py-5">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                Falso
              </S4Button>
            </div>

            {showFeedback && (
              <div className={`absolute inset-3 z-20 flex flex-col items-center justify-center rounded-[1.5rem] border-2 border-[#0f766e] bg-[#ecfeff] p-6 text-center ${selectedAnswer === currentQ.ans ? '' : 's4-shake'}`}>
                <div className={`mb-3 flex h-20 w-20 items-center justify-center ${selectedAnswer === currentQ.ans ? 's4-stamp bg-[#d9f99d] text-[#115e59]' : 'bg-[#ffe4e6] text-[#9f1239]'}`}>
                  <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {selectedAnswer === currentQ.ans ? 'verified' : 'sentiment_dissatisfied'}
                  </span>
                </div>
                <h3 className={`text-2xl font-black ${selectedAnswer === currentQ.ans ? 'text-[#0f766e]' : 'text-[#9f1239]'}`}>
                  {selectedAnswer === currentQ.ans ? '¡Excelente!' : '¡Casi!'}
                </h3>
                <p className="mt-2 max-w-md font-body-md text-[#434841]">{currentQ.msg}</p>
                <S4Button onClick={nextQuestion} className="mt-5">Continuar</S4Button>
              </div>
            )}
          </article>
        </div>
      ) : (
        <article className="s4-pop relative mx-auto flex w-full max-w-xl flex-col items-center gap-5 rounded-[2rem] border-2 border-[#0f766e] bg-[#ecfeff] p-6 text-center shadow-[10px_10px_0_#99f6e4] md:p-10">
          <S4Confetti />
          <S4Image
            src="/images/semana4/quiz-badge.jpg"
            alt="Medalla"
            filename="quiz-badge.jpg"
            hint="Medalla o copa"
            className="s4-stamp h-40 w-40 rounded-[2rem] border-4 border-white bg-white shadow-[6px_6px_0_#99f6e4]"
          />
          <h2 className="font-headline-lg text-3xl font-black text-[#12263a]">¡Felicidades, joven científico!</h2>
          <p className="font-body-lg text-[#1f3a40]">Completaste el laboratorio de Propiedades Químicas.</p>
          <div className="w-full max-w-xs rounded-3xl border-2 border-[#0f766e] bg-white p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#0f766e]">Tu calificación</p>
            <p className="text-5xl font-black text-[#12263a]">{score}/{totalQuestions}</p>
          </div>
          {saveStatus === 'saving' || saveStatus === 'idle' ? (
            <p className="flex items-center gap-2 font-bold text-[#0f766e]">
              <span className="material-symbols-outlined animate-spin text-sm">sync</span>
              Guardando tu resultado...
            </p>
          ) : saveStatus === 'saved' ? (
            <p className="flex items-center gap-2 font-bold text-[#2f4a2f]">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              Tu resultado se ha guardado con éxito
            </p>
          ) : (
            <p className="flex items-center gap-2 font-bold text-[#8f1f1f]">
              <span className="material-symbols-outlined text-sm">error</span>
              {saveError}
            </p>
          )}
          <S4Button onClick={() => navigate('/semana/4')} className="w-full max-w-xs">
            Volver al laboratorio
          </S4Button>
        </article>
      )}
    </S4Page>
  );
}
