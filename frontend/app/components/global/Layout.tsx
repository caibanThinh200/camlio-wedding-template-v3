import Header from '@/app/components/global/Header'
import Footer, { type FooterProps } from '@/app/components/global/Footer'

// Phase 1 mock data — replace with Sanity settings query in Phase 2
const footerData: FooterProps = {
  headline: 'CREATE SOMETHING BEAUTIFUL, MEMORABLE & UNIQUELY YOURS',
  italicPart: 'MEMORABLE',
  ctaLabel: 'CONTACT US',
  ctaHref: '/contact',
  backgroundImage:
    'https://www.figma.com/api/mcp/asset/eec296c2-ef8a-4095-985b-9b8fd47e39d3',
  address: {
    label: 'Address',
    lines: ['Based in Ho Chi Minh City', 'Available for destination events'],
  },
  contact: {
    phone: '+84 123 456 789',
    email: 'camlio.studio@outlook.com',
  },
  social: [
    { platform: 'Instagram', href: 'https://instagram.com' },
    { platform: 'Facebook', href: 'https://facebook.com' },
    { platform: 'TikTok', href: 'https://tiktok.com' },
  ],
  copyright: '©2026 All rights reserved',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer {...footerData} />
    </>
  )
}
