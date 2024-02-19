import {Image, Link, Markdown} from '~/components';

import {Schema} from './MetaobjectImage.schema';

export function MetaobjectImage({cms}: {cms: Record<string, any>}) {
  const dataSourceReference = cms?.dataSource?.reference;
  const fields: Record<string, any> = {};
  dataSourceReference?.fields?.forEach((field: Record<string, any>) => {
    fields[field.key] = field.reference || field.value;
  });

  const {alt, link, caption, enable_padding, image} = fields;
  const imageDetails = image?.image;

  const maxWidth = 'max-w-[90rem]';
  const sizes =
    /[0-9]+(?:px)|[0-9]+(?:rem)/.exec('max-w-[90rem]')?.[0] || '100vw';

  return (
    <div
      className={`py-4 md:py-6 lg:py-8 ${enable_padding ? 'px-contained' : ''}`}
    >
      <Link className={`mx-auto ${maxWidth}`} href={link} newTab={true}>
        <Image
          data={{
            ...imageDetails,
            altText: alt || image.altText,
          }}
          aspectRatio="16/9"
          className="max-md:hidden"
          sizes={sizes}
        />
      </Link>

      {caption && (
        <div className={`mt-3 ${enable_padding ? '' : 'px-contained'}`}>
          <div
            className={`mx-auto [&_a]:underline [&_h1]:text-base [&_h2]:text-base [&_h3]:text-base [&_h4]:text-base [&_h5]:text-base [&_h6]:text-base [&_p]:text-base ${maxWidth}`}
          >
            <Markdown>{caption}</Markdown>
          </div>
        </div>
      )}
    </div>
  );
}

MetaobjectImage.displayName = 'MetaobjectImage';
MetaobjectImage.Schema = Schema;
