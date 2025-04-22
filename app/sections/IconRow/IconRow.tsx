import clsx from 'clsx';

import {Container} from '~/components/Container';
import {Image} from '~/components/Image';
import {RichText} from '~/components/RichText';
import {Svg} from '~/components/Svg';

import type {IconRowCms} from './IconRow.types';
import {Schema} from './IconRow.schema';

export function IconRow({cms}: {cms: IconRowCms}) {
  const {heading, icons, section, subtext} = cms;
  const maxWidthClass = section?.fullWidth
    ? 'max-w-none'
    : 'max-w-[var(--content-max-width)]';

  return (
    <Container container={cms.container}>
      <div
        className="px-contained py-contained"
        style={{color: section?.textColor}}
      >
        <div
          className={clsx(
            'mx-auto flex flex-col items-center gap-4 text-center md:gap-6',
            maxWidthClass,
          )}
        >
          {heading && (
            <h2 className="text-h2 mx-auto max-w-[46rem]">{heading}</h2>
          )}

          {subtext && (
            <RichText className="mx-auto max-w-[46rem]">{subtext}</RichText>
          )}

          {icons?.length > 0 && (
            <ul className="mt-4 flex flex-wrap justify-center">
              {icons.map(({icon, image, alt, label}, index) => {
                return (
                  <li
                    key={index}
                    className="flex max-w-64 grow basis-1/2 flex-col items-center p-4 text-center md:basis-1/6"
                  >
                    {image?.url && (
                      <Image
                        data={{
                          altText: image.altText || alt || label,
                          url: image.url,
                          width: image.width,
                          height: image.height,
                        }}
                        className="bg-transparent"
                        aspectRatio="1/1"
                        width="48px"
                      />
                    )}

                    {icon !== 'none' && !image?.url && (
                      <Svg
                        className="w-12"
                        src={`/svgs/icons/${icon}.svg#${icon}`}
                        style={{color: section?.iconColor}}
                        title={label || icon}
                        viewBox="0 0 24 24"
                      />
                    )}

                    {label && <p className="mt-3 font-bold">{label}</p>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </Container>
  );
}

IconRow.displayName = 'IconRow';
IconRow.Schema = Schema;
