import {memo} from 'react';

import {useRootLoaderData} from '~/hooks';

export const Favicon = memo(() => {
  const {siteSettings} = useRootLoaderData();

  const favicon = siteSettings?.data?.siteSettings?.favicon;
  const src = favicon || '/favicon.svg';

  return <link rel="icon" type="image/x-icon'" href={src} />;
});
