import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { playWhoosh } from '../services/sounds';
import { S4_STYLES, S4Sky } from '../components/Semana4Ui';

type Mission = {
  id: string;
  tube: string;
  title: string;
  desc: string;
  skill: string;
  link: string;
  filename: string;
  imageHint: string;
  accent: string;
  accentDark: string;
};

const MISSIONS: Mission[] = [
  {
    id: 'oxidacion',
    tube: 'Tubo 01',
    title: 'El Misterio de la Oxidación',
    desc: '5 niveles: busca la fruta café y frena a Óxido.',
    skill: 'Observar',
    link: '/semana/4/oxidacion',
    filename: 'card-oxidacion.jpg',
    imageHint: 'Pera fresca y pera café',
    accent: '#ea580c',
    accentDark: '#9a3412',
  },
  {
    id: 'fermentacion',
    tube: 'Tubo 02',
    title: 'La Magia de la Fermentación',
    desc: '5 niveles: alimenta a Fermi y encuentra el CO₂.',
    skill: 'Proceso',
    link: '/semana/4/fermentacion',
    filename: 'card-fermentacion.jpg',
    imageHint: 'Pan y burbujas',
    accent: '#0f766e',
    accentDark: '#115e59',
  },
  {
    id: 'opuestos',
    tube: 'Tubo 03',
    title: 'Conoce a los Opuestos',
    desc: '5 niveles: clasifica ácidos, bases y el 7 del agua.',
    skill: 'Comparar',
    link: '/semana/4/opuestos',
    filename: 'card-acidos.jpg',
    imageHint: 'Limón y jabón',
    accent: '#ca8a04',
    accentDark: '#854d0e',
  },
  {
    id: 'lumi',
    tube: 'Tubo 04',
    title: 'Lumi y la luz mágica',
    desc: '5 niveles: dobla la barra y enciende luciérnagas.',
    skill: 'Experimentar',
    link: '/semana/4/quimioluminiscencia',
    filename: 'card-lumi.jpg',
    imageHint: 'Barra luminosa',
    accent: '#6d28d9',
    accentDark: '#4c1d95',
  },
  {
    id: 'combustion',
    tube: 'Tubo 05',
    title: 'El Gran Drama Químico',
    desc: '5 niveles: el drama del fuego y el triángulo mágico.',
    skill: 'Transformar',
    link: '/semana/4/combustion',
    filename: 'card-combustion.jpg',
    imageHint: 'Papel, llama y cenizas',
    accent: '#e11d48',
    accentDark: '#9f1239',
  },
];

function MissionArt({
  src,
  alt,
  filename,
  hint,
}: {
  src: string;
  alt: string;
  filename: string;
  hint: string;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <div className="s4-frame s4-float relative h-32 w-44 shrink-0 rounded-2xl border-4 border-white bg-white shadow-[3px_3px_0_#99f6e4] sm:h-36 sm:w-52">
      <img
        src={src}
        alt={alt}
        className={`s4-frame-img ${failed ? '' : 'is-on'}`}
        onLoad={() => setFailed(false)}
        onError={() => setFailed(true)}
      />
      {failed && (
        <div className="absolute inset-2 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-2xl text-teal-700">science</span>
          <span className="text-[10px] font-black text-[#12263a]">{filename}</span>
          <span className="text-[10px] text-teal-800">{hint}</span>
        </div>
      )}
    </div>
  );
}

export default function Semana4Page() {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen flex-col text-[#12263a] antialiased">
      <style>{S4_STYLES}</style>
      <S4Sky />

      <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b-4 border-[#99f6e4] bg-[#0f766e] px-4 py-3 text-white md:px-10">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="s4-icon-btn flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d9f99d] text-[#115e59] shadow-[3px_3px_0_#115e59]"
          aria-label="Volver al inicio"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="min-w-0 flex-1 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-[#99f6e4]">Laboratorio 04</p>
          <h1 className="truncate text-lg font-black md:text-xl">Propiedades Químicas</h1>
        </div>
        <span className="hidden rounded-full bg-[#d9f99d] px-2 py-1 text-[10px] font-black uppercase text-[#115e59] sm:inline">
          5 tubos
        </span>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col gap-5 px-4 py-8 pb-44 md:pb-10 scroll-pb-28" style={{ paddingBottom: 'max(11rem, calc(7.5rem + env(safe-area-inset-bottom)))' }}>
        <section className="s4-pop text-center">
          <p className="inline-block rounded-full bg-[#0f766e] px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#d9f99d]">
            Estación de experimentos
          </p>
          <h2 className="mt-3 text-3xl font-black leading-tight">Elige un tubo y entra al lab</h2>
          <p className="mt-2 text-[#1f3a40]">
            Cada experimento tiene 5 niveles. Las cosas se ponen café, hacen burbujas, brillan o se vuelven ceniza.
          </p>
        </section>

        <section className="flex flex-col gap-4">
          {MISSIONS.map((mission, index) => (
            <button
              key={mission.id}
              type="button"
              onClick={() => {
                playWhoosh();
                navigate(mission.link);
              }}
              className="s4-tube flex flex-col items-center gap-4 rounded-[1.75rem] border-2 bg-[#ecfeff] p-4 text-left shadow-[8px_8px_0_#99f6e4] sm:flex-row scroll-mb-24"
              style={{ borderColor: mission.accent, ['--s4-bob' as string]: `${0.25 + index * 0.35}s` }}
            >
              <span className="s4-card-shine" aria-hidden="true" />
              <div className="flex items-center gap-3">
                <span
                  className="s4-wiggle flex h-12 w-10 items-center justify-center text-xs font-black text-white"
                  style={{ backgroundColor: mission.accent, clipPath: 'polygon(20% 0, 80% 0, 100% 18%, 100% 100%, 0 100%, 0 18%)' }}
                >
                  {String(index + 1).padStart(2, '0')}
                </span>
                <MissionArt
                  src={`/images/semana4/${mission.filename}`}
                  alt={mission.title}
                  filename={mission.filename}
                  hint={mission.imageHint}
                />
              </div>
              <div className="min-w-0 flex-1 text-center sm:text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.18em]" style={{ color: mission.accentDark }}>
                  {mission.tube} · {mission.skill}
                </p>
                <h3 className="text-xl font-black">{mission.title}</h3>
                <p className="text-sm text-[#1f3a40]">{mission.desc}</p>
              </div>
              <span
                className="s4-tube-cta s4-btn-lab w-full rounded-2xl px-5 py-3 text-center font-black text-white shadow-[4px_4px_0_#115e59] sm:w-auto"
                style={{ backgroundColor: mission.accent }}
              >
                Abrir tubo
              </span>
            </button>
          ))}
        </section>

        <section className="s4-tube flex flex-col items-center justify-between gap-4 rounded-[1.75rem] border-2 border-[#6d28d9] bg-[#2e1065] p-5 text-white shadow-[8px_8px_0_#c4b5fd] md:flex-row scroll-mb-24" style={{ ['--s4-bob' as string]: '1.8s' }}>
          <span className="s4-card-shine" aria-hidden="true" />
          <div className="flex items-center gap-4">
            <div className="s4-frame hidden h-20 w-20 overflow-hidden rounded-2xl border-4 border-white bg-white sm:flex">
              <img src="/images/semana4/card-quiz.jpg" alt="" className="s4-frame-img is-on" />
            </div>
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#d9f99d]">Reto final</p>
              <h2 className="text-xl font-black">Quiz de 10 preguntas</h2>
              <p className="text-sm text-violet-100">Verdadero o falso de los cinco tubos. ¡Gana tu nota!</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              playWhoosh();
              navigate('/semana/4/quiz');
            }}
            className="s4-pulse s4-btn-lab w-full rounded-2xl bg-[#d9f99d] px-6 py-3 font-black text-[#115e59] shadow-[4px_4px_0_#86efac] md:w-auto"
          >
            Encender lab
          </button>
        </section>
      </main>

      <nav className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t-4 border-[#99f6e4] bg-[#0f766e] px-3 py-2 text-white md:hidden" style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}>
        <Link to="/home" className="s4-icon-btn flex flex-col items-center px-3 py-1 text-xs font-bold text-[#ccfbf1]">
          <span className="material-symbols-outlined">map</span>
          Mapa
        </Link>
        <div className="flex flex-col items-center rounded-2xl bg-[#d9f99d] px-4 py-1 text-xs font-black text-[#115e59]">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>science</span>
          Lab
        </div>
        <Link to="/perfil" className="s4-icon-btn flex flex-col items-center px-3 py-1 text-xs font-bold text-[#ccfbf1]">
          <span className="material-symbols-outlined">stars</span>
          Nota
        </Link>
      </nav>
    </div>
  );
}
