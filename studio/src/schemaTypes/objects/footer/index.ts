import { defineField, defineType } from 'sanity'
import { LeaveIcon } from '@sanity/icons'

export const footer = defineType({
  name: 'footer',
  title: 'Footer',
  type: 'object',
  icon: LeaveIcon,
  preview: {
    select: { title: 'headline' },
    prepare({ title }) {
      return { title: `Footer: ${title || 'Untitled'}` }
    },
  },
  fields: [
    defineField({ name: 'headline', title: 'Headline', type: 'string' }),
    defineField({ name: 'italicPart', title: 'Italic Part of Headline', type: 'string' }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string' }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Circle Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'addressLines',
      title: 'Address Lines',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({
      name: 'social',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', type: 'string', title: 'Platform' },
            { name: 'href', type: 'url', title: 'URL' },
          ],
          preview: { select: { title: 'platform' } },
        },
      ],
    }),
    defineField({ name: 'copyright', title: 'Copyright Text', type: 'string' }),
  ],
})
