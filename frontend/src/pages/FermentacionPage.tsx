import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showKidMessage } from '../components/KidFrame';
import { playBubble, playLevelUp, playMiss, playSuccess, playWhoosh } from '../services/sounds';
import { S4Button, S4Clear, S4Confetti, S4Image, S4Levels, S4Page, S4Welcome } from '../components/Semana4Ui';

const FOODS = [
  { id: 'pan', label: 'Pan', icon: 'bakery_dining', ok: true },
  { id: 'yogurt', label: 'Yogurt', icon: 'icecream', ok: true },
  { id: 'queso', label: 'Queso', icon: 'lunch_dining', ok: true },
  { id: 'galleta', label: 'Galleta', icon: 'cookie', ok: false },
  { id: 'agua', label: 'Agua', icon: 'water_drop', ok: false },
];

const STEPS = [
  { id: 'festin', label: 'El festín', hint: 'Fermi come azúcar' },
  { id: 'burbujas', label: 'Burbujas', hint: 'Sale gas CO₂' },
  { id: 'magia', label: 'Magia', hint: 'El pan crece' },
];

export default function FermentacionPage() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<'welcome' | 'play'>('welcome');
  const [level, setLevel] = useState(1);
  const [feeds, setFeeds] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [wrong, setWrong] = useState(false);
  const [clear, setClear] = useState(false);
  const [order, setOrder] = useState<string[]>([]);
  const [foods, setFoods] = useState<string[]>([]);

  const resetLevel = () => {
    setFeeds(0);
    setPicked(null);
    setWrong(false);
    setClear(false);
    setOrder([]);
    setFoods([]);
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

  const fail = () => {
    playMiss();
    setWrong(true);
    window.setTimeout(() => setWrong(false), 450);
  };

  const next = () => {
    playWhoosh();
    if (level >= 5) {
      showKidMessage('¡Completaste los 5 niveles de fermentación!');
      navigate('/semana/4');
      return;
    }
    setLevel((n) => n + 1);
    resetLevel();
  };

  const feed = (need: number) => {
    playBubble();
    setFeeds((prev) => {
      const nextFeeds = Math.min(need, prev + 1);
      if (nextFeeds >= need && prev < need) {
        window.setTimeout(win, 0);
      }
      return nextFeeds;
    });
  };

  return (
    <S4Page
      title="Semana 4 · Fermentación"
      onBack={handleBack}
      badge={screen === 'play' ? <span className="rounded-full bg-[#d9f99d] px-3 py-1 text-xs font-black text-[#115e59]">Tubo {level}/5</span> : undefined}
    >
      {screen === 'welcome' ? (
        <S4Welcome
          badge="Misión 2"
          title="La Magia de la Fermentación"
          text="5 niveles con Fermi: aliméntalo, adivina el gas y encuentra los alimentos mágicos."
          src="/images/semana4/fermi-personaje.jpg"
          filename="fermi-personaje.jpg"
          hint="Fermi, levadura feliz"
          cta="¡Nivel 1!"
          accent="#4a6549"
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
              title={level === 5 ? '¡Fermi está feliz!' : `¡Nivel ${level} superado!`}
              text={
                level === 1
                  ? 'El azúcar despierta las burbujas.'
                  : level === 2
                    ? 'El gas se llama CO₂.'
                    : level === 3
                      ? 'Festín, burbujas y magia.'
                      : level === 4
                        ? 'Pan, yogurt y queso fermentan.'
                        : 'El pan creció gracias a Fermi.'
              }
              onNext={next}
            />
          ) : (
            <>
              {(level === 1 || level === 5) && (
                <section className="s4-pop relative overflow-hidden rounded-[2rem] border-[3px] border-[#4a6549] bg-white/90 p-5 text-center">
                  <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                    {Array.from({ length: feeds }).map((_, i) => (
                      <span
                        key={i}
                        className="absolute bottom-8 rounded-full bg-[#b0cfac]"
                        style={{
                          left: `${14 + (i * 13) % 70}%`,
                          width: 12 + (i % 3) * 6,
                          height: 12 + (i % 3) * 6,
                          animation: `s4-bubble ${2 + (i % 3) * 0.3}s ease-in infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <S4Image
                    src="/images/semana4/fermi-personaje.jpg"
                    alt="Fermi"
                    filename="fermi-personaje.jpg"
                    hint="Levadura feliz"
                    className="s4-float relative z-10 mx-auto h-48 w-48 rounded-full border-8 border-[#ccebc7] bg-[#e8f6e4]"
                  />
                  {level === 5 && (
                    <S4Image
                      src="/images/semana4/fermentacion-pan.jpg"
                      alt="Pan"
                      filename="fermentacion-pan.jpg"
                      hint="Pan que crece"
                      className="relative z-10 mx-auto mt-3 h-36 w-56 rounded-2xl border-[3px] border-white bg-white"
                    />
                  )}
                  <h2 className="relative z-10 mt-3 font-headline-md text-2xl font-extrabold text-[#2f4a2f]">
                    {level === 1 ? 'Dale 3 azúcares a Fermi' : '¡Infla el pan! Dale 5 azúcares'}
                  </h2>
                  <p className="relative z-10 font-bold text-[#4a6549]">{feeds}/{level === 1 ? 3 : 5}</p>
                  <S4Button className="relative z-10 mt-3" onClick={() => feed(level === 1 ? 3 : 5)}>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bakery_dining</span>
                    Darle azúcar
                  </S4Button>
                </section>
              )}

              {level === 2 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#2f4a2f]">¿Qué gas suelta Fermi?</h2>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { id: 'co2', label: 'CO₂ · dióxido de carbono' },
                      { id: 'humo', label: 'Humo de fuego' },
                      { id: 'vapor', label: 'Vapor de agua' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setPicked(item.id);
                          if (item.id === 'co2') win();
                          else fail();
                        }}
                        className={`s4-choice rounded-3xl border-[3px] bg-white px-4 py-4 text-lg font-bold ${wrong && picked === item.id ? 's4-shake border-[#d64545]' : 'border-[#d8c7aa]'}`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </section>
              )}

              {level === 3 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#2f4a2f]">Toca los pasos en orden</h2>
                  <p className="text-sm font-bold text-[#4a6549]">{order.map((id) => STEPS.find((s) => s.id === id)?.label).join(' → ') || 'Empieza por el festín'}</p>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    {STEPS.map((step) => {
                      const used = order.includes(step.id);
                      return (
                        <button
                          key={step.id}
                          type="button"
                          disabled={used}
                          onClick={() => {
                            const nextOrder = [...order, step.id];
                            setOrder(nextOrder);
                            const expected = STEPS[nextOrder.length - 1].id;
                            if (step.id !== expected) {
                              fail();
                              setOrder([]);
                              return;
                            }
                            playBubble();
                            if (nextOrder.length === 3) win();
                          }}
                          className={`s4-choice rounded-3xl border-[3px] p-4 ${used ? 'border-[#4a6549] bg-[#ccebc7]' : 'border-[#d8c7aa] bg-white'}`}
                        >
                          <span className="block font-black text-[#2f4a2f]">{step.label}</span>
                          <span className="text-sm text-[#5a4630]">{step.hint}</span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              )}

              {level === 4 && (
                <section className="s4-pop space-y-4 text-center">
                  <h2 className="font-headline-md text-2xl font-extrabold text-[#2f4a2f]">Toca los 3 alimentos de Fermi</h2>
                  <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
                    {FOODS.map((food) => {
                      const on = foods.includes(food.id);
                      return (
                        <button
                          key={food.id}
                          type="button"
                          onClick={() => {
                            if (!food.ok) {
                              setPicked(food.id);
                              fail();
                              return;
                            }
                            playBubble();
                            setFoods((prev) => {
                              const nextFoods = on ? prev.filter((id) => id !== food.id) : prev.includes(food.id) ? prev : [...prev, food.id];
                              if (FOODS.filter((f) => f.ok).every((f) => nextFoods.includes(f.id))) {
                                window.setTimeout(win, 0);
                              }
                              return nextFoods;
                            });
                          }}
                          className={`s4-choice rounded-3xl border-[3px] p-3 ${on ? 'border-[#4a6549] bg-[#ccebc7]' : wrong && picked === food.id ? 's4-shake border-[#d64545] bg-white' : 'border-[#d8c7aa] bg-white'}`}
                        >
                          <span className="material-symbols-outlined text-3xl text-[#4a6549]" style={{ fontVariationSettings: "'FILL' 1" }}>{food.icon}</span>
                          <span className="mt-1 block text-sm font-black">{food.label}</span>
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
