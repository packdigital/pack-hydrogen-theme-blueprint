import {useState} from 'react';
import {A11y, Autoplay, EffectFade, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';
import clsx from 'clsx';

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
    <Swiper
      a11y={{enabled: true}}
      autoplay={
        autoplay
          ? {
              delay: delay || 5000,
              disableOnInteraction: false,
            }
          : false
      }
      className="size-full"
      effect={effect}
      fadeEffect={{
        crossFade: true,
      }}
      grabCursor
      onSlideChange={(swiper) => setVisibleIndex(swiper.realIndex)}
      modules={[A11y, Autoplay, EffectFade, Pagination]}
      pagination={{
        el: `.swiper-pagination`,
        type: 'bullets',
        clickable: true,
        renderBullet(_, className) {
          return `<span class="${className}" style="background-color: ${activeBulletColor}"></span>`;
        },
      }}
      slidesPerView={1}
    >
      {slides.map((slide, index) => {
        return (
          <SwiperSlide key={index}>
            <HeroSlide
              aboveTheFold={aboveTheFold}
              index={index}
              isActiveSlide={index === visibleIndex}
              isFirstSlide={index === 0}
              sectionId={sectionId}
              slide={slide}
            />
          </SwiperSlide>
        );
      })}

      <div className={clsx('swiper-pagination', !pagination && '!hidden')} />
    </Swiper>
  );
}

HeroSlider.displayName = 'HeroSlider';
