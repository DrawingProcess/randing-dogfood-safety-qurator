import type { ReactNode } from "react";

const ink = "#2A241B";

function Face({
  children,
  className,
  fill,
}: {
  children: ReactNode;
  className?: string;
  fill: string;
}) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="36" r="22" fill={fill} stroke={ink} strokeWidth="2.4" />
      {children}
    </svg>
  );
}

export function QuotePuppy({ className = "" }: { className?: string }) {
  return (
    <Face className={className} fill="#FFF6E4">
      <ellipse cx="18" cy="18" rx="7" ry="10" fill="#FFF6E4" stroke={ink} strokeWidth="2.2" transform="rotate(-28 18 18)" />
      <ellipse cx="46" cy="18" rx="7" ry="10" fill="#FFF6E4" stroke={ink} strokeWidth="2.2" transform="rotate(28 46 18)" />
      <circle cx="25" cy="36" r="2.1" fill={ink} />
      <circle cx="39" cy="36" r="2.1" fill={ink} />
      <path d="M28 44c2.4 2.4 5.6 2.4 8 0" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </Face>
  );
}

export function QuoteCat({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 64" className={className} aria-hidden="true">
      <path d="M16 28 24 8l10 18" fill="#fff" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M46 26 56 8l10 20" fill="#fff" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="36" cy="38" r="20" fill="#fff" stroke={ink} strokeWidth="2.4" />
      <circle cx="29" cy="38" r="2" fill={ink} />
      <circle cx="43" cy="38" r="2" fill={ink} />
      <path d="M16 40h10M46 40h10" fill="none" stroke={ink} strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="62" cy="10" r="2.2" fill="none" stroke={ink} strokeWidth="1.6" />
    </svg>
  );
}

export function QuoteShiba({ className = "" }: { className?: string }) {
  return (
    <Face className={className} fill="#FFE7C2">
      <path d="M14 28 20 8l12 16" fill="#FFE7C2" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M38 24 48 8l10 20" fill="#FFE7C2" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="25" cy="36" r="2.1" fill={ink} />
      <circle cx="39" cy="36" r="2.1" fill={ink} />
      <path d="M29 44c1.8 1.8 4.2 1.8 6 0" fill="none" stroke={ink} strokeWidth="2" strokeLinecap="round" />
    </Face>
  );
}

export function QuoteOrangeCat({ className = "" }: { className?: string }) {
  return (
    <Face className={className} fill="#FFD27A">
      <path d="M14 30 22 8l10 18" fill="#FFD27A" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M32 26 42 8l10 22" fill="#FFD27A" stroke={ink} strokeWidth="2.2" strokeLinejoin="round" />
      <circle cx="25" cy="36" r="2.1" fill={ink} />
      <circle cx="39" cy="36" r="2.1" fill={ink} />
    </Face>
  );
}

export function PeekingPets({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 78" className={className} aria-hidden="true">
      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M18 70c0-22 10-38 26-38s26 16 26 38" />
        <path d="M22 40 32 16l12 22" />
        <path d="M42 38 56 16l12 24" />
      </g>
      <circle cx="36" cy="50" r="2.2" fill={ink} />
      <circle cx="52" cy="50" r="2.2" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M86 70c0-24 11-42 28-42s28 18 28 42" />
        <ellipse cx="100" cy="28" rx="7" ry="14" transform="rotate(-22 100 28)" />
        <ellipse cx="128" cy="28" rx="7" ry="14" transform="rotate(22 128 28)" />
      </g>
      <circle cx="106" cy="50" r="2.2" fill={ink} />
      <circle cx="122" cy="50" r="2.2" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M160 70c0-20 9-34 22-34s22 14 22 34" />
        <path d="M164 42 172 20l10 20" />
        <path d="M182 40 194 20l10 22" />
      </g>
      <circle cx="176" cy="50" r="2.1" fill={ink} />
      <circle cx="188" cy="50" r="2.1" fill={ink} />

      <g fill="#fff" stroke={ink} strokeWidth="2.4" strokeLinejoin="round">
        <path d="M214 70c0-24 12-42 30-42s30 18 30 42" />
        <ellipse cx="230" cy="26" rx="8" ry="15" transform="rotate(-18 230 26)" />
        <ellipse cx="258" cy="26" rx="8" ry="15" transform="rotate(18 258 26)" />
      </g>
      <circle cx="236" cy="50" r="2.2" fill={ink} />
      <circle cx="252" cy="50" r="2.2" fill={ink} />
    </svg>
  );
}

export const quoteCharacters = [QuotePuppy, QuoteCat, QuoteShiba, QuoteOrangeCat] as const;
