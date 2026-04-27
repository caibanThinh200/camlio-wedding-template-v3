# Scripts

## create-block.js (repo root)

The root-level `create-block.js` script scaffolds a new block in one command:

```bash
# Run from repo root — name must be PascalCase
node create-block.js MySection
# or via the workspace shortcut:
npm run create-block MySection
```

### What it does

1. Creates `studio/src/schemaTypes/objects/MySection/index.ts` — Sanity schema stub.
2. Creates `frontend/app/components/blocks/MySection/index.tsx` — React component stub.
3. Appends the import + map entry to `frontend/app/schemaBlockTypes.ts` (if it exists).
4. Appends the import + array entry to `studio/src/schemaTypes/importSchemaType.ts`.
5. Appends `{ type: 'MySection' }` to `studio/src/schemaTypes/objects/importPageBuilderTypes.ts`.

### After running the script

```bash
# 1. Regenerate TypeScript types from the updated schema
npm run predev

# 2. Open the generated files and fill in real fields + JSX
#    studio/src/schemaTypes/objects/MySection/index.ts
#    frontend/app/components/blocks/MySection/index.tsx

# 3. Wire up the component in BlockRenderer.tsx (the script does NOT do this)
#    import MySectionBlock from '@/app/components/blocks/MySection'
#    const Blocks = { …, mySection: MySectionBlock }
```

### Validation rules for block name

- Must be **PascalCase** (e.g., `HeroSection`, `ContactForm`, `PricingTable`).
- No hyphens, spaces, or leading lowercase letters.
- The script will reject invalid names with a clear error message.
