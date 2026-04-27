---
name: camlio-stack
description: >-
  Agent skill for creating and extending projects built on the Camlio stack —
  Sanity v5 (Studio) + Next.js 16 (App Router) headless architecture with
  page-builder blocks, GROQ queries, TypeScript types, and Tailwind CSS v4.
version: "1.0"
figma_design_url: ""   # ← Paste your Figma file URL here before starting a session
                        #   e.g. https://www.figma.com/design/<file-id>/<file-name>
                        #   The agent will use Figma MCP to inspect designs when this is set.
tags:
  - sanity
  - nextjs
  - typescript
  - tailwindcss
  - groq
---

# Camlio Stack — Agent Skill

This skill teaches the agent everything needed to **scaffold, extend, and maintain** projects that follow the Camlio architecture: a Sanity v5 CMS driving a Next.js 16 App Router frontend via GROQ queries and a drag-and-drop page builder.

---

## Figma Integration

When `figma_design_url` is set in the metadata above, use the **Figma MCP** to:

1. Open the file and inspect frames / components for exact colors, spacing, typography tokens, and layout.
2. Map Figma components to Sanity block schema fields (e.g., a "Stats Section" Figma component → `backgroundColumnSection` schema object).
3. Implement the frontend component to match the Figma design pixel-accurately.
4. Use Figma-exported asset names and color tokens to keep code aligned with the design system.

---

## Project Overview

| Layer | Technology | Location |
|---|---|---|
| CMS / Studio | Sanity v5 | `/studio` |
| Frontend | Next.js 16 App Router | `/frontend` |
| Styling | Tailwind CSS v4 | `/frontend` |
| Type generation | `sanity typegen` | root `sanity.schema.json` → `frontend/sanity.types.ts` |
| Package management | npm workspaces | root `package.json` |

The two workspaces share types through an extracted schema JSON. **Always run `npm run predev` from the root** (or `npm run sanity:typegen` from `frontend/`) after any schema change to regenerate `sanity.types.ts`.

---

## Monorepo Structure

```
camlio-v2/
├── studio/                          # Sanity Studio (Sanity v5)
│   ├── sanity.config.ts             # Studio config: plugins, structure, presentation tool
│   ├── src/
│   │   ├── schemaTypes/
│   │   │   ├── index.ts             # Master schema registry — import ALL types here
│   │   │   ├── importSchemaType.ts  # Secondary registry for blocks added via create-block.js
│   │   │   ├── documents/           # Document types: page.ts, template.ts, tag.ts
│   │   │   ├── singletons/          # settings.tsx (site-wide config)
│   │   │   └── objects/             # Block schema types (one folder per block)
│   │   │       └── importPageBuilderTypes.ts  # Array entries for the page.pageBuilder field
│   │   └── structure/               # Custom Sanity Studio sidebar structure
│   └── static/page-builder-thumbnails/  # Preview PNGs shown in the Studio "Add block" menu
│
├── frontend/                        # Next.js 16 App Router
│   ├── app/
│   │   ├── layout.tsx               # Root layout: fonts, global providers, Header/Footer
│   │   ├── page.tsx                 # Home page — fetches "home" slug, renders BlockRenderer
│   │   ├── [slug]/page.tsx          # Dynamic pages — fetches by slug, renders PageBuilder
│   │   ├── components/
│   │   │   ├── PageBuilder.tsx      # Renders pageBuilder[] array with live-editing support
│   │   │   ├── BlockRenderer.tsx    # Looks up block._type → React component, renders it
│   │   │   ├── blocks/              # One folder per block (matches schema object name)
│   │   │   ├── ui/                  # Reusable presentational components (Badge, Button, …)
│   │   │   ├── icons/               # SVG icon components + central <Icon> registry
│   │   │   └── global/              # Header, Footer, Layout wrapper
│   │   └── utils/                   # generateSeoMetadata, etc.
│   └── sanity/
│       └── lib/
│           ├── api.ts               # env var exports: projectId, dataset, apiVersion, studioUrl
│           ├── client.ts            # createClient() with stega support
│           ├── live.ts              # sanityFetch() + SanityLive for Live Content API
│           ├── queries.ts           # All GROQ queries (defineQuery)
│           ├── service.ts           # Data fetching helpers (getPageBySlug, getTemplates…)
│           ├── types.ts             # PageBuilderSection, ExtractPageBuilderType, DereferencedLink
│           └── utils.ts             # urlForImage, linkResolver, dataAttr, cn, formatPrice
│
├── create-block.js                  # CLI scaffold: node create-block.js <PascalCaseName>
├── sanity.schema.json               # Auto-generated — DO NOT edit manually
└── package.json                     # Root workspace scripts
```

---

## Core Concepts

### 1. Sanity Schema — Block Objects

Every page section is a Sanity **object** type stored in `studio/src/schemaTypes/objects/<BlockName>/index.ts`:

```ts
import {defineField, defineType} from 'sanity'
import {DocumentIcon} from '@sanity/icons'

export const myBlock = defineType({
  name: 'myBlock',           // camelCase — must match key in BlockRenderer
  title: 'My Block',
  type: 'object',
  icon: DocumentIcon,
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `My Block: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    // … more fields
  ],
})
```

**Registration checklist for a new block:**

| File | What to do |
|---|---|
| `studio/src/schemaTypes/objects/<BlockName>/index.ts` | Create schema |
| `studio/src/schemaTypes/importSchemaType.ts` | Import + add to `importSchemaTypes[]` |
| `studio/src/schemaTypes/objects/importPageBuilderTypes.ts` | Add `{ type: 'myBlock' }` entry |
| `studio/src/schemaTypes/documents/page.ts` | Add `{ type: 'myBlock' }` to `pageBuilder` array if NOT using `importPageBuilderTypes` |
| Run `npm run predev` from root | Regenerate `sanity.types.ts` |

### 2. Frontend Block Component

Each block lives in `frontend/app/components/blocks/<BlockName>/index.tsx`:

```tsx
import { MyBlock } from '@/sanity.types'   // auto-generated type

type MyBlockProps = {
  block: MyBlock
  index: number
}

export default function MyBlockBlock({ block }: MyBlockProps) {
  return (
    <section className="…">
      <h2>{block.heading}</h2>
    </section>
  )
}
```

Then **register it in `BlockRenderer.tsx`**:

```ts
import MyBlockBlock from '@/app/components/blocks/MyBlock'

const Blocks = {
  // …existing entries…
  myBlock: MyBlockBlock,
}
```

### 3. GROQ Queries

All queries live in `frontend/sanity/lib/queries.ts` and use `defineQuery` from `next-sanity`:

```ts
import {defineQuery} from 'next-sanity'

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id, _type, name, slug,
    "pageBuilder": pageBuilder[]{ ... },
    ...
  }
`)
```

**Common patterns:**

```groq
// Dereference a reference field
"author": author->{ firstName, lastName }

// Conditional field projection per block type
_type == "myBlock" => { ..., link{ ..., "page": page->slug.current } }

// Coalesce for fallback values
"title": coalesce(title, "Untitled")

// Image with asset metadata
thumbnail { ..., asset->{ _id, url, metadata { dimensions { width, height } } } }

// Filter + order
*[_type == "template" && defined(slug.current)] | order(_createdAt desc) [0...limit]
```

### 4. TypeScript Types

Types are auto-generated from the Sanity schema. Import them from `@/sanity.types`:

```ts
import { Page, Hero, ColumnSection } from '@/sanity.types'
import { PageBuilderSection, ExtractPageBuilderType } from '@/sanity/lib/types'

// Extract a specific block type from the union
type HeroBlock = ExtractPageBuilderType<'hero'>
```

### 5. Sanity Singletons — Settings

`settings` is a singleton document (id: `siteSettings`) used for site-wide config.  
Schema: `studio/src/schemaTypes/singletons/settings.tsx`  
Query: `settingsQuery` in `queries.ts` → `*[_type == "settings"][0]{ ... }`

### 6. SEO

- The Studio uses `sanity-plugin-seo` (`seoMetaFields` field type).
- On the frontend, `generateSeoMetadata({ slug })` in `frontend/app/utils/` reads the `seo` field and returns Next.js `Metadata`.

### 7. Images

Use `urlForImage` from `@/sanity/lib/utils`:

```ts
import { urlForImage } from '@/sanity/lib/utils'

const src = urlForImage(block.image).width(800).height(600).url()
```

Use Next.js `<Image>` for rendering. Remote domain `cdn.sanity.io` is already configured in `next.config.ts`.

### 8. Links & Navigation

The `link` schema object supports `href`, `page` (reference), and `post` (reference).  
Use `linkResolver(link)` from `@/sanity/lib/utils` to convert to a URL string.

### 9. Styling Conventions

- Tailwind CSS v4 with `@tailwindcss/postcss`.
- Use `cn(...)` from `@/sanity/lib/utils` (wraps `clsx` + `tailwind-merge`) for conditional classes.
- Use `<Container>` from `@/app/components/Container` for consistent horizontal padding.
- Typography scale classes: `heading-1-bold`, `heading-2-bold`, `body-1-regular`, etc. (defined in global CSS).
- Color tokens: `brown-50`, `green-300`, `green-900` (brand palette).

### 10. Live / Draft Mode & Visual Editing

- `sanityFetch()` from `@/sanity/lib/live` handles live content and draft mode automatically.
- `<SanityLive>` in root layout keeps all fetches live.
- `dataAttr()` from utils attaches `data-sanity` attributes for Presentation Tool click-to-edit.
- `useOptimistic` in `PageBuilder.tsx` reconciles optimistic Studio edits.

---

## Quick-Start Commands

```bash
# From repo root:
npm run dev                    # Start both Studio (:3333) and Next.js (:3000) in parallel
npm run create-block MySection # Scaffold a new block (schema + frontend component)
npm run predev                 # Regenerate sanity.types.ts after schema changes
npm run type-check             # TypeScript check across all workspaces
npm run lint                   # ESLint on frontend

# From /studio:
npx sanity deploy              # Deploy Studio to Sanity-hosted URL

# From /frontend:
npm run build                  # Production build (runs typegen first via prebuild)
```

---

## Environment Variables

| Variable | Workspace | Required |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | frontend | ✅ |
| `NEXT_PUBLIC_SANITY_DATASET` | frontend | ✅ |
| `NEXT_PUBLIC_SANITY_API_VERSION` | frontend | optional (default `2025-09-25`) |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | frontend | optional (default `http://localhost:3333`) |
| `NEXT_PUBLIC_APP_URL` | frontend | optional |
| `SANITY_API_READ_TOKEN` | frontend | for private datasets |
| `SANITY_API_WRITE_TOKEN` | frontend | for mutations |
| `SANITY_STUDIO_PROJECT_ID` | studio | ✅ |
| `SANITY_STUDIO_DATASET` | studio | ✅ |

---

## References

See the `references/` folder for detailed guides:

- `references/architecture.md` — full architecture diagram and data flow
- `references/block-contract.md` — complete specification for adding a new block end-to-end
- `references/groq-patterns.md` — GROQ cheat sheet for this codebase
- `references/env-vars.md` — full environment variable reference

See the `assets/templates/` folder for copy-paste starters:

- `assets/templates/block-schema.ts` — Sanity schema template
- `assets/templates/block-component.tsx` — Next.js block component template
