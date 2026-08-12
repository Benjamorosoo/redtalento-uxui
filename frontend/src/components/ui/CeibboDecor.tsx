// Decoración sutil de fondo — ramas y flores de ceibo, muy baja opacidad.
// Puramente ornamental: pointer-events-none, no afecta el layout ni la interacción.
function CeibboFlower({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <g opacity="0.9">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="32"
            cy="18"
            rx="7"
            ry="13"
            fill="#C0392B"
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="5" fill="#FADBD8" />
      </g>
    </svg>
  )
}

export function CeibboDecor() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {/* Rama superior derecha */}
      <svg
        viewBox="0 0 400 300"
        className="absolute -top-6 -right-10 w-[340px] h-[260px] opacity-[0.07]"
      >
        <path
          d="M400 10 C 320 40, 260 20, 210 70 C 170 110, 180 150, 130 170"
          stroke="#4E9A52"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M330 30 C 300 55, 290 80, 250 90"
          stroke="#4E9A52"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <CeibboFlower className="absolute top-6 right-16 w-14 h-14 opacity-[0.10]" />
      <CeibboFlower className="absolute top-24 right-4 w-9 h-9 opacity-[0.08] rotate-12" />
      <CeibboFlower className="absolute top-32 right-40 w-7 h-7 opacity-[0.06] -rotate-6" />

      {/* Rama inferior izquierda */}
      <svg
        viewBox="0 0 400 300"
        className="absolute -bottom-10 -left-10 w-[340px] h-[260px] opacity-[0.07]"
      >
        <path
          d="M0 290 C 80 260, 140 280, 190 230 C 230 190, 220 150, 270 130"
          stroke="#4E9A52"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M60 270 C 90 245, 100 220, 140 210"
          stroke="#4E9A52"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <CeibboFlower className="absolute bottom-10 left-14 w-14 h-14 opacity-[0.10]" />
      <CeibboFlower className="absolute bottom-28 left-2 w-8 h-8 opacity-[0.08] rotate-45" />
      <CeibboFlower className="absolute bottom-6 left-44 w-6 h-6 opacity-[0.06] -rotate-12" />
    </div>
  )
}
