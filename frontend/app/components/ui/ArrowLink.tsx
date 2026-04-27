import Link from 'next/link'

type ArrowLinkProps = {
  href: string
  label: string
  /** 'light' = dark text on light bg  |  'dark' = white text on dark bg  |  'filled-white' = white bg button  |  'filled-red' = red bg button */
  variant?: 'light' | 'dark' | 'filled-white' | 'filled-red'
  className?: string
}

export default function ArrowLink({ href, label, variant = 'light', className = '' }: ArrowLinkProps) {
  const base = 'group inline-flex items-center gap-[10px] px-6 py-3 font-body font-bold text-sm uppercase tracking-tight whitespace-nowrap transition-opacity hover:opacity-80'

  const variants: Record<string, string> = {
    light: 'text-[var(--color-text)] opacity-50 hover:opacity-100',
    dark: 'text-white opacity-50 hover:opacity-100',
    'filled-white': 'bg-white text-[var(--color-text)]',
    'filled-red': 'bg-[var(--color-red-mid)] text-white',
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`}>
      <span>{label}</span>
      <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
        <line x1="0" y1="6" x2="22" y2="6" stroke="currentColor" strokeWidth="1.5" />
        <polyline points="16,1 22,6 16,11" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </Link>
  )
}
