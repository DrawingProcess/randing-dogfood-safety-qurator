export function PeekingPets({ className = "" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/characters/peeking-pets.png" alt="" className={className} />
  );
}

export function QuoteCharacter({ src, className = "" }: { src: string; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={className} />
  );
}

export const quoteCharacterSrcs = [
  "/characters/quote-dog.png",
  "/characters/quote-white-cat.png",
  "/characters/quote-shiba.png",
  "/characters/quote-yellow-cat.png",
] as const;
