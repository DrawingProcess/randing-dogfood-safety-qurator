const ink = "#2A241B";

export function QuotePuppy({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <ellipse cx="14" cy="28" rx="8" ry="10" fill="#FFF6E4" stroke={ink} strokeWidth="2.2" transform="rotate(-40 14 28)" />
      <ellipse cx="50" cy="28" rx="8" ry="10" fill="#FFF6E4" stroke={ink} strokeWidth="2.2" transform="rotate(40 50 28)" />
      <circle cx="32" cy="36" r="20" fill="#FFF6E4" stroke={ink} strokeWidth="2.3" />
      <circle cx="25" cy="35" r="2.1" fill={ink} />
      <circle cx="39" cy="35" r="2.1" fill={ink} />
      <path d="M28 44c2.6 2.6 5.4 2.6 8 0" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function QuoteCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 64" className={className} aria-hidden="true">
      <path d="M18 30 26 8l12 20" fill="#fff" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M46 28 58 8l10 22" fill="#fff" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="36" cy="38" r="19" fill="#fff" stroke={ink} strokeWidth="2.3" />
      <circle cx="29" cy="38" r="2" fill={ink} />
      <circle cx="43" cy="38" r="2" fill={ink} />
      <path d="M14 40h11M47 40h11" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
      <path d="M62 8v6M59 11h6" fill="none" stroke={ink} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function QuoteShiba({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M12 30 20 8l14 18" fill="#FFE7C2" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M38 26 48 8l12 22" fill="#FFE7C2" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="32" cy="36" r="20" fill="#FFE7C2" stroke={ink} strokeWidth="2.3" />
      <circle cx="25" cy="35" r="2.1" fill={ink} />
      <circle cx="39" cy="35" r="2.1" fill={ink} />
      <path d="M29 44c2 2 4 2 6 0" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function QuoteOrangeCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <path d="M14 30 22 8l12 18" fill="#FFD27A" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M34 26 44 8l12 22" fill="#FFD27A" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="32" cy="36" r="20" fill="#FFD27A" stroke={ink} strokeWidth="2.3" />
      <circle cx="25" cy="35" r="2.1" fill={ink} />
      <circle cx="39" cy="35" r="2.1" fill={ink} />
    </svg>
  );
}

export function PeekingPets({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 70" className={className} aria-hidden="true">
      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M18 70 28 34l16 20" />
        <path d="M42 54 56 32l16 38" />
        <path d="M16 70a28 28 0 0 1 56 0Z" />
      </g>
      <circle cx="36" cy="58" r="2.2" fill={ink} />
      <circle cx="52" cy="58" r="2.2" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <ellipse cx="108" cy="28" rx="8" ry="16" transform="rotate(-18 108 28)" />
        <ellipse cx="148" cy="28" rx="8" ry="16" transform="rotate(18 148 28)" />
        <path d="M96 70a32 32 0 0 1 64 0Z" />
      </g>
      <circle cx="118" cy="58" r="2.2" fill={ink} />
      <circle cx="138" cy="58" r="2.2" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M184 70 194 36l14 18" />
        <path d="M206 54 220 34l12 36" />
        <path d="M182 70a24 24 0 0 1 48 0Z" />
      </g>
      <circle cx="198" cy="58" r="2" fill={ink} />
      <circle cx="214" cy="58" r="2" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <ellipse cx="262" cy="26" rx="9" ry="17" transform="rotate(-16 262 26)" />
        <ellipse cx="302" cy="26" rx="9" ry="17" transform="rotate(16 302 26)" />
        <path d="M248 70a36 36 0 0 1 72 0Z" />
      </g>
      <circle cx="274" cy="58" r="2.2" fill={ink} />
      <circle cx="294" cy="58" r="2.2" fill={ink} />
    </svg>
  );
}

export const quoteCharacters = [QuotePuppy, QuoteCat, QuoteShiba, QuoteOrangeCat] as const;
