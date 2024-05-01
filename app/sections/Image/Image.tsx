import {useMemo} from 'react';

import {Container, Image as ImageComponent, Link, Markdown} from '~/components';

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
        className={`py-4 md:py-6 lg:py-8 ${
          enablePadding ? 'px-contained' : ''
        }`}
      >
        <Link
          aria-label={link?.text}
          className={`mx-auto ${maxWidth}`}
          to={link?.url}
          newTab={link?.newTab}
          type={link?.type}
        >
          <ImageComponent
            data={{
              altText: imageMobile?.altText || alt,
              url: imageMobile?.src,
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
              url: imageDesktop?.src,
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
          <div className={`mt-3 ${enablePadding ? '' : 'px-contained'}`}>
            <div
              className={`mx-auto [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base ${maxWidth}`}
            >
              <Markdown>{caption}</Markdown>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}

Image.displayName = 'Image';
Image.Schema = Schema;
