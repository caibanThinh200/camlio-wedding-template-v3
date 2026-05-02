import Header from '@/app/components/global/Header'
import Footer, { type FooterProps } from '@/app/components/global/Footer'
import { getSettings } from '@/sanity/lib/service'

const fallbackFooter: FooterProps = {
  headline: 'CREATE SOMETHING BEAUTIFUL, MEMORABLE & UNIQUELY YOURS',
  italicPart: 'MEMORABLE',
  ctaLabel: 'CONTACT US',
  ctaHref: '/contact',
  backgroundImage: '',
  address: { label: 'Address', lines: [] },
  contact: { phone: '', email: '' },
  social: [],
  copyright: `©${new Date().getFullYear()} All rights reserved`,
}

export default async function Layout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()

  const navLinks = (settings?.navLinks ?? []).map((l: { label?: string | null; href?: string | null; _key: string }) => ({
    label: l.label ?? '',
    href: l.href ?? '/',
  }))

  const footer: FooterProps = settings
    ? {
        ...fallbackFooter,
        contact: {
          phone: settings.contactPhone ?? '',
          email: settings.contactEmail ?? '',
        },
        social: (settings.social ?? []).map((s: { platform?: string | null; href?: string | null; _key?: string }) => ({
          platform: s.platform ?? '',
          href: s.href ?? '#',
        })),
      }
    : fallbackFooter

  return (
    <>
      <Header navLinks={navLinks.length ? navLinks : undefined} />
      <main>{children}</main>
      <Footer {...footer} />
    </>
  )
}
