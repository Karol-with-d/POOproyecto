import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import { playLevelUp, playMiss, playSuccess, playWhoosh } from '../services/sounds';
import { S4Clear, S4Confetti, S4Image, S4Levels, S4Page, S4Welcome } from '../components/Semana4Ui';

type AnswerState = 'idle' | 'wrong' | 'clear';

export default function OxidacionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'play'>('welcome');
  const [level, setLevel] = useState(1);
  const [state, setState] = useState<AnswerState>('idle');
  const [color, setColor] = useState('');
  const [edible, setEdible] = useState<boolean | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const resetLevel = () => {
    setState('idle');
    setColor('');
    setEdible(null);
    setPicked(null);
  };

  const handleBack = () => {
    if (screen === 'play') {
      setScreen('welcome');
      setLevel(1);
      resetLevel();
    } else {
      navigate('/semana/4');
    }
  };

  const win = () => {
    playSuccess();
    playLevelUp();
    setState('clear');
  };

  const fail = () => {
    playMiss();
    setState('wrong');
    window.setTimeout(() => setState('idle'), 500);
  };

  const next = () => {
    playWhoosh();
    if (level >= 5) {
      showKidMessage('¡Completaste los 5 niveles de oxidación!');
      navigate('/semana/4');
      return;
    }
    setLevel((n) => n + 1);
    resetLevel();
  };

  const tryPick = (id: string, correct: string) => {
    if (state === 'clear') return;
    setPicked(id);
    if (id === correct) win();
    else fail();
  };

  return (
    <S4Page
      title="Semana 4 · Oxidación"
      onBack={handleBack}
      badge={screen === 'play' ? <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">Tubo {level}/5</span> : undefined}
    >
      {screen === 'welcome' ? (
        <S4Welcome
          badge="Misión 1"
          title="El Misterio de la Oxidación"
          text="5 niveles: busca la fruta café, descubre al oxígeno y aprende a frenarlo."
          src="/images/semana4/oxido-personaje.jpg"
          filename="oxido-personaje.jpg"
          hint="Personaje Óxido, café y travieso"
          cta="¡Nivel 1!"
          accent="#e07a2f"
          onStart={() => {
            playWhoosh();
            setScreen('play');
            setLevel(1);
            resetLevel();
          }}
        />
      ) : (
        <div className="relative space-y-5">
          {state === 'clear' && <S4Confetti />}
          <S4Levels current={level} />

          {state === 'clear' ? (
            <S4Clear
              last={level === 5}
              color="#e07a2f"
              title={level === 5 ? '¡Laboratorio listo!' : `¡Nivel ${level} superado!`}
              text={
                level === 1
                  ? 'La fruta café ya se oxidó.'
                  : level === 2
                    ? 'El oxígeno es el travieso.'
                    : level === 3
                      ? 'Si está cortada, el aire la toca más.'
                      : level === 4
                        ? 'Café y mejor no comerla.'
                        : 'Limón o taparla frena a Óxido.'
              }
              onNext={next}
            />
          ) : (
            <>
              {level === 1 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#9a4b12]">¿Cuál se puso café?</h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <button type="button" onClick={() => tryPick('fresh', 'oxi')} className={`s4-choice rounded-[1.75rem] border-[3px] bg-[#e8f6e4] p-4 ${state === 'wrong' && picked === 'fresh' ? 's4-shake' : ''}`}>
                      <S4Image src="/images/semana4/pera-fresca.jpg" alt="Pera fresca" filename="pera-fresca.jpg" hint="Pera jugosa" className="mx-auto aspect-square h-auto w-full max-w-[16rem] rounded-2xl bg-white" />
                      <span className="mt-2 block font-black text-[#2f4a2f]">Pera fresca</span>
                    </button>
                    <button type="button" onClick={() => tryPick('oxi', 'oxi')} className="s4-choice rounded-[1.75rem] border-[3px] border-[#e07a2f] bg-[#fff4e6] p-4">
                      <S4Image src="/images/semana4/pera-oxidada.jpg" alt="Pera oxidada" filename="pera-oxidada.jpg" hint="Pera café" className="mx-auto aspect-square h-auto w-full max-w-[16rem] rounded-2xl bg-white" />
                      <span className="mt-2 block font-black text-[#9a4b12]">Pera café</span>
                    </button>
                  </div>
                </section>
              )}

              {level === 2 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#9a4b12]">¿Quién pone café a la fruta?</h2>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'oxigeno', label: 'Oxígeno', icon: 'air' },
                      { id: 'azucar', label: 'Azúcar', icon: 'icecream' },
                      { id: 'fuego', label: 'Fuego', icon: 'local_fire_department' },
                      { id: 'jabon', label: 'Jabón', icon: 'soap' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => tryPick(item.id, 'oxigeno')}
                        className={`s4-choice rounded-3xl border-[3px] bg-white p-4 font-bold ${state === 'wrong' && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        <span className="material-symbols-outlined text-4xl text-[#e07a2f]" style={{ fontVariationSettings: "'FILL' 1" }}>{item.icon}</span>
                        <span className="mt-1 block">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {level === 3 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#9a4b12]">Una manzana cortada se pone café más rápido. ¿Por qué?</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'aire', label: 'Porque el aire la toca más' },
                      { id: 'dulce', label: 'Porque es más dulce' },
                      { id: 'fria', label: 'Porque está fría' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => tryPick(item.id, 'aire')}
                        className={`s4-choice rounded-3xl border-[3px] bg-white px-4 py-4 text-lg font-bold ${state === 'wrong' && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {level === 4 && (
                <section className="s4-pop space-y-4">
                  <h2 className="text-center font-headline-md text-2xl font-extrabold text-[#9a4b12]">Observa la pera oxidada</h2>
                  <S4Image src="/images/semana4/pera-oxidada.jpg" alt="Pera oxidada" filename="pera-oxidada.jpg" hint="Pera café" className="mx-auto h-48 w-64 rounded-3xl border-[3px] border-[#e07a2f] bg-white" />
                  <div className="rounded-3xl bg-[#fff4e6] p-4">
                    <p className="mb-2 font-bold text-[#9a4b12]">Su color es…</p>
                    <div className="flex flex-wrap gap-2">
                      {['Amarillo', 'Verde', 'Café'].map((option) => (
                        <button key={option} type="button" onClick={() => setColor(option)} className={`s4-choice rounded-full border-2 px-4 py-2 font-bold ${color === option ? 'border-[#e07a2f] bg-[#e07a2f] text-white' : 'border-[#d8c7aa] bg-white'}`}>
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#fff4e6] p-4">
                    <p className="mb-2 font-bold text-[#9a4b12]">¿Se ve rica para comer?</p>
                    <div className="grid grid-cols-2 gap-2">
                      <button type="button" onClick={() => setEdible(true)} className={`s4-choice rounded-2xl border-[3px] py-3 font-bold ${edible === true ? 'border-[#4a6549] bg-[#ccebc7]' : 'border-[#d8c7aa] bg-white'}`}>Sí</button>
                      <button type="button" onClick={() => setEdible(false)} className={`s4-choice rounded-2xl border-[3px] py-3 font-bold ${edible === false ? 'border-[#d64545] bg-[#ffe8e8]' : 'border-[#d8c7aa] bg-white'}`}>No</button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (color === 'Café' && edible === false) win();
                      else fail();
                    }}
                    className="s4-btn-lab w-full rounded-full bg-[#e07a2f] py-3 font-black text-white shadow-[4px_4px_0_#9a3412]"
                  >
                    Comprobar
                  </button>
                </section>
              )}

              {level === 5 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#9a4b12]">¿Cómo frenas a Óxido?</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'limon', label: 'Limón o taparla' },
                      { id: 'sol', label: 'Dejarla al sol' },
                      { id: 'soplar', label: 'Soplarle aire' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => tryPick(item.id, 'limon')}
                        className={`s4-choice rounded-3xl border-[3px] bg-white px-4 py-4 text-lg font-bold ${state === 'wrong' && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </div>
      )}
    </S4Page>
  );
}
