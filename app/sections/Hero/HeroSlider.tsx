import {useState} from 'react';

import {Carousel} from '~/components/Carousel';

import {HeroSlide} from './HeroSlide';
import type {HeroSliderProps} from './Hero.types';

export function HeroSlider({
  aboveTheFold,
  sectionId,
  slider,
  slides,
}: HeroSliderProps) {
  const [visibleIndex, setVisibleIndex] = useState(0);
  const {activeBulletColor, autoplay, delay, effect, pagination} = slider;

  return (
    // Absolute fill (not `size-full`) so the carousel resolves its height
    // against the aspect-ratio container's *used* height. Safari treats an
    // aspect-ratio-derived height as indefinite for `height: 100%` descendants,
    // collapsing the slide chain to the image's intrinsic height and spilling
    // past the hero; absolute inset-0 sidesteps that.
    <div className="absolute inset-0">
      <Carousel
        activeDotColor={activeBulletColor}
        ariaLabel="Hero"
        autoplay={autoplay ? delay || 5000 : false}
        className="size-full"
        dots={pagination}
        fade={effect === 'fade'}
        onSelect={setVisibleIndex}
        slideClassName="size-full"
        slides={slides.map((slide, index) => (
          <HeroSlide
            aboveTheFold={aboveTheFold}
            index={index}
            isActiveSlide={index === visibleIndex}
            isFirstSlide={index === 0}
            key={index}
            sectionId={sectionId}
            slide={slide}
          />
        ))}
        viewportClassName="size-full"
      />
    </div>
  );
}

HeroSlider.displayName = 'HeroSlider';
