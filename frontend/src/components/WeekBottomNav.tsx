import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

export type WeekBottomNavTheme = {
  /** Fondo de la barra inferior y panel del menú */
  bar: string;
  /** Borde */
  border: string;
  /** Texto/iconos de Mapa y Nota (barra/menú) */
  muted: string;
  /** Fondo del chip activo (Lab) */
  activeBg: string;
  /** Texto del chip activo (Lab) */
  activeText: string;
  /** Fondo del encabezado (combina con la semana) */
  headerBg: string;
  /** Título / iconos del encabezado */
  headerText: string;
  /** Botón atrás y menú en el encabezado */
  headerBtnBg: string;
  headerBtnText: string;
};

type ThemeProps = {
  theme: WeekBottomNavTheme;
};

function NavItems({
  theme,
  layout,
}: {
  theme: WeekBottomNavTheme;
  layout: 'row' | 'column';
}) {
  const isRow = layout === 'row';
  return (
    <>
      <Link
        to="/home"
        className={
          isRow
            ? 'flex min-h-[44px] flex-col items-center justify-center px-3 py-1 text-xs font-bold transition-transform active:scale-95'
            : 'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-white/10 active:scale-[0.98]'
        }
        style={{ color: theme.muted }}
      >
        <span className="material-symbols-outlined">map</span>
        Mapa
      </Link>

      <div
        className={
          isRow
            ? 'flex min-h-[44px] flex-col items-center justify-center rounded-2xl px-4 py-1 text-xs font-black'
            : 'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-black'
        }
        style={{ backgroundColor: theme.activeBg, color: theme.activeText }}
        aria-current="page"
      >
        <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
          science
        </span>
        Lab
      </div>

      <Link
        to="/perfil"
        className={
          isRow
            ? 'flex min-h-[44px] flex-col items-center justify-center px-3 py-1 text-xs font-bold transition-transform active:scale-95'
            : 'flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-bold transition-colors hover:bg-white/10 active:scale-[0.98]'
        }
        style={{ color: theme.muted }}
      >
        <span className="material-symbols-outlined">stars</span>
        Nota
      </Link>
    </>
  );
}

/** Menú desplegable para tablet/laptop/PC (va dentro del encabezado). */
export function WeekDesktopMenu({ theme }: ThemeProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (rootRef.current && target && !rootRef.current.contains(target)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden shrink-0 md:block">
      <button
        type="button"
        aria-label={open ? 'Cerrar menú de la semana' : 'Abrir menú de la semana'}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className="flex h-11 w-11 items-center justify-center rounded-full transition-transform active:scale-95"
        style={{
          backgroundColor: theme.headerBtnBg,
          color: theme.headerBtnText,
        }}
      >
        <span className="material-symbols-outlined text-[24px]" aria-hidden="true">
          {open ? 'close' : 'menu'}
        </span>
      </button>

      <nav
        id={menuId}
        aria-label="Navegación de la semana"
        className={`absolute right-0 top-[3.25rem] z-50 w-52 origin-top-right rounded-3xl border-4 p-2 shadow-[6px_6px_0_rgba(0,0,0,0.16)] transition-all duration-200 ${
          open
            ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
            : 'pointer-events-none -translate-y-1 scale-95 opacity-0'
        }`}
        style={{
          backgroundColor: theme.bar,
          borderColor: theme.border,
        }}
      >
        <p
          className="px-3 pb-1 pt-1 text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: theme.muted }}
        >
          Menú
        </p>
        <div className="flex flex-col gap-1">
          <NavItems theme={theme} layout="column" />
        </div>
      </nav>
    </div>
  );
}

type WeekHubHeaderProps = ThemeProps & {
  title: string;
  onBack: () => void;
};

/**
 * Encabezado tipo Semana 5: atrás + título a la izquierda,
 * menú desplegable a la derecha en pantallas grandes.
 */
export function WeekHubHeader({ title, theme, onBack }: WeekHubHeaderProps) {
  return (
    <header
      className="z-40 flex w-full shrink-0 items-center justify-between gap-3 px-6 py-4 shadow-sm"
      style={{
        backgroundColor: theme.headerBg,
        color: theme.headerText,
        borderBottom: `3px solid ${theme.border}`,
      }}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95"
          style={{ backgroundColor: theme.headerBtnBg, color: theme.headerBtnText }}
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h1 className="truncate text-xl font-bold md:text-2xl" style={{ color: theme.headerText }}>
          {title}
        </h1>
      </div>

      <WeekDesktopMenu theme={theme} />
    </header>
  );
}

/**
 * Barra inferior móvil unificada (Mapa · Lab · Nota).
 */
export default function WeekBottomNav({ theme }: ThemeProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 z-50 flex w-full items-center justify-around rounded-t-3xl border-t-4 px-3 py-2 md:hidden"
      style={{
        backgroundColor: theme.bar,
        borderTopColor: theme.border,
        color: theme.muted,
        paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))',
      }}
      aria-label="Navegación de la semana"
    >
      <NavItems theme={theme} layout="row" />
    </nav>
  );
}

/** Temas alineados a la decoración de cada hub (semanas 1–5). */
export const WEEK_NAV_THEMES: Record<1 | 2 | 3 | 4 | 5, WeekBottomNavTheme> = {
  // Semana 1: papel cálido + ámbar de medidas
  1: {
    bar: '#b45309',
    border: '#f59e0b',
    muted: '#fff7ed',
    activeBg: '#fde68a',
    activeText: '#78350f',
    headerBg: '#fff4e4',
    headerText: '#b45309',
    headerBtnBg: '#f59e0b',
    headerBtnText: '#fffbeb',
  },
  // Semana 2: salvia + amarillo del aula
  2: {
    bar: '#4D6B53',
    border: '#A7D4AE',
    muted: '#E8F5EA',
    activeBg: '#F4E08B',
    activeText: '#3D5542',
    headerBg: '#A7D4AE',
    headerText: '#1A1A1A',
    headerBtnBg: '#F4E08B',
    headerBtnText: '#3D5542',
  },
  // Semana 3: verde reciclaje UNIVO
  3: {
    bar: '#4a6549',
    border: '#8ba888',
    muted: '#e7f6e4',
    activeBg: '#ccebc7',
    activeText: '#243d24',
    headerBg: '#e7f6e4',
    headerText: '#4a6549',
    headerBtnBg: '#4a6549',
    headerBtnText: '#e7f6e4',
  },
  // Semana 4: laboratorio teal
  4: {
    bar: '#0f766e',
    border: '#99f6e4',
    muted: '#ccfbf1',
    activeBg: '#d9f99d',
    activeText: '#115e59',
    headerBg: '#0f766e',
    headerText: '#ccfbf1',
    headerBtnBg: '#d9f99d',
    headerBtnText: '#115e59',
  },
  // Semana 5: Terra Ciencia (crema + sage + madera)
  5: {
    bar: '#4a7c59',
    border: '#78a886',
    muted: '#e8f0ea',
    activeBg: '#c4a66a',
    activeText: '#3f3420',
    headerBg: '#f5f1ea',
    headerText: '#4a7c59',
    headerBtnBg: '#c4a66a',
    headerBtnText: '#3f3420',
  },
};
