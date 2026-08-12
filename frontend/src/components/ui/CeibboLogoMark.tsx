import { cn } from '@/lib/utils'

interface CeibboLogoMarkProps {
  className?: string
}

// Ilustración detallada de un árbol de ceibo — tronco, copa y flores —
// usada como marca/isotipo en navegaciones y pantallas de acceso.
export function CeibboLogoMark({ className }: CeibboLogoMarkProps) {
  return (
    <div className={cn('relative shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-[#F2F8F2] to-[#DCEDDD] shadow-editorial', className)}>
      <svg viewBox="0 0 64 64" className="w-full h-full" role="img" aria-label="Ceibbo">
        {/* Tronco y ramas */}
        <path
          d="M32 60 C 30.5 53, 33 48, 31 42 C 29.5 37.5, 31.5 34, 32.5 30"
          stroke="#7B4B2A" strokeWidth="3.2" strokeLinecap="round" fill="none"
        />
        <path
          d="M31 44 C 25 41, 21 39.5, 16.5 35.5"
          stroke="#8A5A34" strokeWidth="2.2" strokeLinecap="round" fill="none"
        />
        <path
          d="M32.5 39 C 38 35.5, 42.5 34, 47.5 30.5"
          stroke="#8A5A34" strokeWidth="2.2" strokeLinecap="round" fill="none"
        />

        {/* Copa — lóbulos superpuestos para dar volumen */}
        <ellipse cx="17" cy="30" rx="11.5" ry="9.5" fill="#6BAE6E" opacity="0.9" />
        <ellipse cx="47" cy="29" rx="11.5" ry="9.5" fill="#6BAE6E" opacity="0.9" />
        <ellipse cx="32" cy="14" rx="14.5" ry="10.5" fill="#5CA361" />
        <ellipse cx="32" cy="24" rx="21" ry="14" fill="#4E9A52" />
        <ellipse cx="32" cy="21" rx="16" ry="10.5" fill="#6BAE6E" opacity="0.55" />

        {/* Racimos de flor de ceibo */}
        {[
          [20, 16], [40, 12], [14, 26], [48, 22], [30, 30], [24, 10],
        ].map(([cx, cy], i) => (
          <g key={i} transform={`translate(${cx} ${cy})`}>
            <circle cx="-2.4" cy="0" r="2.1" fill="#C0392B" />
            <circle cx="2.4"  cy="0" r="2.1" fill="#C0392B" />
            <circle cx="0"    cy="-2.4" r="2.1" fill="#E05B47" />
            <circle cx="0"    cy="2.4"  r="2.1" fill="#E05B47" />
            <circle cx="0" cy="0" r="1.4" fill="#FADBD8" />
          </g>
        ))}
      </svg>
    </div>
  )
}
