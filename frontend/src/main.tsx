import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

const markFontsReady = () => document.documentElement.classList.add('fonts-ready');
if (document.fonts?.ready) {
  document.fonts.ready.then(markFontsReady).catch(markFontsReady);
} else {
  markFontsReady();
}
window.setTimeout(markFontsReady, 1800);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
