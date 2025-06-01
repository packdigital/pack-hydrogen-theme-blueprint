import {Button} from '@headlessui/react';
import {Image} from '@shopify/hydrogen-react';
import {useMemo} from 'react';

import {ProductSliderSlide} from './ProductSlider.types';

interface ProductSliderSlideProps {
  slide: ProductSliderSlide;
  index?: number;
}
export const ProductSlide: React.FC<ProductSliderSlideProps> = ({
  slide,
  index,
}) => {
  const {imageLocation, imageDesktop} = slide;
  const isImageLeft = imageLocation === 'left';

  return (
    <div
      key={`slide-${index}`}
      className={`grid w-full grid-cols-1 items-center justify-start gap-6 p-2 md:grid-cols-2 md:p-4`}
    >
      {isImageLeft ? (
        <>
          <ProductSlideImage
            imageUrl={imageDesktop?.url || ''}
            imageAlt={slide.imageAltText || ''}
          />
          <div className="flex h-full flex-col items-start justify-center text-left md:items-center">
            <ProductSlideContent slide={slide} />
          </div>
        </>
      ) : (
        <>
          <div className="flex h-full flex-col items-start justify-center text-left md:items-center">
            <ProductSlideContent slide={slide} />
          </div>
          <ProductSlideImage
            imageUrl={imageDesktop?.url || ''}
            imageAlt={slide.imageAltText || ''}
          />
        </>
      )}
    </div>
  );
};

function ProductSlideContent({slide}: {slide: ProductSliderSlide}) {
  const {
    title,
    title2,
    tagline,
    description,
    featureOrientation = 'vertical',
    features = [],
    buttons = [],
  } = slide;

  return (
    <div className="flex flex-col px-4">
      {tagline && (
        <p className="font-medium uppercase leading-snug text-gray-600">
          {tagline}
        </p>
      )}
      {title && <h2 className="text-h2 font-bold leading-snug">{title}</h2>}
      {title2 && <h3 className="text-h3 text-3xl font-semibold"> {title2}</h3>}

      {description && (
        <div
          className="prose py-2 text-lg text-gray-700"
          dangerouslySetInnerHTML={{__html: description}}
        />
      )}

      {features.length > 0 && (
        <ul
          className={`flex ${
            featureOrientation === 'horizontal'
              ? 'flex-row gap-6'
              : 'flex-col gap-2'
          } pl-0`}
        >
          {features.map((feature, index) => (
            <li key={index} className="text-gray-900">
              {feature}
            </li>
          ))}
        </ul>
      )}

      <ProductSlideButtons buttons={slide?.buttons || []} />
    </div>
  );
}

function ProductSlideImage({
  imageUrl,
  imageAlt,
}: {
  imageUrl: string;
  imageAlt?: string;
}) {
  const imageData = useMemo(
    () => ({
      url: imageUrl,
    }),
    [imageUrl],
  );

  return (
    <div className="flex h-full items-center justify-center p-4">
      <div className="max-h-[460px] w-full overflow-hidden rounded shadow-lg">
        <Image
          aspectRatio="9/6"
          data={imageData}
          alt={imageAlt}
          className="size-full object-cover"
          sizes="(min-width: 1024px) 40vw, (min-width: 768px) 40vw, 70vw"
        />
      </div>
    </div>
  );
}

function ProductSlideButtons({
  buttons,
}: {
  buttons: ProductSliderSlideProps['slide']['buttons'];
}) {
  if (!buttons || buttons.length === 0) return null;

  return (
    <div className="mt-6 flex flex-row gap-5 md:mt-12">
      {buttons.map((button, index) => (
        <a href={button.link.url} key={index}>
          <Button className={button.style}>{button.link.text}</Button>
        </a>
      ))}
    </div>
  );
}
