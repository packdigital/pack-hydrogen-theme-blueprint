import type {ReactNode} from 'react';
import type {EmblaOptionsType, EmblaCarouselType} from 'embla-carousel';

export interface SlidesPerView {
  /** slides visible at the base (mobile) breakpoint; fractional allowed (e.g. 2.4) */
  base: number;
  /** >= 768px */
  md?: number;
  /** >= 1024px */
  lg?: number;
}

export interface ResponsiveGap {
  /** gap in px at the base (mobile) breakpoint */
  base: number;
  /** >= 768px (defaults to base) */
  md?: number;
  /** >= 1024px (defaults to md) */
  lg?: number;
}

export interface CarouselProps {
  /** One node per slide. Each is wrapped in an Embla slide element. */
  slides: ReactNode[];
  /**
   * Responsive slides-per-view. Embla sizes slides via CSS, so these values
   * are applied as CSS custom properties consumed by the slide flex-basis.
   * Omit for a single full-width slide (slidesPerView 1).
   */
  slidesPerView?: SlidesPerView;
  /** Gap between slides in px. Pass a single number for a uniform gap, or a
   *  responsive `{base, md, lg}` object to vary it per breakpoint. */
  gap?: number | ResponsiveGap;
  /** Embla options (loop, align, axis, startIndex, containScroll, ...). */
  options?: EmblaOptionsType;
  /** Enable autoplay; pass a delay in ms or true for the 5s default. */
  autoplay?: boolean | number;
  /** Crossfade between slides instead of sliding. */
  fade?: boolean;
  /** Render prev/next arrow buttons. */
  arrows?: boolean;
  /** Classes on the default arrow buttons (both). Use `!` to override the
   *  default size/border/bg/position. */
  arrowClassName?: string;
  /** Arrow icon/button color (e.g. a CMS color). Inline style — always wins. */
  arrowColor?: string;
  /** Swap the arrow icon while keeping the default button (styling, color,
   *  positioning, disabled state, a11y). Give the icon `text-current` so
   *  `arrowColor` recolors it. Defaults to the arrow-left/right SVGs. */
  arrowIcon?: (direction: 'prev' | 'next') => ReactNode;
  /** Full custom arrow rendering (icon, markup, color) — replaces the default
   *  buttons. Called once per direction; wire up the provided onClick/disabled.
   *  Use this when className tweaks aren't enough (e.g. a CMS-hex arrow color
   *  or a different icon). */
  renderArrow?: (
    direction: 'prev' | 'next',
    props: {disabled: boolean; onClick: () => void},
  ) => ReactNode;
  /** Render pagination dots (overlaid at the bottom-center of the carousel). */
  dots?: boolean;
  /** Active dot color (e.g. a CMS bullet color). Inactive dots use it faded.
   *  Falls back to the theme text color. */
  activeDotColor?: string;
  /** Extra classes on the dots container (e.g. 'md:hidden' to show on mobile only). */
  dotsClassName?: string;
  /** Render a draggable scrollbar (track + thumb reflecting scroll progress).
   *  Sits below the slides by default; reposition via `scrollbarClassName`
   *  (e.g. `!absolute !top-0` to place it above, plus viewport padding to
   *  make room). */
  scrollbar?: boolean;
  /** Scrollbar thumb color (e.g. a CMS color). Defaults to the theme text color. */
  scrollbarColor?: string;
  /** Classes on the scrollbar track. Use Tailwind `!` (e.g. `!h-2 !bg-black/10`)
   *  to override the defaults, since there's no tailwind-merge. */
  scrollbarClassName?: string;
  /** Classes on the scrollbar thumb (same `!`-to-override note applies). */
  scrollbarThumbClassName?: string;
  /** Accessible label for the carousel region (required for a11y). */
  ariaLabel: string;
  /** Called with the Embla API once ready (for syncing, e.g. thumbnails). */
  onApi?: (api: EmblaCarouselType) => void;
  /** Called with the selected slide index whenever it changes. */
  onSelect?: (index: number) => void;
  className?: string;
  viewportClassName?: string;
  slideClassName?: string;
  /** Extra content rendered inside the viewport (e.g. gradient overlays). */
  children?: ReactNode;
}
