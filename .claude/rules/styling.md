---
paths:
  - "app/styles/**"
  - "tailwind.config.js"
  - "postcss.config.cjs"
---

# Styling Conventions

## Tailwind CSS

- All styling uses Tailwind utility classes — avoid inline styles and custom CSS where possible
- Custom design tokens are CSS custom properties in `app/styles/app.css`, referenced in `tailwind.config.js`
- Semantic component classes are defined in the `@layer components` block of `app.css`
- Plugin: `@headlessui/tailwindcss` for accessible component state styling

## Breakpoints

| Token | Size |
|---|---|
| `xs` | 480px (30rem) |
| `sm` | 640px (40rem) |
| `md` | 768px (48rem) |
| `lg` | 1024px (64rem) |
| `xl` | 1280px (80rem) |
| `2xl` | 1536px (96rem) |

## Color System

CSS custom properties (defined in `app/styles/app.css`):

| Token | Default |
|---|---|
| `--primary` | #008464 |
| `--secondary` | #8164bf |
| `--accent1` | #189cc5 |
| `--accent2` | #4a69d4 |
| `--black` | #000000 |
| `--white` | #ffffff |
| `--text` | #000000 |
| `--background` | #ffffff |
| `--border` | #e8e8e8 |
| `--overlay` | rgba(0, 0, 0, 0.3) |
| Neutral scale | `--neutral-darkest` through `--neutral-lightest` |

Button color variables: `--primary-btn-*`, `--secondary-btn-*`, `--inverse-light-btn-*`, `--inverse-dark-btn-*` (each with `bg-color`, `border-color`, `text-color` + hover variants)

## Fonts

| Font | Role | Source |
|---|---|---|
| Poppins | `sans` (body) + `heading` | System/CDN |

Font faces can be declared in `app/styles/fonts.css` (currently empty — Poppins loaded via default).

## Layout Constants

| Token | Value |
|---|---|
| `--header-height-mobile` | 4.5rem |
| `--header-height-desktop` | 4.5rem |
| `--promobar-height-mobile` | 3rem |
| `--promobar-height-desktop` | 3rem |
| `--drawer-width` | 23.5rem |
| `--content-max-width` | 96rem |
| `--product-image-aspect-ratio` | 3 / 4 |

## Font Sizes

2xs (10px), xs (12px), sm (14px), base (16px), lg (18px), xl (20px), 2xl (24px), 3xl (30px), 4xl (36px), 5xl (48px), 6xl (60px), 7xl (72px), 8xl (96px), 9xl (128px)

## Component Classes

**Typography:** `.text-h1` through `.text-h6`, `.text-body`, `.text-body-sm`, `.text-body-lg`, `.text-link`, `.text-caption`, `.text-label`, `.text-nav`, `.text-superheading`
**Buttons:** `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-inverse-light`, `.btn-inverse-dark`, `.btn-select`
**Inputs:** `.input-text`, `.input-label`
**Layout:** `.px-contained`, `.py-contained`, `.pt-contained`, `.pb-contained`, `.media-fill`, `.absolute-center`, `.scrollbar-hide`, `.overflow-anywhere`

## Animations

- `spin-fast` (0.75s), `bounce-high` (0.75s), `flash` (1.5s), `shimmer` (horizontal translate)

## Conventions

- Use `px-contained` / `py-contained` utility classes for consistent page padding
- Button styles use CSS custom properties for theming — modify `--*-btn-*` vars, not Tailwind classes
- Swiper carousel styles have custom overrides in `app.css` — check before modifying slider CSS
- `assetsInlineLimit: 0` in Vite config — no base64 inlining (CSP compliance)
