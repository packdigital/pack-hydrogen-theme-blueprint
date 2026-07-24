import {useCallback, useEffect, useRef, useState} from 'react';
import type {CSSProperties, PointerEvent as ReactPointerEvent} from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Fade from 'embla-carousel-fade';
import type {EmblaCarouselType, EmblaPluginType} from 'embla-carousel';
import clsx from 'clsx';

import {Svg} from '~/components/Svg';

import type {CarouselProps} from './Carousel.types';

const DEFAULT_AUTOPLAY_DELAY = 5000;

/**
 * Headless carousel built on Embla. Replaces Swiper across the theme.
 * - responsive slides-per-view via CSS custom properties (Embla sizes slides
 *   from CSS, not JS)
 * - optional autoplay / crossfade plugins
 * - optional prev/next arrows and pagination dots built from the Embla API
 * - accessible: labelled region, slide groups, labelled controls
 * The Embla API is exposed via `onApi` for advanced cases (e.g. synced
 * thumbnails).
 */
export function Carousel({
  slides,
  slidesPerView,
  gap = 0,
  options,
  autoplay,
  fade,
  arrows,
  arrowClassName,
  arrowColor,
  arrowIcon,
  renderArrow,
  dots,
  activeDotColor,
  dotsClassName,
  scrollbar,
  scrollbarColor,
  scrollbarClassName,
  scrollbarThumbClassName,
  ariaLabel,
  onApi,
  onSelect,
  className,
  viewportClassName,
  slideClassName,
  children,
}: CarouselProps) {
  const isVertical = options?.axis === 'y';

  const plugins: EmblaPluginType[] = [];
  if (autoplay) {
    plugins.push(
      Autoplay({
        delay: typeof autoplay === 'number' ? autoplay : DEFAULT_AUTOPLAY_DELAY,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
        stopOnFocusIn: true,
      }),
    );
  }
  if (fade) plugins.push(Fade());

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {loop: false, ...options},
    plugins,
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [snapCount, setSnapCount] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  // Scrollbar: thumb position (0-1 progress) and width (% of track = fraction
  // of slides currently in view).
  const [scrollProgress, setScrollProgress] = useState(0);
  const [thumbSize, setThumbSize] = useState(100);
  const scrollbarTrackRef = useRef<HTMLDivElement>(null);

  const onEmblaSelect = useCallback(
    (api: EmblaCarouselType) => {
      const index = api.selectedScrollSnap();
      setSelectedIndex(index);
      setCanPrev(api.canScrollPrev());
      setCanNext(api.canScrollNext());
      onSelect?.(index);
    },
    [onSelect],
  );

  const onEmblaScroll = useCallback((api: EmblaCarouselType) => {
    setScrollProgress(Math.max(0, Math.min(1, api.scrollProgress())));
  }, []);

  const updateThumbSize = useCallback((api: EmblaCarouselType) => {
    const inView = api.slidesInView().length || 1;
    const total = api.slideNodes().length || 1;
    setThumbSize(Math.min(100, (inView / total) * 100));
  }, []);

  // Named so it can be detached in cleanup — an inline handler would leak on
  // every effect re-run.
  const onEmblaReInit = useCallback(
    (api: EmblaCarouselType) => {
      setSnapCount(api.scrollSnapList().length);
      onEmblaSelect(api);
      onEmblaScroll(api);
      updateThumbSize(api);
    },
    [onEmblaSelect, onEmblaScroll, updateThumbSize],
  );

  useEffect(() => {
    if (!emblaApi) return;
    onApi?.(emblaApi);
    setSnapCount(emblaApi.scrollSnapList().length);
    onEmblaSelect(emblaApi);
    onEmblaScroll(emblaApi);
    updateThumbSize(emblaApi);
    emblaApi.on('select', onEmblaSelect);
    emblaApi.on('scroll', onEmblaScroll);
    emblaApi.on('reInit', onEmblaReInit);
    return () => {
      emblaApi.off('select', onEmblaSelect);
      emblaApi.off('scroll', onEmblaScroll);
      emblaApi.off('reInit', onEmblaReInit);
    };
  }, [
    emblaApi,
    onApi,
    onEmblaSelect,
    onEmblaScroll,
    onEmblaReInit,
    updateThumbSize,
  ]);

  // Drag / click the scrollbar track to scrub to the nearest snap.
  const scrubToPointer = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!emblaApi || !scrollbarTrackRef.current) return;
      const rect = scrollbarTrackRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (event.clientX - rect.left) / rect.width),
      );
      const snaps = emblaApi.scrollSnapList().length;
      if (snaps > 1) emblaApi.scrollTo(Math.round(ratio * (snaps - 1)));
    },
    [emblaApi],
  );

  const base = fade ? 1 : (slidesPerView?.base ?? 1);
  const md = fade ? 1 : (slidesPerView?.md ?? base);
  const lg = fade ? 1 : (slidesPerView?.lg ?? md);

  // Gap may be a single px value or a responsive {base, md, lg} object.
  const gapBase = typeof gap === 'number' ? gap : gap.base;
  const gapMd = typeof gap === 'number' ? gap : (gap.md ?? gapBase);
  const gapLg = typeof gap === 'number' ? gap : (gap.lg ?? gapMd);

  // Consumed by the slide flex-basis and padding (see slide className below).
  // Spacing is applied as slide padding + a negative container margin (not
  // flex `gap`) so it's absorbed into the basis (border-box) rather than added
  // on top of it — otherwise N slides + (N-1) gaps overflow the viewport and
  // the last slide is clipped. Both the slide padding and the container's
  // negative margin read these `--cv-gap*` vars at each breakpoint (via
  // responsive classNames), so a responsive gap stays in sync per viewport.
  const cssVars = {
    '--cv-base': `calc(100% / ${base})`,
    '--cv-md': `calc(100% / ${md})`,
    '--cv-lg': `calc(100% / ${lg})`,
    '--cv-gap': `${gapBase}px`,
    '--cv-gap-md': `${gapMd}px`,
    '--cv-gap-lg': `${gapLg}px`,
  } as CSSProperties;

  const scrollbarEl =
    scrollbar && snapCount > 1 ? (
      <div
        className={clsx(
          'relative mt-4 h-1 w-full cursor-pointer touch-none rounded-full bg-neutralLighter',
          scrollbarClassName,
        )}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId);
          scrubToPointer(event);
        }}
        onPointerMove={(event) => {
          if (event.buttons === 1) scrubToPointer(event);
        }}
        ref={scrollbarTrackRef}
        role="presentation"
      >
        <div
          className={clsx(
            'absolute inset-y-0 rounded-full bg-text',
            scrollbarThumbClassName,
          )}
          style={{
            width: `${thumbSize}%`,
            left: `${scrollProgress * (100 - thumbSize)}%`,
            ...(scrollbarColor ? {backgroundColor: scrollbarColor} : {}),
          }}
        />
      </div>
    ) : null;

  return (
    <div className={clsx('relative', className)}>
      <div
        aria-label={ariaLabel}
        aria-roledescription="carousel"
        className={clsx('overflow-hidden', viewportClassName)}
        ref={emblaRef}
        role="region"
      >
        <div
          className={clsx(
            'flex h-full',
            // Negative margin offsets the slide padding that creates the gap.
            // Responsive so it tracks a per-breakpoint gap (see --cv-gap* vars).
            isVertical
              ? 'mt-[calc(var(--cv-gap)*-1)] flex-col md:mt-[calc(var(--cv-gap-md)*-1)] lg:mt-[calc(var(--cv-gap-lg)*-1)]'
              : 'ml-[calc(var(--cv-gap)*-1)] flex-row md:ml-[calc(var(--cv-gap-md)*-1)] lg:ml-[calc(var(--cv-gap-lg)*-1)]',
          )}
          style={cssVars}
        >
          {slides.map((slide, index) => (
            <div
              aria-label={`${index + 1} of ${slides.length}`}
              aria-roledescription="slide"
              className={clsx(
                // flex: 0 0 <basis> — must not shrink, or slides cram into the
                // viewport instead of overflowing for Embla to scroll them.
                // Spacing is padding (absorbed into border-box basis), offset
                // by the container's negative margin above.
                'shrink-0 grow-0 basis-[var(--cv-base)] md:basis-[var(--cv-md)] lg:basis-[var(--cv-lg)]',
                isVertical
                  ? 'min-h-0 pt-[var(--cv-gap)] md:pt-[var(--cv-gap-md)] lg:pt-[var(--cv-gap-lg)]'
                  : 'min-w-0 pl-[var(--cv-gap)] md:pl-[var(--cv-gap-md)] lg:pl-[var(--cv-gap-lg)]',
                slideClassName,
              )}
              key={index}
              role="group"
            >
              {slide}
            </div>
          ))}
        </div>
        {children}
      </div>

      {arrows &&
        snapCount > 1 &&
        (renderArrow ? (
          <>
            {renderArrow('prev', {
              disabled: !canPrev,
              onClick: () => emblaApi?.scrollPrev(),
            })}
            {renderArrow('next', {
              disabled: !canNext,
              onClick: () => emblaApi?.scrollNext(),
            })}
          </>
        ) : (
          <>
            <button
              aria-label="Previous slide"
              className={clsx(
                'absolute left-2 top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-black disabled:opacity-40',
                arrowClassName,
              )}
              disabled={!canPrev}
              onClick={() => emblaApi?.scrollPrev()}
              style={arrowColor ? {color: arrowColor} : undefined}
              type="button"
            >
              {arrowIcon ? (
                arrowIcon('prev')
              ) : (
                <Svg
                  className="max-w-4 text-current"
                  src="/svgs/arrow-left.svg#arrow-left"
                  title="Arrow Left"
                  viewBox="0 0 24 24"
                />
              )}
            </button>
            <button
              aria-label="Next slide"
              className={clsx(
                'absolute right-2 top-1/2 z-[1] flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-white text-black disabled:opacity-40',
                arrowClassName,
              )}
              disabled={!canNext}
              onClick={() => emblaApi?.scrollNext()}
              style={arrowColor ? {color: arrowColor} : undefined}
              type="button"
            >
              {arrowIcon ? (
                arrowIcon('next')
              ) : (
                <Svg
                  className="max-w-4 text-current"
                  src="/svgs/arrow-right.svg#arrow-right"
                  title="Arrow Right"
                  viewBox="0 0 24 24"
                />
              )}
            </button>
          </>
        ))}

      {dots && snapCount > 1 && (
        <div
          className={clsx(
            'absolute bottom-4 left-1/2 z-[1] flex -translate-x-1/2 justify-center gap-2',
            dotsClassName,
          )}
        >
          {Array.from({length: snapCount}).map((_, index) => {
            const isActive = index === selectedIndex;
            return (
              <button
                aria-current={isActive}
                aria-label={`Go to slide ${index + 1}`}
                // Inline bg + opacity (not `bg-text/30`): the theme text color is
                // a hex var, and Tailwind's /opacity modifier on a var() color
                // emits invalid CSS, so faded dots would render invisibly.
                className="size-2 rounded-full transition"
                key={index}
                onClick={() => emblaApi?.scrollTo(index)}
                style={{
                  backgroundColor: activeDotColor || 'var(--text)',
                  opacity: isActive ? 1 : 0.35,
                }}
                type="button"
              />
            );
          })}
        </div>
      )}

      {scrollbarEl}
    </div>
  );
}

Carousel.displayName = 'Carousel';
