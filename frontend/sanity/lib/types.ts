import type { Page } from '@/sanity.types'

// Union of all pageBuilder block types from the generated Page type
export type PageBuilderSection = NonNullable<Page['pageBuilder']>[number]

// Extract a specific block type from the pageBuilder union by _type discriminant
export type ExtractPageBuilderType<T extends PageBuilderSection['_type']> = Extract<
  PageBuilderSection,
  { _type: T }
>

// Sanity image projection result — returned by image${imageProjection} in queries
export type SanityImageProjection = {
  url: string | null
  alt?: string | null
} | null

// Resolved nav link from settings
export type NavLink = {
  label?: string | null
  href?: string | null
  _key: string
}

// Resolved social link
export type SocialLink = {
  platform?: string | null
  href?: string | null
  _key?: string
}
