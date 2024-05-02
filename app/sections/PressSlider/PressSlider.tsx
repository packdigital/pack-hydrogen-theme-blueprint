import {useState} from 'react';
import {Autoplay, Thumbs} from 'swiper/modules';
import type {SwiperClass} from 'swiper/react';
import {Swiper, SwiperSlide} from 'swiper/react';

import {Container} from '~/components';

import type {PressSliderCms} from './PressSlider.types';
import {PressSliderThumb} from './PressSliderThumb';
import {Schema} from './PressSlider.schema';

export function PressSlider({cms}: {cms: PressSliderCms}) {
  const {section, slides} = cms;
  const {fullWidth, textColor} = {...section};

  const [mainSwiper, setMainSwiper] = useState<SwiperClass | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const maxWidthContainerClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div
        className="md:px-contained py-contained"
        style={{
          color: textColor,
        }}
      >
        {slides?.length > 0 && (
          <div className={`mx-auto pt-4 ${maxWidthContainerClass}`}>
            <Swiper
              autoplay={{
                delay: 8000,
                disableOnInteraction: false,
              }}
              centeredSlides
              grabCursor
              modules={[Autoplay, Thumbs]}
              onActiveIndexChange={(swiper) => {
                if (!thumbsSwiper) return;
                setActiveIndex(swiper.activeIndex);
                thumbsSwiper.slideTo(swiper.activeIndex);
              }}
              onSwiper={setMainSwiper}
              slidesPerView={1}
            >
              {slides.map(({quote}, index) => {
                return (
                  <SwiperSlide className="w-full py-2" key={index}>
                    <h2 className="mx-auto max-w-[50rem] px-4 text-center text-3xl font-bold md:text-4xl">
                      &quot;{quote}&quot;
                    </h2>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* desktop */}
            <ul
              className="mx-auto mt-8 hidden gap-8 md:grid"
              style={{
                gridTemplateColumns: `repeat(${slides.length}, 1fr)`,
                width: `calc(1/6*100%*${slides.length})`,
              }}
            >
              {slides.map(({alt, image}, index) => {
                const isActive = index === activeIndex;
                return (
                  <li key={index} className="flex justify-center">
                    <PressSliderThumb
                      alt={alt}
                      image={image}
                      isActive={isActive}
                      onClick={() => {
                        if (!mainSwiper) return;
                        mainSwiper.slideTo(index);
                      }}
                    />
                  </li>
                );
              })}
            </ul>

            {/* mobile */}
            <div className="mt-4 md:hidden">
              <Swiper
                centeredSlides
                className="max-md:cursor-grab"
                modules={[Thumbs]}
                onSwiper={setThumbsSwiper}
                slidesPerView={2.25}
                onActiveIndexChange={(swiper) => {
                  if (!mainSwiper) return;
                  mainSwiper.slideTo(swiper.activeIndex);
                }}
              >
                {slides.map(({alt, image}, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <SwiperSlide
                      className="flex justify-center px-4"
                      key={index}
                    >
                      <PressSliderThumb
                        alt={alt}
                        image={image}
                        isActive={isActive}
                        onClick={() => {
                          if (!mainSwiper) return;
                          mainSwiper.slideTo(index);
                        }}
                      />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

PressSlider.displayName = 'PressSlider';
PressSlider.Schema = Schema;
