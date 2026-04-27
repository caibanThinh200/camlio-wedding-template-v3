import { defineField, defineType } from 'sanity'
import { ImagesIcon } from '@sanity/icons'

export const process = defineType({
  name: 'process',
  title: 'Process / How We Work',
  type: 'object',
  icon: ImagesIcon,
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Process: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'italicPhrase', title: 'Italic Phrase in Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
    defineField({
      name: 'steps',
      title: 'Process Steps',
      type: 'array',
      validation: (r) => r.max(4),
      of: [
        {
          type: 'object',
          fields: [
            { name: 'number', type: 'string', title: 'Number (e.g. 01.)' },
            { name: 'title', type: 'string', title: 'Step Title' },
            {
              name: 'image',
              type: 'image',
              title: 'Step Image',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            },
          ],
          preview: { select: { title: 'title', subtitle: 'number' } },
        },
      ],
    }),
  ],
})
