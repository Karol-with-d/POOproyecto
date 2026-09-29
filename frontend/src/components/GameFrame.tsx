import { Outlet, useLocation } from 'react-router-dom';

function isGameScreen(path: string): boolean {
  if (!path.startsWith('/semana')) return false;
  return !/^\/semana\/[1-6]$/.test(path);
}

export default function GameFrame() {
  const { pathname } = useLocation();

  if (!isGameScreen(pathname)) {
    return <Outlet />;
  }

  return (
    <div className="game-screen">
      <Outlet />
    </div>
  );
}
