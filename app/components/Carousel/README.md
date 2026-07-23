# Carousel

A headless carousel built on [Embla](https://www.embla-carousel.com/). It replaced Swiper across the theme and is the single component every slider should use.

Why Embla: ~7KB vs Swiper's ~47KB, no render-blocking CSS, SSR-friendly, and no layout-shift on hydration. The trade-off is that Embla is headless, so navigation UI and accessibility live in this wrapper.

```tsx
import {Carousel} from '~/components/Carousel';

<Carousel
  ariaLabel="Featured products"
  slidesPerView={{base: 1.4, md: 3, lg: 4}}
  gap={20}
  arrows
  slides={products.map((product) => (
    <ProductItem key={product.id} product={product} />
  ))}
/>;
```

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `slides` | `ReactNode[]` | — | One node per slide; each is wrapped in an Embla slide element. Keep `key`s on the mapped nodes. |
| `ariaLabel` | `string` | — | **Required.** Accessible name for the carousel region (e.g. the section heading). |
| `slidesPerView` | `{base; md?; lg?}` | `{base: 1}` | Slides visible per breakpoint. Fractional allowed (e.g. `2.4`). `md` defaults to `base`, `lg` to `md`. |
| `gap` | `number \| {base, md?, lg?}` | `0` | Spacing between slides, in px. Pass a number for a uniform gap, or a responsive object to vary it per breakpoint. |
| `options` | `EmblaOptionsType` | `{loop: false}` | Raw Embla options — `loop`, `align` (`'start' \| 'center' \| 'end'`), `axis` (`'x' \| 'y'`), `startIndex`, `containScroll`, `dragFree`, `breakpoints`, … |
| `autoplay` | `boolean \| number` | — | `true` = 5000ms; a number sets the delay in ms. |
| `fade` | `boolean` | — | Crossfade instead of sliding (forces one slide per view). |
| `arrows` | `boolean` | — | Prev/next buttons (only render when there's more than one snap). |
| `arrowClassName` | `string` | — | Classes on both default arrow buttons (size/border/bg/position; `!` to override). |
| `arrowColor` | `string` | theme | Arrow icon/button color from a CMS hex (inline style — always wins). |
| `arrowIcon` | `(dir: 'prev' \| 'next') => ReactNode` | arrow SVGs | Swap the icon while keeping the default button. Give the icon `text-current` so `arrowColor` recolors it. |
| `renderArrow` | `(dir, {disabled, onClick}) => ReactNode` | — | Full custom arrows — replaces the default buttons entirely. |
| `dots` | `boolean` | — | Pagination dots, overlaid bottom-center. |
| `activeDotColor` | `string` | theme text | Active dot color (e.g. a CMS bullet color); inactive dots use it faded. |
| `dotsClassName` | `string` | — | Extra classes on the dots container (e.g. `'md:hidden'` for mobile-only). |
| `scrollbar` | `boolean` | — | Draggable scrollbar (track + thumb). Below the slides by default; reposition via `scrollbarClassName`. |
| `scrollbarColor` | `string` | theme text | Scrollbar thumb color (inline style — always wins). |
| `scrollbarClassName` | `string` | — | Classes on the scrollbar track. |
| `scrollbarThumbClassName` | `string` | — | Classes on the scrollbar thumb. |
| `onApi` | `(api: EmblaCarouselType) => void` | — | Receives the Embla API once ready — use for advanced control / syncing. |
| `onSelect` | `(index: number) => void` | — | Fires with the selected slide index on change. |
| `className` | `string` | — | On the outer wrapper (which is `position: relative`). |
| `viewportClassName` | `string` | — | On the Embla viewport (the `overflow-hidden` element). |
| `slideClassName` | `string` | — | On every slide element. |
| `children` | `ReactNode` | — | Rendered inside the viewport (e.g. gradient overlays, a draft badge). |

## Recipes

### Responsive, fractional slides + spacing
Embla sizes slides via CSS, so `slidesPerView` is applied as CSS variables — no JS resize handling. Spacing is handled as slide padding + a negative container margin (not flex `gap`), so `N` slides + spacing sum to exactly 100% and the last slide is never clipped.

```tsx
<Carousel ariaLabel="Tiles" slidesPerView={{base: 1.4, md: 2, lg: 3}} gap={16} slides={...} />
```

### Loop, centered, vertical
```tsx
<Carousel ariaLabel="..." options={{loop: true, align: 'center'}} slides={...} />
<Carousel ariaLabel="..." options={{axis: 'y'}} className="h-[500px]" slides={...} /> // vertical
```

### Arrows and dots
```tsx
<Carousel ariaLabel="..." arrows dots slides={...} />
<Carousel ariaLabel="..." dots activeDotColor="#fff" dotsClassName="md:hidden" slides={...} /> // mobile-only white dots
```

Customizing arrows (increasing power, pick the lowest that fits):
```tsx
// 1. restyle + recolor the default button
<Carousel ariaLabel="..." arrows arrowColor="#111" arrowClassName="!size-6 !border-0 !bg-transparent" slides={...} />

// 2. swap the icon, keep the default button/behavior (e.g. chevrons)
<Carousel
  ariaLabel="..."
  arrows
  arrowIcon={(dir) => (
    <Svg
      className="w-3 text-current"
      src={`/svgs/chevron-${dir === 'prev' ? 'left' : 'right'}.svg#chevron-${dir === 'prev' ? 'left' : 'right'}`}
      title={dir === 'prev' ? 'Previous' : 'Next'}
      viewBox="0 0 24 24"
    />
  )}
  slides={...}
/>

// 3. full control — render your own buttons
<Carousel ariaLabel="..." arrows renderArrow={(dir, {disabled, onClick}) => (
  <button disabled={disabled} onClick={onClick} className="...">{dir === 'prev' ? '‹' : '›'}</button>
)} slides={...} />
```
See `app/components/Header/Promobar.tsx` for the chevron example.

### Autoplay + crossfade (e.g. a hero)
```tsx
<Carousel ariaLabel="Hero" autoplay={5000} fade dots slides={...} />
```
See `app/sections/Hero/HeroSlider.tsx`.

### Scrollbar
```tsx
<Carousel ariaLabel="..." scrollbar scrollbarColor="#fff" slides={...} />
// above the slides, taller track — position with classes + viewport padding:
<Carousel
  ariaLabel="..."
  scrollbar
  scrollbarClassName="!absolute !inset-x-0 !top-0 !mt-0 !h-1.5"
  viewportClassName="pt-6"
  scrollbarColor="#fff"
  slides={...}
/>
```
See `app/sections/ShoppableSocialVideo/ShoppableSocialVideo.tsx`.

### Synced thumbnails / external control
Grab the Embla API with `onApi`, track position with `onSelect`, and drive it with `api.scrollTo(index)`.

```tsx
const [api, setApi] = useState<EmblaCarouselType | null>(null);
const [active, setActive] = useState(0);

<Carousel ariaLabel="Gallery" onApi={setApi} onSelect={setActive} slides={...} />;
// elsewhere: <button onClick={() => api?.scrollTo(2)}>Go to 3</button>
```
See `app/components/Product/ProductMedia/ProductMedia.tsx` (gallery synced to a thumbnail strip) and `app/sections/PressSlider/PressSlider.tsx`.

## Styling / overriding

The className props (`className`, `viewportClassName`, `slideClassName`, `dotsClassName`, `scrollbarClassName`, `scrollbarThumbClassName`) are **appended** to the component's defaults. Adding non-conflicting utilities works normally. To **override** a default (height, background, margin, etc.) use Tailwind's `!` important prefix, because the project has no `tailwind-merge`:

```tsx
<Carousel
  ariaLabel="..."
  scrollbar
  scrollbarClassName="!h-2 !bg-white/20 mt-6"   // taller, translucent track, more top margin
  scrollbarThumbClassName="!rounded-none"        // square thumb
  slides={...}
/>
```

Colors that come from the CMS (dynamic hex) should use the dedicated `activeDotColor` / `scrollbarColor` props (inline styles that always win) rather than className.

## Accessibility

Built in: the viewport is a labelled `region` (`aria-roledescription="carousel"`), each slide is a labelled `group` ("N of total"), and arrows/dots are real `<button>`s (keyboard-operable, `aria-label`led, arrows `disabled` at the ends, active dot `aria-current`). Always pass a meaningful `ariaLabel`.

Known gaps (not yet handled here — mind them when using):
- **Off-screen slides remain in the tab order.** Interactive content in non-visible slides is still Tab-focusable / read by screen readers.
- **Autoplay has no pause control and ignores `prefers-reduced-motion`** — a WCAG 2.2.2 concern for auto-advancing carousels. Prefer not to autoplay content with interactive elements.
- **The scrollbar is pointer-only** (not keyboard-accessible). Don't make it the *only* navigation control — pair it with `arrows` or `dots`.

## Gotchas

- `slidesPerView` and `gap` are CSS-driven — don't add your own `flex`/`basis`/`shrink` classes to slides; the component sets `flex: 0 0 <basis>` and spacing for you.
- Slides render immediately (SSR) — there's no "initializing" flash, so no skeleton gating is needed (unlike the old Swiper setup).
- `fade` forces one slide per view regardless of `slidesPerView`.
