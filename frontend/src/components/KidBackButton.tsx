type KidBackButtonProps = {
  onClick: () => void;
  label?: string;
  className?: string;
};

export default function KidBackButton({
  onClick,
  label = 'Volver',
  className = '',
}: KidBackButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-[1.15rem] bg-[#eef8dc] text-[#2f5a45] shadow-[0_8px_16px_rgba(47,90,69,0.2)] transition-transform hover:scale-105 active:scale-95 ${className}`}
      style={{ touchAction: 'manipulation', minHeight: 48, minWidth: 48 }}
    >
      <span className="material-symbols-outlined text-[26px]">arrow_back</span>
    </button>
  );
}

export function KidBackOverlay({
  onClick,
  label = 'Volver',
}: KidBackButtonProps) {
  return (
    <div className="absolute left-3 top-3 z-[80] sm:left-4 sm:top-4">
      <KidBackButton onClick={onClick} label={label} />
    </div>
  );
}
