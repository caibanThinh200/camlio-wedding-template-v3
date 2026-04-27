# Architecture & Data Flow

## Overview

```
Sanity Studio (v5)          Next.js 16 App Router
┌──────────────────┐        ┌──────────────────────────────────┐
│  sanity.config   │        │  layout.tsx                      │
│  ├ structureTool │        │  ├ <SanityLive>                  │
│  ├ presentation  │        │  ├ <Header> / <Footer>           │
│  ├ visionTool    │        │  └ <Layout>{children}</Layout>   │
│  ├ assist        │        │                                  │
│  └ seoMetaFields │        │  page.tsx (home)                 │
│                  │        │  ├ getPageBySlug("home")         │
│  schemaTypes/    │        │  └ <BlockRenderer> × n          │
│  ├ documents/    │        │                                  │
│  │ └ page.ts     │  GROQ  │  [slug]/page.tsx (dynamic)      │
│  ├ singletons/   │◄──────►│  ├ getPageBySlug(slug)          │
│  │ └ settings    │        │  └ <PageBuilder>                 │
│  └ objects/      │        │     └ <BlockRenderer> × n       │
│    ├ Hero/       │        │        └ <HeroBlock>             │
│    ├ ColumnSection/       │        └ <ColumnSectionBlock>    │
│    └ …           │        │        └ …                      │
└──────────────────┘        └──────────────────────────────────┘
         │                              │
         │     sanity.schema.json       │
         └──────────────────────────────┘
                   (typegen)
                sanity.types.ts
```

## Data Flow — Page Render

1. **Request arrives** at `[slug]/page.tsx` (or root `page.tsx` for home).
2. `sanityFetch({ query: getPageQuery, params: { slug } })` calls Sanity's Content Lake via GROQ.
3. The returned `page.pageBuilder[]` array contains typed block objects (union type `PageBuilderSection`).
4. `<PageBuilder>` wraps the array with `useOptimistic` for real-time Studio editing.
5. For each block, `<BlockRenderer>` looks up `block._type` in the `Blocks` map and renders the matching React component.
6. Individual block components receive the typed `block` object and render HTML + Tailwind CSS.

## Data Flow — Studio Editing (Visual Editing / Presentation Tool)

1. Editor opens Presentation Tool in Studio.
2. Studio loads the Next.js app in an iframe with draft mode enabled (`/api/draft-mode/enable`).
3. Stega-encoded strings in the Sanity response carry edit-intent metadata.
4. Click-to-edit works via `data-sanity` attributes (set with `dataAttr()`) on wrapper `<div>`s.
5. Live updates flow through `<SanityLive>` → `sanityFetch` → `useOptimistic` → re-render.

## Schema Type Hierarchy

```
Document types (own _id, searchable, list in sidebar)
  └── page          (pageBuilder[] → block objects)
  └── template      (reusable content template)
  └── tag           (taxonomy)
  └── settings      (singleton — siteSettings)

Object types (embedded, no own _id)
  └── hero
  └── columnSection
  └── backgroundColumnSection
  └── stackedCard
  └── caseStudies
  └── templateListing
  └── simpleTextBlock
  └── CTA, ImageText, TemplateDetailHero, TemplateDetailContent  (via importSchemaTypes)
  └── blockContent        (Portable Text)
  └── blockContentTextOnly
  └── button
  └── link
```

## Key File Relationships

| Schema file | Registered in | Frontend component |
|---|---|---|
| `objects/Hero/index.ts` | `importSchemaType.ts` | `blocks/Hero/index.tsx` |
| `objects/ColumnSection/index.ts` | `schemaTypes/index.ts` | `blocks/ColumnSection/index.tsx` |
| `objects/BackgroundColumnSection/index.ts` | `schemaTypes/index.ts` | `blocks/BackgroundColumnSection/` |
| `objects/stackedCard.ts` | `schemaTypes/index.ts` | `blocks/StackedCard/` |
| `objects/caseStudies.ts` | `schemaTypes/index.ts` | `blocks/CaseStudies/` |
| `objects/CTA/` | `importSchemaType.ts` | (add to BlockRenderer) |
| `singletons/settings.tsx` | `schemaTypes/index.ts` | via `settingsQuery` |
