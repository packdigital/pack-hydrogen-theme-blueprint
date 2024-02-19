import {useRootLoaderData} from '~/hooks';

export function Favicon() {
  const {siteSettings} = useRootLoaderData();

  const favicon = siteSettings?.data?.siteSettings?.favicon;
  const src = favicon || '/favicon.svg';

  return <link rel="icon" type="image/x-icon'" href={src} />;
}
