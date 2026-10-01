import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';

const WEEK = /^\/semana\/[56](\/|$)/;

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

/** Scroll semana 5 and 6 back to the top whenever the route changes. */
export default function WeekScrollReset() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (!WEEK.test(pathname)) return;
    const previous = history.scrollRestoration;
    history.scrollRestoration = 'manual';
    resetScrollContainers();
    const frame = requestAnimationFrame(resetScrollContainers);
    return () => {
      cancelAnimationFrame(frame);
      history.scrollRestoration = previous;
    };
  }, [pathname]);

  return null;
}

/** Scroll back to the top when an in-page screen changes on semana 5 or 6. */
export function useResetScrollOn(token: unknown) {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if (!WEEK.test(pathname)) return;
    resetScrollContainers();
    const frame = requestAnimationFrame(resetScrollContainers);
    return () => cancelAnimationFrame(frame);
  }, [pathname, token]);
}
