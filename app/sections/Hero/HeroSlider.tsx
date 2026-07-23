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
  );
}

HeroSlider.displayName = 'HeroSlider';
