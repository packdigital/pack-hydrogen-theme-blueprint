import {memo} from 'react';

import {useRootLoaderData} from '~/hooks';

const getMimeType = (src: string): string => {
  if (src.endsWith('.svg')) return 'image/svg+xml';
  if (src.endsWith('.png')) return 'image/png';
  if (src.endsWith('.ico')) return 'image/x-icon';
  if (src.endsWith('.jpg') || src.endsWith('.jpeg')) return 'image/jpeg';
  return 'image/png';
};

export const Favicon = memo(() => {
  const {siteSettings} = useRootLoaderData();

  const favicon = siteSettings?.data?.siteSettings?.favicon;
  const src = favicon || '/favicon.svg';
  const mimeType = getMimeType(src);

  return (
    <>
      <link rel="icon" type={mimeType} href={src} />
      <link rel="apple-touch-icon" sizes="180x180" href={src} />
    </>
  );
});
