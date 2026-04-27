import Image from 'next/image'
import ArrowLink from '@/app/components/ui/ArrowLink'
import Container from '@/app/components/ui/Container'
import ItalicHeading from '@/app/components/ui/ItalicHeading'

export type HeroBlockProps = {
  backgroundImage: string
  headline: string
  italicWord: string
  ctaLabel: string
  ctaHref: string
  sectionLabels: string[]
  activeSection?: number
}

export default function HeroBlock({
  backgroundImage,
  headline,
  italicWord,
  ctaLabel,
  ctaHref,
  sectionLabels,
  activeSection = 0,
}: HeroBlockProps) {
  return (
    <section className="relative w-full h-screen min-h-[600px] md:min-h-[822px] flex flex-col">
      <div className="absolute inset-0">
        <Image
          src={backgroundImage}
          alt="Hero background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[rgba(49,0,0,0.5)]" />
      </div>

      {/* Headline + CTA */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 gap-8 md:gap-12 text-center px-4 pt-16 md:pt-[88px]">
        <ItalicHeading
          as="h1"
          text={headline}
          italicPart={italicWord}
          className="display-hero text-white text-center max-w-[90vw] md:max-w-[1100px]"
        />
        <ArrowLink href={ctaHref} label={ctaLabel} variant="filled-white" />
      </div>

      {/* Section progress indicator — hidden on mobile */}
      <div className="relative z-10 pb-4 hidden md:block">
        <Container className="flex flex-col gap-3">
          <div className="flex items-center justify-between w-full">
            {sectionLabels.map((label, i) => (
              <span
                key={label}
                className="text-white font-body text-sm lg:text-base"
                style={{ opacity: i === activeSection ? 1 : 0.6 }}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="w-full h-[2px] bg-white/30">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${((activeSection + 1) / sectionLabels.length) * 100}%` }}
            />
          </div>
        </Container>
      </div>
    </section>
  )
}
