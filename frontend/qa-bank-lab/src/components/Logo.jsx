export default function Logo({ size = 32, title = "QA Bank" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
    >
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="rgba(0,0,0,0.6)" />
        </filter>
        <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6fa27d" />
          <stop offset="100%" stopColor="#4f745f" />
        </linearGradient>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b48a1e" />
        </linearGradient>
      </defs>

      {/* Main triangular shape (minimalist bank glyph) */}
      <path d="M10 90 L50 10 L90 90 Z" fill="url(#greenGrad)" filter="url(#shadow)" />

      {/* Gold accent bar */}
      <rect x="20" y="48" width="60" height="4" fill="url(#goldGrad)" />
    </svg>
  );
}


