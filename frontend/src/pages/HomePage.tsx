/**
 * HomePage — Pantalla principal del dashboard.
 * 
 * Nota: Es un placeholder para T-013 (Pantalla de inicio / Home).
 * Mostrará el grid de 6 semanas con estado de progreso.
 */
export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-on-background flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-headline-lg text-headline-lg text-on-surface mb-4">
          ¡Bienvenido a la Plataforma!
        </h1>
        <p className="font-body-md text-body-md text-on-surface-variant">
          Aquí irá el grid de las 6 semanas (T-013).
        </p>
      </div>
    </div>
  );
}
