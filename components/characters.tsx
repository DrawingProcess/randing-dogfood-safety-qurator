export function ChickPea({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 220" className={className} aria-hidden="true">
      <ellipse cx="78" cy="132" rx="46" ry="58" fill="#BCFF88" />
      <ellipse cx="62" cy="86" rx="16" ry="22" fill="#9BE56A" transform="rotate(-18 62 86)" />
      <circle cx="70" cy="124" r="4" fill="#245C34" />
      <circle cx="92" cy="124" r="4" fill="#245C34" />
      <path d="M74 140c6 6 16 6 22 0" fill="none" stroke="#245C34" strokeWidth="3" strokeLinecap="round" />
      <circle cx="176" cy="118" r="62" fill="#FAE78B" />
      <circle cx="156" cy="108" r="6" fill="#2A241B" />
      <circle cx="196" cy="108" r="6" fill="#2A241B" />
      <path d="M160 132c8 10 24 10 32 0" fill="none" stroke="#2A241B" strokeWidth="4" strokeLinecap="round" />
      <ellipse cx="214" cy="78" rx="14" ry="18" fill="#F6C945" transform="rotate(18 214 78)" />
      <ellipse cx="142" cy="74" rx="12" ry="16" fill="#F6C945" transform="rotate(-16 142 74)" />
      <path d="M92 168c28 18 78 22 126 4" fill="none" stroke="#E7D3A1" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}
