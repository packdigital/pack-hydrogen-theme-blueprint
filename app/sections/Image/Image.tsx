import {useMemo} from 'react';
import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Image as ImageComponent} from '~/components/Image';
import {Link} from '~/components/Link';
import {RichText} from '~/components/RichText';

import type {ImageCms} from './Image.types';
import {Schema} from './Image.schema';

const FALLBACK_ASPECT_RATIO = '16/9';

export function Image({cms}: {cms: ImageCms}) {
  const {content, image, section} = cms;
  const {
    alt,
    aspectDesktop = 'native',
    aspectMobile = 'native',
    cropDesktop,
    cropMobile,
    imageDesktop,
    imageMobile,
  } = {
    ...image,
  };
  const {caption, link} = {...content};
  const {maxWidth, enablePadding} = {...section};

  const sizes = useMemo(() => {
    return /[0-9]+(?:px)|[0-9]+(?:rem)/.exec(maxWidth)?.[0] || '100vw';
  }, [maxWidth]);

  return (
    <Container container={cms.container}>
      <div
        className={clsx(
          'py-4 md:py-6 lg:py-8',
          enablePadding && 'px-contained',
        )}
      >
        <Link
          aria-label={link?.text}
          className={clsx('mx-auto', maxWidth)}
          to={link?.url}
          newTab={link?.newTab}
          type={link?.type}
        >
          <ImageComponent
            data={{
              altText: imageMobile?.altText || alt,
              url: imageMobile?.url,
              width: imageMobile?.width,
              height: imageMobile?.height,
            }}
            aspectRatio={
              aspectMobile === 'native'
                ? imageMobile?.width && imageMobile?.height
                  ? `${imageMobile.width}/${imageMobile.height}`
                  : FALLBACK_ASPECT_RATIO
                : aspectMobile
            }
            className="md:hidden"
            crop={cropMobile}
            sizes={sizes}
          />

          <ImageComponent
            data={{
              altText: imageDesktop?.altText || alt,
              url: imageDesktop?.url,
              width: imageDesktop?.width,
              height: imageDesktop?.height,
            }}
            aspectRatio={
              aspectDesktop === 'native'
                ? imageDesktop?.width && imageDesktop?.height
                  ? `${imageDesktop.width}/${imageDesktop.height}`
                  : FALLBACK_ASPECT_RATIO
                : aspectDesktop
            }
            className="max-md:hidden"
            crop={cropDesktop}
            sizes={sizes}
          />
        </Link>

        {caption && (
          <div className={clsx('mt-3', !enablePadding && 'px-contained')}>
            <RichText className={clsx('mx-auto', maxWidth)}>{caption}</RichText>
          </div>
        )}
      </div>
    </Container>
  );
}

Image.displayName = 'Image';
Image.Schema = Schema;
