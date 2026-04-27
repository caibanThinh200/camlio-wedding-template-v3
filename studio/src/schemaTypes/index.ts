// Master schema registry
import { page } from './documents/page'
import { template } from './documents/template'
import { tag } from './documents/tag'
import { settings } from './singletons/settings'
import { hero } from './objects/hero'
import { about } from './objects/about'
import { socialProof } from './objects/socialProof'
import { services } from './objects/services'
import { experience } from './objects/experience'
import { process } from './objects/process'
import { importSchemaTypes } from './importSchemaType'

export const schemaTypes = [
  // Documents
  page,
  template,
  tag,
  // Singletons
  settings,
  // Core block objects
  hero,
  about,
  socialProof,
  services,
  experience,
  process,
  // Dynamically scaffolded blocks
  ...importSchemaTypes,
]
