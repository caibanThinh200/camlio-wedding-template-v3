import HeroBlock from '@/app/components/blocks/Hero'
import AboutBlock from '@/app/components/blocks/About'
import SocialProofBlock from '@/app/components/blocks/SocialProof'
import ServicesBlock from '@/app/components/blocks/Services'
import ExperienceBlock from '@/app/components/blocks/Experience'
import ProcessBlock from '@/app/components/blocks/Process'
import FooterBlock from '@/app/components/blocks/Footer'
import {
  mapHeroBlock,
  mapAboutBlock,
  mapSocialProofBlock,
  mapServicesBlock,
  mapExperienceBlock,
  mapProcessBlock,
  mapFooterBlock,
} from '@/sanity/lib/service'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = Record<string, any> & { _type: string; _key: string }

const renderers: Record<string, (block: Block) => React.ReactNode> = {
  hero: (b) => <HeroBlock key={b._key} {...mapHeroBlock(b)} />,
  about: (b) => <AboutBlock key={b._key} {...mapAboutBlock(b)} />,
  socialProof: (b) => <SocialProofBlock key={b._key} {...mapSocialProofBlock(b)} />,
  services: (b) => <ServicesBlock key={b._key} {...mapServicesBlock(b)} />,
  experience: (b) => <ExperienceBlock key={b._key} {...mapExperienceBlock(b)} />,
  process: (b) => <ProcessBlock key={b._key} {...mapProcessBlock(b)} />,
  footer: (b) => <FooterBlock key={b._key} {...mapFooterBlock(b)} />,
}

type BlockRendererProps = {
  block: Block
}

export default function BlockRenderer({ block }: BlockRendererProps) {
  const render = renderers[block._type]
  if (!render) return null
  return <>{render(block)}</>
}
