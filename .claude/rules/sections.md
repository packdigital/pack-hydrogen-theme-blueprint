---
paths:
  - "app/sections/**"
---

# Section Conventions

- Every section must be registered in `app/sections/index.tsx` via `registerSection()` from `@pack/react`
- Each section has a co-located schema file (`{SectionName}.schema.ts`) that exports a `Schema` function returning the schema object. The component attaches it: `Component.Schema = Schema`
- Sections receive CMS data via the `cms` prop — never hardcode page content
- Co-locate sub-components in the section's directory (e.g., `app/sections/Hero/HeroSlide.tsx`)
- Sections are rendered via `<RenderSections />` from `@pack/react` — they are never imported directly in routes
- Use the `<Section>` wrapper component for consistent container/spacing behavior
- Check existing sections before creating new ones — many content needs are covered by existing types

## Registered Sections

**Text:** rich-text, text-block, markdown, accordions, icon-row, marquee
**Hero:** hero, half-hero, banner
**Featured Media:** image-tiles, image-tiles-grid, image-tiles-mosaic, tabbed-tiles-slider, tiles-slider, tiles-stack, social-media-grid
**Media:** image, video, video-embed
**Product:** product, products-slider, product-recommendations-slider, shoppable-social-video, shoppable-products-grid, build-your-own-bundle
**Reviews:** press-slider, testimonial-slider, product-reviews
**Form:** form-builder, marketing-signup
**HTML:** html
**Blog:** blog-categories, blog-grid
**Metaobject:** metaobject-text-block, metaobject-image

## Creating a New Section

1. Create directory: `app/sections/{SectionName}/`
2. Create component: `{SectionName}.tsx` — export default functional component accepting `{cms}` prop
3. Create schema: `app/sections/{SectionName}/{SectionName}.schema.ts` — export a `Schema` function returning `{ category, label, key, previewSrc, fields }`
4. Register in `app/sections/index.tsx`: import and call `registerSection()`
5. Run `npm run typecheck` to verify types
