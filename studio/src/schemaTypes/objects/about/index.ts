import { defineField, defineType } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'object',
  icon: UserIcon,
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `About: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'italicPhrase', title: 'Italic Phrase in Heading', type: 'string' }),
    defineField({
      name: 'body',
      title: 'Body Paragraphs',
      type: 'array',
      of: [{ type: 'text' }],
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
  ],
})
