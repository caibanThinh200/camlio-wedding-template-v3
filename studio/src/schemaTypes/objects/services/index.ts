import { defineField, defineType } from 'sanity'
import { SparklesIcon } from '@sanity/icons'

export const services = defineType({
  name: 'services',
  title: 'Services',
  type: 'object',
  icon: SparklesIcon,
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Services: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'italicPhrase', title: 'Italic Phrase in Heading', type: 'string' }),
    defineField({ name: 'subheading', title: 'Subheading', type: 'text' }),
    defineField({
      name: 'items',
      title: 'Service Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'year', type: 'string', title: 'Year' },
            { name: 'title', type: 'string', title: 'Service Title' },
            {
              name: 'image',
              type: 'image',
              title: 'Thumbnail',
              options: { hotspot: true },
              fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
            },
            { name: 'href', type: 'string', title: 'Link' },
            { name: 'highlighted', type: 'boolean', title: 'Highlighted Row', initialValue: false },
          ],
          preview: { select: { title: 'title', subtitle: 'year' } },
        },
      ],
    }),
  ],
})
