import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export const socialProof = defineType({
  name: 'socialProof',
  title: 'Social Proof',
  type: 'object',
  icon: StarIcon,
  preview: {
    select: { title: 'eyebrow' },
    prepare({ title }) {
      return { title: `Social Proof: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'eyebrow', title: 'Eyebrow / Heading', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text' }),
    defineField({
      name: 'stats',
      title: 'Stats',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'value', type: 'string', title: 'Value (e.g. 250+)' },
            { name: 'label', type: 'string', title: 'Label (e.g. Events Styled)' },
            {
              name: 'image',
              type: 'image',
              title: 'Circle Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            },
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
    }),
  ],
})
