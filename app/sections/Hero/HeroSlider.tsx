import {useState} from 'react';
import {A11y, Autoplay, EffectFade, Pagination} from 'swiper/modules';
import {Swiper, SwiperSlide} from 'swiper/react';

import {HeroSlide} from './HeroSlide';
import type {HeroSliderProps} from './Hero.types';

export function HeroSlider({aboveTheFold, slider, slides}: HeroSliderProps) {
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
              isActiveSlide={index === visibleIndex}
              isFirstSlide={index === 0}
              slide={slide}
            />
          </SwiperSlide>
        );
      })}

      <div
        // eslint-disable-next-line tailwindcss/no-custom-classname
        className={`swiper-pagination ${pagination ? '' : '!hidden'}`}
      />
    </Swiper>
  );
}

HeroSlider.displayName = 'HeroSlider';
