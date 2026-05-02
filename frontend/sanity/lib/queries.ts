import { defineQuery } from 'next-sanity'

// ─── Image fragment (inline) ──────────────────────────────────────────────────
// Returns { url, alt } for all image fields
const imageProjection = `{ "url": asset->url, alt }`

// ─── Home page ────────────────────────────────────────────────────────────────
export const homePageQuery = defineQuery(`
  *[_type == "page" && slug.current == "home"][0] {
    _id,
    name,
    "pageBuilder": pageBuilder[] {
      _type,
      _key,
      _type == "hero" => {
        "backgroundImage": backgroundImage${imageProjection},
        headline,
        italicWord,
        ctaLabel,
        ctaHref,
      },
      _type == "about" => {
        "image": image${imageProjection},
        heading,
        italicPhrase,
        body,
        ctaLabel,
        ctaHref,
      },
      _type == "socialProof" => {
        eyebrow,
        description,
        "stats": stats[] {
          _key,
          value,
          label,
          "image": image${imageProjection},
        },
      },
      _type == "services" => {
        heading,
        italicPhrase,
        subheading,
        "items": items[] {
          _key,
          year,
          title,
          "image": image${imageProjection},
          href,
        },
      },
      _type == "experience" => {
        heading,
        italicPhrase,
        body,
        ctaLabel,
        ctaHref,
        "videoThumbnail": videoThumbnail${imageProjection},
        videoUrl,
      },
      _type == "process" => {
        heading,
        italicPhrase,
        subheading,
        "steps": steps[] {
          _key,
          number,
          title,
          "image": image${imageProjection},
        },
      },
      _type == "footer" => {
        headline,
        italicPart,
        ctaLabel,
        ctaHref,
        "backgroundImage": backgroundImage${imageProjection},
        addressLines,
        phone,
        email,
        social,
        copyright,
      },
    }
  }
`)

// ─── Settings (singleton) ─────────────────────────────────────────────────────
export const settingsQuery = defineQuery(`
  *[_type == "settings"][0] {
    siteName,
    tagline,
    "logo": logo${imageProjection},
    navLinks,
    social,
    contactEmail,
    contactPhone,
  }
`)

// ─── Page by slug ─────────────────────────────────────────────────────────────
export const pageBySlugQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0] {
    _id,
    name,
    slug,
    "pageBuilder": pageBuilder[] {
      _type,
      _key,
    }
  }
`)
