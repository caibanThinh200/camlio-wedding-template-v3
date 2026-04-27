import Image from 'next/image'
import Container from '@/app/components/ui/Container'
import AnimatedStat from '@/app/components/ui/AnimatedStat'

export type StatItem = {
  value: string
  label: string
  image: string
  animateFrom?: number
  animateDuration?: number
}

export type SocialProofBlockProps = {
  eyebrow: string
  description: string
  stats: StatItem[]
}

export default function SocialProofBlock({ eyebrow, description, stats }: SocialProofBlockProps) {
  return (
    <section className="bg-[var(--color-blush)] py-16 lg:py-[120px]">
      <Container className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-10">
        <div className="flex flex-col gap-6 max-w-full lg:max-w-[509px] text-center lg:text-left">
          <h2 className="display-lg text-[var(--color-text)]">{eyebrow}</h2>
          <p className="body-lg text-[var(--color-text)] opacity-60">{description}</p>
        </div>

        <div className="flex items-start justify-center gap-6 lg:gap-10 flex-wrap">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-6 lg:gap-10">
              <div className="relative size-[140px] md:size-[200px] rounded-full overflow-hidden">
                <Image src={stat.image} alt={stat.label} fill className="object-cover" />
              </div>
              <div className="flex flex-col items-center gap-4 lg:gap-6 w-full">
                <span className="font-body font-bold text-[32px] md:text-[44px] leading-normal text-[var(--color-text)]">
                  <AnimatedStat value={stat.value} from={stat.animateFrom} duration={stat.animateDuration} />
                </span>
                <span className="body-lg text-[var(--color-text)] opacity-[0.78]">{stat.label}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}
