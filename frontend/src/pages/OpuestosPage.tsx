import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import { playLevelUp, playMiss, playPop, playSuccess, playWhoosh } from '../services/sounds';
import { S4Clear, S4Confetti, S4Image, S4Levels, S4Page, S4Welcome } from '../components/Semana4Ui';

type Side = 'acido' | 'basico';

const ALL_ITEMS: { id: string; name: string; side: Side; filename: string; hint: string; src: string; icon?: string }[] = [
  { id: 'limon', name: 'Limón', side: 'acido', filename: 'ejemplo-limon.jpg', hint: 'Limón cortado', src: '/images/semana4/ejemplo-limon.jpg' },
  { id: 'vinagre', name: 'Vinagre', side: 'acido', filename: 'ejemplo-vinagre.jpg', hint: 'Botella de vinagre', src: '/images/semana4/ejemplo-vinagre.jpg' },
  { id: 'naranja', name: 'Naranja', side: 'acido', filename: 'ejemplo-naranja.jpg', hint: 'Naranja agria', src: '/images/semana4/ejemplo-naranja.jpg' },
  { id: 'jabon', name: 'Jabón', side: 'basico', filename: 'ejemplo-jabon.jpg', hint: 'Jabón suave', src: '/images/semana4/ejemplo-jabon.jpg' },
  { id: 'pasta', name: 'Pasta dental', side: 'basico', filename: 'ejemplo-pasta.jpg', hint: 'Pasta dental', src: '/images/semana4/ejemplo-pasta.jpg' },
  { id: 'bicarbonato', name: 'Bicarbonato', side: 'basico', filename: 'ejemplo-bicarbonato.jpg', hint: 'Polvo blanco de bicarbonato', src: '/images/semana4/ejemplo-bicarbonato.jpg' },
];

export default function OpuestosPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'play'>('welcome');
  const [level, setLevel] = useState(1);
  const [picked, setPicked] = useState<string | null>(null);
  const [sorted, setSorted] = useState<Record<string, Side>>({});
  const [shake, setShake] = useState<Side | null>(null);
  const [clear, setClear] = useState(false);
  const [tf, setTf] = useState(0);

  const itemsForLevel = () => {
    if (level === 1) return ALL_ITEMS.filter((item) => item.id === 'limon' || item.id === 'jabon');
    if (level === 2) return ALL_ITEMS.filter((item) => ['limon', 'vinagre', 'jabon', 'pasta'].includes(item.id));
    return ALL_ITEMS;
  };

  const resetLevel = () => {
    setPicked(null);
    setSorted({});
    setShake(null);
    setClear(false);
    setTf(0);
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
      showKidMessage('¡Completaste los 5 niveles de ácidos y bases!');
      navigate('/semana/4');
      return;
    }
    setLevel((n) => n + 1);
    resetLevel();
  };

  const dropOn = (side: Side) => {
    if (!picked || clear) return;
    const item = ALL_ITEMS.find((entry) => entry.id === picked);
    if (!item) return;
    if (item.side === side) {
      playPop();
      const nextSorted = { ...sorted, [item.id]: side };
      setSorted(nextSorted);
      setPicked(null);
      const needed = itemsForLevel();
      if (needed.every((entry) => nextSorted[entry.id])) win();
    } else {
      playMiss();
      setShake(side);
      window.setTimeout(() => setShake(null), 450);
    }
  };

  const remaining = itemsForLevel().filter((item) => !sorted[item.id]);

  return (
    <S4Page
      title="Semana 4 · Ácidos y bases"
      onBack={handleBack}
      badge={screen === 'play' ? <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">Tubo {level}/5</span> : undefined}
    >
      {screen === 'welcome' ? (
        <S4Welcome
          badge="Misión 3"
          title="¡Conoce a los Opuestos!"
          text="5 niveles: clasifica ácidos y bases, y encuentra el 7 del agua."
          src="/images/semana4/senor-acido.jpg"
          filename="senor-acido.jpg"
          hint="Señor Ácido amarillo"
          cta="¡Nivel 1!"
          accent="#d4a017"
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
              color="#d4a017"
              title={level === 5 ? '¡Los opuestos son amigos!' : `¡Nivel ${level} superado!`}
              text={
                level === 1
                  ? 'Limón ácido, jabón básico.'
                  : level === 2
                    ? 'Vinagre también es ácido.'
                    : level === 3
                      ? 'Naranja agria, bicarbonato suave.'
                      : level === 4
                        ? 'El jabón no es ácido.'
                        : 'El agua pura está en el 7.'
              }
              onNext={next}
            />
          ) : level <= 3 ? (
            <section className="s4-pop space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <article className="rounded-[1.5rem] border-[3px] border-[#d4a017] bg-[#fff8d9] p-3 text-center">
                  <S4Image src="/images/semana4/senor-acido.jpg" alt="Señor Ácido" filename="senor-acido.jpg" hint="Cara de limón" className="mx-auto h-32 w-32 rounded-2xl bg-white" />
                  <p className="mt-1 font-black text-[#8a6a0a]">Casa de Ácido</p>
                </article>
                <article className="rounded-[1.5rem] border-[3px] border-[#3e6378] bg-[#e6f4ff] p-3 text-center">
                  <S4Image src="/images/semana4/don-basico.jpg" alt="Don Básico" filename="don-basico.jpg" hint="Suave como jabón" className="mx-auto h-32 w-32 rounded-2xl bg-white" />
                  <p className="mt-1 font-black text-[#3e6378]">Casa de Básico</p>
                </article>
              </div>
              <h2 className="text-center font-headline-md text-xl font-extrabold text-[#8a6a0a]">Toca un objeto y luego su casa</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {remaining.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPicked(item.id)}
                    className={`s4-choice w-32 rounded-2xl border-[3px] bg-[#fff8ee] p-2 ${picked === item.id ? 's4-pulse border-[#d4a017]' : 'border-[#d8c7aa]'}`}
                  >
                    <S4Image src={item.src} alt={item.name} filename={item.filename} hint={item.hint} className="h-24 w-full rounded-xl bg-white" />
                    <span className="mt-1 block text-sm font-bold">{item.name}</span>
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <button type="button" onClick={() => dropOn('acido')} className={`s4-choice rounded-[1.5rem] border-[3px] border-[#d4a017] bg-[#fff8d9] p-4 text-left ${shake === 'acido' ? 's4-shake' : ''}`}>
                  <p className="font-black uppercase text-[#8a6a0a]">Dejar en Ácido</p>
                  <p className="text-sm">{itemsForLevel().filter((item) => sorted[item.id] === 'acido').map((item) => item.name).join(', ') || 'Vacía'}</p>
                </button>
                <button type="button" onClick={() => dropOn('basico')} className={`s4-choice rounded-[1.5rem] border-[3px] border-[#3e6378] bg-[#e6f4ff] p-4 text-left ${shake === 'basico' ? 's4-shake' : ''}`}>
                  <p className="font-black uppercase text-[#3e6378]">Dejar en Básico</p>
                  <p className="text-sm">{itemsForLevel().filter((item) => sorted[item.id] === 'basico').map((item) => item.name).join(', ') || 'Vacía'}</p>
                </button>
              </div>
            </section>
          ) : level === 4 ? (
            <section className="s4-pop space-y-4 text-center">
              <h2 className="font-headline-md text-2xl font-extrabold text-[#8a6a0a]">
                {tf === 0 ? '¿El jabón es ácido?' : '¿El limón es ácido?'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    if (tf === 0) {
                      playMiss();
                      setShake('acido');
                      window.setTimeout(() => setShake(null), 450);
                    } else win();
                  }}
                  className={`s4-choice rounded-3xl border-[3px] bg-white py-6 text-xl font-black ${shake === 'acido' ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                >
                  Sí
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tf === 0) {
                      playPop();
                      setTf(1);
                    } else {
                      playMiss();
                      setShake('basico');
                      window.setTimeout(() => setShake(null), 450);
                    }
                  }}
                  className="s4-choice rounded-3xl border-[3px] border-[#d8c7aa] bg-white py-6 text-xl font-black"
                >
                  No
                </button>
              </div>
              {tf === 1 && <p className="font-bold text-[#4a6549]">¡Bien! El jabón es básico. Ahora el limón…</p>}
            </section>
          ) : (
            <section className="s4-pop space-y-4 text-center">
              <h2 className="font-headline-md text-2xl font-extrabold text-[#8a6a0a]">El agua pura está en el…</h2>
              <p className="text-sm font-bold text-[#5a4630]">Escala de pH: 0 es muy ácido, 14 es muy básico</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: '0', label: '0 · muy ácido', ok: false },
                  { id: '7', label: '7 · en el medio', ok: true },
                  { id: '14', label: '14 · muy básico', ok: false },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      if (item.ok) win();
                      else {
                        playMiss();
                        setShake('acido');
                        window.setTimeout(() => setShake(null), 450);
                      }
                    }}
                    className={`s4-choice rounded-3xl border-[3px] bg-white py-6 font-black ${shake && !item.ok ? 's4-shake' : 'border-[#d8c7aa]'}`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </S4Page>
  );
}
