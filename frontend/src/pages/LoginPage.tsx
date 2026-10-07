import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';
import { showKidMessage } from '../components/KidFrame';

/**
 * LoginPage — Pantalla de inicio de sesión donde el niño escribe su nombre.
 *
 * Flujo:
 * 1. Niño escribe un nombre inventado en el campo
 * 2. Toca "Entrar"
 * 3. Frontend envía POST /api/users al backend
 * 4. Backend persiste el usuario y retorna { id, randomName, createdAt }
 * 5. Frontend guarda el usuario en localStorage
 * 6. Navega al home (/home)
 *
 * Restricciones globales cumplidas:
 * - Sin sesiones ni tokens de seguridad
 * - Sin tipeo de contraseñas (solo nombre libre)
 * - Interacción 100% táctil (tap)
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const name = nickname.trim() || 'Explorador';

    try {
      const user = await createUser(name);
      localStorage.setItem('plataforma_user', JSON.stringify(user));
      navigate('/home');
    } catch (err: unknown) {
      // Sin backend: entra igual en modo local para que el niño pueda jugar.
      console.warn('API no disponible; entrando en modo local.', err);
      const localUser = {
        id: `local-${Date.now()}`,
        randomName: name,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('plataforma_user', JSON.stringify(localUser));
      navigate('/home');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-transparent text-on-background selection:bg-primary-container selection:text-on-primary-container">
      <header className="text-primary font-headline-md text-headline-md font-bold flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base z-50">
        <div className="flex flex-col leading-tight">
          <span className="font-headline-md text-headline-md font-bold tracking-wide text-primary">GRAVCI</span>
          <span className="text-sm font-semibold text-on-surface-variant">Gran Aventura Científica</span>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-3 md:py-xl">
        {/* Layout Grid */}
        <div className="w-full max-w-[1024px] grid grid-cols-4 md:grid-cols-12 gap-gutter items-center">
          {/* Illustration Area */}
          <div className="col-span-4 md:col-span-6 flex justify-center items-center mb-3 md:mb-0">
            <div
              className="relative h-32 w-32 sm:h-auto sm:w-full sm:max-w-[400px] sm:aspect-square rounded-full bg-surface-container-low flex items-center justify-center p-2 sm:p-md overflow-hidden border-2 border-surface-container-high"
              style={{ boxShadow: 'inset 0 4px 24px rgba(74,101,73,0.05)' }}
            >
              {/* Soft organic blob background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-fixed opacity-30 blur-2xl rounded-full scale-110"></div>
              <img
                alt="Personaje explorador de ciencias"
                className="relative z-10 w-full h-full object-cover rounded-full shadow-sm opacity-90 object-center"
                src="/images/LoginImage.webp"
                onError={(e) => {
                  // Fallback si la imagen no existe aun
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          </div>

          {/* Form Area */}
          <div className="col-span-4 md:col-span-6 flex justify-center md:justify-start">
            <div
              className="w-full max-w-[420px] bg-surface rounded-[24px] p-4 sm:p-lg border-2 border-surface-container-high"
              style={{ boxShadow: '0 8px 32px rgba(74,101,73,0.08)' }}
            >
              <div className="text-center mb-2 sm:mb-lg">
                <h1 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mb-xs">
                  ¡Hola!
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  Listos para explorar la ciencia hoy.
                </p>
              </div>

              {error && (
                <div className="mb-md p-sm bg-error-container text-on-error-container rounded-xl text-center font-body-md">
                  {error}
                </div>
              )}

              <form className="flex flex-col gap-3 sm:gap-lg" onSubmit={handleStart}>
                {/* Username Field */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface ml-sm" htmlFor="username">
                    ¿Cómo te llamas?
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Explorador', 'Luna', 'Sol', 'Río'].map((name) => (
                      <button
                        key={name}
                        type="button"
                        className={`kid-name ${nickname === name ? 'kid-name-on' : ''}`}
                        onClick={() => setNickname(name)}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline">face</span>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="O escribe otro nombre"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      disabled={isLoading}
                      className="input-squishy w-full bg-surface-container-low text-on-surface rounded-xl py-sm pl-[48px] pr-sm font-body-lg text-body-lg h-14 sm:h-[64px] border-2 border-surface-container placeholder:text-outline-variant focus:bg-surface-container-lowest disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="kid-cta mt-1 sm:mt-sm w-full text-white font-headline-md text-headline-md py-sm rounded-xl h-14 sm:h-[72px] flex items-center justify-center gap-sm btn-3d disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Estamos abriendo el laboratorio' : 'Entrar'}
                  <span className="material-symbols-outlined fill">arrow_forward</span>
                </button>
              </form>

              {/* Help Link */}
              <div className="mt-2 sm:mt-lg text-center">
                <button
                  type="button"
                  onClick={() => showKidMessage('Puedes tocar un nombre o entrar sin escribir. Tu aventura se guarda en este aparato.', 'soon')}
                  className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant inline-flex items-center justify-center gap-2 min-h-[44px] px-4 py-2 rounded-xl transition-colors"
                >
                  <span className="material-symbols-outlined text-[22px]">help</span>
                  ¿Necesitas ayuda?
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
