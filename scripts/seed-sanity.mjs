#!/usr/bin/env node
/**
 * seed-sanity.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Migrates the frontend mock data into Sanity as real documents.
 *
 * Creates (or replaces) two documents:
 *   • page { slug: "home" }  — full pageBuilder[] array
 *   • settings               — contact / social / nav links
 *
 * ⚠️  Images: the mock data uses Figma asset URLs that are not publicly
 *     accessible. Image fields are left empty here — upload them manually
 *     in Sanity Studio after running this script.
 *
 * Usage:
 *   SANITY_API_WRITE_TOKEN=<your-token> node scripts/seed-sanity.mjs
 *
 *   Or add SANITY_API_WRITE_TOKEN to studio/.env and run:
 *   node scripts/seed-sanity.mjs
 *
 * Get a write token at: https://sanity.io/manage → project → API → Tokens
 */

import { createClient } from '@sanity/client'
import { randomUUID } from 'crypto'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// ─── Resolve env from studio/.env ────────────────────────────────────────────

const __dirname = dirname(fileURLToPath(import.meta.url))

function loadEnv(filePath) {
  try {
    const raw = readFileSync(filePath, 'utf8')
    for (const line of raw.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const [key, ...rest] = trimmed.split('=')
      if (key && !process.env[key]) {
        process.env[key] = rest.join('=').trim()
      }
    }
  } catch {
    // file not found — rely on process.env
  }
}

loadEnv(resolve(__dirname, '../studio/.env'))

const projectId = process.env.SANITY_STUDIO_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset   = process.env.SANITY_STUDIO_DATASET    || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token     = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('❌  SANITY_STUDIO_PROJECT_ID is not set.')
  process.exit(1)
}
if (!token) {
  console.error('❌  SANITY_API_WRITE_TOKEN is not set.')
  console.error('    Get one at https://sanity.io/manage → project → API → Tokens')
  process.exit(1)
}

const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false })

const key = () => randomUUID().replace(/-/g, '').slice(0, 12)

// ─── Mock data ────────────────────────────────────────────────────────────────

const pageBuilder = [
  {
    _type: 'hero',
    _key: key(),
    headline: 'DESIGNING MOMENTS, CRAFTING ATMOSPHERES',
    italicWord: 'MOMENTS',
    ctaLabel: 'Book a Consultation',
    ctaHref: '/contact',
    // backgroundImage: upload manually in Studio
  },
  {
    _type: 'about',
    _key: key(),
    heading: 'WHERE EVERY EVENT BECOMES A MASTERPIECE',
    italicPhrase: 'EVERY EVENT',
    body: [
      'We are a boutique event decor agency specialising in weddings and intimate celebrations. From concept to execution, we design immersive spaces that reflect your story, style, and emotions.',
      'Every detail — from florals to lighting — is curated to create a seamless and unforgettable atmosphere.',
    ],
    ctaLabel: 'Discover More',
    ctaHref: '/about',
    // image: upload manually in Studio
  },
  {
    _type: 'socialProof',
    _key: key(),
    eyebrow: 'FEEDBACK FROM CLIENTS',
    description:
      'Trusted by hundreds of couples and brands, we deliver refined aesthetics and exceptional event experiences.',
    stats: [
      { _key: key(), value: '250+', label: 'Events Styled' },
      { _key: key(), value: '4.9/5', label: 'Client Satisfaction' },
      { _key: key(), value: '90%',   label: 'Returning Clients' },
    ],
  },
  {
    _type: 'services',
    _key: key(),
    heading: 'ELEGANT DESIGNS, IMMERSIVE SPACES — YOUR VISION, OUR CRAFT',
    italicPhrase: 'YOUR VISION, OUR CRAFT',
    subheading:
      'Every event is a story. We design environments that evoke emotion and elevate every moment.',
    items: [
      { _key: key(), year: '2026.', title: 'SIGNATURE WEDDING DECOR',        href: '/services/wedding-decor' },
      { _key: key(), year: '2023.', title: 'PRIVATE EVENT STYLING',           href: '/services/private-events' },
      { _key: key(), year: '2023.', title: 'CORPORATE & BRAND EVENTS',        href: '/services/corporate' },
      { _key: key(), year: '2023.', title: 'FLORAL & TABLESCAPE DESIGN',      href: '/services/floral' },
      { _key: key(), year: '2023.', title: 'LUXURY BACKDROP & INSTALLATIONS', href: '/services/installations' },
    ],
  },
  {
    _type: 'experience',
    _key: key(),
    heading: 'OUR PHILOSOPHY, YOUR EXPERIENCE',
    italicPhrase: 'YOUR EXPERIENCE',
    body: "We believe decor is not just visual — it's emotional.\nOur approach blends creativity, craftsmanship, and storytelling to create spaces that leave lasting impressions.",
    ctaLabel: 'Explore Our Process',
    ctaHref: '/process',
    videoUrl: '/mp4/wedding.mp4',
  },
  {
    _type: 'process',
    _key: key(),
    heading: 'HOW TO WORK WITH US — A SEAMLESS JOURNEY',
    italicPhrase: 'A SEAMLESS JOURNEY',
    subheading:
      'From the first conversation to the final styling touch, we guide you through every step with care and precision.',
    steps: [
      { _key: key(), number: '01.', title: 'Consultation' },
      { _key: key(), number: '02.', title: 'Concept & Design' },
      { _key: key(), number: '03.', title: 'Planning & Preparation' },
      { _key: key(), number: '04.', title: 'Execution & Styling' },
    ],
  },
  {
    _type: 'footer',
    _key: key(),
    headline: 'CREATE SOMETHING BEAUTIFUL, MEMORABLE & UNIQUELY YOURS',
    italicPart: 'MEMORABLE',
    ctaLabel: 'CONTACT US',
    ctaHref: '/contact',
    addressLines: ['Based in Ho Chi Minh City', 'Available for destination events'],
    phone: '+84 123 456 789',
    email: 'camlio.studio@outlook.com',
    social: [
      { _key: key(), platform: 'Instagram', href: 'https://instagram.com' },
      { _key: key(), platform: 'Facebook',  href: 'https://facebook.com' },
      { _key: key(), platform: 'TikTok',    href: 'https://tiktok.com' },
    ],
    copyright: '©2026 All rights reserved',
  },
]

const settingsDoc = {
  _id: 'siteSettings',
  _type: 'settings',
  siteName: 'Camlio Studio',
  tagline: 'Boutique event decor agency specialising in weddings and intimate celebrations.',
  navLinks: [
    { _key: key(), label: 'ROOM & SUITES', href: '#services' },
    { _key: key(), label: 'EXPERIENCE',    href: '#experience' },
    { _key: key(), label: 'GALLERY',       href: '#process' },
  ],
  social: [
    { _key: key(), platform: 'Instagram', href: 'https://instagram.com' },
    { _key: key(), platform: 'Facebook',  href: 'https://facebook.com' },
    { _key: key(), platform: 'TikTok',    href: 'https://tiktok.com' },
  ],
  contactEmail: 'camlio.studio@outlook.com',
  contactPhone: '+84 123 456 789',
}

const homePageDoc = {
  _id: 'home-page',
  _type: 'page',
  name: 'Home',
  slug: { _type: 'slug', current: 'home' },
  pageBuilder,
}

// ─── Run ──────────────────────────────────────────────────────────────────────

async function seed() {
  console.log(`\n🌱  Seeding Sanity project ${projectId} / ${dataset}\n`)

  const transaction = client.transaction()
  transaction.createOrReplace(homePageDoc)
  transaction.createOrReplace(settingsDoc)

  const result = await transaction.commit()
  console.log(`✅  Done! Created/replaced ${result.results.length} documents.`)
  console.log(`\n📝  Next steps:`)
  console.log(`    1. Open Sanity Studio at http://localhost:3333`)
  console.log(`    2. Open the "Home" page and upload images for each block`)
  console.log(`    3. Run \`npm run predev\` if you changed the schema\n`)
}

seed().catch((err) => {
  console.error('❌  Seed failed:', err.message)
  process.exit(1)
})
