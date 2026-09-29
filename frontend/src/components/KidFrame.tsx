import { useEffect, useState, type ReactNode } from 'react';
import { playClick, playPop, playSuccess, unlockAudio } from '../services/sounds';

type KidMessage = { text: string; tone: 'ok' | 'soon' };

export function showKidMessage(text: string, tone: KidMessage['tone'] = 'ok'): void {
  if (tone === 'ok') playSuccess();
  else playPop();
  window.dispatchEvent(new CustomEvent<KidMessage>('kid-message', { detail: { text, tone } }));
}

export default function KidFrame({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<KidMessage | null>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      const control = target?.closest('button, a, [role="button"]');
      if (!control) return;
      if (control.hasAttribute('disabled') || control.getAttribute('aria-disabled') === 'true') return;
      unlockAudio();
      playClick();
    };
    const onMessage = (event: Event) => {
      setMessage((event as CustomEvent<KidMessage>).detail);
    };
    document.addEventListener('pointerdown', onPointer, true);
    window.addEventListener('kid-message', onMessage);
    return () => {
      document.removeEventListener('pointerdown', onPointer, true);
      window.removeEventListener('kid-message', onMessage);
    };
  }, []);

  return (
    <>
      <div className="kid-sky" aria-hidden="true">
        <span className="kid-blob kid-blob-a" />
        <span className="kid-blob kid-blob-b" />
        <span className="kid-blob kid-blob-c" />
        <span className="kid-cloud kid-cloud-1" />
        <span className="kid-cloud kid-cloud-2" />
        <span className="kid-star kid-star-1" />
        <span className="kid-star kid-star-2" />
        <span className="kid-star kid-star-3" />
      </div>
      {children}
      {message && (
        <div className="kid-modal" role="dialog" aria-modal="true">
          <div className="kid-modal-card">
            <p>{message.text}</p>
            <button type="button" className="kid-modal-btn" onClick={() => setMessage(null)}>
              ¡Listo!
            </button>
          </div>
        </div>
      )}
    </>
  );
}
