# GROQ Patterns — Cheat Sheet

GROQ (Graph-Relational Object Queries) is Sanity's query language. All queries in this project use `defineQuery` from `next-sanity` for type inference.

## Basic Structure

```groq
*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  name,
  "slug": slug.current,
  ...
}
```

- `*[filter]` — filter all documents
- `[0]` — take first result (single document)
- `{ … }` — projection (select/rename fields)
- `...` — spread all remaining fields

## Projections & Renaming

```groq
{
  _id,
  _type,
  "slug": slug.current,          // rename: slug object → string
  "author": author->{ name },    // dereference + project
  "date": coalesce(date, _updatedAt),  // fallback value
}
```

## Dereferencing References

```groq
// Single reference
"author": author->{ firstName, lastName, picture }

// Array of references
"tags": tags[]->{ _id, tagName }

// Nested dereference
"category": category->{ title, "parentTitle": parent->title }
```

## Conditional Projections (per block type in pageBuilder)

```groq
"pageBuilder": pageBuilder[]{
  ...,
  _type == "callToAction" => {
    ...,
    button {
      ...,
      link {
        ...,
        _type == "link" => {
          "page": page->slug.current,
          "post": post->slug.current
        }
      }
    }
  },
  _type == "infoSection" => {
    content[]{
      ...,
      markDefs[]{
        ...,
        _type == "link" => {
          "page": page->slug.current
        }
      }
    }
  }
}
```

## Image Fields

```groq
// Basic image
image { ..., asset->{ _id, url } }

// With dimensions
thumbnail {
  ...,
  asset->{
    _id,
    url,
    metadata {
      dimensions { width, height }
    }
  }
}

// Reusable fragment (used in queries.ts)
// imageFields const in queries.ts:
// _type, crop{ … }, hotspot{ … }, asset->{ ... }
```

## SEO Fields

```groq
// Full SEO projection (seofields fragment in queries.ts)
seo{
  _type,
  metaTitle,
  metaDescription,
  seoKeywords,
  "nofollowAttributes": coalesce(nofollowAttributes, null),
  openGraph{ _type, siteName, url, description, title, image{ … } },
  twitter{ _type, site, creator, cardType, handle },
  additionalMetaTags[]{ _type, metaAttributes[]{ … } }
}
```

## Ordering & Pagination

```groq
// Order by date descending
*[_type == "template"] | order(_createdAt desc)

// Paginate (slice)
*[_type == "template"] | order(_createdAt desc) [0...10]

// Dynamic limit via parameter
*[_type == "template"] | order(_createdAt desc) [0...$limit]
```

## Filtering with Parameters

```groq
// By slug
*[_type == "page" && slug.current == $slug][0]

// Conditional search
*[
  _type == "template" &&
  defined(slug.current) &&
  ($search == null || title match $search + "*" || description match $search + "*")
]
```

## Sitemap Query Pattern

```groq
*[(_type == "page" || _type == "template") && defined(slug.current)]
| order(_type asc) {
  "slug": slug.current,
  _type,
  _updatedAt,
}
```

## Using defineQuery (TypeScript)

Always wrap queries in `defineQuery` for automatic TypeScript type inference with `next-sanity`:

```ts
import {defineQuery} from 'next-sanity'

export const myQuery = defineQuery(`
  *[_type == "page" && slug.current == $slug][0]{
    _id,
    name,
    "slug": slug.current,
    "pageBuilder": pageBuilder[]{ ... },
  }
`)
```

Then use with `sanityFetch`:

```ts
const {data} = await sanityFetch({
  query: myQuery,
  params: { slug },
  tags: [`page:${slug}`],
})
```

## Live Content / Tags

Use `tags` in `sanityFetch` for on-demand revalidation:

```ts
// Tag individual documents
tags: [`page:${slug}`, 'pages']
tags: [`template:${slug}`, 'templates']

// Broad tag for list queries
tags: ['templates']
```

Revalidate in a route handler: `revalidateTag('templates')`
