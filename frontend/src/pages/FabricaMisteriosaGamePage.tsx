import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface GameObject {
  id: string;
  name: string;
  type: string;
}

type GameState = | 'IDLE' | 'LAUNCHING' | 'REVEALING' | 'SELECTING' | 'ENDED';

//OBJETOS A CLASIFICAR

const objects: GameObject[] =[
  {id: 'plastico', name: 'Botella de plástico', type: 'Plástico'},
  {id: 'papel', name: 'Caja de cartón', type: 'Papel'},
  {id: 'vidrio', name: 'Botella de vidrio', type: 'Vidrio'},
  {id: 'metal', name: 'Lata de refresco', type: 'Metal'},
  {id: 'organico', name: 'Manzana mordida', type: 'Orgánico'}
  
];

//CONTENEDORES CLASIFICATORIOS

const binTypes =[
  'Plástico', 'Papel', 'Vidrio', 'Metal', 'Orgánico'
];

//ICONO DE BOTON FLECHA

function ArrowLeftIcon(){
  return(
    <svg className= "w-4 h-4 sm:w-5 sm:h-5" viewBox="0 0 24 24" fill = "none" stroke = "currentColor" strokeWidth = "2.6" strokeLinecap = "round" strokeLinejoin = "round">
    <path d="M19 12H5" />
    <polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

//ICONO DE SONIDO

function SoundIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      className="w-4 h-4 sm:w-5 sm:h-5 min-[1440px]:w-6 min-[1440px]:h-6"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

      {muted ? (
        <>
          <line x1="17" y1="9" x2="23" y2="15" />
          <line x1="23" y1="9" x2="17" y2="15" />
        </>
      ) : (
        <>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </>
      )}
    </svg>
  );
}

//ICONO DE LANZAMIENTO

function LaunchIcon() { 
  return ( 
  <svg className="w-5 h-5 sm:w-6 sm:h-6 min-[1440px]:w-7 min-[1440px]:h-7 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" >
     <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
     <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /> 
     <path d="M9 12H4s.55-3.03 2-4.5c1.47-1.47 4.5-2 4.5-2" /> 
     <path d="M12 15v5s3.03-.55 4.5-2c1.47-1.47 2-4.5 2-4.5" />
  </svg>
 );
}

//ILUSTRACIONES DE OBJETOS

function ObjectIllustration({ objectId, className = 'w-full h-full', 

}: { objectId: string; className?: string; }) {
   /* Botella de plástico */ 
   if (objectId === 'plastico') { 
    return ( 
    <svg className={className} viewBox="0 0 100 100" fill="none"> 
     <ellipse cx="50" cy="94" rx="24" ry="5" fill="#CBD5E1" opacity="0.6" />
     <rect x="42" y="8" width="16" height="8" rx="2" fill="#0284C7" /> 
     <line x1="45" y1="8" x2="45" y2="16" stroke="#38BDF8" strokeWidth="1.5" /> 
     <line x1="50" y1="8" x2="50" y2="16" stroke="#38BDF8" strokeWidth="1.5" /> 
     <line x1="55" y1="8" x2="55" y2="16" stroke="#38BDF8" strokeWidth="1.5" /> 
     <rect x="40" y="16" width="20" height="4" rx="1.5" fill="#0369A1" /> 
     <path d="M43 20h14l8 12v54a8 8 0 0 1-8 8H43a8 8 0 0 1-8-8V32l8-12z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="3" strokeLinejoin="round" /> 
     <path d="M37 42h26" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" /> 
     <path d="M36 52h28" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" /> 
     <path d="M36 62h28" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" /> 
     <path d="M37 72h26" stroke="#38BDF8" strokeWidth="2.5" strokeLinecap="round" /> 
     <rect x="36" y="47" width="28" height="18" rx="3" fill="#FFFFFF" opacity="0.9" stroke="#7DD3FC" strokeWidth="1.5" /> 
     <circle cx="44" cy="56" r="2" fill="#0284C7" /> 
     <circle cx="56" cy="56" r="2" fill="#0284C7" /> 
     <path d="M48 59c1 1 3 1 4 0" stroke="#0284C7" strokeWidth="1.8" strokeLinecap="round" /> 
     <path d="M40 26l-2 48" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" opacity="0.9" />
    </svg>
  );
 }
 /* Caja de cartón */
 if (objectId === 'papel') {
   return ( 
   <svg className={className} viewBox="0 0 100 100" fill="none">
    <ellipse cx="50" cy="94" rx="28" ry="5" fill="#CBD5E1" opacity="0.6" /> 
    <path d="M22 35 L50 20 L78 35 L50 50 Z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="2.5" /> 
    <path d="M22 35 L50 50 L50 82 L22 67 Z" fill="#93C5FD" stroke="#0284C7" strokeWidth="2.5" /> 
    <path d="M78 35 L50 50 L50 82 L78 67 Z" fill="#60A5FA" stroke="#0284C7" strokeWidth="2.5" /> 
    <path d="M42 24 L50 28 L58 24" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" /> 
    <circle cx="43" cy="58" r="2.2" fill="#0F172A" />
    <circle cx="57" cy="58" r="2.2" fill="#0F172A" /> 
    <path d="M47 64c1.5 1.5 4.5 1.5 6 0" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" /> 
    <line x1="50" y1="36" x2="50" y2="48" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.8" /> 
   </svg> 
  );
 }
/* Botella de vidrio */
  if (objectId === 'vidrio') { 
    return ( 
    <svg className={className} viewBox="0 0 100 100" fill="none">
     <ellipse cx="50" cy="94" rx="24" ry="5" fill="#CBD5E1" opacity="0.6" /> 
     <polygon points="44,8 56,8 54,16 46,16" fill="#D97706" stroke="#92400E" strokeWidth="2" />
     <line x1="46" y1="12" x2="54" y2="12" stroke="#B45309" strokeWidth="1.5" /> 
     <rect x="43" y="16" width="14" height="4" rx="2" fill="#A7F3D0" stroke="#047857" strokeWidth="2" /> 
     <path d="M45 20v18c-8 6-12 12-12 24v20a8 8 0 0 0 8 8h18a8 8 0 0 0 8-8V62c0-12-4-18-12-24V20H45z" fill="#D1FAE5" stroke="#047857" strokeWidth="3" strokeLinejoin="round" /> 
     <path d="M34 66c5-2 11 2 16 0s11 2 16 0v16a6 6 0 0 1-6 6H40a6 6 0 0 1-6-6V66z" fill="#6EE7B7" opacity="0.75" /> 
     <path d="M38 34v44" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" /> 
     <path d="M42 38v30" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" /> 
     <circle cx="45" cy="56" r="2.2" fill="#065F46" /> 
     <circle cx="55" cy="56" r="2.2" fill="#065F46" /> 
     <path d="M48 60c1 1 3 1 4 0" stroke="#065F46" strokeWidth="2" strokeLinecap="round" /> 
    </svg>
   ); 
  }
/* Lata de metal */
  if (objectId === 'metal') { 
    return ( 
    <svg className={className} viewBox="0 0 100 100" fill="none"> 
     <ellipse cx="50" cy="94" rx="26" ry="5" fill="#CBD5E1" opacity="0.6" /> 
     <ellipse cx="50" cy="22" rx="24" ry="9" fill="#E2E8F0" stroke="#475569" strokeWidth="3" /> 
     <ellipse cx="50" cy="22" rx="16" ry="5.5" fill="#CBD5E1" /> 
     <circle cx="47" cy="21" r="4.5" fill="#F8FAFC" stroke="#475569" strokeWidth="2" /> 
     <path d="M47 21h8v2h-8z" fill="#475569" /> 
     <path d="M26 22v54c0 5 10.7 9 24 9s24-4 24-9V22" fill="#F1F5F9" stroke="#475569" strokeWidth="3" /> 
     <path d="M26 36v32c8 3 16 3 24 3s16 0 24-3V36c-8 3-16 3-24 3s-16 0-24-3z" fill="#2DD4BF" stroke="#0F766E" strokeWidth="2" /> 
     <circle cx="44" cy="51" r="2.2" fill="#042F2E" /> 
     <circle cx="56" cy="51" r="2.2" fill="#042F2E" /> 
     <path d="M48 55c1 1 3 1 4 0" stroke="#042F2E" strokeWidth="2" strokeLinecap="round" /> 
     <path d="M32 26v48" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0.8" /> 
    </svg>
   );
 }
/* Manzana orgánica */
    return ( 
    <svg className={className} viewBox="0 0 100 100" fill="none"> 
     <ellipse cx="50" cy="94" rx="26" ry="5" fill="#CBD5E1" opacity="0.6" /> 
     <path d="M50 24c-1-9 5-15 5-15" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" /> 
     <path d="M52 16c8-5 16-2 17 6-8 1-14-2-17-6z" fill="#4ADE80" stroke="#15803D" strokeWidth="2" /> 
     <path d="M50 32c-6-10-24-10-30 2-6 12-2 30 8 40 7 7 15 10 22 10s15-3 22-10c4-4 6-10 6-16-4-1-6-4-6-8 0-4 3-7 6-8 0-3-1-6-2-8-6-12-20-12-26-2z" fill="#FB7185" stroke="#E11D48" strokeWidth="3.5" strokeLinejoin="round" /> 
     <path d="M78 44c-4 0-7 3-7 7s3 7 7 7" stroke="#FFE4E6" strokeWidth="3" fill="#FFF1F2" /> 
     <ellipse cx="36" cy="38" rx="4" ry="2" transform="rotate(-30 36 38)" fill="#FFFFFF" opacity="0.8" /> 
     <circle cx="39" cy="53" r="2.5" fill="#881337" /> 
     <circle cx="53" cy="53" r="2.5" fill="#881337" /> 
     <circle cx="38" cy="51.5" r="1" fill="#FFFFFF" /> 
     <circle cx="52" cy="51.5" r="1" fill="#FFFFFF" /> 
     <path d="M44 58c1.5 2 3.5 2 5 0" stroke="#881337" strokeWidth="2.2" strokeLinecap="round" /> 
     <circle cx="33" cy="57" r="2.5" fill="#FDA4AF" /> 
     <circle cx="59" cy="57" r="2.5" fill="#FDA4AF" /> 
    </svg>
  );
 }

 //ICONOS DE CONTENEDORES 
 function BinIcon({ type }: { type: string }) { 
  if (type === 'Plástico') { 
    return ( 
    <svg className="w-8 h-8 sm:w-9 sm:h-9 min-[1440px]:w-11 min-[1440px]:h-11" fill="none" viewBox="0 0 64 64"> 
     <rect fill="#F59E0B" height="8" rx="3" width="20" x="22" y="6" /> 
     <path d="M20 14h24l4 10v32a6 6 0 0 1-6 6H22a6 6 0 0 1-6-6V24l4-10z" fill="#FDE68A" stroke="#D97706" strokeLinejoin="round" strokeWidth="3" /> 
     <circle cx="32" cy="38" fill="none" r="8" stroke="#D97706" strokeDasharray="10 6" strokeWidth="2.5" /> 
     <path d="M38 32l3 3-3 3" stroke="#D97706" strokeLinecap="round" strokeWidth="2.5" /> 
     <path d="M20 22h24" stroke="#FBBF24" strokeWidth="2" /> 
    </svg> 
  );
 }

 if (type === 'Papel'){
  return ( 
   <svg className="w-8 h-8 sm:w-9 sm:h-9 min-[1440px]:w-11 min-[1440px]:h-11" fill="none" viewBox="0 0 64 64">
     <path d="M12 20h30a4 4 0 0 1 4 4v32a4 4 0 0 1-4 4H12a4 4 0 0 1-4-4V24a4 4 0 0 1 4-4z" fill="#BAE6FD" stroke="#0284C7" strokeWidth="3" /> 
     <path d="M22 10h28a4 4 0 0 1 4 4v34a4 4 0 0 1-4 4H22V10z" fill="#FFFFFF" stroke="#0284C7" strokeWidth="3" /> 
     <line stroke="#38BDF8" strokeLinecap="round" strokeWidth="2.5" x1="28" x2="44" y1="20" y2="20" /> 
     <line stroke="#38BDF8" strokeLinecap="round" strokeWidth="2.5" x1="28" x2="44" y1="28" y2="28" /> 
     <line stroke="#38BDF8" strokeLinecap="round" strokeWidth="2.5" x1="28" x2="38" y1="36" y2="36" /> 
    </svg> 
  );
 }

  if (type === 'Vidrio') { 
    return ( 
     <svg className="w-8 h-8 sm:w-9 sm:h-9 min-[1440px]:w-11 min-[1440px]:h-11" fill="none" viewBox="0 0 64 64"> 
      <rect fill="#047857" height="6" rx="2" width="8" x="28" y="6" /> 
      <path d="M27 12h10v10l7 8v24a4 4 0 0 1-4 4H24a4 4 0 0 1-4-4V30l7-8V12z" fill="#A7F3D0" stroke="#047857" strokeWidth="3" /> 
      <line stroke="#FFFFFF" strokeLinecap="round" strokeWidth="2.5" x1="26" x2="26" y1="36" y2="48" /> 
     </svg> 
    );
   }

   if (type === 'Metal') { 
    return ( 
    <svg className="w-8 h-8 sm:w-9 sm:h-9 min-[1440px]:w-11 min-[1440px]:h-11" fill="none" viewBox="0 0 64 64"> 
     <ellipse cx="32" cy="16" fill="#CBD5E1" rx="16" ry="6" stroke="#475569" strokeWidth="3" /> 
     <circle cx="32" cy="16" fill="#94A3B8" r="3" /> 
     <path d="M16 16v32c0 3.3 7.16 6 16 6s16-2.7 16-6V16" fill="#E2E8F0" stroke="#475569" strokeWidth="3" /> 
     <line stroke="#94A3B8" strokeWidth="2" x1="16" x2="48" y1="26" y2="26" /> 
    </svg> 
    ); 
  }

  return ( 
    <svg className="w-8 h-8 sm:w-9 sm:h-9 min-[1440px]:w-11 min-[1440px]:h-11" fill="none" viewBox="0 0 64 64"> 
      <path d="M32 14c-1-5 2-8 2-8" stroke="#78350F" strokeLinecap="round" strokeWidth="3" /> 
      <path d="M33 10c4-3 8-1 9 3-4 1-7-1-9-3z" fill="#4ADE80" stroke="#15803D" strokeWidth="1.5" /> 
      <path d="M32 20c-4-6-16-6-20 2-4 8-1 20 6 26 5 4 10 6 14 6s9-2 14-6c7-6 10-18 6-26-4-8-16-8-20-2z" fill="#FB923C" stroke="#C2410C" strokeLinejoin="round" strokeWidth="3" /> 
    </svg> 
  );
 }

 //ICONOS DE ESTADO

function SearchIcon() { 
  return ( 
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"> 
      <circle cx="11" cy="11" r="8" /> 
      <line x1="21" y1="21" x2="16.65" y2="16.65" /> 
    </svg>
   );
 }

function CheckIcon() { 
  return ( 
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"> 
       <polyline points="20 6 9 17 4 12" /> 
    </svg>
   );
 } 

function WarningIcon() { 
  return ( 
    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"> 
       <circle cx="12" cy="12" r="10" /> 
       <line x1="12" y1="8" x2="12" y2="12" /> 
       <line x1="12" y1="16" x2="12.01" y2="16" /> 
    </svg> 
  );
 }

//FUNCION PARA MEZCLAR OBJETOS

function shuffleArray<T>(array: T[]): T[] { 
  const shuffled = [...array]; 
  
  for (let i = shuffled.length - 1; i > 0; i--) { 
    const j = Math.floor(Math.random() * (i + 1)); 
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; 
  }
  
  
  return shuffled;
 }

 //COMPONENTE PRINCIPAL DEL JUEGO

export default function FabricaMisteriosaGamePage() { 
  const navigate = useNavigate(); 
  /* Referencias de elementos importantes */ 
  const gameContainerRef = useRef<HTMLDivElement>(null); 
  const objectRef = useRef<HTMLDivElement>(null); 
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

 //ESTADOS DEL ERROR
  const [gameSequence, setGameSequence] = useState<GameObject[]>([]);
  const [currentRound, setCurrentRound] = useState(0);
  const [gameState, setGameState] = useState<GameState>('IDLE'); 

  const [showObject, setShowObject] = useState(false); 
  const [showBins, setShowBins] = useState(false); 
  const [gameEnded, setGameEnded] = useState(false); 

  const [machineVibrating, setMachineVibrating] = useState(false); 
  const [objectLaunching, setObjectLaunching] = useState(false); 
  const [objectBob, setObjectBob] = useState(false); 

  const [selectedBin, setSelectedBin] = useState<string | null>(null); 
  const [errorBin, setErrorBin] = useState<string | null>(null); 
  
  const [collectedResults, setCollectedResults] = useState<GameObject[]>([]); 
  
  const [soundEnabled, setSoundEnabled] = useState(true); 
  const [instruction, setInstruction] = useState< 
  'ready' | 'object' | 'success' | 'error' 
>('ready'); 

const currentObject = gameSequence[currentRound];  

//LIMPIAR TEMPORIZADORES

  useEffect(() => { 
    return () => { 
      if (feedbackTimerRef.current) { 
        clearTimeout(feedbackTimerRef.current);
      } 
    }; 
  }, 
[]
);

  //SONIDO BASE

const playTone = useCallback( 
  ( 
    frequency: number, 
    duration = 0.15, 
    type: OscillatorType = 'sine'
   ) => { 
    if (!soundEnabled) return; 
    try { 
      const AudioContextClass = 
        window.AudioContext || 
        ( 
          window as typeof window & { 
            webkitAudioContext?: typeof AudioContext; 
          } ).webkitAudioContext; 
      if (!AudioContextClass) return; 
      
      const audioContext = new AudioContextClass(); 
      const oscillator = audioContext.createOscillator(); 
      const gain = audioContext.createGain(); 
      
      oscillator.type = type; 
      oscillator.frequency.setValueAtTime( 
        frequency, 
        audioContext.currentTime 
      );
      
      gain.gain.setValueAtTime( 
        0.08,
        audioContext.currentTime
       );
       
       gain.gain.exponentialRampToValueAtTime( 
        0.0001, 
        audioContext.currentTime + duration
       );
        
       oscillator.connect(gain);
       gain.connect(audioContext.destination); 
       
       oscillator.start(); 
       oscillator.stop( 
        audioContext.currentTime + duration 
      );
      
      oscillator.onended = () => { 
        audioContext.close(); 
      };
     } catch { 
      /* El sonido es opcional; el juego continúa aunque falle. */
     }
    }, 
    [soundEnabled] 
  );  

//SONIDO DE LANZAMIENTO

 const playWhooshSound = useCallback(() => { 
  if (!soundEnabled) return;
  
  try { 
    const AudioContextClass = 
     window.AudioContext || 
     ( 
      window as typeof window & { 
        webkitAudioContext?: typeof AudioContext; 
      }
     ).webkitAudioContext; 
     
    if (!AudioContextClass) return; 
    
    const audioContext = new AudioContextClass(); 
    const oscillator = audioContext.createOscillator(); 
    const gain = audioContext.createGain(); 
    
    oscillator.type = 'triangle'; 
    
    oscillator.frequency.setValueAtTime( 
      260, audioContext.currentTime
     ); 
     
     oscillator.frequency.exponentialRampToValueAtTime( 
      720, audioContext.currentTime + 0.35 
    ); 
    
    gain.gain.setValueAtTime( 
      0.09, audioContext.currentTime 
    ); 
    
    gain.gain.exponentialRampToValueAtTime( 
      0.001, audioContext.currentTime + 0.35 
    );
    
    oscillator.connect(gain); 
    gain.connect(audioContext.destination); 
    
    oscillator.start(); 
    oscillator.stop( 
      audioContext.currentTime + 0.35 
    );
    
    oscillator.onended = () => { 
      audioContext.close(); 
    };
   } catch { 
    /* El juego continúa aunque el sonido no esté disponible. */ 
  }
 }, [soundEnabled]);

 //SONIDO DE ACIERTO

 const playSuccessChime = useCallback(() => { 
  if (!soundEnabled) return; 
  
  playTone(523.25, 0.12); 
  setTimeout(() => playTone(659.25, 0.12), 90); 
  setTimeout(() => playTone(783.99, 0.25), 180); 
}, 
[playTone, soundEnabled]
);

//SONIDO DE ERROR

  const playErrorBeep = useCallback(() => { 
    if (!soundEnabled) return; 
    
    playTone(280, 0.12); 
    setTimeout( 
      () => playTone(220, 0.18), 110 
    );
   }, 
 [playTone, soundEnabled]
);

//SONIDO DE VICTORIA   
   const playVictoryFanfare = useCallback(() => { 
    if (!soundEnabled) return; 

    playTone(523.25, 0.14); 
    
    setTimeout( 
      () => playTone(659.25, 0.14), 110 
    ); 
    
    setTimeout( 
      () => playTone(783.99, 0.16), 220
     );
     
     setTimeout( 
      () => playTone(1046.5, 0.45, 'triangle'), 360 
    );
    
    for (let i = 0; i < 7; i++) { 
      setTimeout( 
        () => 
          playTone( 
            400 + Math.random() * 600, 0.05, 'triangle' 
          ),
         180 + i * 85 
      );
    } 
  }, 
 [playTone, soundEnabled]
);

  //INICIAR O REINICIAR EL JUEGO

  const initGame = useCallback(() => { 
    if (feedbackTimerRef.current) { 
      clearTimeout(feedbackTimerRef.current); 
      feedbackTimerRef.current = null; 
    } 
    
    const shuffled = shuffleArray(objects); 
    
    setGameSequence(shuffled); 
    setCurrentRound(0); 
    setGameState('IDLE'); 
    
    setShowObject(false); 
    setShowBins(false); 
    setGameEnded(false); 
    
    setMachineVibrating(false); 
    setObjectLaunching(false); 
    setObjectBob(false); 
    
    setSelectedBin(null); 
    setErrorBin(null); 
    
    setCollectedResults([]); 
    
    setInstruction('ready');
   }, 
 []
);

//INICIAR EL JUEGO AL CARGAR LA PAGINA

useEffect(() => { initGame(); }, [initGame]);

//LANZAR EL OBJETO DESDE LA MAQUINA

const handleLaunch = useCallback(() => { 
  if (gameState !== 'IDLE' || !currentObject) return; 
  
  setGameState('LAUNCHING'); 
  setMachineVibrating(true); 
  setObjectLaunching(true); 
  setShowBins(false); 
  setInstruction('ready'); 

  playTone(320, 0.12); 
  
  setTimeout(() => { 
    setMachineVibrating(false); 
    playWhooshSound(); 
    
    setShowObject(true); 
    
    setTimeout(() => { 
      setObjectLaunching(false); 
      setObjectBob(true); 
      // Tras revelar, habilita los contenedores al tiro (sin un toque extra).
      setGameState('SELECTING');
      setShowBins(true);
      setInstruction('object');
    }, 700);
   }, 350);
  },
 [ currentObject, gameState, playTone, playWhooshSound, ]
);

//REVELAR EL OBJETO

const handleObjectClick = useCallback(() => { 
  if ( gameState !== 'REVEALING' || !currentObject ) {
     return;
     }
     
     setObjectBob(false); 
     setGameState('SELECTING'); 
     setShowBins(true); 
     setInstruction('object'); 
     
     playTone(620, 0.1); 
     
     if (objectRef.current) { 
      objectRef.current.animate( 
        [ { transform: 'scale(1)' }, { transform: 'scale(1.12)' }, { transform: 'scale(1)' }, ],
        { duration: 350, easing: 'ease-out', } 
      );
     }
    },
  [ currentObject, gameState, playTone, ]
);

//CREAR ESTRELLAS DE CELEBRACION

const createCelebrationStars = useCallback( 
  (x: number, y: number, count = 10) => { 
    const container = gameContainerRef.current; 
    
    if (!container) return; 
    const colors = [ '#A7F3D0', '#A5F3FC', '#FDE047', '#E9D8FD', '#6EE7B7', '#38BDF8', '#C4B5FD', ]; 
    
    for (let i = 0; i < count; i++) { 
      const star = document.createElement('div'); 
      
      star.className = 'celebration-sparkle absolute pointer-events-none z-[70]'; 
      star.innerHTML = ` 
       <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor"> 
         <path d="M12 2l2.4 6.9 6.9 2.4-6.9 2.4L12 20.6l-2.4-6.9L2.7 11.3 9.6 8.9z"/> 
       </svg> 
      `; 
      
      const rect = container.getBoundingClientRect(); 
      
      star.style.left = `${x - rect.left}px`; 
      star.style.top = `${y - rect.top}px`; 
      
      star.style.color = colors[ 
        Math.floor( Math.random() * colors.length )
       ];
       
       const angle = Math.random() * Math.PI * 2;
       
       const distance = 35 + Math.random() * 55; 
       
       const tx = Math.cos(angle) * distance; 
       
       const ty = Math.sin(angle) * distance; 
       
       star.style.setProperty( '--tx', `${tx}px` ); 
       star.style.setProperty( '--ty', `${ty}px` ); 
       
       container.appendChild(star); 
       
       setTimeout(() => { 
        star.remove();
       }, 850); 
      }
     },
  []
 );

 //SELECCIONAR UN CONTENEDOR

 const handleBinClick = useCallback( 
  (binType: string) => { 
    if ( gameState !== 'SELECTING' || !currentObject ) { 
      return;
     } 
    
     if (feedbackTimerRef.current) { 
      clearTimeout( 
        feedbackTimerRef.current 
      ); 
      feedbackTimerRef.current = null; 
    }
    
    setSelectedBin(binType);
  

  //RESPUESTA CORRECTA

  if (binType === currentObject.type) { 
    setGameState('ENDED');
    setObjectBob(false); 
    setShowBins(false); 
    setInstruction('success'); 
    
    playSuccessChime(); 
    
    const container = gameContainerRef.current; 
    
    if (container) { 
      const rect = container.getBoundingClientRect(); 
      
      createCelebrationStars( 
        rect.left + rect.width / 2, rect.top + rect.height / 2, 14 
      );
     } 
     
     setCollectedResults((previous) => [ ...previous, currentObject, ]); 
     
     const nextRound = currentRound + 1; 
     
     /* Último objeto */ 
     
     if ( nextRound >= gameSequence.length ) { 
      playVictoryFanfare(); 
      
      setTimeout(() => { 
        setGameEnded(true); 
      }, 500); 
      
      return; 
    
    }

    //SIGUIENTE RONDA
    
    feedbackTimerRef.current = setTimeout(() => { 
      setCurrentRound(nextRound); 
      
      setGameState('IDLE'); 
      setShowObject(false); 
      setShowBins(false); 
      setSelectedBin(null); 
      setErrorBin(null); 
      setInstruction('ready'); 
      setObjectBob(false); 
    }, 1500); 
    
  return;
 }

   //RESPUESTA INCORRECTA
   playErrorBeep(); 
   
   setErrorBin(binType); 
   setSelectedBin(null); 
   setInstruction('error');
   
   if (objectRef.current) { 
    objectRef.current.animate( 
      [ 
        { transform: 'translateX(0) rotate(0deg)', },
        { transform: 'translateX(-8px) rotate(-5deg)', },
        { transform: 'translateX(8px) rotate(5deg)', }, 
        { transform: 'translateX(-5px) rotate(-3deg)', }, 
        { transform: 'translateX(0) rotate(0deg)', },
       ],
      { duration: 450, easing: 'ease-in-out', } 
    );
   }
   
   const container = gameContainerRef.current;
   
  if (container) { 
    const rect = container.getBoundingClientRect(); 
    
    createCelebrationStars( 
      rect.left + rect.width / 2, 
      rect.top + rect.height / 2, 
      5
     );
    }
    
    feedbackTimerRef.current = 
      setTimeout(() => { 
        setErrorBin(null);
        setSelectedBin(null); 
        setInstruction('object'); 
      }, 2000);
    }, 
     
    [ 
      createCelebrationStars, 
      currentObject, 
      currentRound,
      gameSequence.length,
      gameState,
      playErrorBeep, 
      playSuccessChime,
      playVictoryFanfare,
     ] 
   );

   //JUGAR NUEVAMENTE

   const handleReplay = useCallback(() => { 
    setGameEnded(false); 
    initGame();
   }, [initGame]);

   //VOLVER A LA SEMANA 2

   const handleExit = useCallback(() => { 
    playTone(440, 0.1);
    navigate('/semana/2');
   }, [navigate, playTone]);

   //CAMBIAR EL ESTADO DEL SONIDO

   const handleSoundToggle = useCallback(() => { 
    setSoundEnabled((previous) => !previous); 
  }, []);

  //TEXTO DE INSTRUCCION

  const renderInstruction = () => { 
    if (instruction === 'success') { 
      return ( 
        <span className="text-emerald-700 font-extrabold flex items-center justify-center gap-1.5 text-center"> 
         <CheckIcon />
          <span> ¡Misterio resuelto! ¡Excelente clasificación, pequeño científico! </span>
        </span>
      );
     }
     
     if (instruction === 'error') { 
      return ( 
        <span className="text-amber-800 font-extrabold flex items-center justify-center gap-1.5 text-center"> 
          <WarningIcon /> 
          <span> ¡Casi! Observa con atención el material y prueba con otro contenedor. </span> 
        </span>
      );
     } 
     
     if (instruction === 'object') { 
      return ( 
      <>
       <SearchIcon />
        <span> ¡Ya salió el residuo! Toca el contenedor correcto abajo. 
       </span> 
      </>
    );
   } 
   
   return ( 
     <>
        <span> ¡Un residuo misterioso está listo! Toca «¡EXPULSAR OBJETO!» y luego elige su contenedor. 
        </span>
     </>
   );
  };

  //RENDER PRINCIPAL 

   return ( 
     <div className="fabrica-root min-h-screen w-full bg-[#EEFBF7] text-[#0F172A] flex flex-col overflow-hidden">
       <div
         ref={gameContainerRef} 
         className="responsive-stage relative flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-gradient-to-b from-[#DDF7F0] via-[#EAFBF5] to-[#D5F3EB]" 
         > 
         {/* === FONDO DECORATIVO === */}
         
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-16 sm:top-20 left-1/4 w-40 h-40 sm:w-72 sm:h-72 rounded-full bg-teal-200/30 blur-3xl" /> 
          <div className="absolute top-20 sm:top-24 right-1/4 w-44 h-44 sm:w-80 sm:h-80 rounded-full bg-purple-200/30 blur-3xl" /> 
          <div className="absolute top-36 sm:top-48 left-1/2 -translate-x-1/2 w-[20rem] sm:w-[32rem] h-40 sm:h-60 rounded-full bg-emerald-200/30 blur-3xl" /> 
          {/* Engranajes decorativos */}

           <div className="absolute top-32 sm:top-40 min-[1440px]:top-48 left-0 sm:left-5 min-[1440px]:left-10 opacity-30 text-teal-400"> 
             <div className="w-16 h-16 sm:w-24 sm:h-24 min-[1440px]:w-32 min-[1440px]:h-32 rounded-full border-[8px] sm:border-[14px] border-dashed animate-spin-slow" /> 
           </div> 
           
           <div className="absolute top-40 sm:top-48 min-[1440px]:top-56 right-0 sm:right-5 min-[1440px]:right-10 opacity-30 text-purple-400"> 
             <div className="w-20 h-20 sm:w-28 sm:h-28 min-[1440px]:w-36 min-[1440px]:h-36 rounded-full border-[8px] sm:border-[14px] border-dashed animate-spin-reverse-slow" /> 
           </div> 
           
           {/* Suelo */} 
           <div className="absolute bottom-0 left-0 right-0 h-[27%] sm:h-[32%] bg-gradient-to-b from-[#CBEFE3] via-[#BFEAE0] to-[#B3E5DA] border-t-2 sm:border-t-4 border-emerald-300" /> 
           
           {/* Cinta transportadora */} 
           <div className="absolute bottom-[23%] sm:bottom-[27%] left-0 right-0 h-7 sm:h-10 bg-gradient-to-r from-emerald-300/40 via-teal-200/50 to-sky-300/40 border-y-2 border-emerald-400/60 overflow-hidden"> 
             <div className="w-[200%] h-full flex items-center gap-4 sm:gap-8 animate-conveyor opacity-60"> 
               <span className="w-6 sm:w-8 h-2 bg-emerald-500/50 rounded-full" /> 
               <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-emerald-600/60" /> 
               <span className="w-6 sm:w-8 h-2 bg-teal-500/50 rounded-full" /> 
               <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-teal-600/60" /> 
               <span className="w-6 sm:w-8 h-2 bg-sky-500/50 rounded-full" /> 
               <span className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-sky-600/60" /> 
               <span className="w-6 sm:w-8 h-2 bg-purple-500/50 rounded-full" /> 
             </div> 
          </div>
        </div>
        
         {/* === TUBERÍAS DECORATIVAS === */} 
         
         <div className="absolute top-28 sm:top-36 min-[1440px]:top-40 -left-16 sm:-left-10 w-52 sm:w-72 min-[1440px]:w-[32rem] h-4 sm:h-6 min-[1440px]:h-7 bg-[#A7F3D0] rounded-full border-2 sm:border-4 border-[#34D399] z-[1]" /> 
         <div className="absolute top-36 sm:top-44 min-[1440px]:top-52 -right-16 sm:-right-10 w-52 sm:w-72 min-[1440px]:w-[32rem] h-4 sm:h-6 min-[1440px]:h-7 bg-[#BAE6FD] rounded-full border-2 sm:border-4 border-[#38BDF8] z-[1]" /> 
         
         {/* === ENCABEZADO ==== */} 
         
         <header className="relative z-50 w-full shrink-0 bg-white/95 backdrop-blur-md border-b-2 border-emerald-200/90 px-3 sm:px-5 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-2 sm:gap-4"> 
         {/* Botón volver */} 
         <button  type="button"
            onClick={handleExit}
            title="Volver a la Semana 2"
            aria-label="Volver a la Semana 2"
            className="
              group
              flex
              items-center
              gap-1
              sm:gap-2
              px-2
              sm:px-3.5
              py-1.5
              sm:py-2
              rounded-xl
              sm:rounded-2xl
              bg-gradient-to-b
              from-white
              to-[#ECFDF5]
              border-2
              border-emerald-200
              text-emerald-800
              hover:border-emerald-400
              hover:bg-emerald-50
              active:scale-95
              transition-all
              shadow-sm
              shrink-0
            " > 
          <span className="group-hover:-translate-x-1 transition-transform"> 
              <ArrowLeftIcon /> 
          </span> 
          
          <span className="hidden sm:inline text-xs sm:text-sm font-extrabold tracking-wide"> Volver </span> 
          </button> 
          
          {/* Título */} 
          <div className="flex items-center justify-center min-w-0 flex-1"> 
            
            <span className="font-bold text-base xs:text-xs sm:text-lg md:text-xl xl:text-2xl text-[#54624d] text-center leading-tight"> Máquina de Reciclaje </span> 
          </div> 
          
          {/* Progreso y sonido */} 
          <div className="flex items-center gap-1 sm:gap-2 shrink-0"> 
            <div className="bg-gradient-to-r from-cyan-100/70 to-emerald-100/70 border border-teal-200 px-1.5 sm:px-3 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-sm whitespace-nowrap"> 
              <span className="text-sm sm:text-xs md:text-sm min-[1440px]:text-base font-bold text-teal-950"> 
                Objeto {currentRound + 1} de{' '} {gameSequence.length} 
              </span> 
            </div> 
            
            <button type="button" onClick={handleSoundToggle} 
                    title={ soundEnabled 
                               ? 'Desactivar sonido' 
                               : 'Activar sonido'
                    } aria-label={ 
                      soundEnabled 
                               ? 'Desactivar sonido' 
                               : 'Activar sonido'
                    }
                    className={`w-8 h-8 sm:w-10 sm:h-10 min-[1440px]:w-12 min-[1440px]:h-12 rounded-xl sm:rounded-2xl border-2 flex items-center justify-center transition-all shrink-0 ${ 
                      soundEnabled 
                               ? 'bg-[#FEF08A]/80 border-amber-300 text-amber-800 hover:bg-[#FEF08A]' 
                               : 'bg-slate-100 border-slate-300 text-slate-500' 
                    }`} 
                  >
                     <SoundIcon muted={!soundEnabled} />
                    </button>
                  </div>
                </header>

                {/* === ÁREA PRINCIPAL === */} 
                
                <main className="relative z-20 flex min-h-0 w-full flex-1 flex-col overflow-hidden px-3 sm:px-5 lg:px-8">
                {/* Instrucción */} 
                <div className="mx-auto mt-2 sm:mt-3 mb-2 w-full max-w-3xl xl:max-w-4xl shrink-0 bg-white/95 border-2 border-teal-200/90 px-3 sm:px-6 xl:px-8 py-2 sm:py-2.5 rounded-2xl sm:rounded-full shadow-sm text-center flex items-center justify-center">
                   <p className="w-full text-base sm:text-sm md:text-base xl:text-lg font-bold text-teal-900 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-center leading-snug"> 
                      {renderInstruction()}
                   </p>
                </div>
                {/* === MÁQUINA === */} 
                <div className="flex min-h-0 w-full flex-1 items-center justify-center py-1 sm:py-2">
                <div className="responsive-machine relative flex h-full max-h-full min-h-0 w-full max-w-[18rem] xs:max-w-[19rem] sm:max-w-sm md:max-w-md lg:max-w-xl xl:max-w-2xl flex-col items-center justify-center"> 
                  {/* Conectores laterales */} 
                <div className="absolute top-24 sm:top-28 -left-3 sm:-left-4 w-4 sm:w-6 h-9 sm:h-12 bg-gradient-to-r from-emerald-300 to-emerald-200 border-2 border-emerald-400 rounded-l-xl z-0" />
                
                <div className="absolute top-24 sm:top-28 -right-3 sm:-right-4 w-4 sm:w-6 h-9 sm:h-12 bg-gradient-to-l from-purple-300 to-purple-200 border-2 border-purple-400 rounded-r-xl z-0" />
                  {/* Cuerpo */} 
                  <div 
                    className={`flex h-full max-h-full min-h-0 w-full flex-col items-center relative z-10 overflow-hidden bg-white rounded-t-[3.5rem] sm:rounded-t-[5.5rem] xl:rounded-t-[6.5rem] rounded-b-[1.75rem] sm:rounded-b-[2.5rem] xl:rounded-b-[2.75rem] border-2 sm:border-4 border-emerald-300 shadow-[0_14px_28px_-4px_rgba(167,243,208,0.45),0_6px_12px_-2px_rgba(56,189,248,0.15),inset_0_2px_4px_rgba(255,255,255,0.95)] transition-transform ${ 
                      machineVibrating
                       ? 'animate-vibrate' 
                       : '' 
                    }`} 
                  > 
                   {/* Parte superior */} 
                   
                   <div className="w-full shrink min-h-0 max-h-[38%] overflow-hidden pt-3 sm:pt-4 pb-1 sm:pb-1.5 px-3 sm:px-6 flex flex-col items-center bg-gradient-to-b from-[#F0FDF9] to-white"> 
                   {/* Chimenea */} 
                   <div className="w-10 sm:w-14 h-3 sm:h-4 bg-gradient-to-r from-[#FDE68A] via-[#FEF08A] to-[#FDE68A] border-2 border-amber-300 rounded-t-lg -mt-4 sm:-mt-5" /> 
                   
                   <div className="-1.5 sm:h-2 bg-emerald-200/80 rounded-full mb-2 sm:mb-3" /> 
                   
                   {/* Pantalla */} 
                   <div className=" w-[90%]
                    max-w-[13rem]
                    sm:max-w-[16rem]
                    min-[1440px]:max-w-[20rem]
                    responsive-screen
                    bg-[#E0F7F1]/85
                    border-2
                    sm:border-4
                    border-emerald-300/90
                    rounded-[1.5rem]
                    sm:rounded-[2.2rem]
                    px-3
                    sm:px-5
                    py-2
                    sm:py-3
                    flex
                    flex-col
                    items-center
                    justify-center
                    shadow-inner
                    relative
                    overflow-hidden"> 
                     <div className="absolute -top-7 -left-7 w-28 h-20 bg-white/60 rotate-12 rounded-full" /> 
                   
                   {/* Ojos robóticos */} 
                   <div className="flex items-center justify-center gap-6 sm:gap-10 my-1.5 sm:my-2 relative z-10"> 
                     <div className="robot-eye animate-blink-robot" /> 
                     <div className="robot-eye animate-blink-robot" /> 
                   </div> 
                   
                   <div className="text-sm xs:text-sm sm:text-sm min-[1440px]:text-xs font-extrabold text-teal-950 mt-1 uppercase tracking-wider sm:tracking-widest bg-white/90 px-2 sm:px-3 min-[1440px]:px-4 py-0.5 sm:py-1 rounded-full border border-teal-200/80 shadow-sm whitespace-nowrap"> 
                      <span className="inline-block w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-teal-500 animate-pulse mr-1 sm:mr-1.5" /> DISPENSADOR MISTERIOSO 
                    </div> 
                  </div> 
                </div>
                
                 {/* Detalles */} 
                 <div className="w-full shrink-0 px-4 sm:px-7 py-1 sm:py-1.5 flex items-center justify-between text-teal-600/70"> 
                   <div className="flex items-center gap-1.5"> 
                     <span className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full bg-purple-200 border-2 border-purple-400" /> 
                     <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-emerald-200 border-2 border-emerald-400" /> 
                    </div> 
                    
                    <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 border-emerald-400/60 border-dashed flex items-center justify-center text-sm sm:text-xs animate-spin-slow">
                     ↻
                    </div> 
                  </div> 

                  {/* Bandeja */} 
                  <div className="flex min-h-0 w-full flex-1 flex-col px-3 sm:px-5 pb-2"> 
                    <div className="responsive-tray h-full min-h-[6.5rem] w-full bg-gradient-to-b from-[#DCFCE7]/70 via-[#ECFDF5]/50 to-[#D1FAE5]/60 rounded-2xl sm:rounded-3xl border-2 sm:border-4 border-emerald-300/80 shadow-inner flex items-center justify-center relative">
                     {/* Aura */} 
                     <div className="w-24 sm:w-36 h-7 sm:h-10 rounded-full bg-emerald-200/40 blur-sm absolute bottom-2 sm:bottom-3" /> 
                     <div className="w-20 sm:w-28 h-5 sm:h-6 rounded-full bg-purple-300/30 blur-sm absolute bottom-3 sm:bottom-4 animate-chamber-aura" /> 
                     <div className="absolute w-24 h-24 sm:w-32 sm:h-32 min-[1440px]:w-40 min-[1440px]:h-40 rounded-full bg-purple-200/25 blur-xl animate-chamber-aura" /> 
                     
                     {/* Objeto */} 
                     {showObject && currentObject && ( 
                       <div 
                       ref={objectRef} onClick={handleObjectClick} 
                       className={`absolute z-30 flex flex-col items-center justify-center cursor-pointer ${ 
                          objectLaunching 
                            ? 'animate-object-launch' 
                            : '' 
                          } ${ 
                            objectBob 
                              ? 'animate-gentle-bob' 
                              : '' 
                            }`}
                          > 
                          
                          <div className="responsive-object relative w-20 h-20 xs:w-22 xs:h-22 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 xl:w-52 xl:h-52 rounded-2xl sm:rounded-3xl bg-white/95 border-2 border-emerald-300 shadow-lg flex items-center justify-center backdrop-blur-md p-2 sm:p-3 min-[1440px]:p-4"> 
                           <ObjectIllustration 
                             objectId={ currentObject.id } 
                             /> 
                             </div> 
                             
                             <div className="mt-1.5 sm:mt-2 max-w-full bg-white/95 border-2 border-teal-300 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-xl sm:rounded-2xl shadow-md text-center backdrop-blur-sm"> 
                               <h3 className="text-sm sm:text-xs md:text-sm xl:text-base font-extrabold text-slate-900 leading-tight text-center"> 
                                {currentObject.name} 
                               </h3> 
                            </div> 
                          </div>
                        )} 
                      </div>
                    </div> 
                    
                    {/* Parte inferior */} 
                    <div className="w-full shrink-0 bg-gradient-to-b from-[#A7F3D0] to-[#6EE7B7] border-t-2 sm:border-t-4 border-emerald-300/80 p-2.5 sm:p-3.5 lg:p-4 flex flex-col items-center"> 
                      <div className="w-16 sm:w-24 h-1 sm:h-1.5 bg-emerald-700/20 rounded-full mb-2 sm:mb-3" />
                      
                       {/* Botón de lanzamiento */} 
                       <button type="button" onClick={handleLaunch} disabled={ gameState !== 'IDLE' } 
                       className="w-full py-2.5 sm:py-3.5 min-[1440px]:py-4 px-3 sm:px-6 min-[1440px]:px-8 rounded-xl sm:rounded-2xl min-[1440px]:rounded-3xl bg-gradient-to-r from-white via-[#F0FDF4] to-white hover:bg-emerald-50 border-b-[3px] sm:border-b-[5px] border-emerald-700 active:border-b-2 active:translate-y-1 text-emerald-950 font-black text-base xs:text-xs sm:text-base md:text-lg min-[1440px]:text-xl flex items-center justify-center gap-1.5 sm:gap-2.5 min-[1440px]:gap-3 shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed leading-tight text-center" 
                       > 
                        <LaunchIcon />
                        
                         <span> 
                           {gameState === 'LAUNCHING' 
                             ? '¡DESCIFRANDO MISTERIO!' 
                             : '¡EXPULSAR OBJETO!'} 
                          </span> 
                        </button>
                       </div> 
                      </div> 
                    </div>
                </div>
              {/* === CONTENEDORES === */} 
              <section className={`responsive-bins w-full shrink-0 pb-3 sm:pb-4 lg:pb-5 transition-all duration-700 ${ showBins ? 'opacity-100 translate-y-0' : 'opacity-0 pointer-events-none' }`} >
                 <div className="text-center mb-2 sm:mb-3 px-1">
                   <span className="text-sm xs:text-sm sm:text-xs md:text-sm min-[1440px]:text-base font-extrabold text-teal-950 bg-white/95 px-2 sm:px-4 min-[1440px]:px-5 py-1 sm:py-1.5 rounded-xl sm:rounded-full border border-emerald-200 shadow-sm inline-flex items-center justify-center gap-1 sm:gap-1.5 text-center leading-tight"> 
                     <SearchIcon /> 
                       <span> ¿A qué contenedor pertenece este residuo? </span> 
                    </span> 
                  </div> 

                  <div className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4 xl:gap-5"> 
                   {binTypes.map((type, index) => { 
                     const isSelected = selectedBin === type; 
                     const isError = errorBin === type; 
                     const styles: Record<string, string> = { 
                     Plástico: 'bg-[#FEF9C3] hover:bg-[#FEF08A] border-[#FDE047] text-amber-950', 
                     Papel: 'bg-[#E0F2FE] hover:bg-[#BAE6FD] border-[#7DD3FC] text-sky-950', 
                     Vidrio: 'bg-[#D1FAE5] hover:bg-[#A7F3D0] border-[#6EE7B7] text-emerald-950', 
                     Metal: 'bg-[#F1F5F9] hover:bg-[#E2E8F0] border-[#CBD5E1] text-slate-800', 
                     Orgánico: 'bg-[#FFEDD5] hover:bg-[#FED7AA] border-[#FDBA74] text-orange-950', 
                   }; 
      
                 {/* Si es el 5º elemento (Orgánico) en pantallas móviles, hace que ocupe las 2 columnas */}
                 const isLastOddItem = index === binTypes.length - 1;

                 return ( 
              <button key={type} type="button" onClick={() => handleBinClick(type) } 
                    disabled={ gameState !== 'SELECTING' || gameEnded } 
                    className={`group flex flex-col items-center justify-center p-1.5 xs:p-2 sm:p-3 md:p-3.5 min-[1440px]:p-4 rounded-xl sm:rounded-3xl border-2 sm:border-4 shadow-[0_10px_25px_-4px_rgba(148,163,184,0.18)] hover:-translate-y-1 active:translate-y-0 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed min-w-0
                      ${styles[type]} 
                      ${isSelected ? 'ring-2 sm:ring-4 ring-emerald-400' : ''} 
                      ${isError ? 'ring-2 sm:ring-4 ring-amber-400' : ''}
                      ${isLastOddItem ? 'col-span-2 sm:col-span-1 max-w-[280px] sm:max-w-none justify-self-center w-full' : ''}`} 
              > 
              
              <div className="w-9 h-9 xs:w-10 xs:h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 min-[1440px]:w-16 min-[1440px]:h-16 rounded-xl sm:rounded-2xl bg-white/90 border border-white/80 flex items-center justify-center p-1 sm:p-1.5 mb-1 sm:mb-1.5 shadow-sm group-hover:scale-110 transition-transform shrink-0"> 
                 <BinIcon type={type} /> 
               </div> 
               <span className="font-bold text-sm xs:text-base sm:text-sm md:text-base min-[1440px]:text-lg tracking-wide text-center leading-tight">
                 {type === 'Papel' ? 'Papel y Cartón' : type} 
               </span> 
                 
                <span className="text-sm xs:text-sm sm:text-sm md:text-xs min-[1440px]:text-sm font-medium opacity-80 text-center leading-tight mt-0.5"> 
                 {type === 'Plástico' && 'Envases, botellas'} 
                 {type === 'Papel' && 'Libretas, cajas'} 
                 {type === 'Vidrio' && 'Botellas, frascos'} 
                 {type === 'Metal' && 'Latas, chapas'} 
                 {type === 'Orgánico' && 'Frutas, restos'} 
                </span> 
            </button>
           ); 
        })}
     </div>
   </section>
</main>

                        {/* === PANTALLA FINAL === */} 
                        {gameEnded && ( 
                          <div className="absolute inset-0 bg-[#0F172A]/40 backdrop-blur-md z-[100] flex items-center justify-center  p-2 sm:p-4 overflow-y-auto"> 
                             <div className="bg-[#F8FAFC] w-full max-w-lg min-[1440px]:max-w-3xl max-h-[96dvh] overflow-y-auto rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-[#A7F3D0] shadow-2xl p-4 sm:p-6 md:p-8 min-[1440px]:p-10 text-center relative animate-modal-in">
                               {/* Medalla */} 
                               <div className="w-16 h-16 sm:w-20 sm:h-20 min-[1440px]:w-24 min-[1440px]:h-24 mx-auto rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-[#A7F3D0] to-[#A5F3FC] border-4 border-white flex items-center justify-center text-teal-800 mb-2 sm:mb-3 shadow-md relative"> 
                                 <div className="absolute inset-0 rounded-2xl sm:rounded-3xl bg-teal-400/20 animate-ping" /> 
                                 <svg className="w-9 h-9 sm:w-11 sm:h-11 min-[1440px]:w-14 min-[1440px]:h-14 relative z-10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" viewBox="0 0 24 24" > 
                                  <circle cx="12" cy="8" r="6" /> 
                                  <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" /> 
                                 </svg> 
                                </div> 
                                
                                <span className="text-sm sm:text-xs min-[1440px]:text-sm font-bold text-teal-900 uppercase tracking-widest bg-emerald-100 px-2.5 sm:px-3.5 py-1 rounded-full border border-teal-200"> ¡Misión Científica Completada! </span> 
                                <h2 className="text-xl sm:text-2xl md:text-3xl min-[1440px]:text-4xl font-extrabold text-slate-900 mt-2 sm:mt-3 mb-1"> ¡Gran Pequeño Científico! </h2> 
                                <p className="text-xs sm:text-sm md:text-base min-[1440px]:text-lg text-slate-600 font-medium mb-4 sm:mb-5 min-[1440px]:mb-6"> ¡Descubriste y clasificaste todos los objetos del laboratorio correctamente! </p> 
                                
                                {/* Resultados */} 
                                <div className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-3 border border-emerald-100 mb-4 sm:mb-6 shadow-sm"> 
                                  <p className="text-sm sm:text-base font-bold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3"> Materiales analizados con éxito: </p> 
                                  
                                  <div className="flex justify-center items-center gap-1.5 sm:gap-3 flex-wrap"> 
                                    {collectedResults.map( (object) => ( 
                                      <div key={object.id} title={`${object.name} (${object.type})`} 
                                       className="w-11 h-11 sm:w-14 sm:h-14 min-[1440px]:w-16 min-[1440px]:h-16 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 p-1.5 sm:p-2 flex items-center justify-center shadow-sm animate-bounce" > 
                                      <ObjectIllustration objectId={object.id} /> 
                                      </div> 
                                    ) 
                                  )}
                               </div> 
                            </div> 
                            
                            {/* Botones */} 
                            <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 justify-center items-center"> 
                              <button type="button" onClick={handleReplay} 
                                      className="w-full sm:flex-1 py-3.5 min-[1440px]:py-4 px-5 min-[1440px]:px-6 rounded-2xl bg-gradient-to-r from-[#A7F3D0] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#A7F3D0] border-b-4 border-emerald-600 font-black text-emerald-950 text-base min-[1440px]:text-lg shadow-md active:translate-y-1 transition-all" > Intentar otra vez </button> 
                                      <button type="button" onClick={handleExit} 
                                      className="w-full sm:flex-1 py-3 sm:py-3.5 min-[1440px]:py-4 px-4 sm:px-5 min-[1440px]:px-6 rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#A7F3D0] to-[#6EE7B7] hover:from-[#6EE7B7] hover:to-[#A7F3D0] border-b-4 border-emerald-600 font-black text-emerald-950 text-sm sm:text-base min-[1440px]:text-lg shadow-md active:translate-y-1 transition-all"> Salir </button> 
                                    </div> 
                                  </div> 
                                </div>
                             )} 
                            </div>    

                         {/* === ANIMACIONES PERSONALIZADAS === */} 
                         
                         <style>{` 
                         @keyframes machineVibrate { 
                             0%, 100% { 
                             transform: translate(0, 0);
                            } 
                             20% { 
                              transform: translate(-3px, 2px) rotate(-0.5deg); 
                            } 
                             40% { 
                              transform: translate(3px, -2px) rotate(0.5deg); 
                            } 
                             60% { 
                              transform: translate(-2px, 1px); 
                            } 
                              80% { 
                              transform: translate(2px, -1px);
                            } 
                          } 
                            
                          @keyframes gentleBob { 
                            0%, 100% { 
                              transform: translateY(0) rotate(0deg); 
                            } 
                            50% { 
                              transform: translateY(-6px) rotate(1deg); 
                            } 
                          } 
                            
                          @keyframes objectLaunch { 
                            0% { 
                              transform: translateY(80px) scale(0.2) rotate(-4deg); 
                              opacity: 0; 
                            } 
                            45% { 
                               transform: translateY(-40px) scale(1.1) rotate(-4deg); 
                               opacity: 1; 
                            } 
                            100% { 
                               transform: translateY(0) scale(1) rotate(0deg); 
                               opacity: 1; 
                            }
                          } 
                              
                          @keyframes blinkRobot { 
                              0%, 94%, 100% { 
                               transform: scaleY(1);
                              }
                              97% { 
                               transform: scaleY(0.12); 
                            } 
                          } 
                              
                          @keyframes spinClockwise { 
                            from { 
                              transform: rotate(0deg); 
                            } 
                            to { 
                              transform: rotate(360deg);
                            } 
                          } 
                                
                          @keyframes spinCounterClockwise { 
                            from { 
                              transform: rotate(360deg);
                            } 
                            to { 
                              transform: rotate(0deg); 
                            }
                          } 
                            
                          @keyframes conveyorSlide { 
                            from { 
                              transform: translateX(0);
                            } 
                            to { 
                              transform: translateX(40px);
                            } 
                          } 
                            
                          @keyframes chamberAura { 
                            0%, 100% { 
                             opacity: 0.3; 
                             transform: scale(0.95); 
                            } 
                            50% { 
                             opacity: 0.7; 
                             transform: scale(1.08); 
                            } 
                          } 
                            
                          @keyframes sparkleFade { 
                            0% { 
                             transform: translate(0, 0) scale(0.2) rotate(0deg); 
                             opacity: 1; 
                            } 
                            50% { 
                             transform: translate(var(--tx), var(--ty)) scale(1.2) rotate(90deg); 
                             opacity: 0.95; 
                          } 
                          100% { 
                             transform: translate(var(--tx), var(--ty)) scale(0.2) rotate(180deg); 
                             opacity: 0; 
                            } 
                          } 
                            
                          @keyframes modalIn { 
                            from { 
                              opacity: 0; transform: scale(0.95);
                            } 
                            to { 
                              opacity: 1; 
                              transform: scale(1); 
                            } 
                          } 
                            
                          .animate-vibrate { 
                            animation: machineVibrate 0.4s ease-in-out; 
                          } 
                            
                          .animate-gentle-bob { 
                            animation: gentleBob 2.6s ease-in-out infinite; 
                          } 
                          
                          .animate-object-launch { 
                            animation: objectLaunch 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.25); 
                          } 
                            
                          .animate-blink-robot { 
                            animation: blinkRobot 4.2s infinite; 
                          } 
                            
                          .animate-spin-slow { 
                            animation: spinClockwise 26s linear infinite; 
                          } 
                            
                          .animate-spin-reverse-slow { 
                            animation: spinCounterClockwise 30s linear infinite; 
                          } 
                            
                          .animate-conveyor { 
                            animation: conveyorSlide 3s linear infinite; 
                          } 
                            
                          .animate-chamber-aura { 
                            animation: chamberAura 3s ease-in-out infinite; 
                          } 
                            
                          .celebration-sparkle { 
                            animation: sparkleFade 0.85s ease-out forwards; 
                          } 
                            
                          .animate-modal-in { 
                            animation: modalIn 0.3s ease-out forwards; 
                          } 
                            
                          .robot-eye { 
                            width: 1.5rem; 
                            height: 2.25rem; 
                            background-color: #1e293b; 
                            border-radius: 9999px; 
                            transition: all 0.25s ease-in-out;
                          }

                          .responsive-tray {
                            container-type: size;
                          }

                          .responsive-object {
                            width: min(12rem, 65cqh);
                            height: min(12rem, 65cqh);
                          } 

                          /* === PANTALLAS GRANDES === */

                          @media (min-width: 1024px) {
                            .responsive-object {
                             width: min(11rem, 60cqh);
                             height: min(11rem, 60cqh); 
                            }
                          
                          }

                          @media (min-width: 1280px) {
                            .responsive-object {
                             width: min(13rem, 65cqh);
                             height: min(13rem, 65cqh); 
                            }
                          
                          }


                            
                          @media (min-width: 640px) { 
                            .robot-eye { 
                              width: 1.75rem; 
                              height: 2.6rem;
                            } 
                          } 

                          /* === PANTALLAS PEQUEÑAS EN ALTURA === */

                          @media (min-width: 768px) and (max-height: 760px) {
                             .responsive-machine {
                              transform: scale(0.88);
                              transform-origin: top center;
                              margin-bottom: -6%;
                              }
                           }

                          @media (min-width: 1024px) and (max-height: 700px) {
                             .responsive-machine {
                              transform: scale(0.78);
                              transform-origin: top center;
                              margin-bottom: -10%;
                              }
                           }

                          /* === MÓVILES MUY PEQUEÑOS === */

                          @media (max-width: 380px) {
                             .responsive-machine {
                              max-width: 17rem;
                              }
                           }

                          /* === MÓVIL HORIZONTAL === */

                          @media (max-width: 767px) and (orientation: landscape) {
                             .responsive-machine {
                              transform: scale(0.72);
                              transform-origin: top center;
                              margin-bottom: -18%;
                              }
                           }

                          /* === ESCRITORIO GRANDE CON ALTURA SUFICIENTE === */

                          @media (min-width: 1440px) and (min-height: 800px) {
                             .responsive-stage {
                              max-width: none;
                              width: 100%;
                             }

                             .responsive-machine {
                              max-width: min(40rem, 46vw);
                             }
                           }

                          @media (min-width: 1440px) and (min-height: 960px) {
                             .responsive-stage {
                              max-width: none;
                              width: 100%;
                             }

                             .responsive-machine {
                              max-width: min(42rem, 48vw);
                             }

                             .responsive-screen {
                              max-width: 24rem;
                             }

                             .responsive-tray {
                              height: 100%;
                              min-height: clamp(8rem, 16vh, 12rem);
                             }

                             .responsive-object {
                              width: clamp(11rem, 18vh, 15rem);
                              height: clamp(11rem, 18vh, 15rem);
                             }

                             .robot-eye {
                              width: 2.15rem;
                              height: 3.15rem;
                             }
                           }

                          /* El marco global del juego fuerza scroll y centra el main.
                             Estas reglas lo anulan solo en esta pantalla. */
                          .game-screen > .fabrica-root {
                            overflow: hidden;
                          }

                          .game-screen .fabrica-root main {
                            overflow-x: hidden;
                            overflow-y: auto;
                            justify-content: flex-start;
                            -webkit-overflow-scrolling: touch;
                            overscroll-behavior-y: contain;
                          }

                          .game-screen .fabrica-root main > section {
                            max-height: none;
                            overflow: visible;
                          }

                           /* === REDUCIR ANIMACIONES SI EL USUARIO LO PREFIERE === */

                           @media (prefers-reduced-motion: reduce) {
                             .animate-vibrate,
                             .animate-gentle-bob,
                             .animate-object-launch,
                             .animate-blink-robot,
                             .animate-spin-slow,
                             .animate-spin-reverse-slow,
                             .animate-conveyor,
                             .animate-chamber-aura,
                             .celebration-sparkle,
                             .animate-modal-in {
                               animation-duration: 0.01ms !important;
                               animation-iteration-count: 1 !important;
                            }
                          }

                        `}</style> 
                    </div> 
                  ); 
                }    


  

  

