# Block Contract — End-to-End Guide for Adding a New Block

A "block" is a self-contained page section managed by editors in Sanity Studio and rendered by a React component in Next.js.

## Naming Convention

| Context | Format | Example |
|---|---|---|
| Sanity schema `name` | camelCase | `heroSection` |
| Sanity schema `title` | Title Case | `Hero Section` |
| TypeScript type (generated) | PascalCase | `HeroSection` |
| React component file/folder | PascalCase | `HeroSection/index.tsx` |
| React component export | PascalCase + `Block` suffix | `HeroSectionBlock` |
| `BlockRenderer` map key | camelCase (= schema name) | `heroSection` |

## Step-by-Step

### Option A — Automated (recommended)

```bash
# From repo root — name must be PascalCase
node create-block.js HeroSection
```

This scaffolds:
- `studio/src/schemaTypes/objects/HeroSection/index.ts`
- `frontend/app/components/blocks/HeroSection/index.tsx`
- Updates `importSchemaType.ts`
- Updates `importPageBuilderTypes.ts`

Then regenerate types and wire up BlockRenderer manually (see steps 4–5 below).

### Option B — Manual

#### Step 1 — Create the Sanity schema object

`studio/src/schemaTypes/objects/MyBlock/index.ts`

```ts
import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const myBlock = defineType({
  name: 'myBlock',
  title: 'My Block',
  type: 'object',
  icon: DocumentIcon,
  preview: {
    select: { title: 'heading', cmsTitle: 'cmsTitle' },
    prepare({ heading, cmsTitle }: any) {
      return { title: cmsTitle || heading || 'My Block' }
    },
  },
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
  ],
})
```

#### Step 2 — Register the schema

**`studio/src/schemaTypes/importSchemaType.ts`**

```ts
import { myBlock } from './objects/MyBlock'
// …
export const importSchemaTypes = [
  // …existing
  myBlock,
]
```

Alternatively add directly to `studio/src/schemaTypes/index.ts` (for core blocks).

#### Step 3 — Add to the page builder field

**`studio/src/schemaTypes/objects/importPageBuilderTypes.ts`**

```ts
export const importPageBuilderTypes = [
  // …existing
  { type: 'myBlock' },
]
```

#### Step 4 — Regenerate TypeScript types

```bash
# From repo root:
npm run predev
# Or from /frontend:
npm run sanity:typegen
```

This updates `sanity.types.ts` with the new `MyBlock` type.

#### Step 5 — Create the React component

`frontend/app/components/blocks/MyBlock/index.tsx`

```tsx
import { MyBlock } from '@/sanity.types'
import { Container } from '@/app/components/Container'

type MyBlockProps = {
  block: MyBlock
  index: number
}

export default function MyBlockBlock({ block }: MyBlockProps) {
  return (
    <section className="py-16 md:py-24">
      <Container as="div">
        <h2 className="heading-2-bold">{block.heading}</h2>
      </Container>
    </section>
  )
}
```

#### Step 6 — Register in BlockRenderer

`frontend/app/components/BlockRenderer.tsx`

```ts
import MyBlockBlock from '@/app/components/blocks/MyBlock'

const Blocks = {
  // …existing
  myBlock: MyBlockBlock,
}
```

#### Step 7 — (Optional) Add Studio thumbnail

Place a PNG at `studio/static/page-builder-thumbnails/myBlock.png`.  
Shown in the Studio "Add block" grid menu.

## Common Field Patterns

```ts
// Simple text
defineField({ name: 'heading', title: 'Heading', type: 'string' })

// Long text
defineField({ name: 'body', title: 'Body', type: 'text', rows: 5 })

// Rich text (Portable Text)
defineField({ name: 'content', title: 'Content', type: 'blockContent' })

// Single image with alt + hotspot
defineField({
  name: 'image',
  title: 'Image',
  type: 'image',
  options: { hotspot: true },
  fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
})

// Array of images
defineField({
  name: 'images',
  title: 'Images',
  type: 'array',
  of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Alt' }] }],
})

// CTA button
defineField({ name: 'button', title: 'Button', type: 'button' })

// Link (internal page or external href)
defineField({ name: 'link', title: 'Link', type: 'link' })

// Array of objects (e.g., stat cards)
defineField({
  name: 'stats',
  title: 'Stats',
  type: 'array',
  of: [{
    type: 'object',
    fields: [
      { name: 'value', type: 'string', title: 'Value' },
      { name: 'label', type: 'string', title: 'Label' },
    ],
    preview: { select: { title: 'value' } },
  }],
})

// Badge text with default
defineField({
  name: 'badgeText',
  title: 'Badge Text',
  type: 'string',
  initialValue: 'What we do',
})
```
