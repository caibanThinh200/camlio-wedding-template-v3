'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Container from '@/app/components/ui/Container'
import { Logo } from '../icons/logo'

type NavLink = { label: string; href: string }

type HeaderProps = {
  navLinks?: NavLink[]
  ctaLabel?: string
  ctaHref?: string
}

const defaultNavLinks: NavLink[] = [
  { label: 'ROOM & SUITES', href: '#services' },
  { label: 'EXPERIENCE', href: '#experience' },
  { label: 'GALLERY', href: '#process' },
]

export default function Header({
  navLinks = defaultNavLinks,
  ctaLabel = 'RESERVE NOW',
  ctaHref = '/contact',
}: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY >= 200)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 py-5 transition-[backdrop-filter,background-color] duration-300 ${scrolled || menuOpen ? 'backdrop-blur-md bg-black/30' : ''}`}>
        <Container className="flex items-center justify-between h-16 md:h-[88px]">
          <Link
            href="/"
            className="text-white font-display font-semibold text-2xl md:text-[28px] tracking-tight leading-none select-none"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <Logo />
          </Link>

          <nav className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white font-body text-base uppercase tracking-wide hover:opacity-70 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={ctaHref}
              className="hidden md:block backdrop-blur-[10px] bg-white/20 px-4 py-2 md:px-6 md:py-3 text-white font-body text-sm md:text-base uppercase tracking-wide hover:bg-white/30 transition-colors"
            >
              {ctaLabel}
            </a>

            {/* Hamburger — mobile only */}
            <button
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 shrink-0"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-white transition-transform duration-300 origin-center ${menuOpen ? 'translate-y-2 rotate-45' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-opacity duration-300 ${menuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-white transition-transform duration-300 origin-center ${menuOpen ? '-translate-y-2 -rotate-45' : ''}`}
              />
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col md:hidden transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        aria-hidden={!menuOpen}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={closeMenu} />

        {/* Panel */}
        <div className="relative flex flex-col justify-center items-center gap-10 h-full px-8">
          <nav>
            <ul className="flex flex-col items-center gap-8">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={closeMenu}
                    className="text-white font-body text-2xl uppercase tracking-widest hover:opacity-70 transition-opacity"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <a
            href={ctaHref}
            onClick={closeMenu}
            className="bg-white text-black font-body text-base uppercase tracking-wide px-8 py-4 hover:bg-white/80 transition-colors"
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </>
  )
}
