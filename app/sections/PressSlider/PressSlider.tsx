import {useCallback, useEffect, useState} from 'react';
import type {EmblaCarouselType} from 'embla-carousel';
import clsx from 'clsx';

import {Carousel} from '~/components/Carousel';
import {Container} from '~/components/Container';

import type {PressSliderCms} from './PressSlider.types';
import {PressSliderThumb} from './PressSliderThumb';
import {Schema} from './PressSlider.schema';

export function PressSlider({cms}: {cms: PressSliderCms}) {
  const {section, slides} = cms;
  const {fullWidth, textColor} = {...section};

  const [mainApi, setMainApi] = useState<EmblaCarouselType | null>(null);
  const [thumbApi, setThumbApi] = useState<EmblaCarouselType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const maxWidthContainerClass = fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  const scrollMainTo = useCallback(
    (index: number) => mainApi?.scrollTo(index),
    [mainApi],
  );

  // keep the mobile thumbnail strip centered on the active quote
  useEffect(() => {
    thumbApi?.scrollTo(activeIndex);
  }, [activeIndex, thumbApi]);

  return (
    <Container container={cms.container}>
      <div className="md:px-contained py-contained" style={{color: textColor}}>
        {slides?.length > 0 && (
          <div className={clsx('mx-auto pt-4', maxWidthContainerClass)}>
            <Carousel
              ariaLabel="Press quotes"
              autoplay={8000}
              onApi={setMainApi}
              onSelect={setActiveIndex}
              options={{align: 'center'}}
              slideClassName="py-2"
              slides={slides.map(({quote}, index) => (
                <h2
                  className="mx-auto max-w-[50rem] px-4 text-center text-3xl font-bold md:text-4xl"
                  key={index}
                >
                  &quot;{quote}&quot;
                </h2>
              ))}
            />

            {/* desktop thumbnails (static grid) */}
            <ul
              className="mx-auto mt-8 hidden gap-8 md:grid"
              style={{
                gridTemplateColumns: `repeat(${slides.length}, 1fr)`,
                width: `calc(1/6*100%*${slides.length})`,
              }}
            >
              {slides.map(({alt, image}, index) => (
                <li className="flex justify-center" key={index}>
                  <PressSliderThumb
                    alt={alt}
                    image={image}
                    isActive={index === activeIndex}
                    onClick={() => scrollMainTo(index)}
                  />
                </li>
              ))}
            </ul>

            {/* mobile thumbnails (carousel) */}
            <div className="mt-4 md:hidden">
              <Carousel
                ariaLabel="Press thumbnails"
                onApi={setThumbApi}
                options={{align: 'center'}}
                slides={slides.map(({alt, image}, index) => (
                  <div className="flex justify-center px-4" key={index}>
                    <PressSliderThumb
                      alt={alt}
                      image={image}
                      isActive={index === activeIndex}
                      onClick={() => scrollMainTo(index)}
                    />
                  </div>
                ))}
                slidesPerView={{base: 2.25}}
              />
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

PressSlider.displayName = 'PressSlider';
PressSlider.Schema = Schema;
