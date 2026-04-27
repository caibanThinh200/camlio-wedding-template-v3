'use client'

import Image from 'next/image'
import ArrowLink from '@/app/components/ui/ArrowLink'
import Container from '@/app/components/ui/Container'
import ItalicHeading from '@/app/components/ui/ItalicHeading'

export type SocialLink = {
  platform: string
  href: string
}

export type FooterProps = {
  headline: string
  italicPart: string
  ctaLabel: string
  ctaHref: string
  backgroundImage: string
  address: { label: string; lines: string[] }
  contact: { phone: string; email: string }
  social: SocialLink[]
  copyright: string
}

export default function Footer({
  headline,
  italicPart,
  ctaLabel,
  ctaHref,
  backgroundImage,
  address,
  contact,
  social,
  copyright,
}: FooterProps) {
  const parts = headline.split(italicPart)

  return (
    <footer className="bg-[var(--color-red-deep)] pt-16 lg:pt-[120px]">
      <Container className="flex flex-col gap-16 lg:gap-[100px] items-center">
        {/* CTA hero area */}
        <div className="relative w-full max-w-[1278px] h-[280px] md:h-[340px] lg:h-[400px] flex items-center justify-center">
          <div className="absolute left-1/2 -translate-x-1/2 top-0 size-[280px] md:size-[340px] lg:size-[400px] opacity-50 overflow-hidden rounded-full">
            <Image src={backgroundImage} alt="" fill className="object-cover scale-150" />
          </div>

          <div className="relative text-center z-10 px-4">
            <h2 className="display-xl text-white whitespace-pre-wrap">
              {parts[0]}
              <em>{italicPart}</em>
              {parts[1]}
            </h2>
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
            <ArrowLink href={ctaHref} label={ctaLabel} variant="filled-white" />
          </div>
        </div>

        {/* Contact bar + copyright */}
        <div className="flex flex-col gap-8 lg:gap-10 w-full">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4 w-full">
            <div className="flex flex-col gap-4">
              <span className="label text-white">{address.label}</span>
              <div>
                {address.lines.map((line, i) => (
                  <p key={i} className="label text-white/60 normal-case text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <span className="label text-white">Contact</span>
              <p className="label text-white/60 normal-case text-sm">{contact.phone}</p>
              <a
                href={`mailto:${contact.email}`}
                className="label text-white/60 normal-case text-sm underline hover:text-white transition-colors"
              >
                {contact.email}
              </a>
            </div>

            <div className="flex flex-col gap-4">
              <span className="label text-white">Social Media</span>
              <div className="flex gap-6 lg:gap-10">
                {social.map((s) => (
                  <a
                    key={s.platform}
                    href={s.href}
                    className="label text-white/60 normal-case text-sm hover:text-white transition-colors"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 flex flex-col md:flex-row items-center justify-between gap-4 py-8 lg:py-10 w-full">
            <span className="label text-white text-sm normal-case">{copyright}</span>
            <div className="flex items-center gap-6">
              <span className="label text-white text-sm normal-case cursor-pointer hover:opacity-70">
                Terms Of Use
              </span>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="label text-white text-sm normal-case hover:opacity-70"
              >
                Back To Top
              </button>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
