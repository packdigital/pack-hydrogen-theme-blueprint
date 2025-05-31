import Autoplay from 'embla-carousel-autoplay';
import {useEffect, useMemo, useState} from 'react';
import {useInView} from 'react-intersection-observer';

import {Schema} from './ProductSlider.schema';
import {ProductSliderCms} from './ProductSlider.types';
import {DragonsSlide} from './slides/DragonsSlide';
import {JigglePetSlide} from './slides/JigglePetSlide';

import {Container} from '~/components/Container';
import {Button} from '~/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from '~/components/ui/carousel';
import {ContainerSettings} from '~/settings/container';

export function ProductSlider({
  cms,
}: {
  cms: ProductSliderCms & {container: ContainerSettings};
}) {
  const {ref, inView} = useInView({
    rootMargin: '200px',
    triggerOnce: true,
  });

  const maxWidthClass = useMemo(
    () =>
      cms?.section?.fullWidth
        ? 'max-w-none'
        : 'max-w-[var(--content-max-width)] mx-auto',
    [cms?.section?.fullWidth],
  );

  const [carouselApi, setCarouselApi] = useState<CarouselApi | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const scrollToIndex = (index: number) => {
    carouselApi?.scrollTo(index);
  };

  useEffect(() => {
    if (!carouselApi) return;
    const updateCarouselState = () => {
      setCurrentIndex(carouselApi.selectedScrollSnap());
      setTotalItems(carouselApi.scrollSnapList().length);
    };
    updateCarouselState();
    carouselApi.on('select', updateCarouselState);
    return () => {
      carouselApi.off('select', updateCarouselState); // Clean up on unmount
    };
  }, [carouselApi]);

  return (
    <Container container={cms.container}>
      <div ref={ref}>
        <div className={`${maxWidthClass} justify-center`}>
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: 'start',
              loop: true,
            }}
            plugins={[
              Autoplay({
                delay: 10000,
              }),
            ]}
          >
            <CarouselContent className="">
              <CarouselItem>
                <DragonsSlide />
              </CarouselItem>
              <CarouselItem>
                <JigglePetSlide />
              </CarouselItem>
            </CarouselContent>

            {/* Navigation Dots */}
            <div className="absolute bottom-0 left-1/2 flex justify-center gap-1 pb-4">
              {Array.from({length: totalItems}).map((_, index) => (
                <Button
                  size={'icon'}
                  key={index}
                  onClick={() => scrollToIndex(index)}
                  className={`size-4 rounded-full ${
                    currentIndex === index ? 'bg-orange-400' : 'bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </Carousel>
        </div>
      </div>
    </Container>
  );
}

ProductSlider.displayName = 'ProductSlider';
ProductSlider.Schema = Schema;
