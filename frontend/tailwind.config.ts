import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ─── Design System: Ceibbo ───────────────────────────────────────────
        // Primary — rojo ceibo
        'primary':                  '#C0392B',
        'primary-container':        '#A93226',
        'on-primary':               '#ffffff',
        'on-primary-container':     '#FFE5E1',
        'on-primary-fixed':         '#4A0E08',
        'on-primary-fixed-variant': '#C0392B',
        'primary-fixed':            '#FADBD8',
        'primary-fixed-dim':        '#F1948A',
        'inverse-primary':          '#F1948A',
        'surface-tint':             '#C0392B',

        // Secondary — verde ceibo medio
        'secondary':                '#4E9A52',
        'secondary-container':      '#C8E6C9',
        'on-secondary':             '#ffffff',
        'on-secondary-container':   '#1B4620',
        'secondary-fixed':          '#C8E6C9',
        'secondary-fixed-dim':      '#A5D6A7',
        'on-secondary-fixed':       '#1B4620',
        'on-secondary-fixed-variant':'#2E7D32',

        // Tertiary — turquesa
        'tertiary':                 '#00ACC1',
        'tertiary-container':       '#B2EBF2',
        'on-tertiary':              '#ffffff',
        'on-tertiary-container':    '#00363D',
        'tertiary-fixed':           '#B2EBF2',
        'tertiary-fixed-dim':       '#4DD0E1',
        'on-tertiary-fixed':        '#00363D',
        'on-tertiary-fixed-variant':'#00838F',

        // Error
        'error':                    '#B3261E',
        'error-container':          '#F9DEDC',
        'on-error':                 '#ffffff',
        'on-error-container':       '#410E0B',

        // Surface — blanco cálido de base, verde pastel como acento en bloques
        'surface':                  '#FAFAFA',
        'surface-dim':              '#E5EBE3',
        'surface-bright':           '#FFFFFF',
        'surface-variant':          '#DCEDDD',
        'surface-container-lowest': '#FFFFFF',
        'surface-container-low':    '#E8F5E9',
        'surface-container':        '#DCEDDD',
        'surface-container-high':   '#C8E6C9',
        'surface-container-highest':'#A5D6A7',
        'inverse-surface':          '#2F3B2F',
        'inverse-on-surface':       '#F1F8F1',

        // Neutral
        'background':               '#FAFAFA',
        'on-background':            '#1B2E1C',
        'on-surface':               '#1B2E1C',
        'on-surface-variant':       '#41513F',
        'outline':                  '#6B7D69',
        'outline-variant':          '#C3D6C2',
      },
      fontFamily: {
        'headline': ['Playfair Display', 'serif'],
        'body':     ['Inter', 'sans-serif'],
        'label':    ['Inter', 'sans-serif'],
      },
      fontSize: {
        'display-lg':   ['3.5rem',  { lineHeight: '1.1',  letterSpacing: '-0.02em', fontWeight: '800' }],
        'display-md':   ['2.5rem',  { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-sm':   ['1.75rem', { lineHeight: '1.2',  letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg':  ['1.5rem',  { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-md':  ['1.25rem', { lineHeight: '1.3',  letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-sm':  ['1.1rem',  { lineHeight: '1.4',  fontWeight: '600' }],
        'body-lg':      ['1rem',    { lineHeight: '1.6' }],
        'body-md':      ['0.875rem',{ lineHeight: '1.6' }],
        'label-lg':     ['0.875rem',{ lineHeight: '1.4',  letterSpacing: '0.05em', fontWeight: '600' }],
        'label-md':     ['0.75rem', { lineHeight: '1.4',  letterSpacing: '0.05em', fontWeight: '600' }],
      },
      borderRadius: {
        'DEFAULT': '0.5rem',
        'sm':      '0.375rem',
        'md':      '0.625rem',
        'lg':      '0.875rem',
        'xl':      '1.25rem',
        '2xl':     '1.75rem',
        'full':    '9999px',
      },
      boxShadow: {
        'editorial':  '0 24px 48px -12px rgba(27, 46, 20, 0.14), 0 4px 12px -4px rgba(192, 57, 43, 0.06)',
        'elevated':   '0 8px 24px -6px rgba(27, 46, 20, 0.18), 0 2px 6px -2px rgba(192, 57, 43, 0.08)',
        'subtle':     '0 2px 8px -2px rgba(27, 46, 20, 0.10)',
        'float':      '0 32px 64px -16px rgba(27, 46, 20, 0.22)',
      },
      backgroundImage: {
        'editorial-gradient': 'linear-gradient(135deg, #C0392B 0%, #E05B47 100%)',
        'hero-gradient':      'linear-gradient(to right, #FAFAFA, rgba(250,250,250,0.9), transparent)',
        'card-shine':         'linear-gradient(135deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0) 60%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      animation: {
        'fade-in':      'fadeIn 0.3s ease-out',
        'slide-up':     'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in':     'scaleIn 0.2s ease-out',
        'pulse-soft':   'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { '0%': { opacity: '0' },                     '100%': { opacity: '1' } },
        slideUp:      { '0%': { transform: 'translateY(16px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        slideInRight: { '0%': { transform: 'translateX(16px)', opacity: '0' }, '100%': { transform: 'translateX(0)', opacity: '1' } },
        scaleIn:      { '0%': { transform: 'scale(0.95)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        pulseSoft:    { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.5' } },
      },
    },
  },
  plugins: [],
}
export default config
