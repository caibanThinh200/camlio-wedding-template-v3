import imageUrlBuilder from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { client } from './client'

// ─── Image URL builder ────────────────────────────────────────────────────────

const builder = imageUrlBuilder(client)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source)
}

// ─── Class name helper ────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Data attribute helper (Presentation Tool click-to-edit) ─────────────────

export function dataAttr(value: string | undefined) {
  return value ? { 'data-sanity': value } : {}
}
