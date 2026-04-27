# Environment Variables Reference

## Frontend (`/frontend/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | ✅ | — | Your Sanity project ID (found in sanity.io/manage) |
| `NEXT_PUBLIC_SANITY_DATASET` | ✅ | — | Dataset name, e.g. `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | optional | `2025-09-25` | Sanity API version date |
| `NEXT_PUBLIC_SANITY_STUDIO_URL` | optional | `http://localhost:3333` | URL where Studio is hosted (for stega + Presentation Tool) |
| `NEXT_PUBLIC_APP_URL` | optional | `https://www.camlio.me` | Canonical app URL used as `metadataBase` in Next.js Metadata |
| `SANITY_API_READ_TOKEN` | private datasets | — | Sanity token with `viewer` role |
| `SANITY_API_WRITE_TOKEN` | mutations | — | Sanity token with `editor` or `deploy-studios` role |
| `SANITY_REVALIDATE_SECRET` | optional | — | Shared secret for webhook-triggered ISR revalidation |

## Studio (`/studio/.env`)  or (`/studio/.env.local`)

| Variable | Required | Default | Description |
|---|---|---|---|
| `SANITY_STUDIO_PROJECT_ID` | ✅ | — | Same project ID as frontend |
| `SANITY_STUDIO_DATASET` | ✅ | — | Same dataset as frontend |
| `SANITY_STUDIO_PREVIEW_URL` | optional | `http://localhost:3000` | Where Next.js app runs; used by Presentation Tool |

## Example `.env.local` (frontend)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=abc123xyz
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-09-25
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-project.sanity.studio
NEXT_PUBLIC_APP_URL=https://yoursite.com
SANITY_API_READ_TOKEN=sk...
```

## Example `.env` (studio)

```env
SANITY_STUDIO_PROJECT_ID=abc123xyz
SANITY_STUDIO_DATASET=production
SANITY_STUDIO_PREVIEW_URL=https://yoursite.com
```

## Vercel Deployment

Set all `NEXT_PUBLIC_*` and secret variables in your Vercel project's **Environment Variables** settings.  
The `SANITY_API_READ_TOKEN` and `SANITY_API_WRITE_TOKEN` should be marked as **Sensitive** (encrypted).

## GitHub Actions / CI

The existing `frontend-pr.yml` workflow reads these secrets from the repository:

- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION`
- `NEXT_PUBLIC_SANITY_STUDIO_URL`
- `NEXT_PUBLIC_APP_URL`
- `SANITY_API_READ_TOKEN`
- `SANITY_API_WRITE_TOKEN`
