import { client } from './client'
import { homePageQuery, settingsQuery } from './queries'
import type { HeroBlockProps } from '@/app/components/blocks/Hero'
import type { AboutBlockProps } from '@/app/components/blocks/About'
import type { SocialProofBlockProps, StatItem } from '@/app/components/blocks/SocialProof'
import type { ServicesBlockProps, ServiceItem } from '@/app/components/blocks/Services'
import type { ExperienceBlockProps } from '@/app/components/blocks/Experience'
import type { ProcessBlockProps, ProcessStep } from '@/app/components/blocks/Process'
import type { FooterProps } from '@/app/components/global/Footer'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function img(field: { url: string | null; alt?: string | null } | null | undefined): string {
  return field?.url ?? ''
}

// ─── Home page ────────────────────────────────────────────────────────────────

export async function getHomePage() {
  return client.fetch(homePageQuery)
}

// ─── Settings ─────────────────────────────────────────────────────────────────

export async function getSettings() {
  return client.fetch(settingsQuery)
}

// ─── Block → component prop mappers ──────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapHeroBlock(block: any): HeroBlockProps {
  return {
    backgroundImage: img(block.backgroundImage),
    headline: block.headline ?? '',
    italicWord: block.italicWord ?? '',
    ctaLabel: block.ctaLabel ?? '',
    ctaHref: block.ctaHref ?? '/',
    sectionLabels: block.sectionLabels ?? [],
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapAboutBlock(block: any): AboutBlockProps {
  return {
    image: img(block.image),
    imageAlt: block.image?.alt ?? '',
    heading: block.heading ?? '',
    italicPhrase: block.italicPhrase ?? '',
    body: block.body ?? [],
    ctaLabel: block.ctaLabel ?? '',
    ctaHref: block.ctaHref ?? '/',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapSocialProofBlock(block: any): SocialProofBlockProps {
  const stats: StatItem[] = (block.stats ?? []).map((s: any) => ({
    value: s.value ?? '',
    label: s.label ?? '',
    image: img(s.image),
  }))
  return {
    eyebrow: block.eyebrow ?? '',
    description: block.description ?? '',
    stats,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapServicesBlock(block: any): ServicesBlockProps {
  const items: ServiceItem[] = (block.items ?? []).map((item: any) => ({
    year: item.year ?? '',
    title: item.title ?? '',
    image: item.image?.url ?? undefined,
    href: item.href ?? '/',
  }))
  return {
    heading: block.heading ?? '',
    italicPhrase: block.italicPhrase ?? '',
    subheading: block.subheading ?? '',
    items,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapExperienceBlock(block: any): ExperienceBlockProps {
  return {
    heading: block.heading ?? '',
    italicPhrase: block.italicPhrase ?? '',
    body: block.body ?? '',
    ctaLabel: block.ctaLabel ?? '',
    ctaHref: block.ctaHref ?? '/',
    videoThumbnail: block.videoThumbnail?.url ?? undefined,
    videoUrl: block.videoUrl ?? '',
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapProcessBlock(block: any): ProcessBlockProps {
  const steps: ProcessStep[] = (block.steps ?? []).map((step: any) => ({
    number: step.number ?? '',
    title: step.title ?? '',
    image: img(step.image),
    imageAlt: step.image?.alt ?? step.title ?? '',
  }))
  return {
    heading: block.heading ?? '',
    italicPhrase: block.italicPhrase ?? '',
    subheading: block.subheading ?? '',
    steps,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function mapFooterBlock(block: any): FooterProps {
  return {
    headline: block.headline ?? '',
    italicPart: block.italicPart ?? '',
    ctaLabel: block.ctaLabel ?? '',
    ctaHref: block.ctaHref ?? '/',
    backgroundImage: img(block.backgroundImage),
    address: {
      label: 'Address',
      lines: block.addressLines ?? [],
    },
    contact: {
      phone: block.phone ?? '',
      email: block.email ?? '',
    },
    social: (block.social ?? []).map((s: any) => ({
      platform: s.platform ?? '',
      href: s.href ?? '#',
    })),
    copyright: block.copyright ?? '',
  }
}
