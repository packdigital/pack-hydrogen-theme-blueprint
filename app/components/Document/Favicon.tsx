import {memo} from 'react';

import {useRootLoaderData} from '~/hooks';

export const Favicon = memo(() => {
  const {siteSettings} = useRootLoaderData();

  const favicon = siteSettings?.data?.siteSettings?.favicon;
  const src = favicon || '/favicon.svg';
  const mimeType = getMimeType(src);

  return (
    <>
      <link rel="icon" type={mimeType} href={src} />
      {supportsAppleTouchIcon(src) && (
        <link rel="apple-touch-icon" sizes="180x180" href={src} />
      )}
    </>
  );
});

const getPathname = (src: string): string => {
  return src.split('?')[0].toLowerCase();
};

const getMimeType = (src: string): string => {
  const pathname = getPathname(src);
  if (pathname.endsWith('.svg')) return 'image/svg+xml';
  if (pathname.endsWith('.png')) return 'image/png';
  if (pathname.endsWith('.ico')) return 'image/x-icon';
  if (pathname.endsWith('.jpg') || pathname.endsWith('.jpeg'))
    return 'image/jpeg';
  return 'image/png';
};

const supportsAppleTouchIcon = (src: string): boolean => {
  const pathname = getPathname(src);
  return (
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg')
  );
};
