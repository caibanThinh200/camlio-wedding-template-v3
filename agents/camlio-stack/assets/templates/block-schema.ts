import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

/**
 * BLOCK SCHEMA TEMPLATE
 * ─────────────────────
 * 1. Rename every occurrence of "MyBlock" / "myBlock" to your block name.
 * 2. Add/remove fields as needed (see references/block-contract.md for field patterns).
 * 3. Register in importSchemaType.ts and importPageBuilderTypes.ts.
 * 4. Run `npm run predev` from repo root to regenerate sanity.types.ts.
 */

export const myBlock = defineType({
  name: 'myBlock',           // camelCase — must match BlockRenderer map key
  title: 'My Block',         // Human-readable label shown in Studio
  type: 'object',
  icon: DocumentIcon,        // Replace with a fitting icon from @sanity/icons
  preview: {
    select: {
      title: 'heading',
      cmsTitle: 'cmsTitle',
    },
    prepare({ heading, cmsTitle }: any) {
      return {
        title: cmsTitle || heading || 'My Block',
      }
    },
  },
  fields: [
    // Optional: internal CMS-only label for the block instance
    defineField({
      name: 'cmsTitle',
      title: 'CMS Title (internal)',
      type: 'string',
      description: 'Label only visible in Studio to identify this block.',
    }),

    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),

    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'text',
      rows: 4,
    }),

    // Example: single image
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alt Text' },
      ],
    }),

    // Example: CTA button
    defineField({
      name: 'button',
      title: 'Button',
      type: 'button',
    }),
  ],
})
