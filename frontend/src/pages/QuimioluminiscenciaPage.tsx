import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import { playCrack, playLevelUp, playMiss, playSparkle, playSuccess, playWhoosh } from '../services/sounds';
import { S4Clear, S4Confetti, S4Image, S4Levels, S4Page, S4Welcome } from '../components/Semana4Ui';

export default function QuimioluminiscenciaPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'play'>('welcome');
  const [level, setLevel] = useState(1);
  const [clear, setClear] = useState(false);
  const [wrong, setWrong] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [bugs, setBugs] = useState<number[]>([]);

  const [isActivated, setIsActivated] = useState(false);
  const [topProgress, setTopProgress] = useState(0);
  const [bottomProgress, setBottomProgress] = useState(0);
  const [isDraggingTop, setIsDraggingTop] = useState(false);
  const [isDraggingBottom, setIsDraggingBottom] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetStick = () => {
    setIsActivated(false);
    setTopProgress(0);
    setBottomProgress(0);
  };

  const resetLevel = () => {
    setClear(false);
    setWrong(false);
    setPicked(null);
    setBugs([]);
    resetStick();
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

  const fail = (id?: string) => {
    playMiss();
    setPicked(id ?? null);
    setWrong(true);
    window.setTimeout(() => setWrong(false), 450);
  };

  const next = () => {
    playWhoosh();
    if (level >= 5) {
      showKidMessage('¡Completaste los 5 niveles de luz mágica!');
      navigate('/semana/4');
      return;
    }
    setLevel((n) => n + 1);
    resetLevel();
  };

  useEffect(() => {
    if (isActivated || level !== 1) return;
    if (topProgress >= 80 && bottomProgress >= 80) {
      setIsActivated(true);
      playCrack();
      playSparkle();
      win();
    }
  }, [topProgress, bottomProgress, isActivated, level]);

  const handleStickClick = () => {
    if (isActivated || clear) return;
    setTopProgress((prev) => Math.min(100, prev + 34));
    setBottomProgress((prev) => Math.min(100, prev + 34));
  };

  const dragTop = (e: React.PointerEvent<HTMLDivElement>, moving: boolean) => {
    if (isActivated) return;
    if (!moving) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDraggingTop(true);
      return;
    }
    if (!isDraggingTop || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setTopProgress(Math.min(100, Math.max(0, ((e.clientY - rect.top) / (rect.height / 2)) * 100)));
  };

  const dragBottom = (e: React.PointerEvent<HTMLDivElement>, moving: boolean) => {
    if (isActivated) return;
    if (!moving) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDraggingBottom(true);
      return;
    }
    if (!isDraggingBottom || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setBottomProgress(Math.min(100, Math.max(0, ((rect.height - (e.clientY - rect.top)) / (rect.height / 2)) * 100)));
  };

  return (
    <S4Page
      title="Semana 4 · Luz mágica"
      onBack={handleBack}
      badge={screen === 'play' ? <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">Tubo {level}/5</span> : undefined}
    >
      {screen === 'welcome' ? (
        <S4Welcome
          badge="Misión 4"
          title="Lumi y la luz mágica"
          text="5 niveles: dobla la barra, compara con las luciérnagas y enciende la noche."
          src="/images/semana4/lumi-personaje.jpg"
          filename="lumi-personaje.jpg"
          hint="Lumi brillante"
          cta="¡Nivel 1!"
          accent="#5b6fd6"
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
              color="#5b6fd6"
              title={level === 5 ? '¡La noche brilla!' : `¡Nivel ${level} superado!`}
              text={
                level === 1
                  ? '¡CRAAACK! Luz fría, sin calor.'
                  : level === 2
                    ? 'No necesita fuego ni pilas.'
                    : level === 3
                      ? 'Las luciérnagas brillan igual.'
                      : level === 4
                        ? 'Dos líquidos se mezclan.'
                        : 'Tres luciérnagas encendidas.'
              }
              onNext={next}
            />
          ) : (
            <>
              {level === 1 && (
                <section className="s4-pop rounded-[2rem] border-[3px] border-[#3341a3] bg-[#1b1f4a] p-6 text-center text-white">
                  <h2 className="font-headline-md text-2xl font-extrabold">Dobla la barra</h2>
                  <p className="text-sm text-[#dce2ff]">Arrastra los extremos o tócala 3 veces</p>
                  <div className="mt-6 flex justify-center">
                    <div ref={containerRef} onClick={handleStickClick} className="relative flex h-[280px] w-44 cursor-pointer items-center justify-center select-none touch-none">
                      <div className="relative h-64 w-16">
                        <div
                          className="absolute left-0 top-0 z-10 h-32 w-16"
                          style={{
                            transform: `rotate(${isActivated ? 0 : -15 * (topProgress / 100)}deg)`,
                            transformOrigin: 'bottom center',
                            transition: isDraggingTop ? 'none' : 'transform 0.3s ease-out',
                          }}
                        >
                          <div className={`h-full w-full overflow-hidden rounded-t-full border-4 border-b-0 border-white/50 ${isActivated ? 's4-glow' : ''}`} style={{ background: isActivated ? 'radial-gradient(circle, #c2e1be 0%, #5b6fd6 100%)' : '#2a3170' }} />
                          {!isActivated && (
                            <div
                              onPointerDown={(e) => dragTop(e, false)}
                              onPointerMove={(e) => dragTop(e, true)}
                              onPointerUp={() => setIsDraggingTop(false)}
                              onPointerCancel={() => setIsDraggingTop(false)}
                              className="absolute -top-8 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#5b6fd6]"
                            >
                              <span className="material-symbols-outlined pointer-events-none">keyboard_double_arrow_down</span>
                            </div>
                          )}
                        </div>
                        <div
                          className="absolute left-0 top-32 z-10 h-32 w-16"
                          style={{
                            transform: `rotate(${isActivated ? 0 : 15 * (bottomProgress / 100)}deg)`,
                            transformOrigin: 'top center',
                            transition: isDraggingBottom ? 'none' : 'transform 0.3s ease-out',
                          }}
                        >
                          <div className={`h-full w-full overflow-hidden rounded-b-full border-4 border-t-0 border-white/50 ${isActivated ? 's4-glow' : ''}`} style={{ background: isActivated ? 'radial-gradient(circle, #c2e1be 0%, #5b6fd6 100%)' : '#2a3170' }} />
                          {!isActivated && (
                            <div
                              onPointerDown={(e) => dragBottom(e, false)}
                              onPointerMove={(e) => dragBottom(e, true)}
                              onPointerUp={() => setIsDraggingBottom(false)}
                              onPointerCancel={() => setIsDraggingBottom(false)}
                              className="absolute -bottom-8 left-1/2 z-30 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full bg-[#5b6fd6]"
                            >
                              <span className="material-symbols-outlined pointer-events-none">keyboard_double_arrow_up</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {level === 2 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#3341a3]">¿La barra necesita calor o pilas para brillar?</h2>
                  <div className="grid grid-cols-2 gap-3">
                    <button type="button" onClick={() => fail('si')} className={`s4-choice rounded-3xl border-[3px] bg-white py-6 text-xl font-black ${wrong && picked === 'si' ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}>Sí</button>
                    <button type="button" onClick={win} className="s4-choice rounded-3xl border-[3px] border-[#d8c7aa] bg-white py-6 text-xl font-black">No</button>
                  </div>
                </section>
              )}

              {level === 3 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#3341a3]">¿Quién brilla como Lumi?</h2>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {[
                      { id: 'luci', label: 'Luciérnaga', ok: true, filename: 'luciernaga.jpg', hint: 'Luciérnaga de noche', src: '/images/semana4/luciernaga.jpg' },
                      { id: 'vela', label: 'Vela', ok: false, filename: 'vela.jpg', hint: 'Vela con fuego', src: '/images/semana4/vela.jpg' },
                      { id: 'lampara', label: 'Lámpara', ok: false, filename: 'lampara.jpg', hint: 'Lámpara con cable', src: '/images/semana4/lampara.jpg' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => (item.ok ? win() : fail(item.id))}
                        className={`s4-choice rounded-3xl border-[3px] bg-white p-3 ${wrong && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        <S4Image src={item.src} alt={item.label} filename={item.filename} hint={item.hint} className="h-36 w-full rounded-2xl bg-[#eef0ff]" />
                        <span className="mt-2 block font-black">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {level === 4 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#3341a3]">Dentro de la barra, ¿qué pasa?</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'mix', label: 'Se mezclan dos líquidos' },
                      { id: 'pila', label: 'Se enciende una pila' },
                      { id: 'fuego', label: 'Se prende un fósforo' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => (item.id === 'mix' ? win() : fail(item.id))}
                        className={`s4-choice rounded-3xl border-[3px] bg-white px-4 py-4 text-lg font-bold ${wrong && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {level === 5 && (
                <section className="s4-pop rounded-[2rem] border-[3px] border-[#3341a3] bg-[#12143a] p-5 text-center text-white">
                  <h2 className="font-headline-md text-2xl font-extrabold">Toca las 3 luciérnagas</h2>
                  <p className="text-sm text-[#dce2ff]">{bugs.length}/3</p>
                  <div className="relative mx-auto mt-4 h-56 max-w-lg">
                    {[
                      { id: 1, top: '10%', left: '8%' },
                      { id: 2, top: '52%', left: '38%' },
                      { id: 3, top: '20%', left: '68%' },
                    ].map((bug) => {
                      const on = bugs.includes(bug.id);
                      return (
                        <button
                          key={bug.id}
                          type="button"
                          onClick={() => {
                            if (on) return;
                            playSparkle();
                            setBugs((prev) => {
                              if (prev.includes(bug.id)) return prev;
                              const nextBugs = [...prev, bug.id];
                              if (nextBugs.length === 3) window.setTimeout(win, 0);
                              return nextBugs;
                            });
                          }}
                          className={`s4-choice absolute flex h-14 w-14 items-center justify-center rounded-full ${on ? 's4-glow' : 's4-pulse'}`}
                          style={{ top: bug.top, left: bug.left }}
                        >
                          <span className="material-symbols-outlined text-4xl" style={{ color: on ? '#ccebc7' : '#8a90c8', fontVariationSettings: "'FILL' 1" }}>
                            emoji_nature
                          </span>
                        </button>
                      );
                    })}
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
