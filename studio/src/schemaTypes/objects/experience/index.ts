import { defineField, defineType } from 'sanity'
import { PlayIcon } from '@sanity/icons'

export const experience = defineType({
  name: 'experience',
  title: 'Experience',
  type: 'object',
  icon: PlayIcon,
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return { title: `Experience: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'heading', title: 'Heading', type: 'string' }),
    defineField({ name: 'italicPhrase', title: 'Italic Phrase in Heading', type: 'string' }),
    defineField({ name: 'body', title: 'Body Text', type: 'text' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
    defineField({
      name: 'videoThumbnail',
      title: 'Video Thumbnail',
      type: 'image',
      options: { hotspot: true },
      fields: [{ name: 'alt', type: 'string', title: 'Alt Text' }],
    }),
    defineField({
      name: 'videoUrl',
      title: 'Video URL',
      type: 'string',
      description: 'External URL (https://…) or internal path (/mp4/wedding.mp4)',
    }),
  ],
})
