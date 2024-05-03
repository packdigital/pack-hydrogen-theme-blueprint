import {Container, Image, Markdown, Svg} from '~/components';

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
          className={`mx-auto flex flex-col items-center gap-4 text-center md:gap-6 ${maxWidthClass}`}
        >
          {heading && (
            <h2 className="text-h2 mx-auto max-w-[46rem]">{heading}</h2>
          )}

          {subtext && (
            <div className="mx-auto max-w-[46rem] [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base">
              <Markdown>{subtext}</Markdown>
            </div>
          )}

          {icons?.length > 0 && (
            <ul className="mt-4 flex flex-wrap justify-center">
              {icons.map(({icon, image, alt, label}, index) => {
                return (
                  <li
                    key={index}
                    className="flex max-w-64 grow basis-1/2 flex-col items-center p-4 text-center md:basis-1/6"
                  >
                    {image?.src && (
                      <Image
                        data={{
                          altText: image.altText || alt || label,
                          url: image.src,
                          width: image.width,
                          height: image.height,
                        }}
                        aspectRatio="1/1"
                        width="48"
                        isStatic
                      />
                    )}

                    {icon !== 'none' && !image?.src && (
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
