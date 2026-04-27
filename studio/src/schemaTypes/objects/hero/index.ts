import { defineField, defineType } from 'sanity'
import { ComposeIcon } from '@sanity/icons'

export const hero = defineType({
  name: 'hero',
  title: 'Hero',
  type: 'object',
  icon: ComposeIcon,
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: `Hero: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'italicWord', title: 'Italic Word/Phrase', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
  ],
})
