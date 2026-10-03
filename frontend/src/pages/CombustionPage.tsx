import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import { playLevelUp, playMiss, playSizzle, playSuccess, playWhoosh } from '../services/sounds';
import { S4Clear, S4Confetti, S4Image, S4Levels, S4Page, S4Welcome } from '../components/Semana4Ui';

const STAGES = [
  { id: 1, label: 'Papel', filename: 'combustion-papel.jpg', hint: 'Hoja de papel', src: '/images/semana4/combustion-papel.jpg' },
  { id: 2, label: 'Fuego', filename: 'combustion-fuego.jpg', hint: 'Llama naranja', src: '/images/semana4/combustion-fuego.jpg' },
  { id: 3, label: 'Humo', filename: 'combustion-humo.jpg', hint: 'Humo gris', src: '/images/semana4/combustion-humo.jpg' },
  { id: 4, label: 'Cenizas', filename: 'combustion-cenizas.jpg', hint: 'Montón de cenizas', src: '/images/semana4/combustion-cenizas.jpg' },
];

export default function CombustionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'play'>('welcome');
  const [level, setLevel] = useState(1);
  const [stage, setStage] = useState(1);
  const [clear, setClear] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);

  const goal = level === 1 ? 2 : level === 2 ? 3 : 4;

  const resetLevel = () => {
    setStage(1);
    setClear(false);
    setWrong(false);
    setPicked([]);
  };

  const handleBack = () => {
    if (screen === 'play') {
      setScreen('welcome');
      setLevel(1);
      resetLevel();
    } else navigate('/semana/4');
  };

  const win = () => {
    playSuccess();
    playLevelUp();
    setClear(true);
  };

  const next = () => {
    playWhoosh();
    if (level >= 5) {
      showKidMessage('¡Completaste los 5 niveles de combustión!');
      navigate('/semana/4');
      return;
    }
    setLevel((n) => n + 1);
    resetLevel();
  };

  const advance = () => {
    if (clear) return;
    playSizzle();
    if (stage >= goal) {
      win();
      return;
    }
    setStage((n) => n + 1);
  };

  const current = STAGES.find((item) => item.id === stage) ?? STAGES[0];

  return (
    <S4Page
      title="Semana 4 · Combustión"
      onBack={handleBack}
      badge={screen === 'play' ? <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">Tubo {level}/5</span> : undefined}
    >
      {screen === 'welcome' ? (
        <S4Welcome
          badge="Misión 5"
          title="El Gran Drama Químico"
          text="5 niveles: mira el fuego, descubre que no se puede deshacer y arma el triángulo del fuego."
          src="/images/semana4/combus-personaje.jpg"
          filename="combus-personaje.jpg"
          hint="Combus de fuego"
          cta="¡Nivel 1!"
          accent="#d64545"
          onStart={() => {
            playWhoosh();
            setScreen('play');
            setLevel(1);
            resetLevel();
          }}
        />
      ) : (
        <div className="relative space-y-5">
          {clear && <S4Confetti />}
          <S4Levels current={level} />

          {clear ? (
            <S4Clear
              last={level === 5}
              color="#d64545"
              title={level === 5 ? '¡Drama completo!' : `¡Nivel ${level} superado!`}
              text={
                level === 1
                  ? 'El papel se volvió fuego.'
                  : level === 2
                    ? 'Luego salió humo.'
                    : level === 3
                      ? 'Al final solo quedan cenizas.'
                      : level === 4
                        ? 'Ese cambio ya no se deshace.'
                        : 'Fuego = combustible + oxígeno + calor.'
              }
              onNext={next}
            />
          ) : level <= 3 ? (
            <section className="s4-pop s4-choice cursor-pointer rounded-[2rem] border-[3px] border-[#d64545] bg-[#fff4e6] p-5 text-center" onClick={advance}>
              <S4Image
                src="/images/semana4/combus-personaje.jpg"
                alt="Combus"
                filename="combus-personaje.jpg"
                hint="Personaje de fuego"
                className="s4-wiggle mx-auto mb-3 h-32 w-32 rounded-2xl bg-[#ffe8e8]"
              />
              <div className="mb-3 flex justify-center gap-2">
                {STAGES.slice(0, goal).map((item) => (
                  <span key={item.id} className={`rounded-full px-3 py-1 text-xs font-black uppercase ${item.id === stage ? 'bg-[#d64545] text-white' : 'bg-white text-[#5a4630]'}`}>
                    {item.label}
                  </span>
                ))}
              </div>
              <h2 className="font-headline-md text-2xl font-extrabold text-[#8f1f1f]">{current.label}</h2>
              <S4Image src={current.src} alt={current.label} filename={current.filename} hint={current.hint} className="mx-auto mt-3 h-56 w-full max-w-md rounded-[1.5rem] border-[3px] border-white bg-white" />
              <p className="mt-4 font-bold text-[#8f1f1f]">
                Toca para {stage >= goal ? 'terminar el drama' : 'seguir la transformación'}
              </p>
            </section>
          ) : level === 4 ? (
            <section className="s4-pop space-y-4 text-center">
              <h2 className="font-headline-md text-2xl font-extrabold text-[#8f1f1f]">¿Las cenizas pueden volver a ser papel?</h2>
              <S4Image src="/images/semana4/combustion-cenizas.jpg" alt="Cenizas" filename="combustion-cenizas.jpg" hint="Cenizas" className="mx-auto h-44 w-56 rounded-3xl border-[3px] border-[#d64545] bg-white" />
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playMiss();
                    setWrong(true);
                    window.setTimeout(() => setWrong(false), 450);
                  }}
                  className={`s4-choice rounded-3xl border-[3px] bg-white py-6 text-xl font-black ${wrong ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                >
                  Sí
                </button>
                <button type="button" onClick={win} className="s4-choice rounded-3xl border-[3px] border-[#d8c7aa] bg-white py-6 text-xl font-black">
                  No
                </button>
              </div>
            </section>
          ) : (
            <section className="s4-pop space-y-4 text-center">
              <h2 className="font-headline-md text-2xl font-extrabold text-[#8f1f1f]">Toca las 3 cosas del fuego</h2>
              <p className="text-sm font-bold text-[#5a4630]">{picked.length}/3</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {[
                  { id: 'papel', label: 'Combustible', icon: 'description', ok: true },
                  { id: 'aire', label: 'Oxígeno', icon: 'air', ok: true },
                  { id: 'calor', label: 'Calor', icon: 'local_fire_department', ok: true },
                  { id: 'agua', label: 'Agua', icon: 'water_drop', ok: false },
                  { id: 'sombra', label: 'Sombra', icon: 'dark_mode', ok: false },
                ].map((item) => {
                  const on = picked.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (!item.ok) {
                          playMiss();
                          setWrong(true);
                          window.setTimeout(() => setWrong(false), 450);
                          return;
                        }
                        if (on) return;
                        playSizzle();
                        setPicked((prev) => {
                          if (prev.includes(item.id)) return prev;
                          const nextPicked = [...prev, item.id];
                          if (nextPicked.length === 3) window.setTimeout(win, 0);
                          return nextPicked;
                        });
                      }}
                      className={`s4-choice rounded-3xl border-[3px] p-4 ${on ? 'border-[#d64545] bg-[#ffe8e8]' : wrong && !item.ok ? 's4-shake border-[#d64545] bg-white' : 'border-[#d8c7aa] bg-white'}`}
                    >
                      <span className="material-symbols-outlined text-3xl text-[#d64545]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                      <span className="mt-1 block font-black">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      )}
    </S4Page>
  );
}
