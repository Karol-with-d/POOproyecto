import { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const WEEK = /^\/semana\/[56](\/|$)/;

type Snapshot = {
  windowY: number;
  mainTop: number | null;
};

const positions = new Map<string, Snapshot>();

function resetScrollContainers() {
  window.scrollTo(0, 0);
  document.documentElement.scrollTop = 0;
  document.body.scrollTop = 0;
  document
    .querySelectorAll<HTMLElement>('.game-screen, .game-screen > *, .game-screen main, .game-screen section, main.overflow-y-auto')
    .forEach((el) => {
      el.scrollTop = 0;
    });
}

function captureScroll(): Snapshot {
  const main = document.querySelector<HTMLElement>('main.overflow-y-auto');
  return {
    windowY: window.scrollY,
    mainTop: main ? main.scrollTop : null,
  };
}

function restoreScroll(snapshot: Snapshot) {
  window.scrollTo(0, snapshot.windowY);
  const main = document.querySelector<HTMLElement>('main.overflow-y-auto');
  if (main && snapshot.mainTop != null) main.scrollTop = snapshot.mainTop;
}

function isReturn(from: string, to: string) {
  if (from.startsWith(`${to}/`)) return true;
  return to === '/home' && WEEK.test(from);
}

/** Reset semana 5 and 6 when opening a screen, and restore scroll when coming back. */
export default function WeekScrollReset() {
  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);
  const previousPath = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    const save = () => {
      positions.set(pathnameRef.current, captureScroll());
    };
    window.addEventListener('scroll', save, true);
    return () => window.removeEventListener('scroll', save, true);
  }, []);

  useLayoutEffect(() => {
    const from = previousPath.current;
    previousPath.current = pathname;

    const returning = from !== pathname && isReturn(from, pathname);
    const enteringWeek = WEEK.test(pathname);
    if (!returning && !enteringWeek) return;

    const previousRestoration = history.scrollRestoration;
    history.scrollRestoration = 'manual';

    const apply = () => {
      if (returning) {
        const snapshot = positions.get(pathname);
        if (snapshot) restoreScroll(snapshot);
        else resetScrollContainers();
      } else {
        resetScrollContainers();
      }
    };

    apply();
    const frame = requestAnimationFrame(apply);
    return () => {
      cancelAnimationFrame(frame);
      history.scrollRestoration = previousRestoration;
    };
  }, [pathname]);

  return null;
}

/** Scroll back to the top when an in-page screen changes on semana 5 or 6. */
export function useResetScrollOn(token: unknown) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (!WEEK.test(pathname)) return;
    if (/^\/semana\/[56]$/.test(pathname)) return;
    resetScrollContainers();
    const frame = requestAnimationFrame(resetScrollContainers);
    return () => cancelAnimationFrame(frame);
  }, [pathname, token]);
}
