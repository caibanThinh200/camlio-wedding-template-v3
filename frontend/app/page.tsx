import HeroBlock, { type HeroBlockProps } from '@/app/components/blocks/Hero'
import AboutBlock, { type AboutBlockProps } from '@/app/components/blocks/About'
import SocialProofBlock, { type SocialProofBlockProps } from '@/app/components/blocks/SocialProof'
import ServicesBlock, { type ServicesBlockProps } from '@/app/components/blocks/Services'
import ExperienceBlock, { type ExperienceBlockProps } from '@/app/components/blocks/Experience'
import ProcessBlock, { type ProcessBlockProps } from '@/app/components/blocks/Process'

// ─── Mock data ───────────────────────────────────────────────────────────────
// These objects mirror the Sanity schema fields exactly.
// In Phase 2 they will be replaced by data fetched from Sanity via GROQ.

const heroData: HeroBlockProps = {
  backgroundImage:
    'https://www.figma.com/api/mcp/asset/bd0f9b83-9591-4e82-a786-abcca489c75a',
  headline: 'DESIGNING MOMENTS, CRAFTING ATMOSPHERES',
  italicWord: 'MOMENTS',
  ctaLabel: 'Book a Consultation',
  ctaHref: '/contact',
  sectionLabels: [
    '01 / Who We Are',
    '02 / Services',
    '03 / Experience',
    '04 / Testimonials',
    '05 / Gallery',
  ],
  activeSection: 0,
}

const aboutData: AboutBlockProps = {
  image: 'https://www.figma.com/api/mcp/asset/481a2405-47d4-4d51-a77c-d068b15c85c4',
  imageAlt: 'Boutique event decor — bride writing in notebook',
  heading: 'WHERE EVERY EVENT BECOMES A MASTERPIECE',
  italicPhrase: 'EVERY EVENT',
  body: [
    'We are a boutique event decor agency specialising in weddings and intimate celebrations. From concept to execution, we design immersive spaces that reflect your story, style, and emotions.',
    'Every detail — from florals to lighting — is curated to create a seamless and unforgettable atmosphere.',
  ],
  ctaLabel: 'Discover More',
  ctaHref: '/about',
}

const socialProofData: SocialProofBlockProps = {
  eyebrow: 'FEEDBACK FROM CLIENTS',
  description:
    'Trusted by hundreds of couples and brands, we deliver refined aesthetics and exceptional event experiences.',
  stats: [
    {
      value: '250+',
      label: 'Events Styled',
      image: 'https://www.figma.com/api/mcp/asset/f0c34ad5-6566-46f2-bcef-f07e8974071c',
      animateFrom: 0,
      animateDuration: 1200,
    },
    {
      value: '4.9/5',
      label: 'Client Satisfaction',
      image: 'https://www.figma.com/api/mcp/asset/ccfa8b15-4f94-47cc-99ff-0c5316425bfb',
      animateFrom: 4,
      animateDuration: 3000,
    },
    {
      value: '90%',
      label: 'Returning Clients',
      image: 'https://www.figma.com/api/mcp/asset/bcdb8001-5703-4f80-b416-59fb61f46160',
      animateFrom: 60,
      animateDuration: 2000,
    },
  ],
}

const servicesData: ServicesBlockProps = {
  heading: 'ELEGANT DESIGNS, IMMERSIVE SPACES — YOUR VISION, OUR CRAFT',
  italicPhrase: 'YOUR VISION, OUR CRAFT',
  subheading:
    'Every event is a story. We design environments that evoke emotion and elevate every moment.',
  items: [
    {
      year: '2026.',
      title: 'SIGNATURE WEDDING DECOR',
      href: '/services/wedding-decor',
    },
    {
      year: '2023.',
      title: 'PRIVATE EVENT STYLING',
      image: 'https://www.figma.com/api/mcp/asset/4acc530d-1938-4ea9-84f4-3c79d70e8e30',
      href: '/services/private-events',

    },
    {
      year: '2023.',
      title: 'CORPORATE & BRAND EVENTS',
      href: '/services/corporate',
    },
    {
      year: '2023.',
      title: 'FLORAL & TABLESCAPE DESIGN',
      href: '/services/floral',
    },
    {
      year: '2023.',
      title: 'LUXURY BACKDROP & INSTALLATIONS',
      href: '/services/installations',
    },
  ],
}

const experienceData: ExperienceBlockProps = {
  heading: 'OUR PHILOSOPHY, YOUR EXPERIENCE',
  italicPhrase: 'YOUR EXPERIENCE',
  body: "We believe decor is not just visual — it's emotional.\nOur approach blends creativity, craftsmanship, and storytelling to create spaces that leave lasting impressions.",
  ctaLabel: 'Explore Our Process',
  ctaHref: '/process',
  // videoThumbnail:
  //   'https://www.figma.com/api/mcp/asset/5b37e2cf-491b-490f-ad76-513e496d7d41',
  videoUrl: '/mp4/wedding.mp4',
}

const processData: ProcessBlockProps = {
  heading: 'HOW TO WORK WITH US — A SEAMLESS JOURNEY',
  italicPhrase: 'A SEAMLESS JOURNEY',
  subheading:
    'From the first conversation to the final styling touch, we guide you through every step with care and precision.',
  steps: [
    {
      number: '01.',
      title: 'Consultation',
      image: 'https://www.figma.com/api/mcp/asset/7b52c5ad-510e-4a95-921f-74f95b9ebcf4',
    },
    {
      number: '02.',
      title: 'Concept & Design',
      image: 'https://www.figma.com/api/mcp/asset/b2f8bfd7-6dcf-4e54-93a6-50166339510a',
    },
    {
      number: '03.',
      title: 'Planning & Preparation',
      image: 'https://www.figma.com/api/mcp/asset/bbb10fa4-a211-4a5d-9c26-e94417535be4',
    },
    {
      number: '04.',
      title: 'Execution & Styling',
      image: 'https://www.figma.com/api/mcp/asset/534fec12-cb79-4c7a-a766-4ac2047cdd7b',
    },
  ],
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// export default function HomePage() {
//   return (
//     <>
//       <HeroBlock {...heroData} />
//       <AboutBlock {...aboutData} />
//       <SocialProofBlock {...socialProofData} />
//       <ServicesBlock {...servicesData} />
//       <ExperienceBlock {...experienceData} />
//       <ProcessBlock {...processData} />
//     </>
//   )
// }


import PageBuilder from '@/app/components/PageBuilder'
import { getHomePage } from '@/sanity/lib/service'

export default async function HomePage() {
  const page = await getHomePage()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blocks = (page?.pageBuilder ?? []) as any[]

  return <PageBuilder blocks={blocks} />
}