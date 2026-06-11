import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface LevelItem {
  id: string;
  name: string;
  src: string;
  alt: string;
}

interface LevelConfig {
  prompt: string;
  correctItemId: string;
  items: LevelItem[];
  characterImage: string;
  characterAlt: string;
}

const levels: LevelConfig[] = [
  {
    prompt: '"¿Puedes encontrar algo que sea... <span class="text-primary font-bold">grande</span> y <span class="text-primary font-semibold">verde</span>?"',
    correctItemId: 'item-notebook',
    items: [
      { id: 'item-pencil', name: 'Lápiz', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDufR6VSDKUAtKrkrAsnrJnl20I41EsdfxUVIRvlY6J2k68gKf_xIgk4p58wPM1o-JWNQBoI4hD6G5t4VS_VX2CtPhImkzhFCKX9rlqkR1OIEqhjtXBdRFFQ4Ntd_aAdACideM11ZG6tbS0xkQzGRJ4ertRlyo4vUEvvz2imh3lspjNloP3E3Fw_evpG4jvzCG4J42qnx1Pp0-ojkNtolk9Mk10JEQ76jsjxaeYgwRPEd77VXdpTUJ9ejDAveoUKQ3b-E499kDrbaxn', alt: 'Lápiz' },
      { id: 'item-eraser', name: 'Borrador', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCRJfpBZhq97QIggC1aW42LvJ8zm2PBZ3IbBpKOf15NCEOfC-FKmI4oa3CFO0jdId5sb3zGGlIIYVBIGS1a0sK29HRldgJWDj8FyuplXwD3ODELsyRstw0AGt2EOgnDTrxaz8nIkyIWlEAvl69C18DJjd1um3En2gGXQ73Q3vC_0ZvJGYIHr9zrcGMb5X9PWER33xkiV1lST5fN-IQ8EYDPU6lEW67FrPPLFCi_wMbH8j9YtT4T73VCt3qvAQjyzaS2Ydi662m2AUMQ', alt: 'Borrador' },
      { id: 'item-notebook', name: 'Cuaderno', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF6L9Z_jkKZb31nuF0O6I_Q9b2_tLj_TFv8tMs9hhP3uelWT1mPOx5WfhXfiJD8aOnus5KFIMjiEKmnfOZGVwaDSftKqO00lTCKyozRUj_AIWa9CfGmyIrvyJFQB1HEDf4ZoLtRW5Tj4ubfSDcdRZLjdOQwFyEO6C39deNpMnQbsTdtTFSIv74aL5gWJrjDEU6N2HQVWFW4rNLINX--Hwc3cD1R6TJ_629CApwd1eCH-jfxRVFzQf8LSDnI3HvbHYl1K8eUEBkoUOM', alt: 'Cuaderno Verde' },
      { id: 'item-ruler', name: 'Regla', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDGpmtFT9c4i60eT-yeSPrSyAvXbL7FkMVVhlI_Re8xdN_lqLFXJ6Picdmehpd-fNL4FKGb19CkncHzbI_9Y_P6zV_3I3ta3tooi1mWXJsK4SwcXzWLmBhyjl_6hKsuZUyq9bn4VP3tpycH2CYcrFfOboYCTQ9D-LK0JU8I0oBrULbZ1J_P6oaB9rBhoacNgHEMupoXuZReQEUDy7mgspxMfyZQAGxnqacJAnO5Eaqjo2vTkARw7EDVxM1wcXks7YmpjrchASf1hsV9', alt: 'Regla' },
    ],
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7iVyr4JKYkp_93hELmzqlXY0vXFuKY25G4YKRKCPnHvcIsmXK-yUdKuYyJ_8SayOCES8cmnai0WG7Mdbtrmm-65237T0cXhfo8GN_OXhljt-O-S_xvRxsDmCY7a2FYdtAGOchX752FJNEtx6KDfpPZrczO3lcFo1v4DVxPr9gmrUNwsDyB7Wfx_cmOGEJgLHawb6da_TD5nlK26Doa9qYW4yVMhj338kP4oe-nI1CqQOcgBCtJrcxsc9bPv1wo-T_FXPCoTfRLrez',
    characterAlt: 'Pulgarcito',
  },
  {
    prompt: '"¿Puedes encontrar algo que sea... <span class="text-error font-bold">redondo</span> y de color <span class="text-error font-semibold">rojo</span>?"',
    correctItemId: 'item-apple',
    items: [
      { id: 'item-scissors', name: 'Tijeras', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAIQGXw-ktjVBWwrIyGIjSY7Z_wlBb2NFRxe_-7uaJYyMQp8DbtCaox_QQHnAm_Q8brHWF4oTaMhvF4AfT7GQq7GMxVO-p255pq1EAlosEsfUTRZ0IyyDRtSsNBc3r1y9dDQqKfN4wejRnJ4a1Ec7uYkyC8KQxcyrtpGmY9UxU2_u1LE3JiyHFeWPDpsto4IZH-3GY3flqy1HIqmtK6eLU4mtPq_jZ_8BZNGxBViGaAr0rVyA3gG_Bej1vdjqzN2hJrcVBfnK3Qd2m', alt: 'Tijeras' },
      { id: 'item-backpack', name: 'Mochila', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBnL_zJH4V-4oxS8OfwRt86NhELo4WdYTiymn5dQvX3O0oeo__etTz3pFl895egHj20kMUUASj7rXu4uQAW_U0bgoIlujf05-Ns5eulAyakAhg_qUWg7TtU48AK8rsBVX9QRqO4bw2Rigm4WKucEWCq93ldmgxPWT73jkAHC0PPwoAkMwaK_r5KQLwd5XHH0pMB2jdVh_XOJDNE0QuP9Qj0wn-ONDgbzBJD2ZbeHEX3nhnsAZhx_xZenJNTtT7waW_zULb4WcJ7jiOV', alt: 'Mochila' },
      { id: 'item-apple', name: 'Manzana', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDRc9pNENMDEx1LVJwdSSf88SMNuO0WwdNSolXg_EuYH50op3nf3oiQO2cQn-fLaFNesl_a_eV-_2j9DO6yD946SVGtktn0nGSLEWJkG3kjDCEenYnsmmI-gH8g_c6fqgV_diFsGvdmIxbVAdI2WMyYnTPyRWmHLRzh5SHf-3epq_8RtI9jYryyT1GEtQQz6ZnyJe-gsPzucEdU1iQOAsLbsaGtZ5dpVQAdz90RUTvqv8efrIu63vgDm1ebeXKj8quExeAlT3E77tVv', alt: 'Manzana' },
      { id: 'item-ball', name: 'Pelota', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmTUm0JCa6f1c1IJVvTRnTuYabZdvHd-I-Wa0_MIpQr1RHtutQXdxu1fYr17a4BQ2uOZjVEVGpcITeOJe0TjfeImLfv1pQIe1f2zNx0htt8fFWUkZslgOSER8PAXe1l6aXfCiuXr48qWzFdJUBDSansmaRRBkDHqnU_2-TqnGytXB4NYI1hZnOQVGX-AabIx0HrDUf-_tRRuXDpqpPjakcRJJx_XS6ZlVzVYa4sPNTXESGbD_TOKnz3f9nlEnIGOjnBToOG6z8bQg-', alt: 'Pelota' },
    ],
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7iVyr4JKYkp_93hELmzqlXY0vXFuKY25G4YKRKCPnHvcIsmXK-yUdKuYyJ_8SayOCES8cmnai0WG7Mdbtrmm-65237T0cXhfo8GN_OXhljt-O-S_xvRxsDmCY7a2FYdtAGOchX752FJNEtx6KDfpPZrczO3lcFo1v4DVxPr9gmrUNwsDyB7Wfx_cmOGEJgLHawb6da_TD5nlK26Doa9qYW4yVMhj338kP4oe-nI1CqQOcgBCtJrcxsc9bPv1wo-T_FXPCoTfRLrez',
    characterAlt: 'Pulgarcito',
  },
  {
    prompt: '"¿Puedes encontrar algo que sea... <span class="text-primary font-semibold">amarillo</span> y nos ayude a ver cosas <span class="text-primary font-bold">pequeñas</span>?"',
    correctItemId: 'item-magnifier',
    items: [
      { id: 'item-ball', name: 'Pelota', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAmTUm0JCa6f1c1IJVvTRnTuYabZdvHd-I-Wa0_MIpQr1RHtutQXdxu1fYr17a4BQ2uOZjVEVGpcITeOJe0TjfeImLfv1pQIe1f2zNx0htt8fFWUkZslgOSER8PAXe1l6aXfCiuXr48qWzFdJUBDSansmaRRBkDHqnU_2-TqnGytXB4NYI1hZnOQVGX-AabIx0HrDUf-_tRRuXDpqpPjakcRJJx_XS6ZlVzVYa4sPNTXESGbD_TOKnz3f9nlEnIGOjnBToOG6z8bQg-', alt: 'Pelota' },
      { id: 'item-beaker', name: 'Frasco', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB26bYFy1_b2fruQDrjHtZVYMacnxVPreCpxQtdVD-JJW_x2tGqqnzJD3s-yEGlGpeFh2zU-llrH3l9TbvOAYH8x1NAS_Z6gO5zYC9Qe3SSj7ijzXAyVm0OpS4jud0GzXiubw4ZG9hkaJcfH62ypEeMjHNOX0EszkeODwMTN-6gLiMkdApQlAATJ2uaytvBc8Ktoau7SpXbf2PNSMaTPdAFYSXgGEvAfZ7ACEDobPXmOFqXGlyMa6ig4vB6OjLVmN6f4bRPLefS1oYA', alt: 'Frasco' },
      { id: 'item-magnifier', name: 'Lupa', src: '/images/Lupa.png', alt: 'Lupa' },
      { id: 'item-clock', name: 'Reloj', src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDNyQZhsEVjRxG5aS8KUNx4R8loLHOKnEuhGX2WQ_8ylwKw9l8QpfDW-D8YuWD2iv7nXKWg_VhI04zBj0m0AIUdvdvhVLTR4YnhP2yc-vzxXQC2rXUFtze7x3QYYB-UZndrtpEsyvOjcyyV9MS3Rn0r-dEdwmlTiEwlpbv5VrqR2iZ2q5ZG1jEGNMY37KYGLDX4d9GpZxGbASPwmj_pRAYyVoXjATK1Bt38-INgB0Bln0bxUefZBd3w1Q_933TmfibNb8qTjdXaa1eB', alt: 'Reloj' },
    ],
    characterImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7iVyr4JKYkp_93hELmzqlXY0vXFuKY25G4YKRKCPnHvcIsmXK-yUdKuYyJ_8SayOCES8cmnai0WG7Mdbtrmm-65237T0cXhfo8GN_OXhljt-O-S_xvRxsDmCY7a2FYdtAGOchX752FJNEtx6KDfpPZrczO3lcFo1v4DVxPr9gmrUNwsDyB7Wfx_cmOGEJgLHawb6da_TD5nlK26Doa9qYW4yVMhj338kP4oe-nI1CqQOcgBCtJrcxsc9bPv1wo-T_FXPCoTfRLrez',
    characterAlt: 'Pulgarcito',
  },
];

function triggerConfetti() {
  const container = document.createElement('div');
  container.className = 'confetti-container';
  document.body.appendChild(container);
  const colors = ['#4a6549', '#8ba888', '#3e6378', '#f3e0c2', '#ba1a1a'];
  for (let i = 0; i < 100; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    const size = Math.random() * 10 + 8 + 'px';
    particle.style.width = size;
    particle.style.height = size;
    if (Math.random() > 0.5) particle.style.borderRadius = '50%';
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = Math.random() * 100 + 'vw';
    particle.style.animationDuration = Math.random() * 3 + 2 + 's';
    particle.style.animationDelay = Math.random() * 2 + 's';
    container.appendChild(particle);
  }
  setTimeout(() => container.remove(), 5000);
}

export default function DescriptionMatchGamePage() {
  const navigate = useNavigate();
  const [currentLevel, setCurrentLevel] = useState(0);
  const [droppedItemId, setDroppedItemId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  const level = levels[currentLevel];

  const handleDragStart = (itemId: string) => {
    setDraggedItemId(itemId);
  };

  const handleDragEnd = () => {
    setDraggedItemId(null);
  };

  const handleDragOver = (ev: React.DragEvent) => {
    ev.preventDefault();
  };

  const handleDragEnter = (ev: React.DragEvent) => {
    ev.preventDefault();
    if (!droppedItemId) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (ev: React.DragEvent) => {
    ev.preventDefault();
    setIsDragOver(false);
    if (!droppedItemId && draggedItemId) {
      setDroppedItemId(draggedItemId);
      setFeedback(null);
    }
    setDraggedItemId(null);
  };

  const handleReset = useCallback(() => {
    setDroppedItemId(null);
    setFeedback(null);
    setLevelCompleted(false);
  }, []);

  const handleCheck = useCallback(() => {
    if (!droppedItemId) return;
    if (droppedItemId === level.correctItemId) {
      const itemName = level.items.find((i) => i.id === level.correctItemId)?.name || 'objeto';
      setFeedback(`¡Excelente! Has encontrado el ${itemName}.`);
      setLevelCompleted(true);
      triggerConfetti();
    } else {
      setFeedback('Ese objeto es el incorrecto, ¡vuelve a intentarlo!');
    }
  }, [droppedItemId, level]);

  const handleNextLevel = useCallback(() => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel((prev) => prev + 1);
      setDroppedItemId(null);
      setFeedback(null);
      setLevelCompleted(false);
    } else {
      setGameCompleted(true);
    }
  }, [currentLevel]);

  const handleBack = () => navigate('/semana/1/description-match');

  const handleRestartGame = useCallback(() => {
    setCurrentLevel(0);
    setDroppedItemId(null);
    setFeedback(null);
    setLevelCompleted(false);
    setGameCompleted(false);
  }, []);

  const handleNextGame = useCallback(() => {
    // Navigate to next activity (Rescata a Pulgarcito)
    navigate('/semana/1');
  }, [navigate]);

  const droppedItem = level.items.find((i) => i.id === droppedItemId);
  const originalPrompt = level.prompt;
  const speechText = feedback
    ? `"${feedback}"`
    : originalPrompt;

  return (
    <div
      className="text-on-background font-body-md overflow-x-hidden flex flex-col min-h-screen relative"
      style={{ background: 'linear-gradient(135deg, #fbf8fc 0%, #f3e0c2 100%)' }}
    >
      {/* Back Button */}
      <button
        onClick={handleBack}
        className="absolute top-4 left-4 md:top-6 md:left-8 text-primary hover:scale-105 transition-transform duration-200 active:scale-95 flex items-center justify-center p-2 rounded-full hover:bg-surface-container z-50"
      >
        <span className="material-symbols-outlined text-3xl">arrow_back</span>
      </button>

      {gameCompleted ? (
        /* Score Screen */
        <main className="flex-grow flex flex-col items-center justify-center px-margin-mobile md:px-margin-desktop py-lg w-full relative z-20">
          <div className="bg-surface-container rounded-3xl p-lg md:p-xl flex flex-col items-center gap-lg w-full max-w-md border-2 border-surface-dim relative overflow-hidden"
               style={{ boxShadow: '0 10px 40px -10px rgba(74, 101, 73, 0.15), 0 0 80px 20px rgba(139, 168, 136, 0.2)' }}>
            {/* Background glows */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary-fixed opacity-50 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary-container opacity-40 rounded-full blur-3xl pointer-events-none"></div>

            {/* Illustration */}
            <div className="w-full aspect-square max-w-[280px] bg-surface-container-lowest rounded-2xl flex items-center justify-center p-md border-2 border-outline-variant relative z-10">
              <img
                alt="Science character"
                className="w-full h-full object-contain drop-shadow-md"
                src={level.characterImage}
              />
            </div>

            {/* Score Content */}
            <div className="text-center z-10 flex flex-col gap-sm items-center">
              <div className="flex items-center gap-sm text-primary">
                <span className="material-symbols-outlined text-[32px]">military_tech</span>
                <span className="font-headline-md text-headline-md">¡Puntaje Perfecto! 3 de 3</span>
              </div>
              <div className="w-full h-4 bg-surface-container-highest rounded-full overflow-hidden max-w-xs">
                <div className="h-full bg-primary w-full"></div>
              </div>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-sm mx-auto">
                Tu observación es de un verdadero científico. ¡Sigue así!
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-md w-full justify-center z-10 mt-sm">
              <button
                onClick={handleRestartGame}
                className="bg-surface-container-highest text-on-surface-variant font-label-lg text-label-lg rounded-2xl py-md px-lg flex items-center gap-sm justify-center hover:bg-opacity-90 border-b-4 border-surface-dim active:translate-y-0.5 active:border-b-2 transition-all"
              >
                <span>Reintentar</span>
                <span className="material-symbols-outlined">replay</span>
              </button>
              <button
                onClick={handleNextGame}
                className="bg-primary text-on-primary font-label-lg text-label-lg rounded-2xl py-md px-lg flex items-center gap-sm justify-center hover:bg-opacity-90 border-b-4 border-[#334d33] active:translate-y-0.5 active:border-b-2 transition-all"
              >
                <span>Siguiente Juego</span>
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      ) : (
        /* Main Game Area */
        <main className="flex-grow flex flex-col md:flex-row items-center justify-center px-margin-mobile md:px-margin-desktop py-lg gap-lg max-w-7xl mx-auto w-full">
          {/* Left Column: Character & Prompt */}
          <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center relative">
            <div className="bg-surface-container-lowest p-md rounded-xl clay-shadow clay-border mb-lg relative max-w-[280px] w-full z-10">
              <p
                className="font-body-lg text-body-lg text-center text-on-surface"
                dangerouslySetInnerHTML={{ __html: speechText }}
              />
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-surface-container-lowest rotate-45 border-r-2 border-b-2 border-surface-container"></div>
            </div>
            <div className="w-48 h-64 relative rounded-2xl overflow-hidden clay-shadow">
              <img
                alt={level.characterAlt}
                className="w-full h-full object-cover"
                src={level.characterImage}
              />
            </div>
          </div>

          {/* Center/Right Column: Interactive Zone */}
          <div className="flex-[2] w-full flex flex-col items-center justify-center gap-xl">
            {/* Level Indicator */}
            <div className="flex items-center gap-2">
              {levels.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-3 h-3 rounded-full ${
                    idx === currentLevel
                      ? 'bg-primary'
                      : idx < currentLevel
                      ? 'bg-primary-container'
                      : 'bg-surface-variant'
                  }`}
                />
              ))}
              <span className="font-label-md text-label-md text-on-surface-variant ml-2">
                Nivel {currentLevel + 1}/{levels.length}
              </span>
            </div>

            {/* Drop Zone */}
            <div
              className={`w-full max-w-2xl aspect-video bg-surface-container-low/50 rounded-3xl border-4 border-dashed border-outline-variant flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 ${
                isDragOver ? 'drop-target-active' : ''
              }`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="absolute inset-0 bg-tertiary-fixed opacity-20 pointer-events-none"></div>
              {!droppedItem ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <span
                    className="material-symbols-outlined text-outline-variant text-6xl mb-sm"
                    style={{ fontVariationSettings: '"FILL" 0' }}
                  >
                    place_item
                  </span>
                  <p className="font-headline-md text-headline-md text-outline-variant">ZONA DE ENTREGA</p>
                </div>
              ) : (
                <div className="m-auto absolute inset-0 flex items-center justify-center">
                  <div className="bg-surface-container-lowest rounded-lg clay-shadow flex items-center justify-center w-32 h-32">
                    <img
                      alt={droppedItem.alt}
                      className="object-contain z-10 pointer-events-none w-24 h-24"
                      src={droppedItem.src}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Asset Shelf */}
            <div className="w-full max-w-3xl bg-tertiary-fixed rounded-xl p-sm clay-shadow clay-border flex flex-wrap justify-center gap-md">
              {level.items.map((item) => (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-lg clay-shadow flex items-center justify-center transition-transform hover:scale-105 active:scale-95 group relative overflow-hidden w-32 h-32 ${
                    droppedItemId === item.id ? 'hidden' : 'draggable'
                  }`}
                  draggable={droppedItemId !== item.id}
                  onDragStart={() => handleDragStart(item.id)}
                  onDragEnd={handleDragEnd}
                >
                  <img
                    alt={item.alt}
                    className="object-contain z-10 pointer-events-none w-24 h-24"
                    src={item.src}
                  />
                  <div className="absolute inset-0 bg-secondary-container opacity-0 group-hover:opacity-20 transition-opacity pointer-events-none"></div>
                </div>
              ))}
            </div>

            {/* Controls */}
            <div className="flex gap-md mt-sm flex-wrap justify-center">
              <button
                className="bg-surface-container flex items-center gap-sm px-md py-sm rounded-full font-label-lg text-label-lg text-on-surface-variant clay-border btn-press"
                onClick={handleReset}
              >
                <span className="material-symbols-outlined">refresh</span>
                Reiniciar
              </button>
              {!levelCompleted ? (
                <button
                  className="bg-primary flex items-center gap-sm px-md py-sm rounded-full font-label-lg text-label-lg text-on-primary clay-border btn-press"
                  onClick={handleCheck}
                >
                  Comprobar
                </button>
              ) : (
                <button
                  className="bg-primary flex items-center gap-sm px-md py-sm rounded-full font-label-lg text-label-lg text-on-primary clay-border btn-press"
                  onClick={handleNextLevel}
                >
                  <span className="material-symbols-outlined">arrow_forward</span>
                  {currentLevel < levels.length - 1 ? 'Siguiente nivel' : 'Finalizar'}
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Bottom Navigation (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-margin-mobile pb-sm pt-xs bg-surface shadow-sm rounded-t-xl pb-6">
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
          <span className="material-symbols-outlined">map</span>
          <span className="text-xs mt-1">Mapa</span>
        </div>
        <div className="flex flex-col items-center justify-center bg-primary-container text-on-primary-container rounded-full px-md py-xs">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: '"FILL" 1' }}>
            science
          </span>
          <span className="text-xs mt-1 font-bold">Lab</span>
        </div>
        <div className="flex flex-col items-center justify-center text-on-surface-variant p-2">
          <span className="material-symbols-outlined">trending_up</span>
          <span className="text-xs mt-1">Progreso</span>
        </div>
      </nav>
    </div>
  );
}
