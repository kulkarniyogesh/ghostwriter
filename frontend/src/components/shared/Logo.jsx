// Responsive SVG logo. Sizes scale with the viewport so the mark never looks tiny on large screens.
const MARK_SIZES = {
  nav: 'w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12',
  hero: 'w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40',
}

const WORD_SIZES = {
  nav: 'text-xl sm:text-2xl lg:text-3xl',
  hero: 'text-4xl sm:text-5xl lg:text-6xl',
}

export function GhostMark({ size = 'nav', animated = true }) {
  return (
    <span className={`relative inline-flex shrink-0 ${MARK_SIZES[size]}`}>
      {/* Soft glow behind the ghost */}
      {animated && (
        <span className="gw-glow absolute inset-0 rounded-full bg-[#00D4FF]/30 blur-xl" aria-hidden="true" />
      )}
      <svg
        viewBox="0 0 100 120"
        className={`relative w-full h-full drop-shadow-[0_0_12px_rgba(0,212,255,0.45)] ${animated ? 'gw-float' : ''}`}
        role="img"
        aria-label="GhostWriter logo"
      >
        <defs>
          <linearGradient id="gw-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A8E9FF" />
          </linearGradient>
        </defs>
        <path
          d="M50 8 C28 8 12 26 12 48 V104 L26 94 L38 106 L50 94 L62 106 L74 94 L88 104 V48 C88 26 72 8 50 8 Z"
          fill="url(#gw-body)"
          stroke="#00D4FF"
          strokeWidth="2"
        />
        <g className={`${animated ? 'gw-blink' : ''} origin-center [transform-box:fill-box]`}>
          <ellipse cx="38" cy="50" rx="6" ry="8" fill="#0F1117" />
          <ellipse cx="62" cy="50" rx="6" ry="8" fill="#0F1117" />
        </g>
        <ellipse cx="50" cy="70" rx="7" ry="9" fill="#0F1117" />
      </svg>
    </span>
  )
}

export default function Logo({ size = 'nav', animated = true, showWordmark = true }) {
  return (
    <span className="inline-flex items-center gap-2 sm:gap-3">
      <GhostMark size={size} animated={animated} />
      {showWordmark && (
        <span className={`font-bold text-[#E8E8E8] tracking-tight leading-none ${WORD_SIZES[size]}`}>
          Ghost<span className="text-[#00D4FF]">Writer</span>
        </span>
      )}
    </span>
  )
}
