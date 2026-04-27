import { defineField, defineType } from 'sanity'
import { DocumentIcon } from '@sanity/icons'

export const page = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Page Name',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'name' },
      validation: (r) => r.required(),
    }),
    // seo field — add sanity-plugin-seo in Phase 2
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        // core blocks
        { type: 'hero' },
        { type: 'about' },
        { type: 'socialProof' },
        { type: 'services' },
        { type: 'experience' },
        { type: 'process' },
        // blocks added via create-block scaffold
        ...[] // importPageBuilderTypes merged at schema index level
      ],
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'slug.current' },
    prepare({ title, subtitle }) {
      return { title, subtitle: `/${subtitle}` }
    },
  },
})
