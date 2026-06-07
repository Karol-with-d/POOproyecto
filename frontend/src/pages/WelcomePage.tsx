import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';

/**
 * WelcomePage — Pantalla de bienvenida donde el niño escribe su nombre.
 * 
 * Flujo:
 * 1. Niño escribe un nombre inventado en el campo
 * 2. Toca "Entrar"
 * 3. Frontend envía POST /api/users al backend
 * 4. Backend persiste el usuario y retorna { id, randomName, createdAt }
 * 5. Frontend guarda el usuario en localStorage
 * 6. Navega al home
 * 
 * Restricciones globales cumplidas:
 * - Sin sesiones ni tokens de seguridad
 * - Sin tipeo de contraseñas (solo nombre libre)
 * - Interacción 100% táctil (tap)
 */
export default function WelcomePage() {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const name = nickname.trim() || undefined;
      const user = await createUser(name || 'Explorador');

      localStorage.setItem('plataforma_user', JSON.stringify(user));
      navigate('/home');
    } catch (err: any) {
      console.error('Error al crear usuario:', err);
      setError('Ups, algo salió mal. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden bg-background text-on-background selection:bg-primary-container selection:text-on-primary-container">
      {/* TopAppBar */}
      <header className="bg-surface text-primary font-headline-md text-headline-md font-bold flex justify-between items-center w-full px-margin-mobile md:px-margin-desktop py-base z-50">
        <div className="flex items-center gap-sm">
          <span className="font-headline-md text-headline-md font-bold text-primary">UNIVO</span>
        </div>
        <button
          aria-label="Account"
          className="w-12 h-12 rounded-full flex items-center justify-center hover:bg-secondary-container/50 transition-colors opacity-50 cursor-not-allowed"
          disabled
        >
          <span className="material-symbols-outlined text-[28px] text-on-surface-variant">account_circle</span>
        </button>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow flex items-center justify-center px-margin-mobile md:px-margin-desktop py-xl">
        {/* Layout Grid */}
        <div className="w-full max-w-[1024px] grid grid-cols-4 md:grid-cols-12 gap-gutter items-center">
          {/* Illustration Area */}
          <div className="col-span-4 md:col-span-6 flex justify-center items-center mb-lg md:mb-0">
            <div
              className="relative w-full max-w-[400px] aspect-square rounded-full bg-surface-container-low flex items-center justify-center p-md overflow-hidden border-2 border-surface-container-high"
              style={{ boxShadow: 'inset 0 4px 24px rgba(74,101,73,0.05)' }}
            >
              {/* Soft organic blob background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary-fixed to-secondary-fixed opacity-30 blur-2xl rounded-full scale-110"></div>
              <img
                alt="Personaje explorador de ciencias"
                className="relative z-10 w-full h-full object-cover rounded-full shadow-sm opacity-90 object-center"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAhhBWFLa0i_5lwsVu_0uB8j5DK-yPvHxC4qQLUFNiiVXmnJe-gFW-gnLaV4_arqKvW3e57r_w0P-WBejmKP4Y7cnsGVVGeKEdJGBi6XbznVPVE8VctEJ9WmykXxbh2xSeE9kbUOWsmrc3uE44AZBrp8e3dI-M9Oyq2-QlSZcjLXWeSabwP8dK4Gh-D86SCvCR0tnGUqSm12-kTae41yHYqJLfW9t0xBsgG_GGhtUuYUpsTxAEWwdlvVCciIRJmehjcAfI_F_qsPMr"
              />
            </div>
          </div>

          {/* Form Area */}
          <div className="col-span-4 md:col-span-6 flex justify-center md:justify-start">
            <div
              className="w-full max-w-[420px] bg-surface rounded-[24px] p-lg border-2 border-surface-container-high"
              style={{ boxShadow: '0 8px 32px rgba(74,101,73,0.08)' }}
            >
              <div className="text-center mb-lg">
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

              <form className="flex flex-col gap-lg" onSubmit={handleStart}>
                {/* Username Field */}
                <div className="flex flex-col gap-xs">
                  <label className="font-label-lg text-label-lg text-on-surface ml-sm" htmlFor="username">
                    Nombre de Usuario
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-sm flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-outline">face</span>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      placeholder="Tu nombre aquí"
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      disabled={isLoading}
                      className="input-squishy w-full bg-surface-container-low text-on-surface rounded-xl py-sm pl-[48px] pr-sm font-body-lg text-body-lg h-[64px] border-2 border-surface-container placeholder:text-outline-variant focus:bg-surface-container-lowest disabled:opacity-60"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="mt-sm w-full bg-primary text-on-primary font-headline-md text-headline-md py-sm rounded-xl h-[72px] flex items-center justify-center gap-sm btn-3d disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Cargando...' : 'Entrar'}
                  <span className="material-symbols-outlined fill">arrow_forward</span>
                </button>
              </form>

              {/* Help Link */}
              <div className="mt-lg text-center">
                <a
                  href="#"
                  className="font-label-md text-label-md text-primary hover:text-on-primary-fixed-variant flex items-center justify-center gap-xs transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">help</span>
                  ¿Necesitas ayuda?
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
